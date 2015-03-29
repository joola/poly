var query = {
  timeframe: 'last_90_seconds',
  interval: 'second',
  dimensions: ['source_id', 'location.lat', 'location.lon', 'tag', 'type'],
  metrics: ['metric', {key: 'humidity', aggregation: 'avg', decimals: 2}],
  collection: 'geo',
  realtime: {
    enabled: true,
    interval: state.get('config.refresh.duration')
  }
};
var runningQueries = [];
var map;
var layers;
var geojson = [];
var heat;
var EPSData = [];
var currentTableMarkers = {};
var realtime = true;