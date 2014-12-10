var TerrainChunk = function(size, segments, material, position, rotation) {

  this.parameters = {
    size : size,
    segments : segments,
    material : material,
    position : position,
    rotation : rotation
  }

  this.chunks = [ ];
  this.mesh = new FaceMesh(size, segments, material, position, rotation);


  this.split = function() {
    if(this.isDivided()) return;

    var vert = this.mesh.geometry.attributes.position.array;
    var vLen = vert.length;

    var corners = [
      new THREE.Vector3(vert[0], vert[1], vert[2]),
      new THREE.Vector3(vert[3 * segments], vert[3 * segments + 1], vert[3 * segments + 2]),
      new THREE.Vector3(vert[vLen - 3 * segments - 3], vert[vLen - 3 * segments - 2], vert[vLen - 3 * segments -1]),
      new THREE.Vector3(vert[vLen - 3], vert[vLen - 2], vert[vLen - 1])
    ];

    for (var key in corners) {
      var newCenter = corners[key].sub(position).divideScalar(2).add(position);
      var chunk = new TerrainChunk(size / 2, segments, material, newCenter, rotation);

      this.chunks.push(chunk);
      this.mesh.parent.add(chunk.mesh);
    }

    this.mesh.visible = false;
  }

  this.merge = function() {
    if(!this.isDivided()) return;

    for (var key in this.chunks) {
      var chunk = this.chunks[key];

      chunk.merge();
      chunk.mesh.dispose();
    }

    this.chunks = [];
    this.mesh.visible = true;
  }

  this.isDivided = function() {
    return this.chunks.length > 0;
  }


  this.update = function(userPosition, maxDetailLevel, actualLevel) {
    var chunkPosition = this.mesh.parent.position.clone().add(this.parameters.position);
    var dist = userPosition.distanceTo(chunkPosition);
    var desiredLevel = (maxDetailLevel * this.parameters.size - dist) / this.parameters.size;
    actualLevel = actualLevel || 0;

    if(desiredLevel > actualLevel && maxDetailLevel > actualLevel && !this.isDivided()) {
      console.log('dist: ' + dist + ' size ' + this.parameters.size + "   splitting!");
      this.split();

    }

    if(desiredLevel < actualLevel && this.isDivided()) {
      console.log('dist: ' + dist + ' size ' + this.parameters.size + "   merging!!");
      this.merge();
    }

    for(var i in this.chunks) {
      this.chunks[i].update(userPosition, maxDetailLevel, actualLevel + 1);
    }
  }
}
