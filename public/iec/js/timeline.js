joola.on('ready', function () {
  joola.query.fetch({
    timeframe: 'last_90_seconds',
    interval: 'second',
    dimensions: ['timestamp'],
    metrics: ['metric'],
    collection: 'geo',
    sort: [
      ['timestamp', 'ASC']
    ],
    realtime: {
      enabled: false
    }
  }, function (err, results) {
    if (err)
      throw err;
    var data = results[0].documents;
    data = _.sortBy(data, function (d) {
      d.timestamp = new Date(d.timestamp);
      d.total = d.metric;
      return d.timestamp;
    });

    EPSData = data.concat(EPSData);
    EPSData = _.filter(EPSData, function (x) {
      return x;
    });
    drawTimeline(EPSData);
  });

// sizing information, including margins so there is space for labels, etc
  var margin = { top: 5, right: 5, bottom: 0, left: 5 },
    width = $('svg.timeline').width() - margin.left - margin.right,
    height = 21 - margin.top - margin.bottom,
    marginOverview = { top: 0, right: margin.right, bottom: 0, left: margin.left },
    heightOverview = 21 - marginOverview.top - marginOverview.bottom;

  var x = d3.time.scale()
    .range([0, width]);
  var y = d3.scale.linear()
    .range([height, 0]);
  var xOverview = d3.time.scale()
    .range([0, width]);
  var yOverview = d3.scale.linear()
    .range([heightOverview, 0]);


  var svg = d3.select("svg.timeline")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
  var overview = svg.append("g")
    .attr("class", "overview");

  var brush = d3.svg.brush()
    .x(xOverview)
    .on('brushstart', function () {
      realtime = false;
    })
    .on('brushend', function () {
      brushed();
    });

  function drawTimeline(data) {
    overview.append("g").attr("class", "bars");
    function refresh() {
      // data ranges for the x and y axes
      x.domain(d3.extent(data, function (d) {
        return d.timestamp;
      }));
      y.domain([0, d3.max(data, function (d) {
        return d.total;
      })]);
      xOverview.domain(x.domain());
      yOverview.domain(y.domain());

      var points = overview
        .selectAll('.bars').selectAll('.bar')
        .data(data, function (d) {
          return d.timestamp;
        });

      points
        .enter().insert("svg:rect", "line")
        .attr("class", "bar")
        .attr("x", function (d) {
          return xOverview(d.timestamp) - 3;
        })
        .attr("y", function (d) {
          return yOverview(d.total);
        })
        .attr("width", 4)
        .attr("height", function (d) {
          return heightOverview - yOverview(d.total);
        })
        .transition()
        .duration(1000)
        .attr("x", function (d, i) {
          return  xOverview(d.timestamp) - 3;
        });

      points
        .transition()
        .duration(1000)
        .attr("x", function (d, i) {
          return  xOverview(d.timestamp) - 3;
        });

      points
        .exit()
        .transition().duration(1000)
        .attr('x', function (d, i) {
          return  xOverview(d.timestamp) - 3;
        })
        .remove();
    }

    refresh();
    setInterval(function () {
      if (!realtime)
        return;
      refresh();
    }, 1000);

    // add the brush target area on the overview chart
    overview.append("g")
      .attr("class", "x brush")
      .call(brush)
      .selectAll("rect")
      .attr("y", -6)
      .attr("height", heightOverview + 7);  // +7 is magic number for styling
  }

  function brushed() {
    x.domain(brush.empty() ? xOverview.domain() : brush.extent());
    if (!brush.empty()) {
      realtime = false;
      query.timeframe = {start: x.domain()[0], end: x.domain()[1]};
      query.realtime = {enabled: false};
      $('#button_play i').attr('class', "fa fa-play");
      $('.dates').text('Paused');
    }
    else {
      realtime = true;
      query.timeframe = 'last_90_seconds';
      query.realtime = {enabled: true, interval: 5000};
      $('#button_play i').attr('class', "fa fa-pause");
      $('.dates').text('Last 90 sec.');
    }
    joola.emit('query_updated');
  }

  $('.timeline-state').DatePicker({offsetX: -5,daysback:-7}, function (err, ref) {
    $('.dates').text('Last 90 sec.');
    ref.on('datechange', function (dates) {
      realtime = false;
      query.timeframe = {start: dates.base_fromdate, end: dates.base_todate};
      query.realtime = {enabled: false};
      joola.emit('query_updated');
      $('.dates').text('Custom');
    });
  });

});