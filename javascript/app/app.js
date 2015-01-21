define(['three', 'renderer', 'stats', 'heightmap/heightmapManager',
    'factories/planetFactory', 'seedrandom', 'system/systemFactory', 'config',
    'galaxy/galaxyFactory', 'user/orbitControls', 'user/camera', 'user/fpsControls',
    'user/controls', 'galaxy/galaxy', 'skybox/skyboxGenerator', 'system/system', 'threeFullScreen',
    'galaxy/bucketContainer'],
    function (THREE, renderer, stats, heightmapManager, PlanetFactory,
        seedrandom, SystemFactory, config, GalaxyFactory, OrbitControls,
        Camera, FpsControls, Controls, Galaxy, SkyboxGenerator, System, THREEx, BucketContainer) {

    var pggConfig = config.config.pgg;

    var skyboxGenerator = new SkyboxGenerator(12512512);
    var skybox = skyboxGenerator.generate(new THREE.Vector3(0, 0, 0));
    var bucketContainer = new BucketContainer(skybox.data);
    //bucketContainer.getSystemCoordinates(1.7, 1.0);
    //debugger;

    //var galaxyData = [];
    //for(var i=0; i<1000000; i++) {
    //    galaxyData.push({angles: {theta: 360 * Math.random()}});
    //}
    //var galaxy = new Galaxy(galaxyData, 10);

    function App() {
        var that = this;

        this.clock = new THREE.Clock();
        this.mainScene = new THREE.Scene();
        this.mainCamera = new Camera();
        this.mainCamera.perspectiveCamera.position.z = 5000;
        this.controls = new Controls(this.mainCamera.perspectiveCamera);

        this.run = run;

        THREEx.FullScreen.bindKey();
        THREEx.WindowResize(renderer, this.mainCamera.perspectiveCamera);


        function setup(seed) {

            var systemFactory = new SystemFactory(seed);
            that.system = systemFactory.createSystem(51512);
            that.mainScene.add(that.system.objects);
            that.controls.setCurrentSystem(that.system);

        }

        function debugSetup(seed) {

            var planetFactory = new PlanetFactory(seed);
            var planet = planetFactory.createPlanet(1);
            planet.position.z -= planet.planetRadius * 3;

            that.system = new System(undefined, [planet]);
            that.mainScene.add(that.system.objects);
            that.controls.setCurrentSystem(that.system);

        }

        function run() {

            var seed = pggConfig.random ? Math.random() : pggConfig.seed;


            var clock = new THREE.Clock();
            clock.getDelta();

            var skyboxGenerator = new SkyboxGenerator(seed);
            that.skybox = skyboxGenerator.generate(new THREE.Vector3(0,0,0));
            this.mainScene.add(that.skybox);
            console.log(clock.getDelta());

            if(pggConfig.debug) {

                debugSetup(seed);

            } else {

                setup(seed);

            }


            onFrame();
        }

        function update() {

            var delta = that.clock.getDelta();

            that.controls.update(delta);
            that.mainCamera.updateFrustum();
            that.system.update(that.mainCamera);
            heightmapManager.update();
            stats.update(renderer);
            that.skybox.update(that.mainCamera.perspectiveCamera);
        }

        function onFrame() {

            requestAnimationFrame(function() { onFrame(); });
            update();
            renderer.render(that.mainScene, that.mainCamera.perspectiveCamera);
        }

    }

    return App;
});
