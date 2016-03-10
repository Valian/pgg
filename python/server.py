import os
import json
from flask import Flask, render_template, Response
from loaders import SimpleDataLoader, ObjectsDefinitionsLoader


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, 'data')
TEMPLATES_DIR = os.path.join(BASE_DIR, 'html')
JAVASCRIPT_DIR = os.path.join(BASE_DIR, 'javascript')

PLANETS_DIR = os.path.join(DATA_DIR, 'planets')
HEIGHTMAPS_DIR = os.path.join(DATA_DIR, 'heightmaps')
SKYBOX_DIR = os.path.join(DATA_DIR, 'skybox')
CONFIG_DIR = os.path.join(DATA_DIR, 'config')

LOADERS = (
    ('heightmaps', SimpleDataLoader(HEIGHTMAPS_DIR)),
    ('skybox', SimpleDataLoader(SKYBOX_DIR)),
    ('planets', ObjectsDefinitionsLoader(PLANETS_DIR)),
    ('config', SimpleDataLoader(CONFIG_DIR)),
)


app = Flask(__name__, static_folder=BASE_DIR, static_url_path='', template_folder=TEMPLATES_DIR)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/data/load/')
def load_content():
    content = {name: loader.load() for name, loader in LOADERS}
    return Response(json.dumps(content), content_type='application/json')


@app.after_request
def set_cache_headers(response):
    response.cache_control.no_cache = True
    return response


if __name__ == '__main__':
    app.run(debug=True, port=8000, host='0.0.0.0')
