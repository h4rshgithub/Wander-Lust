
    maptilersdk.config.apiKey = mapToken
    const map = new maptilersdk.Map({
      container: 'map', // container's id or th %e HTML element in which the SDK will render the map
      style: maptilersdk.MapStyle.STREETS,
      center: [ 80.949997,26.850000], // starting position [lng, lat]
      zoom: 14 // starting zoom
    });
