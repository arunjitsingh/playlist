var s = new Song({title: 'Rolling in the Deep',
                  artist: 'Adele',
                  album: '21',
                  duration: '4:28',
                  year: 2011,
                  artwork: 'http://gangster.squarespace.com/storage/adele_21.jpg'});

var p = new Playlist();
p.add(s);

$('#page').empty();
for (var i = 0; i < 4; ++i) {
  var v = new SongView({model: s});
  var el = v.render().el
  $('#page').append(el);

  i == 0 && $(el).addClass('loading').find('img').attr('src', '');
  i == 1 && $(el).addClass('uploading');
  i == 2 && $(el).addClass('playing');
}
