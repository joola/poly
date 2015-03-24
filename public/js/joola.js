joola.on('ready', function () {
  console.log('Joola SDK ready, version', joola.VERSION);

  joola.on('query_updated', function () {
    $('.showingresults').text('Loading data...');
    while (runningQueries.length > 0) {
      var lastQueryUUID = runningQueries.pop();

      if (lastQueryUUID && lastQueryUUID.length > 0) {
        console.log('stopping', lastQueryUUID);
        joola.query.stop(lastQueryUUID);
      }
    }

    joola.query.fetch(query, function (err, docs) {
      if (err) {
        console.error(err);
        throw err;
      }

      runningQueries.push(docs[0].query.realtimeUID);
      buildShowingResults();
      var data = docs[0].documents;
      data.forEach(function (point) {
        point.lat = point.location_lat;
        point.lon = point.location_lon;

        var marker = L.marker(new L.LatLng(point.lat, point.lon), {
          icon: L.mapbox.marker.icon({'marker-color': '#f86767', 'marker-size': 'small'}),
          data: point
        });
        //markers.addLayer(marker);
      });
      markers.eachLayer(function (marker) {
        //heat.addLatLng(marker.getLatLng());

      });
    });


    new joola.viz.Table({
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
      done: function (results, raw) {
        var uuid = raw[0].query.realtimeUID;
        if (runningQueries.indexOf(uuid) === -1)
          runningQueries.push(uuid);
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

  });

  joola.beacon.subscribe(function (err) {
    if (err)
      throw err;
  });

  joola.io.socket.on('event', function (collection, data) {
    if (['geo'].indexOf(collection) === -1)
      return;
    if (EPSData.length > 90)
      EPSData.shift();
    var sum = 0;
    data.forEach(function (d) {
      sum += d.metric;
    });
    EPSData.push({timestamp: new Date(), metric: sum, total: sum });
    /*data.forEach(function (point) {
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
     onmove();*/
  });
});

function buildShowingResults() {
  var result = 'Showing results for date range ';

  if (typeof query.timeframe === 'string')
    result += '<strong>' + query.timeframe.replace(/_/ig, ' ') + '</strong>';
  else {
    result += '<strong>' + query.timeframe.start.toISOString() + '</strong>';
    result += ' - ';
    result += '<strong>' + query.timeframe.end.toISOString() + '</strong>';
  }
  $('.showingresults').html(result);
}