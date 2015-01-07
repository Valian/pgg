from utils import list_files, list_subdirectories, deepupdate
from flask import url_for
import json


class TextFileExtractor(object):
    def extract(self, path):
        with open(path) as f:
            return f.read()


class ImageFileExtractor(object):
    def extract(self, path):
        return url_for('static', filename=path)


class JsonFileExtractor(TextFileExtractor):
    def extract(self, path):
        return json.loads(super(JsonFileExtractor, self).extract(path))


class DataLoader(object):
    extractors = {
        'png': ImageFileExtractor,
        'vert': TextFileExtractor,
        'frag': TextFileExtractor,
        'json': JsonFileExtractor,
    }

    def __init__(self, directory):
        self.directory = directory

    def get_extractor_for_extension(self, extension):
        return self.extractors[extension]()

    def load_data_from_directory(self, directory):
        data = {}
        for filename, extension, filepath in list_files(directory):
            extractor = self.get_extractor_for_extension(extension)
            data[filename] = extractor.extract(filepath)
        return data


class SimpleDataLoader(DataLoader):
    def load(self):
        return self.load_data_from_directory(self.directory)


class ObjectsDefinitionsLoader(DataLoader):
    def load(self):
        data = {}
        defaults = self.load_data_from_directory(self.directory)
        for dirname, dirpath in list_subdirectories(self.directory):
            data[dirname] = defaults.copy()
            deepupdate(self.load_data_from_directory(dirpath), data[dirname])
        return data
