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

    let cacheControl = '';
    // cacheControl = 's-maxage=60'; // 1h // DEBUG
    cacheControl = 's-maxage=86400'; // 24h // DEBUG
    let tryRefreshAfterInMs = 60000; // 1 minute
    let apiUrl = '';
    let apiUrlWithSecret = '';
    let bearerToken = '';
    const agency = pathnameParts[1];
    const urlType = pathnameParts[2];
    console.log(`[MT]> agency: '${agency}'.`);
    console.log(`[MT]> urlType: '${urlType}'.`);
    switch (agency) {
      case "ca_chambly_richelieu_carignan_citcrc": // exo CRC
        switch (urlType) {
          case SERVICE_ALERTS:
            cacheControl = 's-maxage=30'; // minimum interval of 05 seconds between each call to our open data service.
            apiUrl = 'https://exo.chrono-saeiv.com/api/opendata/v1/CITCRC/alert?token='; 
            apiUrlWithSecret = apiUrl + env.MT_GTFS_RT_ca_chambly_richelieu_carignan_citcrc;
            break;
        }
        break;
      case "ca_l_assomption_mrclasso": // exo LASSO
        switch (urlType) {
          case SERVICE_ALERTS:
            cacheControl = 's-maxage=30'; // minimum interval of 05 seconds between each call to our open data service.
            apiUrl = 'https://exo.chrono-saeiv.com/api/opendata/v1/MRCLASSO/alert?token='; 
            apiUrlWithSecret = apiUrl + env.MT_GTFS_RT_ca_l_assomption_mrclasso;
            break;
        }
        break;
      case "ca_la_presqu_ile_citpi": // exo PI
        switch (urlType) {
          case SERVICE_ALERTS:
            cacheControl = 's-maxage=30'; // minimum interval of 05 seconds between each call to our open data service.
            apiUrl = 'https://exo.chrono-saeiv.com/api/opendata/v1/CITPI/alert?token='; 
            apiUrlWithSecret = apiUrl + env.MT_GTFS_RT_ca_la_presqu_ile_citpi;
            break;
        }
        break;
      case "ca_laurentides_citla": // exo LA
        switch (urlType) {
          case SERVICE_ALERTS:
            cacheControl = 's-maxage=30'; // minimum interval of 05 seconds between each call to our open data service.
            apiUrl = 'https://exo.chrono-saeiv.com/api/opendata/v1/CITLA/alert?token='; 
            apiUrlWithSecret = apiUrl + env.MT_GTFS_RT_ca_laurentides_citla;
            break;
        }
        break;
      case "ca_le_richelain_citlr": // exo LRRS (Le Richelain / Roussillon)
        switch (urlType) {
          case SERVICE_ALERTS:
            cacheControl = 's-maxage=30'; // minimum interval of 05 seconds between each call to our open data service.
            apiUrl = 'https://exo.chrono-saeiv.com/api/opendata/v1/LRRS/alert?token='; 
            apiUrlWithSecret = apiUrl + env.MT_GTFS_RT_ca_le_richelain_citlr;
            break;
        }
        break;
      case "ca_les_moulins_mrclm": // exo Terrebonne-Mascouche
        switch (urlType) {
          case SERVICE_ALERTS:
            cacheControl = 's-maxage=30'; // minimum interval of 05 seconds between each call to our open data service.
            apiUrl = 'https://exo.chrono-saeiv.com/api/opendata/v1/MRCLM/alert?token='; 
            apiUrlWithSecret = apiUrl + env.MT_GTFS_RT_ca_les_moulins_mrclm;
            break;
        }
        break;
      case "ca_longueuil_rtl":
        switch (urlType) {
          case SERVICE_ALERTS:
            cacheControl = 's-maxage=30'; // minimum interval of 05 seconds between each call to our open data service.
            apiUrl = 'https://rtl.chrono-saeiv.com/api/opendata/v1/RTL/alert?token='; 
            apiUrlWithSecret = apiUrl + env.MT_GTFS_RT_ca_longueuil_rtl;
            break;
        }
        break;
      case "ca_montreal_amt": // exo trains
        switch (urlType) {
          case SERVICE_ALERTS:
            cacheControl = 's-maxage=30'; // minimum interval of 05 seconds between each call to our open data service.
            apiUrl = 'https://exo.chrono-saeiv.com/api/opendata/v1/TRAINS/alert?token='; 
            apiUrlWithSecret = apiUrl + env.MT_GTFS_RT_ca_montreal_amt;
            break;
        }
        break;
      case "ca_richelieu_citvr": // exo VR
        switch (urlType) {
          case SERVICE_ALERTS:
            cacheControl = 's-maxage=30'; // minimum interval of 05 seconds between each call to our open data service.
            apiUrl = 'https://exo.chrono-saeiv.com/api/opendata/v1/CITVR/alert?token='; 
            apiUrlWithSecret = apiUrl + env.MT_GTFS_RT_ca_richelieu_citvr;
            break;
        }
        break;
      case "ca_sherbrooke_sts":
        switch (urlType) {
          case SERVICE_ALERTS:
            cacheControl = 's-maxage=30'; // minimum interval of 05 seconds between each call to our open data service.
            apiUrl = 'https://sts.chrono-saeiv.com/api/opendata/v1/STS/alert?token='; 
            apiUrlWithSecret = apiUrl + env.MT_GTFS_RT_ca_sherbrooke_sts;
            break;
        }
        break;
      case "ca_sorel_varennes_citsv": // exo SV
        switch (urlType) {
          case SERVICE_ALERTS:
            cacheControl = 's-maxage=30'; // minimum interval of 05 seconds between each call to our open data service.
            apiUrl = 'https://exo.chrono-saeiv.com/api/opendata/v1/CITSV/alert?token='; 
            apiUrlWithSecret = apiUrl + env.MT_GTFS_RT_ca_sorel_varennes_citsv;
            break;
        }
        break;
      case "ca_ste_julie_omitsju": // exo SJU
        switch (urlType) {
          case SERVICE_ALERTS:
            cacheControl = 's-maxage=30'; // minimum interval of 05 seconds between each call to our open data service.
            apiUrl = 'https://exo.chrono-saeiv.com/api/opendata/v1/OMITSJU/alert?token='; 
            apiUrlWithSecret = apiUrl + env.MT_GTFS_RT_ca_ste_julie_omitsju;
            break;
        }
        break;
      case "ca_sud_ouest_citso": // exo SO
        switch (urlType) {
          case SERVICE_ALERTS:
            cacheControl = 's-maxage=30'; // minimum interval of 05 seconds between each call to our open data service.
            apiUrl = 'https://exo.chrono-saeiv.com/api/opendata/v1/CITSO/alert?token='; 
            apiUrlWithSecret = apiUrl + env.MT_GTFS_RT_ca_sud_ouest_citso;
            break;
        }
        break;
    }
    console.log(`[MT]> apiUrl: '${apiUrl}'`);
    if (apiUrl.length == 0) {
      return new Response('404 not found GTFS-RT', {
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
        if (howLongSinceCachedInMs < tryRefreshAfterInMs) { // 1 minute
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
    console.log(`[MT]> - fetched response status: ${fetchResponse.status}.`);
    if (fetchResponse.status == 200) {
      const newResponse = new Response(fetchResponse.body);
      if (cacheControl.length == 0) {
          newResponse.headers.append("Cache-Control", cacheControl);
      }
      newResponse.headers.append("X-MT-Timestamp", Date.now());
      // console.log(`[MT]> newResponse.headers: ${newResponse.headers}.`);
      ctx.waitUntil(cache.put(cacheKey, newResponse.clone()));
      console.log(`[MT]> Cache saved for: ${request.url} (${apiUrl}).`);
      console.log(`[MT]> Returning new fetched & cached response`);
      return newResponse; // return new cached response
    } else {
      if (cacheResponse) {
        console.log(`[MT]> Returning cache hit (fetch failed)`);
        return cacheResponse; // return "older" cached response
      }
      console.log(`[MT]> Returning failed fetched reponse`);
      return fetchResponse; // return fetch response w/ error
    }
    // } else {
    // console.log(`[MT]> Cache hit for: ${request.url} (${apiUrl}).`);
    // }
    // return response;
  }
};