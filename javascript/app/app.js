define(['three', 'renderer', 'stats', 'heightmap/heightmapManager',
    'factories/planetFactory', 'seedrandom', 'system/systemFactory', 'config',
    'galaxy/galaxyFactory', 'user/controls', 'user/camera', 'skybox/skyboxGenerator', 'system/system'],
    function (THREE, renderer, stats, heightmapManager, PlanetFactory,
        seedrandom, SystemFactory, config, GalaxyFactory, Controls, Camera,
        SkyboxGenerator, System) {

    var pggConfig = config.config.pgg;

    function App() {
        var that = this;

        this.clock = new THREE.Clock();
        this.mainScene = new THREE.Scene();
        this.mainCamera = new Camera();
        this.mainCamera.perspectiveCamera.position.z = 5000;
        this.controls = new Controls(this.mainCamera.perspectiveCamera);

        this.run = run;


        var clock = new THREE.Clock();
        clock.getDelta();
        //var size = 40;
        var gen = new SkyboxGenerator(1);
        var skybox = gen.generate(new THREE.Vector3(0,0,0));
        //var material = new THREE.MeshBasicMaterial({map: rt});
        //var geometry = new THREE.PlaneBufferGeometry(size * 1000, size * 1000, 1,1);

        this.mainScene.add(skybox);
        console.log(clock.getDelta());


        function setup(seed) {

            var systemFactory = new SystemFactory(seed);
            that.system = systemFactory.createSystem(51512);
            that.mainScene.add(that.system.objects);
            that.controls.setSystem(that.system);
        }

        function debugSetup(seed) {

            var planetFactory = new PlanetFactory(seed);
            var planet = planetFactory.createPlanet(1);
            planet.position.z -= planet.planetRadius * 3;

            that.system = new System(undefined, [planet]);
            that.mainScene.add(that.system.objects);
            that.controls.setSystem(that.system);

        }

        function run() {

            var seed = pggConfig.random ? Math.random() : pggConfig.seed;

            if(pggConfig.debug) {

                debugSetup(seed);

            } else {

                setup(seed);

            }


            onFrame();
        }

        function update() {
            var delta = that.clock.getDelta();
            that.system.update(that.mainCamera);
            heightmapManager.update();
            that.controls.update(delta);
            that.mainCamera.updateFrustum();
            stats.update(renderer);
        }

        function onFrame() {

            requestAnimationFrame(function() { onFrame(); });
            update();
            renderer.render(that.mainScene, that.mainCamera.perspectiveCamera);
        }

    }

    return App;
});
