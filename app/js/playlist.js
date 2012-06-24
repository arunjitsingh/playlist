// Copyright 2012 Arunjit Singh. All Rights Reserved.

/**
 * @fileoverview The Playlist models and views.
 * @author Arunjit Singh <arunjit@me.com>
 * @license MIT license. This notice must be included in all distributions.
 * @copyright 2012 Arunjit Singh (arunjit@me.com).
 *     @see //LICENSE for details.
 *     @see http://www.opensource.org/licenses/mit-license.php for details.
 */

//================= Models =================



/** A song model */
var Song = Backbone.Model.extend({
  defaults: {
    'guid': '',         // {string} ID
    'title': '',        // {string} Title
    'artist': '',       // {string} Artist
    'album': '',        // {string} Album
    'duration': '',     // {string} Duration (mm:ss)
    'artwork': '',      // {string} Artwork URL
    'url': '',          // {string} URL of the song file
    'year': 1900,       // {number} Year of release
    'state': 'loading', // {string} State (loading, uploading, etc)

    'local.guid': '',
    'local.artwork': '',
    'local.url': ''
  },

  initialize: function() {
    _.bindAll(this, 'updateState');
    this.set({'local.guid': Date.now().toString(16)});
    this.on('change:local.url', this.updateState);
    this.on('change:url', this.updateState);
  },

  updateState: function() {
    if (this.get('local.url') || this.get('url')) {
      this.set({'state': 'playable'});
    }
  },

  isPlayable: function() {
    return this.get('state') == 'playable';
  }
});



/** A song collection is called a 'Playlist' */
var Playlist = Backbone.Collection.extend({
  model: Song,

  isFirstSong: function(index) {
    return (this.models.length && (index == 0));
  },

  isLastSong: function(index) {
    return (this.models.length && (index == (this.models.length - 1)));
  }
});



/** The thing that figures out what song to play. */
var Player = Backbone.Model.extend({
  defaults: {
    'currentIndex': 0,
    'state': 'paused'
  },

  initialize: function() {
    this.playlist = new Playlist();
  },

  reset: function() {
    this.set({'currentIndex': 0, 'state': 'paused'});
  },

  play: function() {
    this.set({'state': 'playing'});
    this.trigger('change:currentIndex');
  },

  pause: function() {
    this.set({'state': 'paused'});
  },

  next: function() {
    var idx = this.get('currentIndex');
    if (this.playlist.isLastSong(idx)) {
      this.set({'currentIndex': 0});
      this.pause();
    } else {
      this.set({'currentIndex': idx + 1});
    }
  },

  previous: function() {
    var idx = this.get('currentIndex');
    if (!this.playlist.isFirstSong(idx)) {
      this.set({'currentIndex': idx - 1});
    }
  },

  currentSongUrl: function() {
    var song = this.playlist.at(this.get('currentIndex'));
    return song.isPlayable() ? (song.get('local.url') || song.get('url')) : '';
  }
});


//----------------- SongWorker -----------------



/** Initializes a worker and sends it the file buffer. */
var SongWorker = Song.extend({
  defaults: {
    buffer: new ArrayBuffer(0)
  },

  initialize: function() {
    _.bindAll(this, 'workerMessage_');
    this.worker_ = new Worker('js/worker.js');
    this.worker_.addEventListener('message', this.workerMessage_, false);
    this.worker_.postMessage({'message': 'init', 'buffer': this.get('buffer')});
  },

  setLocalTags_: function(tags) {
    var validKeys = ['title', 'artist', 'album', 'duration', 'local.guid',
                     'local.artwork', 'local.url'];
    var obj = {};
    validKeys.forEach(function(key) {
      obj[key] = tags[key] || '';
    });
    this.set(obj);
  },

  updateWithServerResponse_: function(content) {},

  workerMessage_: function(event) {
    switch (event.data.message) {
      case 'loading':
        this.set({'state': 'loading'});
        break;
      case 'uploading':
        this.set({'state': 'uploading'});
        break;
      case 'loaded':
        this.setLocalTags_(event.data.tags);
        break;
      case 'uploaded':
        this.updateWithServerResponse_(event.data.content)
        break;
      case 'done':
        this.worker_.terminate();
    }
  }
});


//================= Views =================



/** View for a Song model. */
var SongView = Backbone.View.extend({

  className: 'song',

  template: Handlebars.compile($('#song-tpl').html()),

  initialize: function() {
    _.bindAll(this, 'render', 'stateChanged');
    this.model.on('change', this.render);
    this.model.on('change:state', this.stateChanged);
  },

  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    return this;
  },

  stateChanged: function() {
    $(this.el).get(0).dataset.state = this.model.get('state');
  }

});



var NowPlayingView = Backbone.View.extend({

  className: 'np-song',

  template: Handlebars.compile($("np-song-tpl").html())
});


//================= Router =================



var PlaylistRouter = Backbone.Router.extend({
  routes: {
    '': 'home'
  },

  home: function() {
    var $playlist = $('#playlist').empty();
    $playlist.on('dragover', this.dragover);
  }
});
