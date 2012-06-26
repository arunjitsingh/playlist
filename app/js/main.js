
var FileDropzone = Backbone.View.extend({

  className: 'dropzone',

  initialize: function() {
    _.bindAll(this, 'handleDragOver', 'handleDragLeave', 'handleDrop');
    var $el = this.$el = $(this.el);
    $el.on('mouseout, dragleave', this.handleDragLeave);
    $el.on('dragover', this.handleDragOver);
    $el.on('drop', this.handleDrop);
  },

  handleDragLeave: function() {
    this.$el.removeClass('dragover');
  },
  handleDragOver: function(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.originalEvent.dataTransfer.dropEffect = 'copy';
    this.$el.addClass('dragover');
  },
  handleDrop: function(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    this.$el.removeClass('dragover');
    if (evt.originalEvent.dataTransfer.files) {
      var files = evt.originalEvent.dataTransfer.files;
      var len = files.length, i;
      for (i = 0; i < len; ++i) {
    //         if (!(/^audio\//i).test(files[i].type)) {
    //           continue;
    //         }
    //         WorkerPool.processFile(file);
    //       }
      var file = files[i];
      console.log(file);
      var url = (window.URL || window.webkitURL).createObjectURL(file);
      var audio = new Audio(url);
      audio.addEventListener('ended', function() {
        console.log('Ended');
      }, false);
      audio.play();

      var w = new Worker('js/worker.js');
      w.onmessage = function(e) {
        console.log(e.data);
      };

      w.postMessage({'file': file});

      break;
      }
    }
  }
});



$(document).ready(function() {

  //var pool = new WorkerPool();

  var player = new Player();

  var App = Backbone.Router.extend({
    routes: {
      '': 'main'
    },

    initialize: function() {
      this.playerView = new PlayerView({
        player: player
      });

      this.playlistView = new PlaylistView({
        collection: player.playlist
      });

      this.dropzone = new FileDropzone({el: $('#page')});
    },

    main: function() {
      //something gets rendered here.
    }
  });

  var app = new App();

  Backbone.history.start({pushState: true});
});



var stubs = {};
stubs.getResponse = function() {
  var response = {ok: true};
  response.content = [{
    title: 'Rolling in the Deep',
    artist: 'Adele',
    album: '21',
    duration: '4:28',
    year: 2011,
    artwork: 'http://gangster.squarespace.com/storage/adele_21.jpg',
    filename: '01 Rolling in the Deep.mp3'
  }];
  return JSON.stringify(response);
};



var song = new Song(JSON.parse(stubs.getResponse()).content[0]);
var view = new SongView({model: song});
var el = view.render().el;
$(el).get(0).dataset.loader = 'uploading'
$('#playlist').append(el);
song.set({'local.url': '/song/1234'});


var npview = new NowPlayingView();
npview.render(song);