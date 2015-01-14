define([], function() {

	function System(sun, planets) {
		this.sun = sun;
		this.planets = planets;
		this.objects = new THREE.Object3D();
		for(var i=0; i<this.planets.length; i++) {
			this.objects.add(this.planets[i]);
		}
		this.update = update;


		function update(camera) {
			for(var i=0; i<this.objects.children.length; i++) {
				this.objects.children[i].update(camera);
			}
		}
	}

	return System;
});
