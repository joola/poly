$().ready(function () {

  initMap(function () {
    joola.init({APIToken: 'apitoken-demo'}, function (err, ref) {
      if (err)
        throw err;

      joola.emit('query_updated');
    });
  });
});