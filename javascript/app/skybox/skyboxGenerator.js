define(['three', 'skybox/starPositionGenerator', 'config', 'resources', 'renderer'],
       function(THREE, StarPositionGenerator, config, resources, renderer) {

    var skyboxConfig = config.config.skybox;

    return SkyboxGenerator;

    function SkyboxGenerator(seed) {

        var that = this;

        this.seed = seed;
        this.boxResolution = skyboxConfig.boxResolution;
        this.textureSize = skyboxConfig.skyboxTextureSize;
        this.starImagePath = skyboxConfig.starTexture;
        this.skyboxSize = skyboxConfig.skyboxSize;
        this.starPositionGenerator = new StarPositionGenerator(this.boxResolution, seed);
        this.starData = null;

        this.skybox = createSkybox();

        var scene = new THREE.Scene();
        var material = createMaterial();
        var geometry = createGeometry();
        this.camera = createCamera(scene);
        this.mesh = createMesh(geometry, material, scene);

        this.generate = generate;

        function generate(middlePos) {

            var uniforms = that.mesh.material.uniforms;
            var dataTex = this.starPositionGenerator.generate(middlePos);
            uniforms.dataTex.value = dataTex;

            var materials = that.skybox.material.materials;
            for(var i = 0; i < materials.length; i++) {

                var renderTarget = materials[i].map;
                that.camera.lookAt(materials[i].direction)
                renderer.render(scene, that.camera, renderTarget, true );

            }

            return that.skybox;

        }

        function createSkybox() {

            var size = that.skyboxSize;
            var skyGeometry = new THREE.BoxGeometry( size, size, size );
            var materialArray = [];
            var directions = [

                new THREE.Vector3( 1,  0,  0),
                new THREE.Vector3(-1,  0,  0),
                new THREE.Vector3( 0,  1,  0),
                new THREE.Vector3( 0, -1,  0),
                new THREE.Vector3( 0,  0,  1),
                new THREE.Vector3( 0,  0, -1)

            ]

            for (var i = 0; i < 6; i++) {

                var material = new THREE.MeshBasicMaterial({

                    map: createRenderTarget(that.textureSize, that.textureSize),
                    side: THREE.BackSide

                });

                material.direction = directions[i];

                materialArray.push( material );

            }

            var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
            var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );

            return skyBox;

        }

        function createMaterial() {

            var vertex = config.skybox.skyboxVertex;
            var fragment = config.skybox.skyboxFragment;
            var attributes = {

                //alpha: { type: 'f', value: [] },
                //starSize: { type: 'f', value: [] }

            };
            var uniforms = {

                imageTex: {

                    type: "t",
                    value: resources.getTexture(that.starImagePath)

                },
                dataTex: { type: 't', value: null },
                size: { type: 'f', value: that.boxResolution }

            };

            return new THREE.ShaderMaterial( {

                uniforms: uniforms,
                attributes: attributes,
                vertexShader: vertex,
                fragmentShader: fragment,
                transparent: true,
                side: THREE.DoubleSide,
                sizeAttenuation: false,

            });

        }

        function createGeometry() {

            return new THREE.PlaneBufferGeometry(

                10,
                that.boxResolution * that.boxResolution / 10,
                that.boxResolution - 1,
                that.boxResolution * that.boxResolution - 1

            );

            //return new THREE.SphereGeometry(20, 50, 50)

        }

        function createMesh(geometry, material, scene) {

            var mesh = new THREE.PointCloud(geometry, material);
            mesh.frustumCulled = false;
            scene.add(mesh);

            return mesh;

        }

        function createCamera(scene) {

            var camera = new THREE.PerspectiveCamera(45, 1, 1, 1000);
            //camera.position.set(0, 0, 0);
            //camera.lookAt(new THREE.Vector3(-100, -100, 100));
            scene.add(camera);

            return camera;

        }

        function createRenderTarget(width, height) {

            var settings = {

                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                generateMipmaps: true,
                format: THREE.RGBAFormat,

            };

            return new THREE.WebGLRenderTarget(width, height, settings);

        }

    }

});
