var
  path = require('path'),
  fs = require('fs'),
  ce = require('cloneextend'),
  joola = require('joola.sdk');

process.env.JOOLA_CONFIG_STORE_LOGGER_CONSOLE_LEVEL = 'trace';

var counter = 0;

joola.init({host: 'http://localhost:8081', APIToken: 'apitoken-demo'}, function (err) {
  if (err)
    throw err;

  global.user = joola.USER;
  joola.events.emit('goahead');
});

joola.events.on('goahead', function () {
  var sources = [];
  var files = fs.readdirSync(path.join(__dirname, './sources'));
  files.forEach(function (file) {
    joola.logger.info('Require event source from: ./sources/' + file);
    sources.push(require(path.join(__dirname, './sources', file)));
  });

  setInterval(function () {
    var points = generateRandomPoints({
      'lat': 32.476664,
      'lon': 34.974388
    }, 5000, 1);

    points.forEach(function (point, i) {
      point.location = {
        lat: point.lat,
        lon: point.lon
      };
      delete point.lat;
      delete point.lon;
      sources.forEach(function (s) {
        var _point = ce.cloneextend(point, s);
        Object.keys(_point).forEach(function (key) {
          var elem = _point[key].value;
          if (typeof elem === 'function') {
            _point[key].value = elem.apply(_point);
          }
        });
        if (_point._save.value) {
          var collection = _point._collection ? _point._collection.value : 'geo';
          delete _point._save;
          delete _point._collection;
          joola.insert(collection, [_point], function (err) {
            if (err)
              throw err;
            counter++;
            if (counter % 1000 === 0)
              console.log('Pushed 1000 events');
          });
        }
      });
    });
  }, 700);
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