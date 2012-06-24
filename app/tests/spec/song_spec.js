describe('Song', function () {

  beforeEach(function () {
      this.song = new Song({
        title: 'Rolling in the Deep',
        artist: 'Adele',
        album: '21',
        duration: '4:28',
        year: 2011,
        artwork: '',
        url: ''
      });
  });

  it('creates a song object from data', function () {
    expect(this.song.get('artist')).toEqual('Adele');
  });

  it('has a default state of "loading"', function() {
    expect(this.song.get('state')).toEqual('loading');
  });

  it('should autogenerate a local ID', function() {
    expect(this.song.get('local.id')).toMatch(/[0-9a-f]+/);
  });

});
