define(['three', 'renderer', 'config'],
       function(THREE, renderer, config){

    Skybox.prototype = Object.create(THREE.Mesh.prototype);

    return Skybox;

    function Skybox(size, resolution) {

        var that = this;

        this.size = size;
        this.resolution = resolution;

        var faces = createFaces();
        var material = createMaterial(faces);
        var camera = new THREE.PerspectiveCamera(90, 1, 100, 500000);
        var geometry = new THREE.BoxGeometry( size, size, size );

        THREE.Mesh.call(this, geometry, material);

        this.render = render;
        this.update = update;

        function update(camera) {

            that.position.copy(camera.position);

        }

        function render(scene) {

            for(var i = 0; i < faces.length; i++) {

                camera.up = faces[i].up;
                camera.lookAt(faces[i].direction);
                renderer.render(scene, camera, faces[i].renderTarget, true);

            }

            that.material.needsUpdate = true;

        }

        function createFaces() {

            var createFace = function(direction, up) {

                return {

                    renderTarget: createRenderTarget(that.resolution, that.resolution),
                    direction: direction,
                    up: up

                };

            };

            var faces = [

                createFace(new THREE.Vector3( 1,  0,  0), new THREE.Vector3(0, 0, 1)),
                createFace(new THREE.Vector3(-1,  0,  0), new THREE.Vector3(0, 0, -1)),
                createFace(new THREE.Vector3( 0,  1,  0), new THREE.Vector3(0, 0, -1)),
                createFace(new THREE.Vector3( 0, -1,  0), new THREE.Vector3(0, 0, 1)),
                createFace(new THREE.Vector3( 0,  0,  1), new THREE.Vector3(0, 1, 0)),
                createFace(new THREE.Vector3( 0,  0, -1), new THREE.Vector3(1, 1, 0))

            ]

            return faces;

        }


        function createMaterial(faces) {

            var materials = [];
            for(var i = 0; i < faces.length; i++) {

                materials.push(new THREE.MeshBasicMaterial({

                    map: faces[i].renderTarget,
                    side: THREE.BackSide

                }));

            }


            return new THREE.MeshFaceMaterial(materials);

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
