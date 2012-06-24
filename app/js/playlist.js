// Copyright 2012 Arunjit Singh. All Rights Reserved.

/**
 * @fileoverview The Playlist models and views.
 * @author Arunjit Singh <arunjit@me.com>
 * @license MIT license. This notice must be included in all distributions.
 * @copyright 2012 Arunjit Singh (arunjit@me.com).
 *     @see //LICENSE for details.
 *     @see http://www.opensource.org/licenses/mit-license.php for details.
 */



/** A song model */
var Song = Backbone.Model.extend({
  defaults: {
    id: '',           // {string} ID
    title: '',        // {string} Title
    artist: '',       // {string} Artist
    album: '',        // {string} Album
    duration: '',     // {string} Duration (mm:ss)
    artwork: '',      // {string} Artwork URL
    url: '',          // {string} URL of the song file
    year: 1900,       // {number} Year of release
    state: 'loading', // {string} State (loading, uploading, etc)

    'local.id': '',
    'local.artwork': '',
    'local.url': ''
  },

  initialize: function() {
    this.set('local.id', Date.now().toString(16));
  }
});



/** View for a Song model. */
var SongView = Backbone.View.extend({

  className: 'song',

  template: Handlebars.compile($('#song-tpl').html()),

  initialize: function() {
    _.bindAll(this, 'render', 'stateChanged');
    this.model.bind('change', this.render);
    this.model.bind('change:state', this.stateChanged)
  },

  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    return this;
  },

  stateChanged: function() {
    $(this.el).get(0).dataset.state = this.model.get('state');
  }

});



/** A song collection is called a 'Playlist' */
var Playlist = Backbone.Collection.extend({
  model: Song
});
