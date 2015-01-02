define(["three", "planet/heightmapGenerator", "resources", "utils/settings", "config"],
       function(THREE, heightmapGenerator, resources, settingsUtils, config) {

    return {

        create: function(name, relativePath, genFragShaderPath, rendFragShaderPath, settings) {

            return new PlanetProperties(name, relativePath, genFragShaderPath, rendFragShaderPath, settings);

        },

    };

    function PlanetProperties(name, relativePath, genFragShaderPath, rendFragShaderPath, settings) {

        this.name = name;

        this.chunkSegments = 10;
        this.lodMaxDetailLevel = 3;

        this.planetRadiusMin = 10000;
        this.planetRadiusMax = 12000;
        this.planetSurfaceMin = 300;
        this.planetSurfaceMax = 1000;

        this.noiseFrequency = 1;

        settingsUtils.applySettings(this, settings);


        this.uniforms = parseUniforms(settings.uniforms || {});

        this.heightmapGenerator = heightmapGenerator.create(2 * this.chunkSegments,
                                    this.noiseFrequency,
                                    toAbsolutePath(genFragShaderPath));

        this.material = createMaterial(config.planetVertex,
                                       toAbsolutePath(rendFragShaderPath),
                                       this.uniforms);

        this.toAbsolutePath = toAbsolutePath;


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

        function createMaterial(vertPath, fragPath, uniforms) {

            var material = resources.getShaderMaterial(vertPath, fragPath);

            material.uniforms = THREE.UniformsUtils.clone( uniforms );

            return material;

        }

    }
});


