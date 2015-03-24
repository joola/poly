$("#volume").slider({
  min: 0,
  max: 100,
  value: 0,
  range: "min",
  animate: true,
  slide: function (event, ui) {
    console.log(ui.value);
  }
});
/*
 $(document).ready(function () {
 // this layout could be created with NO OPTIONS - but showing some here just as a sample...
 // myLayout = $('body').layout(); -- syntax with No Options

 var myLayout = $('body').layout({
 //	reference only - these options are NOT required because 'true' is the default
 closable: true,	// pane can open & close
 resizable: true,	// when open, pane can be resized 
 slidable: true,	// when closed, pane can 'slide' open over other panes - closes on mouse-out
 livePaneResizing: true,
 //	some resizing/toggling settings
 north__slidable: false,	// OVERRIDE the pane-default of 'slidable=true'
 north__resizable: false,
 south__slidable: false,
 south__resizable: true, // OVERRIDE the pane-default of 'resizable=true'
 south__togglerLength_closed: '100%',	// toggle-button is full-width of resizer-bar

 //	some pane-size settings
 north__minSize: 100,
 north__size: 100,
 west__minSize: 100,
 east__size: 300,
 east__minSize: 200,
 east__maxSize: .5, // 50% of layout width
 center__minWidth: 100,

 //	some pane animation settings
 west__animatePaneSizing: false,
 west__fxSpeed_size: "fast",	// 'fast' animation when resizing west-pane
 west__fxSpeed_open: 1000,	// 1-second animation when opening west-pane
 west__fxSettings_open: { easing: "easeOutBounce" }, // 'bounce' effect when opening
 west__fxName_close: "none",	// NO animation when closing west-pane

 //	enable showOverflow on west-pane so CSS popups will overlap north pane
 west__showOverflowOnHover: true,

 //	enable state management
 stateManagement__enabled: true, // automatic cookie load & save enabled by default

 showDebugMessages: true // log and/or display messages from debugging & testing code
 });


 $.layout.disableTextSelection = function () {
 var $d = $(document)
 , s = 'textSelectionDisabled'
 , x = 'textSelectionInitialized'
 ;
 if ($.fn.disableSelection) {
 if (!$d.data(x)) // document hasn't been initialized yet
 $d.on('mouseup', $.layout.enableTextSelection).data(x, true);
 if (!$d.data(s))
 $d.disableSelection().data(s, true);
 }
 //console.log('$.layout.disableTextSelection');
 };
 $.layout.enableTextSelection = function () {
 var $d = $(document)
 , s = 'textSelectionDisabled';
 if ($.fn.enableSelection && $d.data(s))
 $d.enableSelection().data(s, false);
 //console.log('$.layout.enableTextSelection');
 };
 $(".ui-layout-resizer")
 .disableSelection() // affects only the resizer element
 .on('mousedown', $.layout.disableTextSelection); // affects entire document

 });
 */

var EPSData = [];
var left_expanded = true;
var right_expanded = true;

function collapse_left(e, force) {
  if (left_expanded || force) {
    $('.left-pane').removeClass('expanded');
    $('.left-pane .expand i').removeClass('glyphicon-collapse-up');
    $('.left-pane .expand i').addClass('glyphicon-collapse-down');
    left_expanded = false;
  }
  else {
    $('.left-pane').addClass('expanded');
    $('.left-pane .expand i').removeClass('glyphicon-collapse-down');
    $('.left-pane .expand i').addClass('glyphicon-collapse-up');
    left_expanded = true;
  }
}


function collapse_right(e, force) {
  if (right_expanded || force) {
    $('.right-pane').removeClass('expanded');
    $('.right-pane .expand i').removeClass('glyphicon-collapse-up');
    $('.right-pane .expand i').addClass('glyphicon-collapse-down');
    right_expanded = false;
  }
  else {
    $('.right-pane').addClass('expanded');
    $('.right-pane .expand i').removeClass('glyphicon-collapse-down');
    $('.right-pane .expand i').addClass('glyphicon-collapse-up');
    right_expanded = true;
  }
}

