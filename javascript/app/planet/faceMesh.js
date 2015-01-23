define(["three", "planet/planeGeometriesContainer"], function(THREE, container){

    FaceMesh.prototype = Object.create(THREE.Mesh.prototype);

    FaceMesh.prototype.disposeMesh = disposeMesh;
    FaceMesh.prototype.computeBoundingBox = computeBoundingBox;

    return FaceMesh;

    function FaceMesh(size, material, position, rotation, number, properties) {

        var segments = properties.chunkSegments;
        var planetRadius = properties.planetRadius;
        var planetSurface = properties.planetSurface;
        var geometry = createGeometry(size, position, rotation, number, properties);

        this.corners = createCorners(geometry);
        this.originalBoundingBox = computeGeometryBoundingBox(this.corners);

        THREE.Mesh.call(this, geometry, material);

        this.frustumCulled = false;

        function createGeometry(size, position, rotation, number, properties) {

            var geometry = new THREE.BufferGeometry();

            var mat = new THREE.Matrix4();
            mat.makeRotationFromEuler(rotation);
            mat.setPosition(position);

            var size_half = size / 2;
            var grid = properties.chunkSegments;
            var grid1 = grid + 1;

            var leftTop = new THREE.Vector3(-size_half, -size_half, 0);
            var rightTop = new THREE.Vector3(size_half, -size_half, 0);
            var leftBottom = new THREE.Vector3(-size_half, size_half, 0);
            var rightBottom = new THREE.Vector3(size_half, size_half, 0);

            leftTop.applyMatrix4(mat);
            rightTop.applyMatrix4(mat);
            leftBottom.applyMatrix4(mat);
            rightBottom.applyMatrix4(mat);

            var segment_diff_x = rightTop.clone().sub(leftTop).divideScalar(grid);
            var segment_diff_y = leftBottom.clone().sub(leftTop).divideScalar(grid);

            var uvRange = 1 - 1 / (2 * grid);
            var uvStartingPosition = new THREE.Vector2((number % 2) * 0.5 - 0.5, (1 - Math.floor(number / 2)) * 0.5 - 0.5);

            var vertices = new Float32Array( grid1 * grid1 * 3 );
            var tangents = new Float32Array( grid1 * grid1 * 3 );
            var uvs = new Float32Array( grid1 * grid1 * 2 );

            var offset = 0;
            var offset2 = 0;

            var actualPos = new THREE.Vector3();
            var helperVec = new THREE.Vector3();

            for ( var iy = 0; iy < grid1; iy ++ ) {

                helperVec.copy(segment_diff_y).multiplyScalar(iy);
                actualPos.copy(leftBottom).sub(helperVec);

                for ( var ix = 0; ix < grid1; ix ++ ) {

                    vertices[ offset     ] = actualPos.x;
                    vertices[ offset + 1 ] = actualPos.y;
                    vertices[ offset + 2 ] = actualPos.z;

                    tangents[ offset + 2 ] = 1;

                    if(number >= 0) {

                        uvs[ offset2     ] = ((ix / grid) * 0.5 + uvStartingPosition.x) * uvRange + 0.5;
                        uvs[ offset2 + 1 ] = ((1 -  iy / grid) * 0.5 + uvStartingPosition.y) * uvRange + 0.5;


                    } else {

                        uvs[ offset2     ] = ix / grid;
                        uvs[ offset2 + 1 ] = 1 - iy / grid;

                    }

                    actualPos.add(segment_diff_x);
                    offset += 3;
                    offset2 += 2;

                }

            }

            offset = 0;

            var indices = new ( ( vertices.length / 3 ) > 65535 ? Uint32Array : Uint16Array )( grid * grid * 6 );

            for ( var iy = 0; iy < grid; iy ++ ) {

                for ( var ix = 0; ix < grid; ix ++ ) {

                    var a = ix + grid1 * iy;
                    var b = ix + grid1 * ( iy + 1 );
                    var c = ( ix + 1 ) + grid1 * ( iy + 1 );
                    var d = ( ix + 1 ) + grid1 * iy;

                    indices[ offset     ] = a;
                    indices[ offset + 1 ] = b;
                    indices[ offset + 2 ] = d;

                    indices[ offset + 3 ] = b;
                    indices[ offset + 4 ] = c;
                    indices[ offset + 5 ] = d;

                    offset += 6;

                }

            }

            geometry.addAttribute( 'index', new THREE.BufferAttribute( indices, 1 ) );
            geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
            geometry.addAttribute( 'tangent', new THREE.BufferAttribute( tangents, 3 ) );
            geometry.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );

            return geometry;

        }

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

            for (var i = 0; i < uvs.length; i += 2) {

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
