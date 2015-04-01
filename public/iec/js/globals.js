var query = {
  timeframe: 'last_90_seconds',
  interval: 'second',
  dimensions: ['timestamp', 'site_id', 'event_ip', 'event_type', 'event_data'],
  metrics: ['metric'],
  collection: 'iec',
  realtime: {
    enabled: true,
    interval: state.get('config.refresh.duration')
  },
  sort: [
    ['timestamp', 'DESC']
  ]
};
var runningQueries = [];
var map;
var layers;
var geojson = [];
var heat;
var EPSData = [];
var currentTableMarkers = {};
var realtime = true;


var GeoJSON = [
  {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [34.886, 32.47]
    },
    "properties": {
      "site_id": "1",
      "title": "IEC Site 001",
      "marker-size": "small"
    },
    "viz_data": {
      nodes: [
        {id: 1, label: 'Node 1', ip: '10.0.0.1'},
        {id: 2, label: 'Node 2', ip: '10.0.0.2'},
        {id: 3, label: 'Node 3', ip: '10.0.0.3'},
        {id: 4, label: 'Node 4', ip: '10.0.0.4'},
        {id: 5, label: 'Node 5', ip: '10.0.0.5'}
      ],
      edges: [
        {from: 1, to: 2},
        {from: 1, to: 3},
        {from: 2, to: 4},
        {from: 2, to: 5}
      ]
    }
  },
  {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [34.831, 32.13]
    },
    "properties": {
      "site_id": "2",
      "title": "IEC Site 002",
      "marker-size": "small"
    },
    "viz_data": {
      nodes: [
        {id: 1, label: 'Node 1', ip: '10.0.0.1'},
        {id: 2, label: 'Node 2', ip: '10.0.0.2'},
        {id: 3, label: 'Node 3', ip: '10.0.0.3'},
        {id: 4, label: 'Node 4', ip: '10.0.0.4'},
        {id: 5, label: 'Node 5', ip: '10.0.0.5'}
      ],
      edges: [
        {from: 1, to: 2},
        {from: 1, to: 3},
        {from: 2, to: 4},
        {from: 2, to: 5}
      ]
    }

  },
  {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [34.892,32.176]
    },
    "properties": {
      "site_id": "3",
      "title": "IEC Site 003",
      "marker-size": "small"
    },
    "viz_data": {
      nodes: [
        {id: 1, label: 'Node 1', ip: '10.0.0.1'},
        {id: 2, label: 'Node 2', ip: '10.0.0.2'},
        {id: 3, label: 'Node 3', ip: '10.0.0.3'},
        {id: 4, label: 'Node 4', ip: '10.0.0.4'},
        {id: 5, label: 'Node 5', ip: '10.0.0.5'}
      ],
      edges: [
        {from: 1, to: 2},
        {from: 1, to: 3},
        {from: 2, to: 4},
        {from: 2, to: 5}
      ]
    }
  }
];
