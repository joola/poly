var joola = require('joola'),
  st = require('node-static'),
  http = require('http'),
  file = new st.Server('./public');

process.env.JOOLA_CONFIG_STORE_LOGGER_CONSOLE_LEVEL = 'trace';

joola.init({}, function (err) {
  if (err)
    throw err;

  joola.users.verifyAPIToken({user: joola.SYSTEM_USER}, 'apitoken-demo', function (err, user) {
    if (err)
      throw err;

    var port = process.env.PORT || 3000;
    http.createServer(function (request, response) {
      request.addListener('end', function () {
        file.serve(request, response);
      }).resume();
    }).listen(port, function () {
      joola.logger.info('Polygons Server ready, port [' + port + '].');
    });    
  });
});
