define(["three", "renderer", "resources", "config"],
       function(THREE, renderer, resources, config) {

    return {

        create: function(size, noiseFrequency, fragmentShaderPath) {

            return new HeightmapGenerator(size, noiseFrequency, fragmentShaderPath);

        },

    };

    function HeightmapGenerator(size, noiseFrequency, fragmentShaderPath) {

        this.size = size;
        this.noiseFrequency = noiseFrequency;
        this.sceneObjects = createRenderScene(fragmentShaderPath);

        this.generateTexture = generateTexture;

        function generateTexture(leftTop, leftBottom, rightTop,  seedVector) {

            var renderTarget = createRenderTarget(this.size);

            this.sceneObjects.mesh.material.uniforms = {

                noiseFrequency: {type: 'f', value: this.noiseFrequency},
                leftTop: {type: '3fv', value: leftTop.toArray()},
                leftBottom: {type: '3fv', value: leftBottom.toArray()},
                rightTop: {type: '3fv', value: rightTop.toArray()},
                seedVector: {type: '3fv', value: seedVector.toArray()},
            }

            this.sceneObjects.mesh.material.needsUpdate = true;
            renderer.render(this.sceneObjects.scene, this.sceneObjects.camera, renderTarget, true);

            return renderTarget;

        };

        function createRenderTarget(size) {

            var settings = {

                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                generateMipmaps: false,
                format: THREE.RGBFormat,

            };

            return new THREE.WebGLRenderTarget(size, size, settings);

        }

        function createRenderScene(fragmentShaderPath) {

            var scene = new THREE.Scene();

            var geometry = createNormalPlaneGeometry();
            var material = resources.getShaderMaterial(config.heightmapGeneratorVertex,
                                                       fragmentShaderPath);
            var mesh = new THREE.Mesh(geometry, material);

            scene.add(mesh);

            var camera = new THREE.OrthographicCamera(0, 1, 0, 1, 1, 1000);
            camera.position.set(0,0, 10);
            scene.add(camera);

            return {scene: scene, camera: camera, mesh: mesh};

        }

        function createNormalPlaneGeometry() {

            var planeGeometry = new THREE.Geometry();

            planeGeometry.vertices.push(new THREE.Vector3(0, 1, 0));
            planeGeometry.vertices.push(new THREE.Vector3(1, 1, 0));
            planeGeometry.vertices.push(new THREE.Vector3(1, 0, 0));
            planeGeometry.vertices.push(new THREE.Vector3(0, 0, 0));

            planeGeometry.faces.push(new THREE.Face3(0, 1, 2));
            planeGeometry.faces.push(new THREE.Face3(0, 2, 3));

            return planeGeometry;

        }

    };

});


