define(["three", "renderer", "resources", "config", "scene"],
       function(THREE, renderer, resources, config, scene) {


    return {

        create: function(size, properties) {

            return new HeightmapGenerator(size, properties);

        },

    };

    function HeightmapGenerator(size, properties) {

        this.name = properties.name;
        this.size = size;
        this.paralell = config.config.heightmapGenerator.generatorParallelity;
        this.noiseMultipliers = properties.noiseMultipliers;
        this.octaves = this.noiseMultipliers ? this.noiseMultipliers.length : 1;
        this.noiseFrequency = properties.noiseFrequency;

        this.firstPass = new FirstPassScene(size, this.paralell, this.octaves, properties);
        this.secondPass = new SecondPassScene(size, this.octaves, properties);

        this.generateTextures = generateTextures;
        this.createRenderTarget = createRenderTarget;

        function generateTextures(parametersArray) {

            var paramCopy = parametersArray.slice();
            var clock = new THREE.Clock();

            do {

                var part = paramCopy.splice(0, this.paralell);

                var count = part.length;

                console.log(count);
                clock.getDelta();

                var sourceTex = createRenderTarget(size * this.octaves, size * count);
                this.firstPass.makePass(count, part, sourceTex);
                this.secondPass.makePass(count, part, sourceTex);

                sourceTex.dispose();

                console.log(clock.getDelta());

            } while (paramCopy.length > 0);

        }

        function createRenderTarget(width, height) {

            width = width || size;
            height = height || width;

            var settings = {

                minFilter: THREE.LinearFilter,
                magFilter: THREE.NearestFilter,
                generateMipmaps: false,
                format: THREE.RGBAFormat,

            };

            return new THREE.WebGLRenderTarget(width, height, settings);

        }

    };

    function FirstPassScene(size, paralell, octaves, properties) {

        var _this = this;

        this.scene = new THREE.Scene();
        this.material = createFirstPassMaterial();
        this.geometry = createFirstPassGeometry();
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.camera = new THREE.OrthographicCamera(0, octaves, 1, 0, 1, 1000);

        this.camera.position.set(0, 0, 10);
        this.mesh.FrustumCulled = false;
        this.scene.add(this.mesh);
        this.scene.add(this.camera);

        this.makePass = makePass;

        function makePass(count, parametersArray, renderTarget) {

            updateAttribute(count, parametersArray);

            this.camera.top = count;
            this.camera.updateProjectionMatrix();

            renderer.render(

                this.scene,
                this.camera,
                renderTarget,
                true

            );

        }

        function createFirstPassMaterial() {

            var materialParameters = {

                attributes: {
                    multiplier: { type: 'f', value: [] },
                    cornerPosition: { type: '3fv', value: [] }
                },
                uniforms: {
                    noiseFrequency: { type: 'f', value: properties.noiseFrequency },
                },
                side: THREE.DoubleSide,
                vertexShader: config.heightmaps.firstPassVert,
                fragmentShader: config.heightmaps.firstPassFrag,

            };

            var material = new THREE.RawShaderMaterial(materialParameters);

            return material;

        }

        function createFirstPassGeometry() {

            var segments = size;
            var noiseMultipliers = properties.noiseMultipliers;
            var verticalCount = paralell;

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


        function updateAttribute(count, parametersArray) {

            var mod = 1 / (2 * size - 2);

            var topVector = new THREE.Vector3();
            var leftVector = new THREE.Vector3();
            var result = new THREE.Vector3();

            var temp1 = new THREE.Vector3();
            var temp2 = new THREE.Vector3();

            for(var row = 0; row < count; row++)
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

    }

    function SecondPassScene(size, octaves, properties) {

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

            uniforms.sourceTexture.value = sourceTex;
            uniforms.verticalCount.value = count;

            for(var i = 0; i < count; i++) {

                uniforms.row.value = i;

                renderer.render(

                    this.scene,
                    this.camera,
                    parametersArray[i].renderTarget,
                    true

                );

            }

        }


        function createSecondPassMaterial() {

            var noiseMultipliers = properties.noiseMultipliers;
            var multipliers = [];

            for(var i = 0; i < noiseMultipliers.length; i++) {
                multipliers.push(noiseMultipliers[i][0]);
            }

            //TODO - move to planetProperties loading.
            var heightmapFrag = properties.heightmapFragment ?
                                properties.heightmapFragment:
                                config.heightmaps.secondPassFrag;

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

    }

});


