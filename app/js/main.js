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


$(function() {
  
  var player = new Player();
  
  
  
  var App = new PlaylistRouter();

  Backbone.history.start({pushState: true});

});
