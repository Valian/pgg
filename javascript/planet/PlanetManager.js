

var PlanetManager = function() {
	this.planets = [];

	var planetGeometry = new THREE.SphereGeometry(10000, 250, 250);
	var resources = new Resources();
	var startTime = Date.now();

	var planetTypes = {
		terran: {
			shader : resources.getShaderMaterial('planet/terran'),
			uniforms : {
				i: { planetDetails: 1 },
			},
		},
		desert: {
			shader : resources.getShaderMaterial('planet/desert')
		},
		lava: {
			shader : resources.getShaderMaterial('planet/lava'),
			uniforms : {
				t: { surfaceTex: resources.getTexture('gradients/lava.png') },
			},
		},
		ice: {
			shader : resources.getShaderMaterial('planet/ice'),
			uniforms : {
				t: { surfaceTex: resources.getTexture('gradients/ice.png') },
				f : { surfaceHeight : 300, planetRadius : 10000 }
			},
		},
		sun: {
			shader : resources.getShaderMaterial('planet/sun'),
			uniforms : {
				t: { surfaceTex: resources.getTexture('gradients/lava.png') },
				f : { surfaceHeight : 300, planetRadius : 10000 }
			},
			animatedUniforms : {
				f : { time : function() { return Date.now() - startTime; } }
			},
		},
	}

	var updateAnimatedUniforms = function(material, animatedUniforms) {
		var type, key;

		for(uniformType in animatedUniforms) {
			for(key in animatedUniforms[uniformType]) {
				material.uniforms[key] = {
					type : uniformType,
					value : animatedUniforms[uniformType][key]()
				};
			}
		}
	}

	var createMaterial = function(data) {
		var key, uniformType;
		var planetShaderMaterial = data.shader.clone();

		planetShaderMaterial.uniforms = {
			planetSeed: {
				type: 'f',
				value: Math.random()
			}
		};

		for(uniformType in data.uniforms) {
			for(key in data.uniforms[uniformType]) {
				planetShaderMaterial.uniforms[key] = {
					type : uniformType,
					value : data.uniforms[uniformType][key]
				};
			}
		}

		updateAnimatedUniforms(planetShaderMaterial, data.animatedUniforms);

		return planetShaderMaterial;
	}

	this.createPlanet = function(name) {
		var data = planetTypes[name];
		var material = createMaterial(data);
		var planet = new Planet(planetGeometry, material);

		planet.animatedUniforms = data.animatedUniforms;

		this.planets.push(planet);
		return planet;
	}

	this.update = function() {
		var name;

		for(name in this.planets) {
			var planet = this.planets[name];
			updateAnimatedUniforms(planet.mesh.material,
				planet.animatedUniforms);
		}
	}
};
