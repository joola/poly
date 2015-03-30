module.exports = {
  _collection: {key: '_collection', value: function () {
    return 'iec';
  }},
  _save: {key: '_save', value: function () {
    return true;
  }},
  timestamp: {key: 'timestamp', type: 'dimension', datatype: 'date', value: function () {
    return new Date().getTime();
  }},
  site_id: {key: 'site_id', type: 'dimension', datatype: 'string', value: function () {
    return ((Math.floor(Math.random() * 100) + 1) / 100) < 0.7 ? '1' : '2'
  }},
  event_id: {key: 'event_id', type: 'dimension', datatype: 'string', value: function () {
    return '1234';
  }},
  event_type: {key: 'event_type', type: 'dimension', datatype: 'string', value: function () {
    return ((Math.floor(Math.random() * 100) + 1) / 100) < 0.9 ? 'info' : 'alert';
  }},
  event_ip: {key: 'event_ip', type: 'dimension', datatype: 'string', value: function () {
    var ips = [
      '10.0.0.1',
      '10.0.0.2',
      '10.0.0.3',
      '10.0.0.4',
      '10.0.0.5'
    ];
    var ip = ips[(Math.floor(Math.random() * (ips.length - 1)) + 0)];
    return ip;
  }},
  event_data: {key: 'event_data', type: 'dimension', datatype: 'string', value: function () {
    if (this.event_type.value === 'info')
      return 'This is a dummy event';
    else
      return 'This is a dummy alert';
  }},
  metric: {key: 'metric', type: 'metric', datatype: 'number', value: function () {
    return 1;
  }}
};