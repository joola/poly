joola.on('ready', function () {
  console.log('Joola SDK ready, version', joola.VERSION);
  joola.on('query_updated', function () {
    $('.showingresults').text('Loading data...');
    stopRunningQueries();

    joola.fetch(query, function (err, data) {
      if (err)
        throw err;

      data = data[0].documents;

      GeoJSON.forEach(function (site) {
        site.alerts = [];
        site.viz_data.nodes.forEach(function (node) {
          node.alerts = [];
        });
      });

      data.forEach(function (point) {
        var theSite = null;
        GeoJSON.forEach(function (site) {
          if (site.properties.site_id === point.site_id) {
            theSite = site;
          }
        });
        if (!theSite)
          return;
        theSite.properties.counter = theSite.properties.counter || {};
        theSite.properties.counter[point.event_type] = theSite.properties.counter[point.event_type] || 0;
        theSite.properties.counter[point.event_type] = point.metric;

        var description = '<h3>Site details<h3>';
        Object.keys(theSite.properties.counter).forEach(function (key) {
          description += '<strong>' + key + '</strong>: ' + theSite.properties.counter[key] + '<br/>';
        });

        //theSite.alerts = theSite.alerts || [];
        if (point.event_type === 'alert') {
          theSite.alerts.push(point);
          theSite.viz_data.nodes.forEach(function (node) {
            if (node.ip === point.event_ip) {
              //node.alerts = node.alerts || [];
              node.alerts.push(point);
              //node.color = {background: '#fc4353'};
            }
          });
        }
      });
      refreshHeatmap();
      updateFeatures();
      showAlertList();
    });
  });

  /*setInterval(function () {
   GeoJSON.forEach(function (site) {
   site.viz_data.nodes.forEach(function (node) {
   if (node.alerts) {
   node.alerts.forEach(function (alert, i) {
   var max_diff_sec = 90;
   var diff = (new Date().getTime() - new Date(alert.timestamp).getTime()) / 1000;
   if (diff > max_diff_sec) {
   console.log('removing alert from viz node');
   node.alerts.splice(i, 1);
   }
   });
   }
   });
   });
   }, 1000);*/

  joola.beacon.subscribe(function (err) {
    if (err)
      throw err;
  });

  joola.io.socket.on('event', function (collection, data) {

  });
});

function stopRunningQueries() {
  while (runningQueries.length > 0) {
    var lastQueryUUID = runningQueries.pop();

    if (lastQueryUUID && lastQueryUUID.length > 0) {
      console.log('stopping', lastQueryUUID);
      joola.query.stop(lastQueryUUID);
    }
  }
}