define(['three', 'renderer', 'stats', 'heightmap/heightmapManager',
    'factories/planetFactory', 'seedrandom', 'system/systemFactory', 'config',
    'galaxy/galaxyFactory', 'user/orbitControls', 'user/camera', 'user/fpsControls',
    'user/controls', 'galaxy/galaxy', 'skybox/skyboxGenerator', 'system/system', 'threeFullScreen'],
    function (THREE, renderer, stats, heightmapManager, PlanetFactory,
        seedrandom, SystemFactory, config, GalaxyFactory, OrbitControls,
        Camera, FpsControls, Controls, Galaxy, SkyboxGenerator, System, THREEx) {

    var pggConfig = config.config.pgg;

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

        var clock = new THREE.Clock();
        clock.getDelta();
        //var size = 40;
        var gen = new SkyboxGenerator(1);
        var skybox = gen.generate(new THREE.Vector3(0,0,0));
        //var material = new THREE.MeshBasicMaterial({map: skybox.material.uniforms.tCube.value.images[0]});
        //var geometry = new THREE.PlaneBufferGeometry(10000, 10000, 1,1);

        //this.mainScene.add(new THREE.Mesh(geometry, material));
        this.mainScene.add(skybox.mesh);
        this.mainScene.add(skybox.skybox);
        console.log(clock.getDelta());


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
            //need some refactor
            skybox.skybox.update(that.mainCamera.perspectiveCamera);
        }

        function onFrame() {

            requestAnimationFrame(function() { onFrame(); });
            update();
            renderer.render(that.mainScene, that.mainCamera.perspectiveCamera);
        }

    }

    return App;
});
