# Copyright 2012 Arunjit Singh. All Rights Reserved.

"""Application models.

There are 3 basic models:
Song: duh.
Playlist: Stores a list of references to Song (a la "collection")
User: Stores a list of references to playlist (a la "collection")

Each model has an ancestor, which is its immediate parent collection:

Song ----ancestor---> Playlist ----ancestor----> User

The 'user_id' (str) stored by the User model is App Engine's user.user_id()
"""

__author__ = 'Arunjit Singh <arunjit@me.com>'

from google.appengine.ext import ndb


class User(ndb.Model):
  user_id = ndb.StringProperty(required=True)
  playlists = ndb.ListProperty(ndb.Key, default=[])


class Playlist(ndb.Model):
  playlist_id = ndb.StringProperty(required=True)
  songs = ndb.ListProperty(ndb.Key, default=[])

  user = ndb.ReferenceProperty(User)


class Song(ndb.Model):
  song_id = ndb.StringProperty(required=True)
  artist = ndb.StringProperty()
  title = ndb.StringProperty()
  album = ndb.StringProperty()
  year = ndb.StringProperty()        # or IntegerProperty?
  duration = ndb.IntegerProperty()   # or StringProperty?
  blob_ref = ndb.BlobProperty()

  playlist = ndb.ReferenceProperty(Playlist)


# Alias some common db stuff
GqlQuery = ndb.GqlQuery
Query = ndb.Query
QueryNotFoundError = ndb.QueryNotFoundError
ReferencePropertyResolveError = ndb.ReferencePropertyResolveError


# TODO(arunjit): add defs to get Songs/Playlists for a user.
