define(["three", "planet/heightmapGenerator", "resources", "utils/settings", "config"],
       function(THREE, heightmapGenerator, resources, settingsUtils, config) {

    return {

        create: function(name, relativePath,  rendFragShaderPath, settings) {

            return new PlanetProperties(name, relativePath,  rendFragShaderPath, settings);

        },

    };

    function PlanetProperties(name, relativePath, rendFragShaderPath, settings) {

        this.name = name;

        this.chunkSegments = 10;
        this.lodMaxDetailLevel = 3;
        this.noiseMultipliers = [
            [1, 1]
        ];

        this.planetRadiusMin = 10000;
        this.planetRadiusMax = 12000;
        this.planetSurfaceMin = 300;
        this.planetSurfaceMax = 1000;

        this.noiseFrequency = 1;

        settingsUtils.applySettings(this, settings);

        this.uniforms = parseUniforms(settings.uniforms || {});

        this.toAbsolutePath = toAbsolutePath;

        initialize(this);


        function initialize(_this) {

            var genFragShaderPath = settings.genFragShaderPath !== undefined ?
                                toAbsolutePath(settings.genFragShaderPath) :
                                config.heightmapGeneratorSecondPassFrag;

            _this.heightmapGenerator = heightmapGenerator.create(
                    _this.name,
                    2 * _this.chunkSegments,
                    _this.noiseMultipliers,
                    _this.noiseFrequency,
                    genFragShaderPath
                );

            _this.material = createMaterial(
                   config.planetVertex,
                   toAbsolutePath(rendFragShaderPath),
                   _this.uniforms,
                   _this.chunkSegments
               );

        }

        function toAbsolutePath(path) {

            return relativePath + path;

        }

        function parseUniforms(uniforms) {

            for(var key in uniforms) {

                if(uniforms[key].type === "t") {

                    var path = toAbsolutePath(uniforms[key].value);
                    uniforms[key].value = resources.getTexture(path);

                }

            }

            return uniforms;

        }

        function createMaterial(vertPath, fragPath, uniforms, segments) {

            var material = resources.getShaderMaterial(vertPath, fragPath);

            material.uniforms = THREE.UniformsUtils.clone( uniforms );
            //material.wireframe = true;

            return material;

        }

    }
});


