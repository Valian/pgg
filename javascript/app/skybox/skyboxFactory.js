define(['three', 'skybox/starPositionFactory', 'skybox/skybox', 'config', 'resources'],
       function(THREE, StarPositionFactory, Skybox, config, resources) {

    var skyboxConfig = config.config.skybox;

    function SkyboxFactory(seed) {
        var that = this;

        this.seed = seed;
        this.gridResolution = skyboxConfig.gridResolution;

        this.createSkybox = createSkybox;

        function createSkybox(x, y, z) {
            var positionFactory = new StarPositionFactory(that.gridResolution, that.seed);
            var starData = positionFactory.generateStarPositions(x, y, z);
            var skybox = new Skybox(starData);
            return skybox;
        }

    }

    return SkyboxFactory;
});
