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

        moveGeometry(geometry);

        this.corners = createCorners(geometry);
        this.originalBoundingBox = computeGeometryBoundingBox(this.corners);

        setUV(geometry, number);

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

                //array[i] += translateVector.getComponent(i % 3);
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

                vector.multiplyScalar((planetRadius + surfaceHeight) / planetRadius);
                box.expandByPoint(vector);

            }

            return box;

        }

        function setUV(geometry, number) {

            if(number < 0 ) return;

            //number from 0 to 3, treated as number of part of the chunk
            var uvs = geometry.attributes.uv.array;
            var startingPosition = new THREE.Vector2(number % 2, 1 - Math.floor(number / 2));
            startingPosition.multiplyScalar(0.5);

            for (var i = 0, il = uvs.length; i < il; i += 2) {

                uvs[i] = uvs[i] * 0.5 + startingPosition.x;
                uvs[i + 1] = uvs[i + 1] * 0.5 + startingPosition.y;

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
