define(["three", "utils/offscreenRenderer", "config"],
       function(THREE, OffscreenRenderer, config) {

    return SecondPass;

    function SecondPass(octaves, properties) {

        var that = this;

        this.octaves = octaves;
        this.offscreenRenderer = createRenderer(properties);
        this.makePass = makePass;

        function makePass(parametersArray, sourceTex) {

            var count = parametersArray.length;
            var uniforms = that.offscreenRenderer.uniforms;

            uniforms.sourceTexture.value = sourceTex;
            uniforms.verticalCount.value = count;

            for(var i = 0; i < count; i++) {

                var mult = parametersArray[i].param.properties.noiseMultipliers;
                var multipliersArray = [];

                for(var j=0; j < mult.length; j++) {

                    multipliersArray.push( mult[j].weight );

                }

                uniforms.row.value = i;
                uniforms.multipliers.value = multipliersArray;

                that.offscreenRenderer.render(parametersArray[i].renderTarget);

            }

        }

        function createRenderer(properties) {

            var uniforms = {

                sourceTexture: { type: 't', value: null },
                multipliers: { type: 'fv1', value: null },
                verticalCount: { type: 'f', value: 1 },
                row: { type: 'f', value: 0 },

            };
            var defines = {

                OCTAVES: that.octaves,
                FOCTAVES: that.octaves.toString() + ".0",

            };
            var vertex = config.heightmaps.secondPassVert;
            var fragment = properties.heightmapFragment ?
                           properties.heightmapFragment :
                           config.heightmaps.secondPassFrag;

            var parameters = {

                uniforms: uniforms,
                defines: defines

            };

            return new OffscreenRenderer(vertex, fragment, parameters);

        }
        /*
        this.scene = new THREE.Scene();
        this.geometry = createSecondPassGeometry();
        this.material = createSecondPassMaterial();
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.camera = new THREE.OrthographicCamera(0, 1, 1, 0, 1, 1000);

        this.camera.position.set(0,0, 10);
        this.scene.add(this.camera);
        this.scene.add(this.mesh);

        this.makePass = makePass;

        function makePass(count, parametersArray, sourceTex) {

            var uniforms = this.mesh.material.uniforms;
            var multipliersArray = [];

            uniforms.sourceTexture.value = sourceTex;
            uniforms.verticalCount.value = count;

            for(var i = 0; i < count; i++) {

                var mult = parametersArray[i].param.properties.noiseMultipliers;

                uniforms.row.value = i;
                uniforms.multipliers.value = convertToUniform(mult);

                renderer.render(

                    this.scene,
                    this.camera,
                    parametersArray[i].renderTarget,
                    true

                );

            }

            function convertToUniform(multipliers) {

                multipliersArray = [];

                for(var j=0; j < multipliers.length; j++) {

                    multipliersArray.push( multipliers[j].weight );

                }

                return multipliersArray;

            }

        }


        function createSecondPassMaterial() {

            //TODO - move to planetProperties loading.
            var heightmapFrag = properties.heightmapFragment ?
                                properties.heightmapFragment:
                                config.heightmaps.secondPassFrag;

            var materialParameters = {

                uniforms: {

                    sourceTexture: { type: 't', value: null },
                    multipliers: { type: 'fv1', value: null },
                    verticalCount: { type: 'f', value: 1 },
                    row: { type: 'f', value: 0 },

                },
                defines: {

                    OCTAVES: octaves,
                    FOCTAVES: octaves.toString() + ".0",

                },
                side: THREE.DoubleSide,
                vertexShader: config.heightmaps.secondPassVert,
                fragmentShader: heightmapFrag,

            };

            return new THREE.ShaderMaterial( materialParameters );

        }


        function createSecondPassGeometry() {

            var planeGeometry = new THREE.BufferGeometry();

            var vertArray = new Float32Array( 2 * 3 * 3 );
            var vertices = new THREE.BufferAttribute( vertArray, 3 );

            vertices.setXYZ(0, 0, 1, 0 );
            vertices.setXYZ(1, 1, 1, 0 );
            vertices.setXYZ(2, 1, 0, 0 );

            vertices.setXYZ(3, 0, 1, 0);
            vertices.setXYZ(4, 1, 0, 0);
            vertices.setXYZ(5, 0, 0, 0);

            planeGeometry.addAttribute( "position", vertices );

            return planeGeometry;

        }
        */

    }


});
