import { getAgencyConfigs } from './agency-configs';
import { createHash } from 'node:crypto';

const DEBUG_LOGS_ENABLED = false;

const logDebug = (message) => {
  if (!DEBUG_LOGS_ENABLED) return;
  console.log(message);
};

const log = (message) => {
  console.log(message);
};

// Cloudflare Workers Preview URLs:
// git branch push > workers preview url:
// <branch_name>-gtfs-rt-cache-api.mtransit-apps.workers.dev
// Preview URLs => no logs :'(

export default {
  async fetch(request, env, ctx) {
    // logDebug(`[MT]> request url: '${request.url}'.`);
    const requestUrl = new URL(request.url);
    // logDebug(`[MT]> request url - host: '${requestUrl.host}'.`);
    // logDebug(`[MT]> request url - origin: '${requestUrl.origin}'.`);
    // logDebug(`[MT]> request url > search: '${requestUrl.search}'.`);
    // logDebug(`[MT]> request url > pathname: '${requestUrl.pathname}'.`);
    // const search = requestUrl.search;
    const pathname = requestUrl.pathname;
    const pathnameParts = pathname.split("/");
    // logDebug(`[MT]> request url > pathname parts[${pathnameParts.length}]: '${pathnameParts}'.`);

    // /xx_city_agency/service-alerts
    // /xx_city_agency/trip-updates
    // /xx_city_agency/vehicle-positions
    const SERVICE_ALERTS = "service-alerts";
    const TRIP_UPDATES = "trip-updates";
    const VEHICLE_POSITIONS = "vehicle-positions";

    const agency = pathnameParts[1];
    const urlType = pathnameParts[2];
    logDebug(`[MT]> agency: '${agency}'.`);
    logDebug(`[MT]> urlType: '${urlType}'.`);

    let maxAgeInSec = -1; // none
    let tryRefreshAfterInMs = -1;
    switch (urlType) {
      case SERVICE_ALERTS:
        maxAgeInSec = 86400; // 24h
        tryRefreshAfterInMs = 60000; // 1 minute
        break;
      case TRIP_UPDATES:
        maxAgeInSec = 3600; // 1h
        tryRefreshAfterInMs = 20000; // 20 seconds
        break;
      case VEHICLE_POSITIONS:
        maxAgeInSec = 3600; // 1h
        // tryRefreshAfterInMs = 30000; // 30 seconds
        tryRefreshAfterInMs = 20000; // 20 seconds
        // TODO if API allows: tryRefreshAfterInMs = 10000; // 10 seconds
        break;
    }
    logDebug(`[MT]> maxAgeInSec: '${maxAgeInSec}'.`);
    logDebug(`[MT]> tryRefreshAfterInMs: '${tryRefreshAfterInMs}'.`);
    const agencyConfigs = getAgencyConfigs(env);
    let apiUrl = '';
    let apiUrlWithSecret = '';
    let bearerToken = '';
    let hashSecret = '';
    let requestHeaderName = '';
    let requestHeaderValue = '';
    const agencyConfig = agencyConfigs[agency];
    // logDebug(`[MT]> agencyConfig: '${agencyConfig}'.`);
    if (agencyConfig) {
      // logDebug(`[MT]> agencyConfig: FOUND.`);
      switch (urlType) {
        case SERVICE_ALERTS:
          apiUrl = agencyConfig.serviceAlertsUrl || '';
          apiUrlWithSecret = agencyConfig.serviceAlertsUrlWithSecret || '';
          tryRefreshAfterInMs = agencyConfig.serviceAlertsTryRefreshAfterInMs || tryRefreshAfterInMs;
          break;
        case TRIP_UPDATES:
          apiUrl = agencyConfig.tripUpdatesUrl || '';
          apiUrlWithSecret = agencyConfig.tripUpdatesUrlWithSecret || '';
          tryRefreshAfterInMs = agencyConfig.tripUpdatesTryRefreshAfterInMs || tryRefreshAfterInMs;
          break;
        case VEHICLE_POSITIONS:
          apiUrl = agencyConfig.vehiclePositionsUrl || '';
          apiUrlWithSecret = agencyConfig.vehiclePositionsUrlWithSecret || '';
          tryRefreshAfterInMs = agencyConfig.vehiclePositionsTryRefreshAfterInMs || tryRefreshAfterInMs;
          break;
      }
      requestHeaderName = agencyConfig.requestHeaderName || '';
      requestHeaderValue = agencyConfig.requestHeaderValue || '';
      hashSecret = agencyConfig.hashSecret || '';
      // logDebug(`[MT]> apiUrl: '${apiUrl}'.`);
      // logDebug(`[MT]> requestHeaderName: '${requestHeaderName}'`);
      // logDebug(`[MT]> requestHeaderValue: '${requestHeaderValue.length}'`);
    }
    logDebug(`[MT]> apiUrl: '${apiUrl}'`);
    if (apiUrl.length == 0 || maxAgeInSec <= 0 || tryRefreshAfterInMs <= 0) {
      return new Response('404 not found GTFS-RT (service alerts, trip updates & vehicle positions)', {
        status: 404,
        headers: { 'Content-Type': 'text/html' }
      });
    }
    if (apiUrlWithSecret.length == 0) {
        apiUrlWithSecret = apiUrl; // no secret in the URL
    }
    const cacheUrl = new URL(apiUrl);
    const cacheKey = cacheUrl.toString();
    const cache = caches.default;
    const cacheResponse = await cache.match(cacheKey);
    if (cacheResponse) {
      log(`[MT]> Cache hit for: ${request.url} (${apiUrl}).`);
      // logDebug(`[MT]> cache response headers: ${cacheResponse.headers}.`);
      const cacheTimestampString = cacheResponse.headers.get("X-MT-Timestamp");
      // logDebug(`[MT]> cach timestamp string: ${cacheTimestampString}.`);
      if (cacheTimestampString == null) {
        log(`[MT]> Returning cache hit (no timestamp)`);
        return cacheResponse; // no cache timestamp -> return response
      } else if (cacheTimestampString != null) {
        const cacheTimestamp = parseInt(cacheTimestampString);
        // logDebug(`[MT]> cache timestamp: ${cacheTimestamp}.`);
        // logDebug(`[MT]> now: ${Date.now()}.`);
        const howLongSinceCachedInMs = Date.now() - cacheTimestamp;
        // logDebug(`[MT]> howLongSinceCachedInMs: ${howLongSinceCachedInMs}.`);
        if (howLongSinceCachedInMs < tryRefreshAfterInMs) {
          log(`[MT]> Returning cache hit (still fresh ${ howLongSinceCachedInMs / 1000 } sec)`);
          return cacheResponse; // to soon -> re-use cache
        } else {
          log(`[MT]> Cache hit is ${ howLongSinceCachedInMs / 1000 } secs old, try to refresh...`);
        }
      }
    }
    if (!cacheResponse) {
      log(`[MT]> NO Cache hit for: '${apiUrl}'.`);
    }
    const requestHeaders = new Headers();
    requestHeaders.append("Content-Type", "application/x-protobuf");
    if (bearerToken.length > 0) {
      requestHeaders.append("Authorization", `Bearer ${bearerToken}`);
    }
    if (requestHeaderName.length > 0 && requestHeaderValue.length > 0) {
      requestHeaders.append(requestHeaderName, requestHeaderValue);
    }
    if (hashSecret.length > 0) {
      // https://www.sto.ca/site/assets/files/1533/documentation_dev_gtfsrt.pdf
      const now = new Date();
      const date_iso8601 = now.toISOString().replace(/[ -:]/g,'').split ('.')[0].slice(0,-2) + 'Z';
      const salted_secret = hashSecret + date_iso8601;
      const hash_value = createHash('sha256').update(salted_secret,'utf8').digest('hex').toUpperCase();
      apiUrlWithSecret = apiUrlWithSecret.replace('MtHashSecretAndDate', hash_value);
    }
    const apiRequest = new Request(apiUrlWithSecret, {
      headers: requestHeaders
    });
    logDebug(`[MT]> Fetching from '${apiUrl})'...`);
    const fetchResponse = await fetch(apiRequest);
    log(`[MT]> Fetching from '${apiUrl})'... DONE`);
    // logDebug(`[MT]> - fetched response headers: ${fetchResponse.headers}.`);
    // logDebug(`[MT]> - fetched response status: ${fetchResponse.status}.`);
    if (fetchResponse.status == 200) {
      const newResponse = new Response(fetchResponse.body);
      if (maxAgeInSec >= 0) {
        const cacheControl = `s-maxage=${maxAgeInSec}`;
        newResponse.headers.append("Cache-Control", cacheControl);
      }
      // logDebug(`[MT]> newResponse.headers["Cache-Control"]: ${newResponse.headers.get("Cache-Control")}.`);
      newResponse.headers.append("X-MT-Timestamp", Date.now());
      // logDebug(`[MT]> newResponse.headers["X-MT-Timestamp"]: ${newResponse.headers.get("X-MT-Timestamp")}.`);
      // logDebug(`[MT]> newResponse.headers: ${newResponse.headers}.`);
      ctx.waitUntil(cache.put(cacheKey, newResponse.clone()));
      logDebug(`[MT]> Cache saved for: ${request.url} (${apiUrl}).`);
      log(`[MT]> Returning new fetched & cached response`);
      return newResponse; // return new cached response
    } else {
      if (cacheResponse) {
        log(`[MT]> Returning cache hit (fetch failed - ${fetchResponse.status})`);
        return cacheResponse; // return "older" cached response
      }
      log(`[MT]> Returning failed (${fetchResponse.status}) fetched reponse`);
      return fetchResponse; // return fetch response w/ error
    }
    // } else {
    // logDebug(`[MT]> Cache hit for: ${request.url} (${apiUrl}).`);
    // }
    // return response;
  }
};
