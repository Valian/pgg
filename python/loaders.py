from utils import list_files, load_json, list_subdirectories, without_extension
import os
from flask import url_for


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