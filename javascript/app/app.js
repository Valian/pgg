define( function (require) {

    var THREE = require("three"),
        camera = require("camera"),
        controls = require("controls"),
        renderer = require("renderer"),
        scene = require("scene"),
        stats = require("stats"),
        planetManager = require("planet/planetManager");

    return {

        run: run,

    };


    function run() {

        var clock = new THREE.Clock();
        planetManager.generatePlanets();

        function render() {

            var delta = clock.getDelta();
            requestAnimationFrame(render);

            planetManager.update();
            controls.update(delta);
            camera.updateFrustum();
            stats.update(renderer);
            renderer.render(scene, camera);

        }

        render();

    }


    /*
    function initScene() {

        this.scene = new THREE.Scene();
        this.planetManager = new PlanetManager(settings);
        this.scene.add(this.planetManager.container);

        var planet = this.planetManager.createPlanet('test');
        planet.position.z = -60000;

    };

    function initRenderer() {

        this.renderer = new THREE.WebGLRenderer({ antialias: false });
        this.renderer.sortObjects = false;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

    };

    function initOthers() {

        this.clock = new THREE.Clock();

        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.top = '0px';
        document.body.appendChild(this.stats.domElement);

        this.rendererStats = new THREEx.RendererStats();
        this.rendererStats.domElement.style.position = 'absolute';
        this.rendererStats.domElement.style.bottom = '0px';
        document.body.appendChild(this.rendererStats.domElement);


        this.heightmapGenerator = new HeightmapGenerator(this.renderer, this.);

    };
    */



} );
