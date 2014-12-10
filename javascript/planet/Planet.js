var Planet = function (material, scale) {

  this.parameters = {
    material : material,
    scale : scale
  }

  //maybe pass in constructor
  this.maxDetailLevel = 6;

  this.object = new THREE.Object3D();

  this.chunks = {
    right : createChunk(this.object, new THREE.Vector3(1, 0, 0), new THREE.Euler(0, 1.570796, 0)),
    left : createChunk(this.object, new THREE.Vector3(-1, 0, 0), new THREE.Euler(0, -1.570796, 0)),
    top : createChunk(this.object, new THREE.Vector3(0, 1, 0), new THREE.Euler(-1.570796, 0, 0)),
    bottom : createChunk(this.object, new THREE.Vector3(0, -1, 0), new THREE.Euler(1.570796, 0, 0)),
    front : createChunk(this.object, new THREE.Vector3(0, 0, 1), new THREE.Euler(0, 0, 0)),
    back : createChunk(this.object, new THREE.Vector3(0, 0, -1), new THREE.Euler(2 * 1.570796, 0, 0)),
  };

  function createChunk(parent, position, rotation) {
    var size = 20000, segments = 10;
    var chunk = new TerrainChunk(scale * size, segments, material, position.multiplyScalar(scale * size / 2), rotation);
    parent.add(chunk.mesh);

    return chunk;
  }

  this.update = function(userPosition) {
    for (key in this.chunks) {
      this.chunks[key].update(userPosition, this.maxDetailLevel);
    }
  }
};
