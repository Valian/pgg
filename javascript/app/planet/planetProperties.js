define(["three", "heightmap/heightmapGenerator", "resources", "utils/settings", "config"],
       function(THREE, HeightmapGenerator, resources, settingsUtils, config) {

    return {

        create: function(name, planetConfig) {

            return new PlanetProperties(name, planetConfig);

        },

    };

    function PlanetProperties(name, planetConfig) {

        this.name = name;

        //copy fields from config to this object
        settingsUtils.update(this, planetConfig.properties);
        settingsUtils.update(this, planetConfig);
        delete this.properties;

        this.generateRandomAttributes = generateRandomAttributes;

        initialize(this);

        function initialize(properties) {

            properties.uniforms = parseUniforms(properties.uniforms || {});

            properties.heightmapGenerator = new HeightmapGenerator(

                2 * properties.chunkSegments + 1,
                properties

            );

        }

        function generateRandomAttributes(seedGen) {

            var copy = makeDeepCopy(this);

            copy.material = new THREE.ShaderMaterial({

                vertexShader: copy.planetVertex,
                fragmentShader: copy.planetFragment,
                uniforms: copy.uniforms,
                wireframe: config.config.pgg.wireframe,

            });

            copy.material.uniforms.planetRadius = { type: "f", value: copy.planetRadius };
            copy.material.uniforms.planetSurface = { type: "f", value: copy.planetSurface };

            return copy;

            function makeDeepCopy(o) {

                if(o.min && o.max) {

                    return seedGen.nextRandomFloatFromRange(o.min, o.max);

                } else  {

                    var newObj = o instanceof Array ? [] : {};

                    for (var i in o) {

                        var newProp = o[i];

                        if (o[i].clone) {

                            newProp = o[i].clone();

                        } else if (o[i] !== null && typeof(o[i])=="object") {

                            newProp = makeDeepCopy(o[i]);

                        }

                        newObj[i] = newProp;

                    }

                    return newObj;

                }

            }
        }



        function parseUniforms(uniforms) {

            for(var key in uniforms) {

                if(uniforms[key].type === "t") {

                    var path = "data/planets/" + name + "/" + uniforms[key].value;
                    uniforms[key].value = resources.getTexture(path);

                }

            }

            return uniforms;

        }

    }
});