$().ready(function () {
  $('.right-pane .expand').on('click', collapse_right);
  $('.left-pane .expand').on('click', collapse_left);

  $('#maptype').on('change', function () {
    switch ($(this).val().toLowerCase()) {
      case 'hybrid':
        map.setMapTypeId(google.maps.MapTypeId.HYBRID);
        break;
      case 'road':
        map.setMapTypeId(google.maps.MapTypeId.ROAD);
        break;
      case 'satellite':
        map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
        break;
      case 'terrain':
        map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
        break;
      default:
        map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
        break;
    }

  });

  setTimeout(function () {

    var _drawingManager = $('div[title="Stop drawing"]').parentsUntil('.gmnoprint').parent();
    $(_drawingManager).addClass('drawing-manager');
    $(_drawingManager).css({position: 'inherit', margin: 0, top: 'auto', left: 'auto'});
    $(_drawingManager).appendTo('#drawing-tools-container');
  }, 1000);

  $(document).keyup(function (e) {

    if (e.keyCode == 27) {
      collapse_left(e, true);
      collapse_right(e, true);
    }   // escape key maps to keycode `27`
  });


  // We use an inline data source in the example, usually data would
  // be fetched from a server

  var data = [],
    totalPoints = 300;

  function getRandomData() {

    if (data.length > 0)
      data = data.slice(1);

    // Do a random walk

    while (data.length < totalPoints) {

      var prev = data.length > 0 ? data[data.length - 1] : 50,
        y = prev + Math.random() * 10 - 5;

      y = 5

      data.push(y);
    }

    // Zip the generated y values with the x values

    var res = [];
    for (var i = 0; i < data.length; ++i) {
      res.push([i, data[i]])
    }

    return res;
  }


  $('.hideonshrink').hide();
  $('#table').addClass('hide-controls');
  $('.showmore').on('click', function () {
    $('.left-pane').css("width", '650px');
    $('.hideonshrink').show();
    $('.showmore').hide();

  });
  $('#dragbar').mousedown(function (e) {
    e.preventDefault();
    $('.left-pane').css("transition", 'none');
    $('.left-pane').css("transition-timing-function", 'ease-in-out');
    $(document).mousemove(function (e) {
      var width = e.pageX + 2;
      if (width < 350) {
        return;
      }
      else if (width < 680) {
        //it's collapsed
        console.log('col');
        $('.hideonshrink').hide();
        $('.showmore').show();

        $('#table').addClass('hide-controls');
      }
      else {
        //it's expanded
        console.log('expand');
        $('.hideonshrink').show();
        $('.showmore').hide();

        $('#table').removeClass('hide-controls');
      }
      $('.left-pane').css("width", width);
      $('#map-canvas').css("left", width);
      $('#ghostbar').remove();
    });

    $(document).mouseup(function (e) {
      $(document).unbind('mousemove');
      $('.left-pane').css("transition", 'all 0.5s');
      $('.left-pane').css("transition-timing-function", 'ease-in-out');
    });
  });

  $('.resizable').resizable({ handles: "n, e, s, w"});
  $('.draggable').draggable({ handle: ".handle" });


  function pointColor(feature) {
    return feature.metric > 5 ? '#f55' : '#a00';
  }

  function pointRadius(feature) {
    return (feature.metric - 4) * 10;
  }

  function scaledPoint(feature, latlng) {
    return L.circleMarker(latlng, {
      radius: pointRadius(feature),
      fillColor: pointColor(feature),
      fillOpacity: 0.7,
      weight: 0.5,
      color: '#fff'
    }).bindPopup(
        '<h2>' + feature.properties.place + '</h2>' +
        '<h3>' + new Date(feature.timestamp) + '</h3>' +
        feature.metric + ' magnitude');
  }


});

function buttonPlayPress() {
  if (!realtime) {
    realtime = true;
    query.timeframe = 'last_5_seconds';
    query.realtime = {enabled: true, interval: 5000};
    $('#button_play i').attr('class', "fa fa-pause");
    $('.timeline-state-caption').text('Last 90 sec.');
    joola.emit('query_updated');
  }
  else if (realtime) {
    realtime = false;
    joola.query.stop(lastQueryUUID);
    $('#button_play i').attr('class', "fa fa-play");
    $('.timeline-state-caption').text('Paused');
  }
}

$().ready(function(){
  if (realtime){
    $('#button_play i').attr('class', "fa fa-pause");
  }
  else{
    $('#button_play i').attr('class', "fa fa-play");
  }
})