define(["three"], function(THREE){

    FaceMesh.prototype = Object.create(THREE.Mesh.prototype);

    FaceMesh.prototype.disposeMesh = disposeMesh;
    FaceMesh.prototype.computeBoundingBox = computeBoundingBox;


    return {

        create: function(size, segments, material, position, rotation, number, planetRadius, surfaceHeight) {

            return new FaceMesh(size, segments, material, position, rotation, number, planetRadius, surfaceHeight);

        }

    };

    function FaceMesh(size, segments, material, position, rotation, number, planetRadius, surfaceHeight) {

        var geometry = new THREE.PlaneBufferGeometry(size, size, segments, segments);

        rotateGeometry(geometry, rotation);
        moveGeometry(geometry, position);
        computeGeometryBoundingBox(geometry, planetRadius, surfaceHeight);

        if(number >= 0) {

            setUV(geometry, number);

        }

        THREE.Mesh.call(this, geometry, material);

        this.boudingBox = null;

        this.frustumCulled = false;

        function moveGeometry(geometry, translateVector) {

            var positionAttr = geometry.attributes.position;
            var array = positionAttr.array;

            for (var i = 0; i < array.length; i++) {

                array[i] += translateVector.getComponent(i % 3);

            }

        }

        function rotateGeometry(geometry, rotationVector) {

            var positionAttr = geometry.attributes.position;
            var array = positionAttr.array;
            var vec = new THREE.Vector3();
            var quaternion = new THREE.Quaternion();
            quaternion.setFromEuler(rotationVector);

            for (var i = 0; i < array.length / 3; i++) {

                vec.set(array[3 * i], array[3 * i + 1], array[3 * i + 2]);
                vec.applyQuaternion(quaternion);

                array[3 * i] = vec.x;
                array[3 * i + 1] = vec.y;
                array[3 * i + 2] = vec.z;

            }

        }

        function computeGeometryBoundingBox(geometry, planetRadius, surfaceHeight) {

            var positions = geometry.attributes.position.array;
            var vector = new THREE.Vector3();

            geometry.boundingBox = new THREE.Box3();

            if (positions) {

                for (var i = 0, il = positions.length * 3; i < il; i += 3) {

                    vector.set(positions[i], positions[i + 1], positions[i + 2]);
                    vector.normalize().multiplyScalar(planetRadius);
                    geometry.boundingBox.expandByPoint(vector);

                    vector.normalize().multiplyScalar(planetRadius + surfaceHeight);
                    geometry.boundingBox.expandByPoint(vector);

                }

            }

        }

        function setUV(geometry, number) {

            //number from 0 to 3, treated as number of part of the chunk
            var uvs = geometry.attributes.uv.array;
            var startingPosition = new THREE.Vector2( number % 2, 1 - Math.floor(number / 2));
            startingPosition.multiplyScalar(0.5);

            for (var i = 0, il = uvs.length; i < il; i += 2) {

                uvs[i] = uvs[i] * 0.5 + startingPosition.x;
                uvs[i + 1] = uvs[i + 1] * 0.5 + startingPosition.y;

            }

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

            this.boundingBox = this.geometry.boundingBox.clone();

        } else {

            this.boundingBox.copy(this.geometry.boundingBox);

        }

        if (this.parent) {

            this.boundingBox.min.add(this.parent.position);
            this.boundingBox.max.add(this.parent.position);

        }

    }

});
