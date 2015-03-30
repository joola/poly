var mapOverlaySouth;
var featureLayer;
function initMap(next) {
  L.mapbox.accessToken = 'pk.eyJ1Ijoiam9vbGEiLCJhIjoiNnFpMlJEbyJ9.R3cNnoE_WpDSxtJIjhN3JQ';
  map = L.mapbox.map('map-canvas', 'joola.ljgmbgcl', {zoomControl: false, attributionControl: {compact: true}})
    .setView(L.latLng(32.22, 34.38), 9);

  map.on('move', showAlertList);

  featureLayer = L.mapbox.featureLayer().addTo(map);
  featureLayer.on('mouseover', function (e) {
    e.layer.openPopup();
  });
  featureLayer.on('mouseout', function (e) {
    e.layer.closePopup();
  });
  featureLayer.on('click', function (e) {
    $('#site-details').show();
    draw(e.layer.feature.viz_data, e.layer.feature);
  });

  $(document).on('click', function () {
    $('#site-details').hide();

  });
  $('#site-details').on('click', function (e) {
    e.stopPropagation();
  });
  $(document).keyup(function (e) {
    if (e.keyCode == 27) {
      $('#site-details').hide();
    }   // escape key maps to keycode `27`
  });

  updateFeatures();
  setInterval(updateFeatures, 5000);

  var overlayOptions = {
    zoomControl: false,
    attributionControl: false
  };

  var cfg = {
    byZoom: false,
    radius: 10
  };

  mapOverlaySouth = L.mapbox.map('map-overlay-south', 'joola.ljgmbgcl', overlayOptions).setView(L.latLng(31.47, 34.804), 7);
  heat = L.heatLayer([], cfg).addTo(mapOverlaySouth);

  joola.emit('start');
  next();
}

function refreshHeatmap() {
  var latlngs = [];

  GeoJSON.forEach(function (site) {
    var counters = site.properties.counter;
    if (!counters)
      return;

    Object.keys(counters).forEach(function (key) {
      var counter = counters[key];
      var latlng = L.latLng(site.geometry.coordinates[1], site.geometry.coordinates[0], counter);
      latlng.alt = counter;
      latlngs.push(latlng);
    });
  });
  heat.setLatLngs(latlngs);
}

function updateFeatures() {
  GeoJSON.forEach(function (site) {
    if (site.properties && site.properties.counter && site.properties.counter['alert'] > 0)
      site.properties['marker-color'] = '#fc4353';
    else
      site.properties['marker-color'] = '#a3e46b';
  });
  featureLayer.setGeoJSON(GeoJSON);
}

function showAlertList() {
  var inBounds = [],
  // Get the map bounds - the top-left and bottom-right locations.
    bounds = map.getBounds();

  // For each marker, consider whether it is currently visible by comparing
  // with the current map bounds.
  var $table = $('<table class="table table-condensed"></table>');
  var counter = 0;
  var trs = [];
  featureLayer.eachLayer(function (marker) {
    if (counter > 10)
      return;

    marker.feature.alerts.forEach(function (alert, i) {
      var max_diff_sec = 90;
      var diff = (new Date().getTime() - new Date(alert.timestamp).getTime()) / 1000;
      if (diff > max_diff_sec) {
        console.log('removing alert from marker',diff);
        marker.feature.alerts.splice(i, 1);
      }
    });

    if (bounds.contains(marker.getLatLng())) {
      marker.feature.alerts.forEach(function (alert) {
        if (counter > 10)
          return;
        var $tr = $('<tr></tr>');
        var $td = $('<td></td>');
        $td.html('<time class="timeago" datetime="' + new Date(alert.timestamp).toISOString() + '">' + timeDifference(new Date, new Date(alert.timestamp)) + '</time>');
        $tr.append($td);
        $td = $('<td></td>');
        $td.text(marker.options.title);
        $tr.append($td);
        $td = $('<td></td>');
        $td.text(alert.event_data);
        $tr.append($td);
        inBounds.push({site: marker.options.title, data: alert.event_data});
        trs.push($tr);
        $tr.on('click', function () {
          map.panTo(marker.getLatLng());
          map.panTo(marker.getLatLng());
        });
        $tr.timestamp = alert.timestamp;
        counter++;
      });
    }
  });

  //we must make sure we order the table correctly, markers can be all over the place.
  trs = _.sortBy(trs, function (x) {
    return x.timestamp;
  });
  trs.reverse();

  trs.forEach(function ($tr) {
    $table.append($tr);
  });
  if (trs.length===0){
    var $tr = $('<tr></tr>');
    var $td = $('<td>No alerts registered, trying zooming out.</td>');
    $tr.append($td);
    $table.append($tr);
  }
  // Display a list of markers.
  $('#coordinates').html($table);
  //jQuery('.timeago').timeago();
  //document.getElementById('coordinates').innerHTML = inBounds.join('\n');
}

function timeDifference(current, previous) {

  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + ' seconds ago';
  }

  else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + ' minutes ago';
  }

  else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + ' hours ago';
  }

  else if (elapsed < msPerMonth) {
    return 'approximately ' + Math.round(elapsed / msPerDay) + ' days ago';
  }

  else if (elapsed < msPerYear) {
    return 'approximately ' + Math.round(elapsed / msPerMonth) + ' months ago';
  }

  else {
    return 'approximately ' + Math.round(elapsed / msPerYear) + ' years ago';
  }
}