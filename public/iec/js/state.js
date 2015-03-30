state = {};

state.get = function (key) {
  return localStorage.getItem(key);
};

state.set = function (key, value) {
  localStorage.setItem(key, value);
};

if (!state.get('version')) {
  //init for the first time
  state.set('version', '0.0.1');
  state.set('config.show.markers', true);
  state.set('config.refresh.duration', 5 * 1000);
  state.set('config.tail.duration', 15 * 1000);
}