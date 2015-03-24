var query = {
  timeframe: 'last_90_seconds',
  interval: 'second',
  dimensions: ['location.lat', 'location.lon', 'tag', 'type'],
  metrics: ['metric', {key: 'humidity', aggregation: 'avg', decimals: 2}],
  collection: 'geo',
  realtime: {
    enabled: true,
    interval: state.get('config.refresh.duration')
  }
};
var runningQueries=[];
var map;
var geojson = [];
var heat;
var EPSData = [];

var realtime = true;