joola.on('ready', function () {
  console.log('Joola SDK ready, version', joola.VERSION);
  var query = {
    timeframe: 'last_5_seconds',
    interval: 'second',
    dimensions: ['location.lat', 'location.lon', 'tag'],
    metrics: ['metric'],
    collection: 'geo',
    realtime: {
      enabled: false,
      interval: state.get('config.refresh.duration')
    }
  };
  /*new joola.viz.Table({
    container: '#table',
    query: query,
    pickers: {
      primary: {
        enabled: false
      },
      add_dimension: {
        enabled: true,
        caption: 'Add dimension...',
        allowRemove: false,
        allowSelect: false
      },
      add_metric: {
        enabled: true,
        caption: 'Add metric...',
        allowRemove: false,
        allowSelect: false
      }
    },
    enter: function (data) {
      var addMarker = function (point) {
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(point.lat, point.lon),
          map: map
        });
        var chHtml = "<h4>Event details</h4><div>";
        Object.keys(point).forEach(function (key) {
          var elem = point[key];
          if (typeof elem !== 'object')
            chHtml += '<strong>' + key + ':</strong> ' + elem + '<br/>';
        });
        var chInfoWindow = new google.maps.InfoWindow({
          content: chHtml,
          maxWidth: 250
        });
        google.maps.event.addListener(marker, 'click', function () {
          chInfoWindow.open(map, marker);
        });
        setTimeout(function () {
          marker.setMap(null);
        }, state.get('config.tail.duration'));
      };

      data.forEach(function (point) {
        point = point.raw;
        point.lat = point.location_lat;
        point.lon = point.location_lon;
        //addMarker(point);

        var marker = L.marker([point.lat, point.lon], {
          icon: L.mapbox.marker.icon({
            'marker-color': '#f86767'
          })
        });
        //marker.addTo(map);

      });
      // L.mapbox.featureLayer(geojson).addTo(map);
    }
  });
*/
  /*
   joola.on('polygon_added', function (marker) {
   var _query = joola.common.extend(query, {
   uuid: marker[0].uuid,
   marker_type: marker[0].type,
   filter: [
   ['location', 'geo_distance', [marker[0].getRadius(), encodeGeoHash(marker[0].getCenter().k, marker[0].getCenter().D), [marker[0].getCenter().k, marker[0].getCenter().D]]]
   ]
   });
   console.log('polygon added', marker, _query);
   joola.query.fetch(_query, function (err, data) {
   if (err)
   throw err;
   var points = data[0].documents;
   points.forEach(function (point) {
   var latLng = new google.maps.LatLng(point.lat, point.lon);

   var circle = {
   path: google.maps.SymbolPath.CIRCLE,
   fillColor: 'red',
   fillOpacity: .2,
   strokeColor: 'white',
   strokeWeight: .5,
   scale: 5
   };
   var marker = new google.maps.Marker({
   position: latLng,
   map: map,
   icon: circle
   });
   setTimeout(function () {
   marker.setMap(null);
   }, 5000);
   });
   });
   });
   joola.on('polygon_updated', function (marker) {
   console.log('polygon updated', marker);
   });
   */
  joola.beacon.subscribe(function (err) {
    if (err)
      throw err;
  });

  joola.io.socket.on('event', function (collection, data) {
    if (['geo'].indexOf(collection) === -1)
      return;
    EPSData.push(data.length);
    data.forEach(function (point) {
      point.lat = point.location.lat;
      point.lon = point.location.lon;

      var marker = L.marker(new L.LatLng(point.lat, point.lon), {
        icon: L.mapbox.marker.icon({'marker-color': '#f86767', 'marker-size': 'small'}),
        data: point
      });
      //markers.addLayer(marker);
    });
    markers.eachLayer(function (marker) {
      //heat.addLatLng(marker.getLatLng());

    });
    onmove();
  });
});