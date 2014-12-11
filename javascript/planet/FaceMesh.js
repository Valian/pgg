function FaceMesh(size, segments, material, position, rotation) {

  var geometry = new THREE.PlaneBufferGeometry(size, size, segments, segments);

  rotateGeometry(geometry, rotation);
  moveGeometry(geometry, position);

  THREE.Mesh.call(this, geometry, material);

  this.frustumCulled = false;

  function moveGeometry(geometry, translateVector) {

    var positionAttr = geometry.attributes.position;
    var array = positionAttr.array;

    for(var i = 0; i < array.length; i++) {
      array[i] += translateVector.getComponent(i % 3);
    }

  }

  function rotateGeometry(geometry, rotationVector) {

    var positionAttr = geometry.attributes.position;
    var array = positionAttr.array;
    var vec = new THREE.Vector3();
    var quaternion = new THREE.Quaternion();
    quaternion.setFromEuler(rotationVector);

    for(var i = 0; i < array.length / 3; i++) {
      vec.set(array[3*i], array[3*i+1], array[3*i+2]);
      vec.applyQuaternion(quaternion);

      array[3*i] = vec.x;
      array[3*i + 1] = vec.y;
      array[3*i + 2] = vec.z;
    }

  }
}

FaceMesh.prototype = Object.create( THREE.Mesh.prototype );

FaceMesh.prototype.dispose = function () {
  this.geometry.dispose();
  this.geometry = undefined;

  if(this.parent) {
    this.parent.remove(this);
  }
}
