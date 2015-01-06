define(["three", "renderer", "resources", "config"],
       function(THREE, renderer, resources, config) {

    return {

        create: function(size, noiseMultipliers, noiseFrequency, fragmentShaderPath) {

            return new HeightmapGenerator(size, noiseMultipliers, noiseFrequency, fragmentShaderPath);

        },

    };

    function HeightmapGenerator(size, noiseMultipliers, noiseFrequency, fragmentShaderPath) {

        this.size = size;
        this.noiseMultipliers = noiseMultipliers;
        this.octaves = noiseMultipliers !== undefined ? noiseMultipliers.length : 1;
        this.noiseFrequency = noiseFrequency;


        this.generateTexture = generateTexture;
        this.makeFirstPass = makeFirstPass;
        this.makeSecondPass = makeSecondPass;


        this.firstPassRenderTarget = createRenderTarget(size * this.octaves, size);

        var _this = this;
        createFirstPassScene();
        createSecondPassScene(fragmentShaderPath);


        function generateTexture(leftTop, leftBottom, rightTop, seedVector) {

            var renderTarget = createRenderTarget(this.size, this.size);
            var clock = new THREE.Clock();

            clock.getDelta();

            this.makeFirstPass(leftTop, leftBottom, rightTop, seedVector);
            this.makeSecondPass(renderTarget);

            console.log(clock.getDelta());

            return renderTarget;

        };

        function makeFirstPass(leftTop, leftBottom, rightTop, seedVector) {

            this.firstPassScene.mesh.material.uniforms = {

                noiseFrequency: {type: 'f', value: this.noiseFrequency},
                leftTop: {type: '3fv', value: leftTop.toArray()},
                leftBottom: {type: '3fv', value: leftBottom.toArray()},
                rightTop: {type: '3fv', value: rightTop.toArray()},
                seedVector: {type: '3fv', value: seedVector.toArray()}

            }

            this.firstPassScene.mesh.material.needsUpdate = true;

            renderer.render(this.firstPassScene.scene, this.firstPassScene.camera,
                            this.firstPassRenderTarget, true);

        }

        function makeSecondPass(renderTarget) {

            renderer.render(this.secondPassScene.scene, this.secondPassScene.camera,
                            renderTarget, true);

        }

        function createRenderTarget(width, height) {

            var settings = {

                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                generateMipmaps: false,
                format: THREE.RGBFormat,

            };

            return new THREE.WebGLRenderTarget(width, height, settings);

        }

        function createFirstPassScene() {

            var scene = new THREE.Scene();
            var material = createFirstPassMaterial();
            var geometry = createFirstPassGeometry();
            var mesh = new THREE.Mesh(geometry, material);

            scene.add(mesh);

            var camera = new THREE.OrthographicCamera(0, _this.octaves, 0, 1, 1, 1000);
            camera.position.set(0,0, 10);
            scene.add(camera);

            _this.firstPassScene = {
                scene: scene,
                camera: camera,
                mesh: mesh
            };

        }

        function createSecondPassScene(fragmentShaderPath) {

            var scene = new THREE.Scene();

            var geometry = createSecondPassGeometry();
            var material = createSecondPassMaterial(fragmentShaderPath);
            var mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);

            var camera = new THREE.OrthographicCamera(0, 1, 1, 0, 1, 1000);
            camera.position.set(0,0, 10);
            scene.add(camera);

            _this.secondPassScene = {
                scene: scene,
                camera: camera,
                mesh: mesh
            };

        }

        function createFirstPassMaterial() {

            var materialParameters = {
                attributes: {
                    multiplier: { type: 'f', value: [] },
                    cornerPosition: { type: '3fv', value: [] }
                },
                side: THREE.DoubleSide,
            };

            var material = resources.getRawShaderMaterial(
                                config.heightmapGeneratorFirstPassVertex,
                                config.heightmapGeneratorFirstPassFrag,
                                materialParameters
            );

            return material;

        }

        function createSecondPassMaterial(fragmentShaderPath) {

            var octaves = _this.octaves, noiseMultipliers = _this.noiseMultipliers;
            var sourceTex = _this.firstPassRenderTarget;

            var multipliers = [];
            for(var i = 0; i < noiseMultipliers.length; i++) {
                multipliers.push(noiseMultipliers[i][0]);
            }

            var materialParameters = {
                uniforms: {
                    sourceTexture: { type: 't', value: sourceTex },
                    multipliers: { type: 'fv1', value: multipliers }
                },
                defines: {
                    OCTAVES: octaves,
                    FOCTAVES: octaves.toString() + ".0",
                },
                side: THREE.DoubleSide,
            };

            return resources.getShaderMaterial(
                               config.heightmapGeneratorSecondPassVertex,
                               fragmentShaderPath,
                               materialParameters
            );

        }

        function createFirstPassGeometry() {

            var octaves = _this.octaves, segments = _this.size;
            var noiseMultipliers = _this.noiseMultipliers;

            var planeGeometry = createSecondPassGeometry();

            var multArray = new Float32Array( octaves * 2 * 3 * 1 );
            var multipliers = new THREE.BufferAttribute( multArray, 1 );

            for(i = 0; i < octaves * 6; i++) {

                multipliers.setX(i, noiseMultipliers[Math.floor(i / 6)][1]);

            }

            planeGeometry.addAttribute( "multiplier", multipliers );

            var cornersArray = new Float32Array( octaves * 2 * 3 * 3 );
            var cornersPositions = new THREE.BufferAttribute( cornersArray, 3 );
            var mod = 1 / (2 * segments - 2);
            for(var i = 0; i < octaves; i++) {

                cornersPositions.setXYZ( 6 * i + 0, -mod, 1 + mod, 0 );
                cornersPositions.setXYZ( 6 * i + 1, 1 + mod, 1 + mod, 0 );
                cornersPositions.setXYZ( 6 * i + 2, 1 + mod, -mod, 0 );

                cornersPositions.setXYZ( 6 * i + 3, -mod, 1 + mod, 0);
                cornersPositions.setXYZ( 6 * i + 4, 1 + mod, -mod, 0);
                cornersPositions.setXYZ( 6 * i + 5, -mod, -mod, 0);

            }

            planeGeometry.addAttribute( "cornerPosition", cornersPositions );

            return planeGeometry;
        }

        function createSecondPassGeometry() {

            var octaves = _this.octaves;

            var planeGeometry = new THREE.BufferGeometry();

            var vertArray = new Float32Array( octaves * 2 * 3 * 3 );
            var vertices = new THREE.BufferAttribute( vertArray, 3 );

            for(var i = 0; i < octaves; i++) {

                var i1 = i + 1;

                vertices.setXYZ( 6 * i + 0, i, 1, 0 );
                vertices.setXYZ( 6 * i + 1, i1, 1, 0 );
                vertices.setXYZ( 6 * i + 2, i1, 0, 0 );

                vertices.setXYZ( 6 * i + 3, i, 1, 0);
                vertices.setXYZ( 6 * i + 4, i1, 0, 0);
                vertices.setXYZ( 6 * i + 5, i, 0, 0);

            }

            planeGeometry.addAttribute( "position", vertices );

            return planeGeometry;

        }

    };

});


