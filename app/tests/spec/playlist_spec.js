var songs = [
  {title: 'Rolling in the Deep',
   artist: 'Adele',
   album: '21',
   duration: '4:28',
   year: 2011,
   artwork: ''},
  {title: 'Set Fire to the Rain',
   artist: 'Adele',
   album: '21',
   duration: '3:54',
   year: 2011,
   artwork: ''}
];



describe('Song', function () {

  beforeEach(function () {
      this.song = new Song(songs[0]);
  });

  it('creates a song object from data', function () {
    expect(this.song.get('artist')).toEqual('Adele');
  });

  it('has a default load state of "loading"', function() {
    expect(this.song.get('load.state')).toEqual('loading');
  });

  it('should autogenerate a local ID', function() {
    expect(this.song.get('local.guid')).toMatch(/[0-9a-f]+/);
  });

});



describe('Playlist', function() {

  beforeEach(function() {
    this.playlist = new Playlist();
  });


  describe('that is empty', function() {

    it('should be have no first/last indices', function() {
      expect(this.playlist.isFirstSong(0)).toBeFalsy();
      expect(this.playlist.isLastSong(0)).toBeFalsy();
    });

  });


  describe('with 2 songs', function() {

    beforeEach(function() {
      this.playlist.add(songs);
    });

    it('should have two songs', function() {
      expect(this.playlist.models.length).toEqual(2);
    });

    it('should have 0 as the first song index', function() {
      expect(this.playlist.isFirstSong(0)).toBeTruthy();
    });

    it('should have 1 as the last song index', function() {
      expect(this.playlist.isLastSong(1)).toBeTruthy();
    });

  });

});


describe('Player', function() {

  beforeEach(function() {
    this.player = new Player();
    this.player.playlist.add(songs);
  });

  it('should start at 0', function() {
    expect(this.player.get('currentIndex')).toEqual(0);
  });

  it('should start off paused', function() {
    expect(this.player.get('state')).toEqual('paused');
  });

  it('should continue to 1 on next()', function() {
    this.player.next();
    expect(this.player.get('currentIndex')).toEqual(1);
  });


  describe('while playing', function() {

    beforeEach(function() {
      this.player.play();
    });

    it('should be playing', function() {
      expect(this.player.get('state')).toEqual('playing');
    });

    it('should not change anything on play()', function() {
      expect(this.player.get('currentIndex')).toEqual(0);
      expect(this.player.get('state')).toEqual('playing');
    });

    it('should continue to 1 on next() and be playing', function() {
      this.player.next();
      expect(this.player.get('currentIndex')).toEqual(1);
      expect(this.player.get('state')).toEqual('playing');
    });

    it('should go to 0 and pause if next() has no more songs', function() {
      this.player.next();
      this.player.next();
      expect(this.player.get('currentIndex')).toEqual(0);
      expect(this.player.get('state')).toEqual('paused');
    });

  });
});



// BlobBuilder = this.BlobBuilder || this.WebKitBlobBuilder;
// 
// 
// describe('WorkerPool', function() {
// 
//   beforeEach(function() {
//     this.pool = new WorkerPool();
//   });
// 
//   it('should start off with an empty pool', function() {
//     expect(this.pool.count()).toEqual(0);
//   });
// 
//   it('should have zero files', function() {
//     expect(this.pool.fileCount()).toEqual(0);
//   });
//   
//   
//   describe('with files', function() {
//     
//     beforeEach(function() {
//       var bb = new BlobBuilder();
//       bb.append('This is not an audio file so don\'t expect it to have tags');
//       this.blob = bb.getBlob('text/plain');
//     });
//     
//     it('should create a worker for a new file', function() {
//       this.pool.add(this.blob);
//       expect(this.pool.count()).toEqual(1);
//       expect(this.pool.fileCount()).toEqual(1);
//     });
//     
//   });
// 
// });