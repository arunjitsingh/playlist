# Copyright 2012 Arunjit Singh. All Rights Reserved.

"""Sets up the Jinja2 environment to get and render templates."""

__author__ = 'Arunjit Singh <arunjit@me.com>'

import os
import jinja2

TEMPLATE_PATH = os.path.join(os.path.dirname(__file__), 'templates')

_env = jinja2.Environment(loader=jinja2.FileSystemLoader(TEMPLATE_PATH))


def Get(name, parent=None, globals=None):
  """Wraps around jinja2.Environment.get_template."""
  return _env.get_template(name, parent, globals)
