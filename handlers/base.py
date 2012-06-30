# Copyright 2012 Arunjit Singh. All Rights Reserved.

"""A base RequestHandler with some extras: users and JSON."""

__author__ = 'Arunjit Singh <arunjit@me.com>'

import json

from google.appengine.api import users
import webapp2


class RequestHandler(webapp2.RequestHandler):
  """Extends webapp2's RequestHandler with some awesomeness."""

  def __init__(self, *args, **kwds):
    super(RequestHandler, self).__init__(*args, **kwds)
    self.user = users.get_current_user()
    self.is_user_admin = users.is_current_user_admin()

  def SendJson(self, obj, nowrap=False, code=200):
    """Sends a JSON response wrapped in an object."""
    response = ''
    if nowrap:
      response = json.dumps(obj)
    else:
      response = json.dumps({'ok': True, 'content': obj})

    self.response.set_status(code)
    self.response.headers['Content-Type'] = 'application/json'
    self.response.write(response)
  
  def Error(self, code, message=None):
    """Send an error with a JSON body."""
    message = message or webapp2.Response.http_status_message(code)
    self.error(code)
    self.response.status_message = message
    self.response.headers['Content-Type'] = 'application/json'
    self.response.write(json.dumps({'ok': False, 'error': message}))


Application = webapp2.WSGIApplication

CreateLoginUrl = users.create_login_url
CreateLogoutUrl = users.create_logout_url