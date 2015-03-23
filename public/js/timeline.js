joola.on('ready', function () {
  joola.query.fetch({
    timeframe: 'last_3_minutes',
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
      d.counts = [1, 2, 3];
      d.total = d.metric;
      return d.timestamp;
    });

    drawTimeline(data);
  });

// sizing information, including margins so there is space for labels, etc
  var margin = { top: 20, right: 20, bottom: 100, left: 20 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    marginOverview = { top: 430, right: margin.right, bottom: 20, left: margin.left },
    heightOverview = 500 - marginOverview.top - marginOverview.bottom;

// set up a date parsing function for future use
  var parseDate = d3.time.format("%d/%m/%Y").parse;

// some colours to use for the bars
  var colour = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

// mathematical scales for the x and y axes
  var x = d3.scale.linear()
    .domain([0, 1])
    .range([0, width]);

  var y = d3.scale.linear()
    .domain([0, 100])
    .rangeRound([0, height]);
  /*
   var x = d3.time.scale()
   .range([0, width]);
   var y = d3.scale.linear()
   .range([height, 0]);*/
  var xOverview = d3.time.scale()
    .range([0, width]);
  var yOverview = d3.scale.linear()
    .range([heightOverview, 0]);


// rendering for the x and y axes
  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");
  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
  var xAxisOverview = d3.svg.axis()
    .scale(xOverview)
    .orient("bottom");

// something for us to render the chart into
  var svg = d3.select("body")
    .append("svg") // the overall space
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
  /*var main = svg.append("g")
   .attr("class", "main")
   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");*/
  var overview = svg.append("g")
    .attr("class", "overview")
    .attr("transform", "translate(" + marginOverview.left + "," + marginOverview.top + ")");

// brush tool to let us zoom and pan using the overview chart
  var brush = d3.svg.brush()
    .x(xOverview)
    .on("brush", brushed);


  function drawTimeline(data) {
    // data ranges for the x and y axes
    x.domain(d3.extent(data, function (d) {
      return d.timestamp;
    }));
    y.domain([0, d3.max(data, function (d) {
      return d.total;
    })]);
    xOverview.domain(x.domain());
    yOverview.domain(y.domain());

    colour.domain(d3.keys(data[0]));
    var magFn = function (d) {
      return d.metric
    }
    var dateFn = function (d) {
      return d.timestamp;
    };

    overview.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + heightOverview + ")")
      .call(xAxisOverview);


    var initialSize = 0;
    overview.append("g")
      .attr("class", "bars");


    function refresh() {
      //if (initialSize === 0)
      //  initialSize = data.length;
      //else
      //  data = data.splice(data.length - initialSize, initialSize);
      console.log(data.length);
      var points = overview
        .selectAll('.bars').selectAll('.bar')
        .data(data, dateFn);

      points
        .enter().insert("svg:rect", "line")
        .attr("class", "bar")
        //.attr("x", function (d, i) {
        //  
        // return x(i + 1) - .5;
        //})
        //.attr("y", function (d) {
        // return height - y(d.total) - .5;
        //})
        .attr("x", function (d) {
          //console.log(xOverview(d.timestamp) - 3)
          return xOverview(d.timestamp) - 3;
        })
        .attr("y", function (d) {
          return yOverview(d.total);
        })
        .attr("width", 20)
        //
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
        //.transition().duration(1000)
        //.attr('x', function (d, i) {
        //  console.log(xOverview(d.timestamp) - 3);
        //  return  xOverview(d.timestamp) - 3;
        //})
        .remove();
    }

    refresh();
    /*.style("fill", function (d) {
     return colour(d.name);
     });*/

    setInterval(function () {
      data.shift();
      data.push({timestamp: new Date(), total: 10, counts: [1, 2, 3]});
      refresh();
    }, 1000);

    // add the brush target area on the overview chart
    overview.append("g")
      .attr("class", "x brush")
      .call(brush)
      .selectAll("rect")
      // -6 is magic number to offset positions for styling/interaction to feel right
      .attr("y", -6)
      // need to manually set the height because the brush has
      // no y scale, i.e. we should see the extent being marked
      // over the full height of the overview chart
      .attr("height", heightOverview + 7);  // +7 is magic number for styling

  }

// zooming/panning behaviour for overview chart
  function brushed() {
    // update the main chart's x axis data range
    x.domain(brush.empty() ? xOverview.domain() : brush.extent());
    // redraw the bars on the main chart
    /*main.selectAll(".bar.stack")
     .attr("transform", function (d) {
     return "translate(" + x(d.date) + ",0)";
     })
     // redraw the x axis of the main chart
     main.select(".x.axis").call(xAxis);*/
  }
});