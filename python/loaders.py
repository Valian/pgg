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


class HeightmapsLoader(DataLoader):
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


'''
data_loader = ObjectsDefinitionsLoader('../data/planets')
raise Exception(data_loader.load())


class Loader(object):
    def __init__(self, directory):
        self.directory = directory

    def load_file_content(self, filepath):
        if any(filepath.endswith(extension) for extension in ('png', 'jpg', 'jpeg', 'gif')):
            return self.create_image_url(filepath)
        else:
            return self.load_text_file(filepath)

    def load_text_file(self, filepath):
        with open(filepath) as f:
            return f.read()

    def create_image_url(self, filepath):
        return url_for('static', filename=filepath)


class HeightmapShadersLoader(Loader):
    def load_content(self):
        return {filename: self.load_text_file(filepath)
                for filename, filepath
                in list_files(self.directory)}


class PlanetSettingsLoader(Loader):
    def load_content(self):
        planets_properties = {}
        default_properties = load_json(os.path.join(self.directory, 'default_properties.json'))

        for dirname, dirpath in list_subdirectories(self.directory):
            planets_properties[dirname] = {'properties': default_properties.copy()}
            planets_properties[dirname]['properties'].update(load_json(os.path.join(dirpath, 'properties.json')))

            planets_properties[dirname]['additional_content'] = {}
            for filename, filepath in list_files(dirpath):
                filename = without_extension(filename)
                planets_properties[dirname]['additional_content'][filename] = self.load_file_content(filepath)

        return planets_properties
'''