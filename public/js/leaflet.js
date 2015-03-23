var map;
var geojson = [];
$().ready(function () {
  L.mapbox.accessToken = 'pk.eyJ1Ijoiam9vbGEiLCJhIjoiNnFpMlJEbyJ9.R3cNnoE_WpDSxtJIjhN3JQ';
  map = L.mapbox.map('map-canvas', 'joola.lhekjm4g').setView(L.latLng(32.476664, 34.974388), 13);


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
    e.layers.eachLayer(function(layer) {
      showPolygonArea({ layer: layer });
    });
  }
  function showPolygonArea(e) {
    featureGroup.clearLayers();
    featureGroup.addLayer(e.layer);
  }
  
  var geocode = L.mapbox.geocoderControl('mapbox.places', {
    autocomplete: true
  });

  var fullscreenControl = new L.Control.Fullscreen();
  map.addControl(geocode);
  map.addControl(fullscreenControl);

  map.on('mousemove', function (e) {
    window[e.type].innerHTML = e.latlng.toString();
  });
});