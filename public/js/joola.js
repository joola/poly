joola.on('ready', function () {
  console.log('Joola SDK ready, version', joola.VERSION);

  joola.on('query_updated', function () {
    $('.showingresults').text('Loading data...');
    stopRunningQueries();

    /*joola.query.fetch(query, function (err, docs) {
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
     });*/

    var bounds = map.getBounds();
    bounds = [
      [bounds.getNorthWest().lat, bounds.getNorthWest().lng],
      [bounds.getSouthEast().lat, bounds.getSouthEast().lng]
    ];

    var collections = {};

    query.filters = [];
    query.filters.push(['location', 'geo_bounds', bounds]);
    //console.log(query.filters);
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
        buildShowingResults();


      },
      enter: function (data) {
        data.forEach(function (point) {
          //build the collection list
          var source_id = point.raw.source_id;
          if (source_id) {
            collections[source_id] = collections[source_id] || 0;
            collections[source_id]++;
          }
          Object.keys(layers._layers).forEach(function (key) {
            var layer = layers._layers[key];
            var name = layer.name;
            if (!layer.overlay)
              return;
            var found = false;
            Object.keys(collections).forEach(function (col) {
              if (name.indexOf(col) > -1)
                found = true;
            });
            if (!found) {
              //console.log('Removing layer', name);
              layers.removeLayer(layer.layer);
            }
          });
          Object.keys(collections).forEach(function (col) {
            var found = false;
            Object.keys(layers._layers).forEach(function (key) {
              var layer = layers._layers[key];
              var name = layer.name;
              if (name.indexOf(col) > -1) {
                //console.log('Updating layer', name);
               // layer.name = col + ' (' + collections[col] + ')';
                found = true;
              }
            });
            if (!found) {
              //var featureLayer = L.mapbox.featureLayer().addTo(map);
              //console.log('Adding layer', col);
              var featureLayer = new L.MarkerClusterGroup({ polygonOptions: {
                fillColor: '#3887be',
                color: '#3887be',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.5
              }}).addTo(map);
              layers.addOverlay(featureLayer, col);
            }
          });
          //layers._update();

          var key = point.key;
          point = point.raw;

          point.lat = point.location_lat;
          point.lon = point.location_lon;
          //addMarker(point);

          var marker = L.marker(new L.LatLng(point.lat, point.lon), {
            icon: L.mapbox.marker.icon({'marker-color': '#f86767', 'marker-size': 'small'}),
            data: point,
            uuid: key
          });

          Object.keys(layers._layers).forEach(function (key) {
            var layer = layers._layers[key];
            var name = layer.name;
            if (name.indexOf(source_id) > -1) {
              //console.log('adding point', marker);
              layer.layer.addLayer(marker);
            }
          });


          //markers.addLayer(marker);
          currentTableMarkers[key] = marker;
          //markers.eachLayer(function (marker) {
            console.log('heat');
            heat.addLatLng(marker.getLatLng());
         // });
        });

        /*
         var marker = L.marker([point.lat, point.lon], {
         icon: L.mapbox.marker.icon({
         'marker-color': '#f86767'
         })
         });*/
        //marker.addTo(map);


        // L.mapbox.featureLayer(geojson).addTo(map);
      },
      exit: function (data) {
        data.forEach(function (point) {
          var marker = currentTableMarkers[point.key];
          // console.log('remove',marker);
          markers.removeLayer(marker);
        });

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
    EPSData.push({timestamp: new Date(), metric: sum, total: sum});
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
  var count = Object.keys(currentTableMarkers).length || 0;
  var result = 'Showing <strong>' + count + '</strong> markers from ';

  if (typeof query.timeframe === 'string')
    result += '<strong>' + query.timeframe.replace(/_/ig, ' ') + '</strong>';
  else {
    result += '<strong>' + query.timeframe.start.toISOString() + '</strong>';
    result += ' - ';
    result += '<strong>' + query.timeframe.end.toISOString() + '</strong>';
  }
  $('.showingresults').html(result);
}

function stopRunningQueries() {
  while (runningQueries.length > 0) {
    var lastQueryUUID = runningQueries.pop();

    if (lastQueryUUID && lastQueryUUID.length > 0) {
      console.log('stopping', lastQueryUUID);
      joola.query.stop(lastQueryUUID);
    }
  }
}