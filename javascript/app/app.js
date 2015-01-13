define(['three', 'camera', 'controls', 'renderer', 'stats', 'planet/planetManager',
    'planet/heightmapManager', 'containers/planetContainer', 'factories/planetFactory',
    'seedrandom', 'system/systemFactory', 'config', 'galaxy/galaxyFactory'],
    function (THREE, camera, controls, renderer, stats, planetManager,
        heightmapManager, PlanetContainer, PlanetFactory, seedrandom,
        SystemFactory, config, GalaxyFactory) {

    var pggConfig = config.config.pgg;

    var clock = new THREE.Clock();
    clock.getDelta();

    //var galaxyFactory = new GalaxyFactory(41242);
    //var middle = new THREE.Vector3(0,0,0);
    //var systemArray = galaxyFactory.createGalaxyCube(4142, middle, 100);

    console.log(clock.getDelta());

    function App() {

        var that = this;

        this.clock = new THREE.Clock();
        this.mainScene = new THREE.Scene();
        this.planetContainer = new PlanetContainer();
        this.mainScene.add(this.planetContainer.planets);

        this.run = run;

        function setup(seed) {

            var systemFactory = new SystemFactory(seed);
            var system = systemFactory.createSystem(51512);

            for(var i=0; i<system.planets.length; i++) {

                that.planetContainer.addPlanet(system.planets[i]);

            }

        }

        function debugSetup(seed) {

            var planetFactory = new PlanetFactory(seed);
            var planet = planetFactory.createPlanet(1);

            that.planetContainer.addPlanet(planet);
            planet.position.z -= planet.planetRadius * 3;

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
            that.planetContainer.updateAll();
            heightmapManager.update();
            controls.update(delta);
            camera.updateFrustum();
            stats.update(renderer);
        }

        function onFrame() {

            requestAnimationFrame(function() { onFrame(); });
            update();
            renderer.render(that.mainScene, camera);
        }

    }

    return App;
});
