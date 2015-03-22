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

var bottom_expanded = false;
var left_expanded = false;
$().ready(function () {
  $('.bottom-pane .handle').on('click', function () {
    if (bottom_expanded)
      $('.bottom-pane').removeClass('expanded');
    else
      $('.bottom-pane').addClass('expanded');
    bottom_expanded = !bottom_expanded;
  });
  $('.left-pane .handle').on('click', function () {
    if (left_expanded)
      $('.left-pane').removeClass('expanded');
    else
      $('.left-pane').addClass('expanded');
    left_expanded = !left_expanded;
  });

  $('#maptype').on('change', function () {
    console.log('change', $(this).val());
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
    console.log('dm', _drawingManager);
    $(_drawingManager).appendTo('#drawing-tools-container');
  }, 1000);
});