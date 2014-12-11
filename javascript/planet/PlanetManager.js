function PlanetManager() {

	this.container = new THREE.Object3D();

	this.planets = [];

	this.defaultPlanetRadius = 10000;
	this.defaultSurfaceHeight = 300;

	var resources = new Resources();

	//slownik trzymajacy dane o dostepnych typach planet
	var planetTypes = {
		terran: {
			material : resources.getPlanetMaterial('planet/terran'),
			defines : {
				planetDetails: 1,
				waterLevel: 0.5
			},
		},
		desert: {
			material : resources.getPlanetMaterial('planet/desert')
		},
		lava: {
			material : resources.getPlanetMaterial('planet/lava'),
			uniforms : {
				t: { surfaceTex: resources.getTexture('gradients/lava.png') },
			},
		},
		ice: {
			material : resources.getPlanetMaterial('planet/ice'),
			uniforms : {
				t: { surfaceTex: resources.getTexture('gradients/ice.png') },
			},
		},
		sun: {
			material : resources.getPlanetMaterial('planet/sun', { updateTime: true }),
			uniforms : {
				t: { surfaceTex: resources.getTexture('gradients/lava.png') },
			},
		},
		test : {
			material : resources.getPlanetMaterial('planet/test', { wireframe: true }),
		}
	}

	//tworzy material na podstawie danych.
	//kopiuje material zawierajacy shadery oraz zapelnia ich uniformy.
	var createMaterial = function(data, planetRadius, surfaceHeight) {

		var key, uniformType;
		var planetShaderMaterial = data.material.clone();

		for(uniformType in data.uniforms)
			for(key in data.uniforms[uniformType])
				planetShaderMaterial.setUniform(key, data.uniforms[uniformType][key], uniformType);

		for(key in data.defines)
			planetShaderMaterial.defines[key] = data.defines[key];

		planetShaderMaterial.defines['SEED'] = Math.random().toFixed(4);//Math.floor(Math.random() * 2000000000);
		planetShaderMaterial.defines['RADIUS'] = planetRadius.toFixed(1);
		planetShaderMaterial.defines['SURFACE'] = surfaceHeight.toFixed(1);

		return planetShaderMaterial;

	}

	//tworzy planete wybranego typu.
	//Dostepne typy sa zawarte w obiekcie planetTypes
	this.createPlanet = function(name, planetRadius, surfaceHeight) {

		var material, planet;

		planetRadius = planetRadius || this.defaultPlanetRadius;
		surfaceHeight = surfaceHeight || this.defaultSurfaceHeight;
		material = createMaterial(planetTypes[name], planetRadius, surfaceHeight);
		//material = new THREE.MeshBasicMaterial({ wireframe : true });
		planet = new Planet(material, planetRadius, surfaceHeight);

		this.planets.push(planet);
		this.container.add(planet);

		return planet;

	}

	function calculateCameraFrustum(camera) {

		var matrix = new THREE.Matrix4();
		var frustum = new THREE.Frustum();

		matrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );

		return frustum.setFromMatrix(matrix);

	}

	//odswieza planety
	this.update = function(camera) {

		camera.frustum = calculateCameraFrustum(camera);

		for(var name in this.planets) {

			var planet = this.planets[name];
			planet.update(camera);

		}

	}

};
