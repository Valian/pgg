define(['three', 'camera', 'controls', 'renderer', 'stats', 'planet/planetManager',
    'planet/heightmapManager', 'containers/planetContainer', 'factories/planetFactory',
    'seedrandom', 'system/systemFactory'], function (THREE, camera, controls, renderer, stats, planetManager,
        heightmapManager, PlanetContainer, PlanetFactory, seedrandom, SystemFactory) {

    function App() {
        this.clock = new THREE.Clock();
        this.mainScene = new THREE.Scene();
        this.setup = setup;
        this.run = run;
        this.onFrame = onFrame;
        this.update = update;

        this.setup();

        function setup() {
            var systemFactory = new SystemFactory(Math.random());
            var system = systemFactory.createSystem(51512);

            this.planetContainer = new PlanetContainer();

            for(var i=0; i<system.planets.length; i++) {
                this.planetContainer.addPlanet(system.planets[i]);
            }
            this.mainScene.add(this.planetContainer.planets);
        }

        function run() {
            this.onFrame();
        }

        function update() {
            var delta = this.clock.getDelta();
            this.planetContainer.updateAll();
            heightmapManager.update();
            controls.update(delta);
            camera.updateFrustum();
            stats.update(renderer);
        }

        function onFrame() {
            var that = this;
            requestAnimationFrame(function() { that.onFrame(); });
            this.update();
            renderer.render(this.mainScene, camera);
        }
    }

    return App;
});
