;(function($, _) {
  var G = this;  // global object


  G.Song = Backbone.Model.extend({
    defaults: function() {
      return {
        title: '',    // {string} Title
        artist: '',   // {string} Artist
        album: '',    // {string} Album
        artwork: '',  // {string} Artwork URL
        year: 0       // {number} Year of release
      };
    }
  });


  G.SongView = Backbone.View.extend({
    
    className: 'song',
    
    template: Handlebars.compile($('#song-tpl').html()),
    
    initialize: function() {
      _.bindAll(this, 'render');
      this.model.bind('change', this.render);
    },
    
    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    }
  });



  G.Playlist = Backbone.Collection.extend({
    model: G.Song
  });

}).call(this, jQuery, _);