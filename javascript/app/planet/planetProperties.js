define(["three", "planet/heightmapGenerator", "resources", "utils/settings", "config"],
       function(THREE, heightmapGenerator, resources, settingsUtils, config) {

    return {

        create: function(name, planetConfig) {

            return new PlanetProperties(name, planetConfig);

        },

    };

    function PlanetProperties(name, planetConfig) {

        this.name = name;

        this.chunkSegments = null;
        this.lodMaxDetailLevel = null;
        this.noiseMultipliers = null;

        this.planetRadius = null;
        this.planetSurface = null;

        this.noiseFrequency = null;

        settingsUtils.update(this, planetConfig.properties);
        settingsUtils.update(this, planetConfig);


        this.uniforms = parseUniforms(this.uniforms || {});

        initialize(this);


        function initialize(properties) {

            properties.heightmapGenerator = heightmapGenerator.create(

                2 * properties.chunkSegments,
                properties

            );

            properties.material = new THREE.ShaderMaterial({

                vertexShader: properties.planetVertex,
                fragmentShader: properties.planetFragment,
                uniforms: THREE.UniformsUtils.clone( properties.uniforms )

            });

        }

        function parseUniforms(uniforms) {

            for(var key in uniforms) {

                if(uniforms[key].type === "t") {

                    //var path = toAbsolutePath(uniforms[key].value);
                    //uniforms[key].value = resources.getTexture(path);

                }

            }

            return uniforms;

        }
    }
});


