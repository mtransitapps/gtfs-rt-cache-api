import { getAgencyConfigs } from './agency-configs';

// Cloudflare Workers Preview URLs:
// git branch push > workers preview url:
// <branch_name>-gtfs-rt-cache-api.mtransit-apps.workers.dev
// Preview URLs => no logs :'(

export default {
  async fetch(request, env, ctx) {
    // console.log(`[MT]> request url: '${request.url}'.`);
    const requestUrl = new URL(request.url);
    // console.log(`[MT]> request url - host: '${requestUrl.host}'.`);
    // console.log(`[MT]> request url - origin: '${requestUrl.origin}'.`);
    // console.log(`[MT]> request url > search: '${requestUrl.search}'.`);
    // console.log(`[MT]> request url > pathname: '${requestUrl.pathname}'.`);
    // const search = requestUrl.search;
    const pathname = requestUrl.pathname;
    const pathnameParts = pathname.split("/");
    // console.log(`[MT]> request url > pathname parts[${pathnameParts.length}]: '${pathnameParts}'.`);

    // /xx_city_agency/service-alerts
    // /xx_city_agency/trip-updates
    // /xx_city_agency/vehicle-positions
    const SERVICE_ALERTS = "service-alerts";
    const TRIP_UPDATES = "trip-updates";
    const VEHICLE_POSITIONS = "vehicle-positions";

    const agency = pathnameParts[1];
    const urlType = pathnameParts[2];
    console.log(`[MT]> agency: '${agency}'.`);
    console.log(`[MT]> urlType: '${urlType}'.`);

    let maxAgeInSec = -1; // none
    let tryRefreshAfterInMs = 60000; // 1 minute
    switch (urlType) {
      case SERVICE_ALERTS:
        maxAgeInSec = 86400; // 24h
        tryRefreshAfterInMs = 60000; // 1 minute
        break;
      // TODO latter case TRIP_UPDATES:
      case VEHICLE_POSITIONS:
        maxAgeInSec = 3600; // 1h
        tryRefreshAfterInMs = 30000; // 30 seconds
        // TODO if API allows: tryRefreshAfterInMs = 10000; // 10 seconds
        break;
    }
    console.log(`[MT]> maxAgeInSec: '${maxAgeInSec}'.`);
    console.log(`[MT]> tryRefreshAfterInMs: '${tryRefreshAfterInMs}'.`);
    const agencyConfigs = getAgencyConfigs(env);
    let apiUrl = '';
    let apiUrlWithSecret = '';
    let bearerToken = '';
    const agencyConfig = agencyConfigs[agency];
    // console.log(`[MT]> agencyConfig: '${agencyConfig}'.`);
    if (agencyConfig) {
      // console.log(`[MT]> agencyConfig: FOUND.`);
      switch (urlType) {
        case SERVICE_ALERTS:
          apiUrl = agencyConfig.serviceAlertsUrl || '';
          apiUrlWithSecret = agencyConfig.serviceAlertsUrlWithSecret || '';
          break;
        // TODO latter case TRIP_UPDATES:
        case VEHICLE_POSITIONS:
          apiUrl = agencyConfig.vehiclePositionsUrl || '';
          apiUrlWithSecret = agencyConfig.vehiclePositionsUrlWithSecret || '';
          break;
      }
      // console.log(`[MT]> apiUrl: '${apiUrl}'.`);
    }
    console.log(`[MT]> apiUrl: '${apiUrl}'`);
    if (apiUrl.length == 0) {
      return new Response('404 not found GTFS-RT (service alerts & vehicle positions)', {
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
      console.log(`[MT]> Cache hit for: ${request.url} (${apiUrl}).`);
      // console.log(`[MT]> cache response headers: ${cacheResponse.headers}.`);
      const cacheTimestampString = cacheResponse.headers.get("X-MT-Timestamp");
      // console.log(`[MT]> cach timestamp string: ${cacheTimestampString}.`);
      if (cacheTimestampString == null) {
        console.log(`[MT]> Returning cache hit (no timestamp)`);
        return cacheResponse; // no cache timestamp -> return response
      } else if (cacheTimestampString != null) {
        const cacheTimestamp = parseInt(cacheTimestampString);
        // console.log(`[MT]> cache timestamp: ${cacheTimestamp}.`);
        // console.log(`[MT]> now: ${Date.now()}.`);
        const howLongSinceCachedInMs = Date.now() - cacheTimestamp;
        // console.log(`[MT]> howLongSinceCachedInMs: ${howLongSinceCachedInMs}.`);
        if (howLongSinceCachedInMs < tryRefreshAfterInMs) {
          console.log(`[MT]> Returning cache hit (still fresh ${ howLongSinceCachedInMs / 1000 } sec)`);
          return cacheResponse; // to soon -> re-use cache
        } else {
          console.log(`[MT]> Cache hit is ${ howLongSinceCachedInMs / 1000 } secs old, try to refresh...`);
        }
      }
    }
    if (!cacheResponse) {
      console.log(`[MT]> NO Cache hit for: '${apiUrl}'.`);
    }
    const requestHeaders = new Headers();
    requestHeaders.append("Content-Type", "application/x-protobuf");
    if (bearerToken.length > 0) {
      requestHeaders.append("Authorization", `Bearer ${bearerToken}`);
    }
    const apiRequest = new Request(apiUrlWithSecret, {
      headers: requestHeaders
    });
    console.log(`[MT]> Fetching from '${apiUrl})'...`);
    const fetchResponse = await fetch(apiRequest);
    console.log(`[MT]> Fetching from '${apiUrl})'... DONE`);
    // console.log(`[MT]> - fetched response headers: ${fetchResponse.headers}.`);
    // console.log(`[MT]> - fetched response status: ${fetchResponse.status}.`);
    if (fetchResponse.status == 200) {
      const newResponse = new Response(fetchResponse.body);
      if (maxAgeInSec >= 0) {
        let cacheControl = `s-maxage=${maxAgeInSec}`;
        newResponse.headers.append("Cache-Control", cacheControl);
      }
      // console.log(`[MT]> newResponse.headers["Cache-Control"]: ${newResponse.headers.get("Cache-Control")}.`);
      newResponse.headers.append("X-MT-Timestamp", Date.now());
      // console.log(`[MT]> newResponse.headers["X-MT-Timestamp"]: ${newResponse.headers.get("X-MT-Timestamp")}.`);
      // console.log(`[MT]> newResponse.headers: ${newResponse.headers}.`);
      ctx.waitUntil(cache.put(cacheKey, newResponse.clone()));
      console.log(`[MT]> Cache saved for: ${request.url} (${apiUrl}).`);
      console.log(`[MT]> Returning new fetched & cached response`);
      return newResponse; // return new cached response
    } else {
      if (cacheResponse) {
        console.log(`[MT]> Returning cache hit (fetch failed - ${fetchResponse.status})`);
        return cacheResponse; // return "older" cached response
      }
      console.log(`[MT]> Returning failed (${fetchResponse.status}) fetched reponse`);
      return fetchResponse; // return fetch response w/ error
    }
    // } else {
    // console.log(`[MT]> Cache hit for: ${request.url} (${apiUrl}).`);
    // }
    // return response;
  }
};
