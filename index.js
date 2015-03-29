var joola = require('joola'),
  st = require('node-static'),
  http = require('http'),
  file = new st.Server('./public');

process.env.JOOLA_CONFIG_STORE_LOGGER_CONSOLE_LEVEL = 'trace';

joola.init({}, function (err) {
  if (err)
    throw err;


  joola.users.verifyAPIToken({user: joola.SYSTEM_USER}, 'apitoken-demo', function (err, user) {
    function generateRandomData() {
      var date = new Date();
      var randomGeoPoints = generateRandomPoints({
        'lat': 32.476664,
        'lon': 34.974388
      }, 5000, Math.floor(Math.random() * 10) + 1);
      randomGeoPoints.forEach(function (point) {
        point.timestamp = date;
        date.setMilliseconds(date.getMilliseconds() - 5);
        point.location = {lat: point.lat, lon: point.lon};
        point.tag = 'tag';
        point.type = 'sensor';
        point.source_id = ((Math.floor(Math.random() * 100) + 0) / 100) < 0.5 ? 'sensor' : 'arial';
        point.uuid = joola.common.uuid();
        point.metric = Math.floor(Math.random() * 60) + 1;
        point.temp = (Math.floor(Math.random() * 42) + 1);
        point.echo_level = (Math.floor(Math.random() * 200) + 1);
        point.humidity = (Math.floor(Math.random() * 100) + 1) / 100;
        delete point.lat;
        delete point.lon;
      });

      joola.beacon.insert({user: user}, 'geo', randomGeoPoints, function (err) {

      });
    }

    setInterval(generateRandomData, 1000);
    //setInterval(queryData, 1000);
  });

  var port = process.env.PORT || 3000;
  http.createServer(function (request, response) {
    request.addListener('end', function () {
      file.serve(request, response);
    }).resume();
  }).listen(port, function () {
    console.log('Server ready, port ' + port + '.');
  });
});

//https://gist.github.com/mkhatib/5641004
/**
 * Generates number of random geolocation points given a center and a radius.
 * @param  {Object} center A JS object with lat and lng attributes.
 * @param  {number} radius Radius in meters.
 * @param {number} count Number of points to generate.
 * @return {array} Array of Objects with lat and lng attributes.
 */
function generateRandomPoints(center, radius, count) {
  var points = [];
  for (var i = 0; i < count; i++) {
    points.push(generateRandomPoint(center, radius));
  }
  return points;
}


/**
 * Generates number of random geolocation points given a center and a radius.
 * Reference URL: http://goo.gl/KWcPE.
 * @param  {Object} center A JS object with lat and lng attributes.
 * @param  {number} radius Radius in meters.
 * @return {Object} The generated random points as JS object with lat and lng attributes.
 */
function generateRandomPoint(center, radius) {
  var x0 = center.lon;
  var y0 = center.lat;
  // Convert Radius from meters to degrees.
  var rd = radius / 111300;

  var u = Math.random();
  var v = Math.random();

  var w = rd * Math.sqrt(u);
  var t = 2 * Math.PI * v;
  var x = w * Math.cos(t);
  var y = w * Math.sin(t);

  var xp = x / Math.cos(y0);

  // Resulting point.
  return {'lat': y + y0, 'lon': xp + x0};
}


// Usage Example.
// Generates 100 points that is in a 1km radius from the given lat and lng point.
