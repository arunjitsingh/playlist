var stubs = {};
stubs.getResponse = function() {
  var response = {ok: true};
  response.content = [{
    title: 'Rolling in the Deep',
    artist: 'Adele',
    album: '21',
    duration: '4:28',
    year: 2011,
    artwork: 'http://gangster.squarespace.com/storage/adele_21.jpg'
  }];
  return JSON.stringify(response);
};


var player = new Player();
  
var worker = new Worker('js/worker.js');
worker.addEventListener('message', function(event) {
  if (event.data) {
    console.log(event.data);
  }
  worker.terminate();
}, false);


send = function() {
  var ui = new Uint8Array([0x30, 0x31, 0x32, 0x33, 0x34, 0x35])
  worker.postMessage({'message': 'read', 'buffer': ui.buffer});
};


var App = new PlaylistRouter();

Backbone.history.start({pushState: true});


