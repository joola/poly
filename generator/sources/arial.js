module.exports = {
  _save: {key: '_save', value: function () {
    return ((Math.floor(Math.random() * 100) + 1) / 100) < 0.7;
  }},
  source_id: {key: 'source_id', type: 'dimension', datatype: 'string', value: 'arial'},
  sensor_type: {key: 'sensor_type', type: 'dimension', datatype: 'string', value: 'movement'},
  sensor_uid: {key: 'sensor_uid', type: 'dimension', datatype: 'string', value: function () {
    return joola.common.uuid(4)
  }},
  timestamp: {key: 'timestamp', type: 'dimension', datatype: 'date', value: function () {
    return new Date();
  }},
  grid: {key: 'grid', type: 'dimension', datatype: 'string', value: function () {
    return 'grid-' + Math.floor(Math.random() * 10) + 1
  }},
  detection_type: {key: 'detection_type', type: 'dimension', datatype: 'string', value: function () {
    return  ((Math.floor(Math.random() * 100) + 1) / 100) < 0.7 ? 'person' : 'vehicle'
  }},
  speed: {key: 'speed', type: 'metric', datatype: 'number', aggregation: 'avg', value: function () {
    return (Math.floor(Math.random() * 180) + 0)
  }}
};