import json
import os
from flask import url_for
from argparse import ArgumentParser


def deepupdate(source, destination):
    for k, v in source.items():
        if isinstance(v, dict):
            if k in destination:
                deepupdate(source[k], destination[k])
            else:
                destination[k] = v
        destination[k] = v


def load_json(path):
    try:
        with open(path) as json_file:
            return json.load(json_file)
    except ValueError:
        raise ValueError('{0} is invalid'.format(path))


def list_subdirectories(dirpath):
    for subdirname in os.listdir(dirpath):
        subdirpath = os.path.join(dirpath, subdirname)
        if os.path.isdir(subdirpath):
            print subdirname
            yield subdirname, subdirpath


def list_files(dirpath):
    for filename in os.listdir(dirpath):
        filepath = os.path.join(dirpath, filename)
        if os.path.isfile(filepath):
            filename, extension = os.path.splitext(filename)
            yield filename, extension.replace('.', ''), filepath


def load_file_content(path):
    if any(path.endswith(extension) for extension in ('png', 'jpg', 'jpeg', 'gif')):
        return url_for('static', filename=path)
    else:
        with open(path) as text_file:
            return text_file.read()


def without_extension(path):
    return os.path.splitext(path)[0]


def parse_arguments():
    argument_parser = ArgumentParser()
    argument_parser.add_argument('-d', '--debug', action='store_true')
    argument_parser.add_argument('-p', '--port', type=int, default=8000)
    return argument_parser.parse_args()