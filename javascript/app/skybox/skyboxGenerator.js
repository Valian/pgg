define(['three', 'skybox/starPositionGenerator', 'skybox/skybox', 'config', 'resources'],
       function(THREE, StarPositionGenerator, Skybox, config, resources) {

    var skyboxConfig = config.config.skybox;

    return SkyboxGenerator;

    function SkyboxGenerator(seed) {

        var that = this;

        this.seed = seed;
        this.gridResolution = skyboxConfig.gridResolution;

        this.generate = generate;

        function generate(middlePos) {

            var positionGenerator = new StarPositionGenerator(that.gridResolution, that.seed);
            var starData = positionGenerator.generate(middlePos);
            var skybox = new Skybox(starData);

            return skybox;

        }

    }

});
