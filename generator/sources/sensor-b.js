module.exports = {
  _save: {key: '_save', value: function () {
    return ((Math.floor(Math.random() * 100) + 1) / 100) < 0.7;
  }},
  source_id: {key: 'source_id', type: 'dimension', datatype: 'string', value: 'sensor-b'},
  sensor_type: {key: 'sensor_datatype', type: 'dimension', datatype: 'string', value: 'atmosphere'},
  sensor_uid: {key: 'sensor_uid', type: 'dimension', datatype: 'string', value: function () {
    return joola.common.uuid(4)
  }},
  timestamp: {key: 'timestamp', type: 'dimension', datatype: 'date', value: function () {
    return new Date().getTime();
  }},
  grid: {key: 'grid', type: 'dimension', datatype: 'string', value: function () {
    return 'grid-' + Math.floor(Math.random() * 10) + 1
  }},
  o2: {key: 'o2', type: 'metric', datatype: 'number', aggregation: 'avg', value: function () {
    return (Math.floor(Math.random() * 100) + 90) / 100
  }}
};