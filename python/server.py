import os
import json
from flask import Flask, render_template, Response
from loaders import HeightmapShadersLoader, PlanetSettingsLoader


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, 'data')
JAVASCRIPT_DIR = os.path.join(BASE_DIR, 'javascript')

PLANETS_DIR = os.path.join(DATA_DIR, 'planets')
HEIGHTMAPS_DIR = os.path.join(DATA_DIR, 'heightmaps')


LOADERS = (
    ('heightmaps', HeightmapShadersLoader(HEIGHTMAPS_DIR)),
    ('planets', PlanetSettingsLoader(PLANETS_DIR)),
)


app = Flask(__name__, static_folder=BASE_DIR, static_url_path='', template_folder=BASE_DIR)


class JsonResponse(Response):
    content_type = 'application/json'


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/data/load/')
def load_content():
    content = {name: loader.load_content() for name, loader in LOADERS}
    return JsonResponse(json.dumps(content))


if __name__ == '__main__':
    app.run(debug=True)
