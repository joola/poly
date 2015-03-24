
function buttonPlayPress() {
  if (!realtime) {
    realtime = true;
    query.timeframe = 'last_90_seconds';
    query.realtime = {enabled: true, interval: 5000};
    $('#button_play i').attr('class', "fa fa-pause");
    $('.dates').text('Last 90 sec.');
    joola.emit('query_updated');
  }
  else if (realtime) {
    realtime = false;
    joola.query.stop(lastQueryUUID);
    $('#button_play i').attr('class', "fa fa-play");
    $('.dates').text('Paused');
  }
}

$().ready(function(){
  if (realtime){
    $('#button_play i').attr('class', "fa fa-pause");
    $('.dates').text('Last 90 sec.');
  }
  else{
    $('#button_play i').attr('class', "fa fa-play");
    $('.dates').text('Paused');
  }
  
  
  $('.resizable').resizable({handles:'all'});
  $('.draggable').draggable({handle:'.handle'});
});