module.exports = {
  _collection: {key: '_collection', value: function () {
    return 'geo';
  }},
  _save: {key: '_save', value: function () {
    return ((Math.floor(Math.random() * 100) + 1) / 100) < 0.5;
  }},
  source_id: {key: 'source_id', type: 'dimension', datatype: 'string', value: 'sensor-a'},
  sensor_type: {key: 'sensor_type', type: 'dimension', datatype: 'string', value: 'acoustic'},
  sensor_uid: {key: 'sensor_uid', type: 'dimension', datatype: 'string', value: function () {
    return joola.common.uuid(4)
  }},
  timestamp: {key: 'timestamp', type: 'dimension', datatype: 'date', value: function () {
    return new Date().getTime();
  }},
  grid: {key: 'grid', type: 'dimension', datatype: 'string', value: function () {
    return 'grid-' + Math.floor(Math.random() * 10) + 1
  }},
  level: {key: 'level', type: 'metric', datatype: 'number', aggregation: 'avg', value: function () {
    return (Math.floor(Math.random() * 100) + 0) / 100
  }}
};