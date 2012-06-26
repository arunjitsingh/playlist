// Copyright 2012 Arunjit Singh. All Rights Reserved.

/**
 * @fileoverview The Playlist models and views.
 * @author Arunjit Singh <arunjit@me.com>
 * @license MIT license. This notice must be included in all distributions.
 * @copyright 2012 Arunjit Singh (arunjit@me.com).
 *     @see //LICENSE for details.
 *     @see http://www.opensource.org/licenses/mit-license.php for details.
 */


/**
 * Joins path strings. Doesn't normalize `.` or `..` in paths.
 * @param {string...} var_args The paths to join.
 * @return {string} The joined path.
 */
function join(var_args) {
  var path = Array.prototype.join.call(arguments, '/');
  return path.replace(/\/\//g, '/');
}


var WORKER_FILE = join(JS_FILES_DIR || '', 'worker.js');


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
    'year': '',         // {string} Year of release
    'filename': '',     // {string} File name

    'state': '',        // {string} State (playing, paused, etc)

    'load.state': 'loading',  // {string} Load state (loading, uploading, etc)
    'load.progress': 0,       // {number} Percent loaded (uploading only)

    'local.guid': '',
    'local.artwork': '',
    'local.url': ''
  },

  initialize: function() {
    _.bindAll(this, 'updateState');
    this.set({'local.guid': Date.now().toString(16)});
    this.on('change:local.url', this.updateState);
    this.on('change:url', this.updateState);
    this.playable = false;
  },

  updateState: function() {
    if (this.get('local.url') || this.get('url')) {
      this.playable = true;
    }
  },

  isPlayable: function() {
    return !!this.playable;
  },

  isPlaying: function() {
    return this.get('state') == 'playing';
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


//================= Views =================



/** View for a Song model. */
var SongView = Backbone.View.extend({

  className: 'song',

  template: Handlebars.compile($('#song-tpl').html()),

  events: {
    'click .delete': 'remove'
  },

  initialize: function() {
    _.bindAll(this,
              'render', 'loadStateChanged', 'stateChanged', 'remove');
    this.model.on('change', this.render);
    this.model.on('change:state', this.stateChanged);
    this.model.on('change:load.state', this.loadStateChange);
  },

  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    return this;
  },

  stateChanged: function() {
    $(this.el).get(0).dataset.state = this.model.get('state');
  },

  loadStateChanged: function() {
    $(this.el).get(0).dataset.loader = this.model.get('load.state');
  },

  remove: function() {
    this.model.collection.remove(this.model);
  }

});


//----------------- SongWorker -----------------



/** Handles interactions between a Song and it's worker. */
var SongWorker = SongView.extend({

  initialize: function() {
    _.bindAll(this, 'workerMessage_');
    this.worker = new Worker(WORKER_FILE);
    this.worker.addEventListener('message', this.workerMessage_, false);
    // The worker is initialized by the worker pool.
  },

  setLocalTags_: function(tags) {
    var validKeys = ['title', 'artist', 'album', 'duration', 'year',
                     'local.guid', 'local.artwork', 'local.url'];
    var obj = {};
    validKeys.forEach(function(key) {
      tags[key] && (obj[key] = tags[key]);
    });
    this.model.set(obj);
  },

  updateWithServerResponse_: function(content) {
    var validKeys = ['artwork', 'url'];
    var obj = {};
    validKeys.forEach(function(key) {
      tags[key] && (obj[key] = tags[key]);
    });
    this.model.set(obj);
  },

  workerMessage_: function(event) {
    switch (event.data.message) {
      case 'loading':
        this.model.set({'load.state': 'loading'});
        break;
      case 'uploading':
        this.model.set({'load.state': 'uploading',
                  'load.progress': event.data.progress});
        break;
      case 'tags':
        this.setLocalTags_(event.data.tags);
        break;
      case 'uploaded':
        this.updateWithServerResponse_(event.data.content)
        break;
    }
  }
});



var PlaylistView = Backbone.View.extend({

  initialize: function() {
    _.bindAll(this, 'addOne');
    this.collection.on('add', this.addOne);
  },

  addOne: function(song) {
    var view = new SongView({model: song});
    $(this.el).append(view.render().el);
  }

});



var NowPlayingView = Backbone.View.extend({

  el: $('#np-song'),

  template: Handlebars.compile($("#np-song-tpl").html()),

  render: function(song) {
    $(this.el).empty().append(this.template(song.toJSON()));
    return this;
  }
});



var PlayerView = Backbone.View.extend({

  el: $('header #controls'),

  events: {
    'click #c-prev': 'previous',
    'click #c-next': 'next',
    'click #c-play': 'playPause'
  },

  initialize: function() {
    this.playlist = new Playlist();
  },

  previous: function() {},
  next: function() {},
  playPause: function() {}
});
