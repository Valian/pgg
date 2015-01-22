define(['three', 'renderer', 'stats', 'heightmap/heightmapManager',
    'factories/planetFactory', 'seedrandom', 'system/systemFactory', 'config',
    'user/orbitControls', 'user/camera', 'user/fpsControls',
    'user/controls', 'galaxy/galaxy', 'skybox/skyboxFactory', 'system/system', 'threeFullScreen',
    'galaxy/bucketContainer'],
    function (THREE, renderer, stats, heightmapManager, PlanetFactory,
        seedrandom, SystemFactory, config, OrbitControls,
        Camera, FpsControls, Controls, Galaxy, SkyboxFactory, System, THREEx, BucketContainer) {


    var pggConfig = config.config.pgg;


    function App(seed) {
        var that = this;

        this.clock = new THREE.Clock();
        this.scene = new THREE.Scene();
        this.camera = new Camera();
        this.camera.perspectiveCamera.position.z = 5000;
        this.controls = new Controls(this.camera.perspectiveCamera, this);
        this.galaxy = new Galaxy(4124);
        THREEx.FullScreen.bindKey();
        THREEx.WindowResize(renderer, this.camera.perspectiveCamera);

        this.run = run;
        this.onFrame = onFrame;
        this.switchSystem = switchSystem;

        function run() {
            this.galaxy.setCurrentSystemIndices(0, 12, 0);
            this.skybox = this.galaxy.currentSkybox;
            this.system = this.galaxy.currentSystem;

            this.scene.add(this.skybox);
            this.scene.add(this.system.objects);
            this.controls.setCurrentSystem(this.system);

            //while(this.scene.children.length > 0) {
            //    this.scene.remove(this.scene.children[0]);
            //}

            this.onFrame();
        }

        function switchSystem(x, y, z) {
            while(this.scene.children.length > 0) {
                this.scene.remove(this.scene.children[0]);
            }

            this.galaxy.setCurrentSystemIndices(x, y, z);
            this.skybox = this.galaxy.currentSkybox;
            this.system = this.galaxy.currentSystem;

            this.scene.add(this.skybox);
            this.scene.add(this.system.objects);
            this.controls.setCurrentSystem(this.system);
        }

        function onFrame() {
            requestAnimationFrame(function() { that.onFrame(); });

            this.galaxy.update(this.camera)

            this.controls.update(this.clock.getDelta());
            this.camera.updateFrustum();
            heightmapManager.update();

            renderer.render(this.scene, this.camera.perspectiveCamera);
            stats.update(renderer);
        }
    }

    return App;
});
