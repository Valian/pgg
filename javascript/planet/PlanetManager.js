

var PlanetManager = function() {
	this.planets = [];

	var planetGeometry = new THREE.SphereGeometry(10000, 250, 250);
	var resources = new Resources();

	var planetTypes = {
		terran: {
			shader : resources.getShaderMaterial('planet/terran'),
			intUniforms : { planetDetails : 1 }
		},
		desert: {
			shader : resources.getShaderMaterial('planet/desert')
		},
		lava: {
			shader : resources.getShaderMaterial('planet/lava'),
			textures : { surfaceTex: resources.getTexture('gradients/lava.png') },
		},
		ice: {
			shader : resources.getShaderMaterial('planet/ice'),
			textures : { surfaceTex: resources.getTexture('gradients/ice.png') },
			floatUniforms : { surfaceHeight : 300, planetRadius : 10000 }
		},
	}

	var createMaterial = function(data) {
		var key, planetShaderMaterial = data.shader.clone();

		planetShaderMaterial.uniforms = {
			planetSeed: {
				type: 'f',
				value: Math.random()
			}
		};

		for(key in data.floatUniforms) {
			planetShaderMaterial.uniforms[key] = {
				type : 'f',
				value : data.floatUniforms[key]
			};
		}
		
		for(key in data.intUniforms) {
			planetShaderMaterial.uniforms[key] = {
				type : 'i',
				value : data.intUniforms[key]
			};
		}

		for(key in data.textures) {
			planetShaderMaterial.uniforms[key] = {
				type : 't',
				value : data.textures[key]
			};
		}

		return planetShaderMaterial;
	}

	this.createPlanet = function(name) {
		var material = createMaterial(planetTypes[name]);
		var planet = new Planet(planetGeometry, material);

		this.planets.push(planet);
		return planet;
	}
};
