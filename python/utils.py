import os

from flask import make_response
from functools import wraps, update_wrapper
from datetime import datetime

def nocache(view):
    @wraps(view)
    def no_cache(*args, **kwargs):
        response = make_response(view(*args, **kwargs))
        response.headers['Last-Modified'] = datetime.now()
        response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '-1'
        return response

    return update_wrapper(no_cache, view)

def deepupdate(source, destination):
    for k, v in source.items():
        if isinstance(v, dict):
            if k in destination:
                deepupdate(source[k], destination[k])
            else:
                destination[k] = v
        else:
            destination[k] = v


def list_subdirectories(dirpath):
    for subdirname in os.listdir(dirpath):
        subdirpath = os.path.join(dirpath, subdirname)
        if os.path.isdir(subdirpath):
            yield subdirname, subdirpath


def list_files(dirpath):
    for filename in os.listdir(dirpath):
        filepath = os.path.join(dirpath, filename)
        if os.path.isfile(filepath):
            filename, extension = os.path.splitext(filename)
            yield filename, extension.replace('.', ''), filepath
