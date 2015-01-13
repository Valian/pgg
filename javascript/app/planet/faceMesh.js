define(["three", "planet/planeGeometriesContainer"], function(THREE, container){

    FaceMesh.prototype = Object.create(THREE.Mesh.prototype);

    FaceMesh.prototype.disposeMesh = disposeMesh;
    FaceMesh.prototype.computeBoundingBox = computeBoundingBox;


    return FaceMesh;

    function FaceMesh(size, material, position, rotation, number, properties) {

        var segments = properties.chunkSegments;
        var planetRadius = properties.planetRadius;
        var planetSurface = properties.planetSurface;
        var geometry = container.getPlaneGeometry(size, segments);

        moveGeometry(geometry);

        this.corners = createCorners(geometry);
        this.originalBoundingBox = computeGeometryBoundingBox(this.corners);

        setUV(geometry);

        THREE.Mesh.call(this, geometry, material);

        this.frustumCulled = false;

        function moveGeometry(geometry) {

            var mat = new THREE.Matrix4();
            mat.makeRotationFromEuler(rotation);
            mat.setPosition(position);

            var vec = new THREE.Vector3();

            var attr = geometry.attributes.position;
            var len = attr.length;

            for (var i = 0; i < len / 3; i++) {

                vec.set(

                    attr.array[3 * i],
                    attr.array[3 * i + 1],
                    attr.array[3 * i + 2]

                );

                vec.applyMatrix4(mat);

                attr.setXYZ(i, vec.x, vec.y, vec.z);

            }

        }

        function computeGeometryBoundingBox(corners) {

            var vector = new THREE.Vector3();
            var box = new THREE.Box3();

            for (var i = 0; i < corners.length; i += 1) {

                vector.copy(corners[i]);
                vector.normalize().multiplyScalar(planetRadius);
                box.expandByPoint(vector);

                vector.multiplyScalar((planetRadius + planetSurface) / planetRadius);
                box.expandByPoint(vector);

            }

            return box;

        }


        function setUV(geometry) {

            if(number < 0 ) return;

            //number from 0 to 3, treated as number of part of the chunk
            var uvs = geometry.attributes.uv.array;
            var translation = new THREE.Vector3(0.5, 0.5);
            var startingPosition = new THREE.Vector2(number % 2, 1 - Math.floor(number / 2));
            startingPosition.multiplyScalar(0.5).sub(translation);

            var range = 1 - 1 / (2 * segments);
            var vec = new THREE.Vector2();

            for (var i = 0, il = uvs.length; i < il; i += 2) {

                vec.set(uvs[i] * 0.5, uvs[i + 1] * 0.5);
                vec.add(startingPosition).multiplyScalar(range).add(translation);

                uvs[i] = vec.x;
                uvs[i + 1] = vec.y;

            }

        }


        function createCorners(geometry) {

            var vert = geometry.attributes.position.array;
            var vLen = vert.length;

            return [

                new THREE.Vector3(vert[0], vert[1], vert[2]),
                new THREE.Vector3(vert[3 * segments], vert[3 * segments + 1], vert[3 * segments + 2]),
                new THREE.Vector3(vert[vLen - 3 * segments - 3], vert[vLen - 3 * segments - 2], vert[vLen - 3 * segments - 1]),
                new THREE.Vector3(vert[vLen - 3], vert[vLen - 2], vert[vLen - 1]),

            ];

        }

    }

    function disposeMesh() {

        if (this.parent) {

            this.parent.remove(this);

        }

        this.geometry.dispose();
        this.material.dispose();

    }

    function computeBoundingBox() {

        if (!this.boundingBox) {

            this.boundingBox = this.originalBoundingBox.clone();

        } else {

            this.boundingBox.copy(this.originalBoundingBox);

        }

        if (this.parent) {

            this.boundingBox.min.add(this.parent.position);
            this.boundingBox.max.add(this.parent.position);

        }

    }

});
