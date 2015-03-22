var markers = [];
var map;
function initialize() {
  var mapOptions = {
    center: new google.maps.LatLng(32.476664, 34.974388),
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.TERRAIN
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  // Create the search box and link it to the UI element.
  var input =    document.getElementById('pac-input');
  //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  var searchBox = new google.maps.places.SearchBox(input);

  // Listen for the event fired when the user selects an item from the
  // pick list. Retrieve the matching places for that item.
  google.maps.event.addListener(searchBox, 'places_changed', function () {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }
    for (var i = 0, marker; marker = markers[i]; i++) {
      marker.setMap(null);
    }

    // For each place, get the icon, place name, and location.

    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, place; place = places[i]; i++) {
      var image = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      var marker = new google.maps.Marker({
        map: map,
        icon: image,
        title: place.name,
        position: place.geometry.location
      });

      //markers.push(marker);

      bounds.extend(place.geometry.location);
    }

    map.fitBounds(bounds);
  });

  // Bias the SearchBox results towards places that are within the bounds of the
  // current map's viewport.
  google.maps.event.addListener(map, 'bounds_changed', function () {
    var bounds = map.getBounds();
    searchBox.setBounds(bounds);
    
    console.log(bounds.getNorthEast());
    $('#bounds-right-top').text('NE:' +bounds.getNorthEast().lat() + ', '+ bounds.getNorthEast().lng());
    $('#bounds-left-bottom').text('SW: ' +bounds.getSouthWest().lat() + ', '+ bounds.getSouthWest().lng());
  });

  var drawingManager = new google.maps.drawing.DrawingManager({
    //drawingMode: google.maps.drawing.OverlayType.MARKER,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [
        google.maps.drawing.OverlayType.MARKER,
        google.maps.drawing.OverlayType.CIRCLE,
        google.maps.drawing.OverlayType.POLYGON,
        google.maps.drawing.OverlayType.POLYLINE,
        google.maps.drawing.OverlayType.RECTANGLE
      ]
    },
    markerOptions: {
      //icon: 'images/beachflag.png'
    },
    circleOptions: {
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      draggable: true,
      editable: true,
      zIndex: 1
    },
    rectangleOptions: {
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      draggable: true,
      editable: true,
      zIndex: 1
    },
    polygonOptions: {
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      draggable: true,
      editable: true,
      zIndex: 1
    }
  });
  drawingManager.setMap(map);
  google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
    event.overlay.uuid = joola.common.uuid();
    markers.push(event.overlay);

    if (event.type == google.maps.drawing.OverlayType.CIRCLE) {
      event.overlay.type = 'CIRCLE';
      google.maps.event.addListener(event.overlay, 'radius_changed', function () {
        joola.emit('polygon_updated', [event.overlay]);
      });
      google.maps.event.addListener(event.overlay, 'center_changed', function () {
        joola.emit('polygon_updated', [event.overlay]);
      });
    }
    else if (event.type == google.maps.drawing.OverlayType.RECTANGLE) {
      event.overlay.type = 'RECT';
      google.maps.event.addListener(event.overlay, 'bounds_changed', function () {
        joola.emit('polygon_updated', [event.overlay]);
      });
    }
    else if (event.type == google.maps.drawing.OverlayType.POLYGON) {
      event.overlay.type = 'POLYGON';
      google.maps.event.addListener(event.overlay.getPath(), 'insert_at', function () {
        joola.emit('polygon_updated', [event.overlay]);
      });
      google.maps.event.addListener(event.overlay.getPath(), 'remove_at', function () {
        joola.emit('polygon_updated', [event.overlay]);
      });
      google.maps.event.addListener(event.overlay.getPath(), 'set_at', function () {
        joola.emit('polygon_updated', [event.overlay]);
      });
    }
    joola.emit('polygon_added', [event.overlay]);
  });
  google.maps.event.addListener(map, 'click', function (e) {
    console.log('e', e)
  });
}
google.maps.event.addDomListener(window, 'load', initialize);

// create a constructor
function Tooltip(options) {
// Now initialize all properties.
  this.marker_ = options.marker;
  this.content_ = options.content;
  this.map_ = options.marker.get('map');
  this.cssClass_ = options.cssClass || null;
// We define a property to hold the content's
// div. We'll actually create this div
// upon receipt of the add() method so we'll
// leave it null for now.
  this.div_ = null;
//Explicitly call setMap on this overlay
  this.setMap(this.map_);
  var me = this;
// Show tooltip on mouseover event.
  google.maps.event.addListener(me.marker_, 'mouseover', function () {
    console.log('over');
    me.show();
  });
// Hide tooltip on mouseout event.
  google.maps.event.addListener(me.marker_, 'mouseout', function () {
    me.hide();
  });
}
// Now we extend google.maps.OverlayView()
Tooltip.prototype = new google.maps.OverlayView();
// onAdd is one of the functions that we must implement,
// it will be called when the map is ready for the overlay to be attached.
Tooltip.prototype.onAdd = function () {
// Create the DIV and set some basic attributes.
  var div = document.createElement('DIV');
  div.style.position = "absolute";
// Hide tooltip
  div.style.visibility = "hidden";
  if (this.cssClass_)
    div.className += " " + this.cssClass_;
//Attach content to the DIV.
  div.innerHTML = this.content_;
// Set the overlay's div_ property to this DIV
  this.div_ = div;
// We add an overlay to a map via one of the map's panes.
// We'll add this overlay to the floatPane pane.
  var panes = this.getPanes();
  panes.floatPane.appendChild(this.div_);
};

// We here implement draw
Tooltip.prototype.draw = function () {
// Position the overlay. We use the position of the marker
// to peg it to the correct position, just northeast of the marker.
// We need to retrieve the projection from this overlay to do this.
  var overlayProjection = this.getProjection();
// Retrieve the coordinates of the marker
// in latlngs and convert them to pixels coordinates.
// We'll use these coordinates to place the DIV.
  var ne = overlayProjection.fromLatLngToDivPixel(this.marker_.getPosition());
// Position the DIV.
  var div = this.div_;
  div.style.left = ne.x + 'px';
  div.style.top = ne.y + 'px';
};

// We here implement onRemove
Tooltip.prototype.onRemove = function () {
  this.div_.parentNode.removeChild(this.div_);
};

// Note that the visibility property must be a string enclosed in quotes
Tooltip.prototype.hide = function () {
  if (this.div_) {
    this.div_.style.visibility = "hidden";
  }
};

Tooltip.prototype.show = function () {
  if (this.div_) {
    this.div_.style.visibility = "visible";
  }
};