 function TerrainChunk(size, segments, material, position, rotation, planet) {

     this.parameters = {
         size: size,
         segments: segments,
         material: material,
         position: position,
         rotation: rotation
     }

     this.mesh = new FaceMesh(size, segments, material, position, rotation, planet.planetRadius);

     this.planet = planet;

     this.chunks = [];

     this.visibleByCamera = true;

     this.normal = position.clone().normalize();

     this.isDivided = false;


     this.split = function() {

         if (this.isDivided) return;

         var vert = this.mesh.geometry.attributes.position.array;
         var vLen = vert.length;

         var corners = [
             new THREE.Vector3(vert[0], vert[1], vert[2]),
             new THREE.Vector3(vert[3 * segments], vert[3 * segments + 1], vert[3 * segments + 2]),
             new THREE.Vector3(vert[vLen - 3 * segments - 3], vert[vLen - 3 * segments - 2], vert[vLen - 3 * segments - 1]),
             new THREE.Vector3(vert[vLen - 3], vert[vLen - 2], vert[vLen - 1])
         ];

         for (var key in corners) {
             var newCenter = corners[key].sub(position).divideScalar(2).add(position);
             var chunk = new TerrainChunk(size / 2, segments, material, newCenter, rotation, this.planet);

             this.chunks.push(chunk);
             this.mesh.parent.add(chunk.mesh);
         }

         this.mesh.visible = false;
         this.isDivided = true;

     }

     this.merge = function() {

         if (!this.isDivided) return;

         for (var key in this.chunks) {
             var chunk = this.chunks[key];

             chunk.merge();
             chunk.mesh.dispose();
         }

         this.chunks = [];
         this.mesh.visible = true;
         this.isDivided = false;

     }

     this.refreshVisibility = function() {

         this.mesh.visible = this.visibleByCamera && !this.isDivided;

     }

     this.update = function(camera, maxDetailLevel, actualLevel) {

         var planet = this.mesh.parent;
         var chunkPosition = planet.position.clone().add(this.parameters.position);
         var spherePosition = planet.position.clone().add(this.normal.clone().multiplyScalar(planet.planetRadius));
         var dist = camera.position.distanceTo(spherePosition);
         var desiredLevel = (maxDetailLevel * this.parameters.size - dist) / this.parameters.size;

         actualLevel = actualLevel || 0;

         //backface culling
         this.visibleByCamera = isFrontSideVisible(chunkPosition, this.normal, camera, actualLevel);
         //frustum culling
         this.visibleByCamera = this.visibleByCamera && isInCameraFrustum(camera, this);

         if (desiredLevel > actualLevel && maxDetailLevel > actualLevel && this.visibleByCamera) {

             this.split();

         }

         if (desiredLevel <= actualLevel - 0.5) {

             this.merge();

         }

         for (var i in this.chunks) {
             this.chunks[i].update(camera, maxDetailLevel, actualLevel + 1);
         }

         this.refreshVisibility();

     }

     function isFrontSideVisible(position, normal, camera, actualLevel) {

         var dir = camera.position.clone().sub(position).normalize();
         var dot = normal.dot(dir);

         var tolerance = 0.615 / Math.pow(2, actualLevel);

         var angle1 = Math.acos(dot) + tolerance;
         var angle2 = Math.acos(dot) - tolerance;

         return angle1 < Math.PI / 2 || angle2 < Math.PI / 2;

     }

     function isInCameraFrustum(camera, chunk) {

         if (!chunk.mesh.boundingBox) {

             chunk.mesh.computeBoundingBox(chunk.planet.planetRadius);

         }

         return camera.frustum.intersectsBox(chunk.mesh.boundingBox);

     }

 }
