# Copyright 2012 Arunjit Singh. All Rights Reserved.

"""The main playlist handler."""

__author__ = 'Arunjit Singh <arunjit@me.com>'

from handlers import base
from storage import models


class Playlist(base.RequestHandler):
  """CRUD for a playlist and songs."""

  def get(self):
    """Sends a list of songs in the playlist."""
    pass


class Song(base.RequestHandler):
  """Handles requests for a song."""

  def get(self, song_id):
    """Reads a song from the Blobstore and writes it to the response.

    Args:
      song_id: (str) ID of the song.
    """
    pass

  def delete(self, song_id):
    """Deletes a song from the Blobstore and it's parent Playlist.

    Args:
      song_id: (str) ID of the song.
    """
    pass
