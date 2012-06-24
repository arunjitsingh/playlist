var s = new Song({title: 'Rolling in the Deep',
                  artist: 'Adele',
                  album: '21',
                  duration: '4:28',
                  year: 2011,
                  artwork: 'http://gangster.squarespace.com/storage/adele_21.jpg'});

var p = new Playlist();
p.add(s);

var v = new SongView({model: s});
var el = v.render().el
$('#page').empty().append(el);

//$(el).addClass('playing');