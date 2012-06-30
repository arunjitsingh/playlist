# Copyright 2012 Arunjit Singh. All Rights Reserved.

"""The application's main handler. All requests go through this module."""

__author__ = 'Arunjit Singh <arunjit@me.com>'

from handlers import base
from handlers import playlist
from storage import models


class User(base.RequestHandler):
  """Checks whether the current user exists in the Datastore.

  If the user does not exist, the user is added to the Datastore and a '204 OK'
  response is sent. Clients can use this to choose whether playlists should be
  loaded (200) or not (204).
  """
  def get(self):
    if not self.user:
      self.Error(401)
      return
    code = 200
    status = 'exists'
    user = (models.User.all(keys_only=True)
                .filter('user_id =', self.user.user_id())
                .get())
    if not user:
      user = models.User(user_id=self.user.user_id())
      user.put()
      code = 204
      status = 'new'

    self.SendJson({'user': status}, code=code)


class App(base.RequestHandler):
  """Redirects to the app."""
  def get(self):
    self.redirect('/app/index.html', permanent=True)


application = base.Application([
    ('/song/([0-9a-f]+)', playlist.Song),
    ('/user', User),
    ('/(?:app/)?', App),
    ],
    debug=True)
