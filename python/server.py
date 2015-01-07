import os
import json
from flask import Flask, render_template, Response
from loaders import HeightmapsLoader, ObjectsDefinitionsLoader


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, 'data')
TEMPLATES_DIR = os.path.join(BASE_DIR, 'html')
JAVASCRIPT_DIR = os.path.join(BASE_DIR, 'javascript')

PLANETS_DIR = os.path.join(DATA_DIR, 'planets')
HEIGHTMAPS_DIR = os.path.join(DATA_DIR, 'heightmaps')

LOADERS = (
    ('heightmaps', HeightmapsLoader(HEIGHTMAPS_DIR)),
    ('planets', ObjectsDefinitionsLoader(PLANETS_DIR)),
)


app = Flask(__name__, static_folder=BASE_DIR, static_url_path='', template_folder=TEMPLATES_DIR)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/data/load/')
def load_content():
    content = {name: loader.load() for name, loader in LOADERS}
    return Response(json.dumps(content), content_type='application/json')


if __name__ == '__main__':
    app.run(debug=True, port=8000)
