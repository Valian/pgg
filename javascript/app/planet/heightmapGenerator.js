define(["three", "renderer", "resources", "config", "scene"],
       function(THREE, renderer, resources, config, scene) {


    return {

        create: function(name, size, noiseMultipliers, noiseFrequency, fragmentShaderPath) {

            return new HeightmapGenerator(name, size, noiseMultipliers, noiseFrequency, fragmentShaderPath);

        },

    };

    function HeightmapGenerator(name, size, noiseMultipliers, noiseFrequency, fragmentShaderPath) {

        this.name = name;

        this.size = size;
        this.noiseMultipliers = noiseMultipliers;
        this.octaves = noiseMultipliers !== undefined ? noiseMultipliers.length : 1;
        this.noiseFrequency = noiseFrequency;

        this.generateTextures = generateTextures;
        this.createRenderTarget = createRenderTarget;

        var _this = this;
        createFirstPassScene();
        createSecondPassScene(fragmentShaderPath);

        function generateTexture(leftTop, leftBottom, rightTop, seedVector, renderTarget) {

            renderTarget = renderTarget || createRenderTarget(this.size, this.size);
            var clock = new THREE.Clock();

            clock.getDelta();

            this.makeFirstPass(leftTop, leftBottom, rightTop, seedVector);
            this.makeSecondPass(renderTarget);

            console.log(clock.getDelta());

            return renderTarget;

        };

        function generateTextures(parametersArray) {

            do {

                var part = parametersArray.splice(0, config.generatorParallelity);

                var count = part.length;
                var sourceTex = makeFirstPass(count, part);
                makeSecondPass(count, part, sourceTex);

                if(!scene.rendered) {

                    _this.rendered = true;

                } else {

                    sourceTex.dispose();

                }

            } while (parametersArray.length > 0);

        }

        function makeFirstPass(count, parametersArray) {

            var renderTarget = createRenderTarget(size * _this.octaves, size * count);
            updateAttribute(parametersArray);

            _this.firstPassScene.camera.top = count;
            _this.firstPassScene.camera.updateProjectionMatrix();

            renderer.render(
                _this.firstPassScene.scene,
                _this.firstPassScene.camera,
                renderTarget,
                true
            );

            if(!_this.rendered) {

                //var geo = new THREE.PlaneBufferGeometry(_this.octaves * 10000, count * 10000, 1, 1);
                //var mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({map: renderTarget}));

                //scene.add(mesh);

            }

            return renderTarget;

        }

        function makeSecondPass(count, parametersArray, sourceTex) {

            var uniforms = _this.secondPassScene.mesh.material.uniforms;

            uniforms.sourceTexture.value = sourceTex;
            uniforms.verticalCount.value = count;

            for(var i = 0; i < count; i++) {

                uniforms.row.value = i;
                renderer.render(_this.secondPassScene.scene, _this.secondPassScene.camera,
                            parametersArray[i].renderTarget, true);

            }

        }

        function createRenderTarget(width, height) {

            width = width || _this.size;
            height = height || width;

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

            mesh.FrustumCulled = false;
            scene.add(mesh);

            var camera = new THREE.OrthographicCamera(0, _this.octaves, 1, 0, 1, 1000);
            camera.position.set(0, 0, 10);
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
                uniforms: {
                    noiseFrequency: { type: 'f', value: _this.noiseFrequency },
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

            var multipliers = [];
            for(var i = 0; i < noiseMultipliers.length; i++) {
                multipliers.push(noiseMultipliers[i][0]);
            }

            var materialParameters = {

                uniforms: {

                    sourceTexture: { type: 't', value: null },
                    multipliers: { type: 'fv1', value: multipliers },
                    verticalCount: { type: 'f', value: 1 },
                    row: { type: 'f', value: 0 },

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
            var verticalCount = config.generatorParallelity;

            var planeGeometry = new THREE.BufferGeometry();

            var vertexes = verticalCount * octaves * 2 * 3;
            var vertArray = new Float32Array(vertexes * 3 );
            var vertices = new THREE.BufferAttribute( vertArray, 3 );

            for(var row=0; row<verticalCount; row++) {

                var row1 = row + 1;

                for(var i = 0; i < octaves; i++) {

                    var i1 = i + 1;
                    var index = 6 * (i + row * octaves);

                    vertices.setXYZ( index + 0, i, row1, 0 );
                    vertices.setXYZ( index + 1, i1, row1, 0 );
                    vertices.setXYZ( index + 2, i1, row, 0 );

                    vertices.setXYZ( index + 3, i, row1, 0);
                    vertices.setXYZ( index + 4, i1, row, 0);
                    vertices.setXYZ( index + 5, i, row, 0);

                }

            }

            planeGeometry.addAttribute( "position", vertices );

            var multArray = new Float32Array( vertexes );
            var multipliers = new THREE.BufferAttribute( multArray, 1 );

            for(var row=0; row<verticalCount; row++) {

                for(var i = 0; i < octaves * 6; i++) {

                    multipliers.setX(i + row * octaves * 6, noiseMultipliers[Math.floor(i / 6)][1]);

                }

            }

            planeGeometry.addAttribute( "multiplier", multipliers );

            var cornersArray = new Float32Array( vertexes * 4 );
            _this.cornersPositions = new THREE.BufferAttribute( cornersArray, 4 );

            for(var i=0; i < vertexes; i++) {

                _this.cornersPositions.setXYZW(i, 0, 0, 0, 0);

            }

            planeGeometry.addAttribute( "cornerPosition", _this.cornersPositions );

            return planeGeometry;
        }

        function updateAttribute(parametersArray) {

            var octaves = _this.octaves
            var len = parametersArray.length;
            var mod = 1 / (2 * _this.size - 2);

            var topVector = new THREE.Vector3();
            var leftVector = new THREE.Vector3();
            var result = new THREE.Vector3();

            var temp1 = new THREE.Vector3();
            var temp2 = new THREE.Vector3();

            for(var row = 0; row < len; row++)
            {

                var corners = parametersArray[row].param.corners;
                var seed = parametersArray[row].param.seed;
                var leftTop = corners[0];

                //rightTop - leftTop;
                topVector.copy(corners[1]).sub(corners[0]);
                //leftBottom - leftTop;
                leftVector.copy(corners[2]).sub(corners[0]);

                for(var i = 0; i < octaves; i++) {

                    var index = 6 * (i + row * octaves);

                    //face1
                    calculateSpherePosition( -mod, -mod );
                    _this.cornersPositions.setXYZW( index + 0, result.x, result.y, result.z, seed);

                    calculateSpherePosition( 1 + mod, -mod );
                    _this.cornersPositions.setXYZW( index + 1, result.x, result.y, result.z, seed);

                    calculateSpherePosition( 1 + mod, 1 + mod );
                    _this.cornersPositions.setXYZW( index + 2, result.x, result.y, result.z, seed);

                    //face2
                    calculateSpherePosition( -mod, -mod );
                    _this.cornersPositions.setXYZW( index + 3, result.x, result.y, result.z, seed);

                    calculateSpherePosition( 1 + mod, 1 + mod );
                    _this.cornersPositions.setXYZW( index + 4, result.x, result.y, result.z, seed);

                    calculateSpherePosition( -mod, 1 + mod );
                    _this.cornersPositions.setXYZW( index + 5, result.x, result.y, result.z, seed);

                }

            }

             _this.cornersPositions.needsUpdate = true;

            function calculateSpherePosition( x, y ) {

                temp1.copy(topVector).multiplyScalar(x);
                temp2.copy(leftVector).multiplyScalar(y);
                result.copy(leftTop).add(temp1).add(temp2);

            }

        }

        function createSecondPassGeometry() {

            var octaves = _this.octaves;

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


    };

});


