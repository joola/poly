$().ready(function () {
  initMap(function () {
    joola.init({APIToken: 'apitoken-demo'}, function (err, ref) {
      if (err)
        throw err;
    
        joola.emit('query_updated')
   
    });

    var intro = introJs();
    intro.setOptions({
      steps: [
        {
          intro: "<h4>Welcome to our little geo experiment.</h4><p>The purpose of this experiment is to offer geo analytics on top of the <a href='http://joolajs.org'>Joola</a> stack. " +
            "<br/>This experiment generates random events for random geo coordinates at the rate of 100 events per second.</p>"
        },
        {
          element: '.leaflet-top.leaflet-left',
          intro: 'Control the map location, zoom and other attributes.',
          position: 'right'
        },
        {
          element: '.leaflet-top.leaflet-right',
          intro: "Control what layers of data should be visible.",
          position: 'left'
        },
        {
          element: '.timeline-controls',
          intro: 'You can play/pause the realtime event updates.',
          position: 'bottom'
        },
        {
          element: '.timeline-state',
          intro: 'You can control what time span should be shown.',
          position: 'bottom'
        },
        {
          element: '.timeline',
          intro: 'You can drag and mark a period of time to review.',
          position: 'bottom'
        },
        {
          element: '.showingresults',
          intro: 'This tab contains the analytical data of the events shown.'
        }
      ]
    });
    var wizard = state.get('wizard');
    if (!wizard)
      intro.start();
    intro.onexit(function () {
      state.set('wizard', 1);
    });
  });
});