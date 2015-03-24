var map;
var geojson = [];
var heat;
var markers = new L.MarkerClusterGroup({ polygonOptions: {
  fillColor: '#3887be',
  color: '#3887be',
  weight: 2,
  opacity: 1,
  fillOpacity: 0.5
}});

$().ready(function () {
  L.mapbox.accessToken = 'pk.eyJ1Ijoiam9vbGEiLCJhIjoiNnFpMlJEbyJ9.R3cNnoE_WpDSxtJIjhN3JQ';
  map = L.mapbox.map('map-canvas').setView(L.latLng(32.476664, 34.974388), 13);


  L.control.layers({
    'Satellite': L.mapbox.tileLayer('joola.lhekjm4g'),
    'Dark': L.mapbox.tileLayer('joola.lhf4b967').addTo(map)
  }).addTo(map);

  var featureGroup = L.featureGroup().addTo(map);
  var drawControl = new L.Control.Draw({
    edit: {
      featureGroup: featureGroup
    },
    draw: {
      polygon: true,
      polyline: false,
      rectangle: true,
      circle: true,
      marker: false
    }
  }).addTo(map);
  map.on('draw:created', showPolygonArea);
  map.on('draw:edited', showPolygonAreaEdited);

  function showPolygonAreaEdited(e) {
    e.layers.eachLayer(function (layer) {
      showPolygonArea({layer: layer});
    });
  }

  function showPolygonArea(e) {
    featureGroup.clearLayers();
    featureGroup.addLayer(e.layer);
  }

  map.addLayer(markers);
  var geocode = L.mapbox.geocoderControl('mapbox.places', {
    autocomplete: true
  });

  var fullscreenControl = new L.Control.Fullscreen();
  map.addControl(geocode);
  map.addControl(fullscreenControl);

  map.on('mousemove', function (e) {
    window[e.type].innerHTML = e.latlng.toString();
  });


  map.on('move', onmove);

// call onmove off the bat so that the list is populated.
// otherwise, there will be no markers listed until the map is moved.
  onmove();

  heat = L.heatLayer([], { maxZoom: 18}).addTo(map);


  /* var layer = L.mapbox.featureLayer().on('ready', function() {
   console.log('test');
   // Zoom the map to the bounds of the markers.
   map.fitBounds(layer.getBounds());
   // Add each marker point to the heatmap.
   layer.eachLayer(function(l) {
   heat.addLatLng(l.getLatLng());
   });
   });*/
  
  joola.emit('start');
  
});


function onmove() {
  // Get the map bounds - the top-left and bottom-right locations.
  var inBounds = [],
    bounds = map.getBounds();
  markers.eachLayer(function (marker) {
    // For each marker, consider whether it is currently visible by comparing
    // with the current map bounds.
    if (bounds.contains(marker.getLatLng())) {
      inBounds.push(marker.options.data);
    }
  });
  // Display a list of markers.
  var $table = $('<table class="table table-condensed"></table>');
  var $tr = $('<tr></tr>');
  if (inBounds.length > 0) {
    Object.keys(inBounds[0]).forEach(function (key) {
      switch (key) {
        case 'timestamp':
          var $td = $('<th>' + key + '</th>');
          $tr.append($td);
          break;
        case 'location':
        case 'lat':
        case 'lon':
        case 'saved':
          break;
        default:
          var $td = $('<th>' + key + '</th>');
          $tr.append($td);
          break;
      }
      $tr.append($td);
    });
    $table.append($tr);
  }
  inBounds = _.sortBy(inBounds, function (x) {
    return x.timestamp;
  });
  inBounds.reverse();
  inBounds = inBounds.splice(0, 100);
  inBounds.forEach(function (point) {
    $tr = $('<tr></tr>');
    Object.keys(point).forEach(function (key) {
      switch (key) {
        case 'timestamp':
          var $td = $('<td>' + point[key] + '</td>');
          $tr.append($td);
          break;
        case 'location':
        case 'lat':
        case 'lon':
        case 'saved':
          break;
        default:
          var $td = $('<td>' + point[key] + '</td>');
          $tr.append($td);
          break;
      }
    });
    $table.append($tr);
  });
  $('#coordinates').empty();
  $('#coordinates').append($table);
  //document.getElementById('coordinates').innerHTML = inBounds.join('\n');
}
