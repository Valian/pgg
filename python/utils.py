import json
import os
from flask import url_for


def load_json(path):
    try:
        with open(path) as json_file:
            return json.load(json_file)
    except ValueError:
        raise ValueError('{0} is invalid'.format(path))


def list_subdirectories(dirpath):
    for name in os.listdir(dirpath):
        abspath = os.path.join(dirpath, name)
        if os.path.isdir(abspath):
            yield name, abspath


def list_files(dirpath):
    for name in os.listdir(dirpath):
        abspath = os.path.join(dirpath, name)
        if os.path.isfile(os.path.join(dirpath, name)):
            yield name, abspath


def load_file_content(path):
    if any(path.endswith(extension) for extension in ('png', 'jpg', 'jpeg', 'gif')):
        return url_for('static', filename=path)
    else:
        with open(path) as text_file:
            return text_file.read()


def without_extension(path):
    return os.path.splitext(path)[0]