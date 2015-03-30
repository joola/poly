var nodes = null;
var edges = null;
var network = null;

function draw(data, site) {

  console.log(site);
  $('#site-name').html(site.properties.title + ' Description');
  // create a network
  var container = document.getElementById('mynetwork');
  var options = {
    stabilize: false,
    dataManipulation: true,
    onAdd: function (data, callback) {
      var span = document.getElementById('operation');
      var idInput = document.getElementById('node-id');
      var labelInput = document.getElementById('node-label');
      var saveButton = document.getElementById('saveButton');
      var cancelButton = document.getElementById('cancelButton');
      var div = document.getElementById('network-popUp');
      span.innerHTML = "Add Node";
      idInput.value = data.id;
      labelInput.value = data.label;
      saveButton.onclick = saveData.bind(this, data, callback);
      cancelButton.onclick = clearPopUp.bind();
      div.style.display = 'block';
    },
    onEdit: function (data, callback) {
      var span = document.getElementById('operation');
      var idInput = document.getElementById('node-id');
      var labelInput = document.getElementById('node-label');
      var saveButton = document.getElementById('saveButton');
      var cancelButton = document.getElementById('cancelButton');
      var div = document.getElementById('network-popUp');
      span.innerHTML = "Edit Node";
      idInput.value = data.id;
      labelInput.value = data.label;
      saveButton.onclick = saveData.bind(this, data, callback);
      cancelButton.onclick = clearPopUp.bind();
      div.style.display = 'block';
    },
    onConnect: function (data, callback) {
      if (data.from == data.to) {
        var r = confirm("Do you want to connect the node to itself?");
        if (r == true) {
          callback(data);
        }
      }
      else {
        callback(data);
      }
    }
  };
  network = new vis.Network(container, data, options);

  $('#selection').html('<strong>' + site.properties.title + ' Details</strong>');

  var $tr, $td;
  Object.keys(site.properties).forEach(function (key) {
    var value = site.properties[key];
    $tr = $('<tr></tr>');
    if (['marker-size', 'marker-color'].indexOf(key) > -1) {
    }
    else if (key === 'counter') {
      $td = $('<td></td>');
      $td.text('# of Events');
      $tr.append($td);
      $td = $('<td></td>');
      $td.text(site.properties.counter.info);
      $tr.append($td);
      $('#node-details').append($tr);

      $tr = $('<tr></tr>');
      $td = $('<td></td>');
      $td.text('# of Alerts');
      $tr.append($td);
      $td = $('<td></td>');
      $td.text(site.properties.counter.alert);
      $tr.append($td);
      $('#node-details').append($tr);
    }
    else {
      $td = $('<td></td>');
      $td.text(key);
      $tr.append($td);
      $td = $('<td></td>');
      $td.text(value);
      $tr.append($td);
      $('#node-details').append($tr);
    }
  });

  if (site.alerts.length > 0) {
    console.log('alerts', site.alerts[0]);
    $tr = $('<tr></tr>');
    ['Timestamp', 'Node', 'Event'].forEach(function (key) {
      if (['site_id', 'event_type', 'metric'].indexOf(key) === -1) {
        $td = $('<th></th>');
        $td.text(key);
        $tr.append($td);
      }
    });
    $('#node-alerts').append($tr);
  }
  var trs = [];
  site.alerts.forEach(function (alert) {
    var $tr = $('<tr></tr>');
    var $td = $('<td></td>');
    $td.html('<time class="timeago" datetime="' + new Date(alert.timestamp).toISOString() + '">' + timeDifference(new Date, new Date(alert.timestamp)) + '</time>');
    $tr.append($td);
    $td = $('<td></td>');
    $td.text(site.properties.title);
    $tr.append($td);
    $td = $('<td></td>');
    $td.text(alert.event_data);
    $tr.append($td);
    $tr.timestamp = alert.timestamp;
    trs.push($tr);
  });
  trs = _.sortBy(trs, function (x) {
    return x.timestamp;
  });
  trs.reverse();

  trs.forEach(function ($tr) {
    $('#node-alerts').append($tr);
  });

  // add event listeners
  network.on('select', function (params) {
    $('#node-details').empty();
    site.viz_data.nodes.forEach(function (viz) {
      if (viz.id == params.nodes[0]) {
        Object.keys(viz).forEach(function (key) {
          var value = viz[key];
          $tr = $('<tr></tr>');
          if (['color', 'alerts'].indexOf(key) > -1) {
          }
          else {
            $td = $('<td></td>');
            $td.text(key);
            $tr.append($td);
            $td = $('<td></td>');
            $td.text(value);
            $tr.append($td);
            $('#node-details').append($tr);
          }
        });
        $('#selection').html('<strong>' + viz.label + ' Details and Alerts</strong>');
        console.log(viz);
        $('#node-alerts').empty();
        trs = [];
        if (viz.alerts && viz.alerts.length > 0) {
          console.log('alerts', site.alerts[0]);
          $tr = $('<tr></tr>');
          Object.keys(site.alerts[0]).forEach(function (key) {
            if (['site_id', 'event_type', 'metric'].indexOf(key) === -1) {
              $td = $('<th></th>');
              $td.text(key);
              $tr.append($td);
            }
          });
          $('#node-alerts').append($tr);

          viz.alerts.forEach(function (alert) {
            var $tr = $('<tr></tr>');
            Object.keys(alert).forEach(function (key) {
              if (['site_id', 'event_type', 'metric'].indexOf(key) === -1) {
                $td = $('<td></td>');
                $td.text(alert[key]);
                $tr.append($td);
                $tr.timestamp = alert.timestamp;
              }
            });
            trs.push($tr);
          });
          trs = _.sortBy(trs, function (x) {
            return x.timestamp;
          });
          trs.reverse();

          trs.forEach(function ($tr) {
            $('#node-alerts').append($tr);
          });
        }
        else {
          $tr = $('<tr></tr>');
          $td = $('<td>No alerts found for this node.</td>');
          $tr.append($td);
          $('#node-alerts').append($tr);
        }
      }
    });
  });

  network.on("resize", function (params) {
    console.log(params.width, params.height)
  });

  function clearPopUp() {
    var saveButton = document.getElementById('saveButton');
    var cancelButton = document.getElementById('cancelButton');
    saveButton.onclick = null;
    cancelButton.onclick = null;
    var div = document.getElementById('network-popUp');
    div.style.display = 'none';

  }

  function saveData(data, callback) {
    var idInput = document.getElementById('node-id');
    var labelInput = document.getElementById('node-label');
    var div = document.getElementById('network-popUp');
    data.id = idInput.value;
    data.label = labelInput.value;
    clearPopUp();
    callback(data);

  }
}