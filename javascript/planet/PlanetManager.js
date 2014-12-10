

var PlanetManager = function() {
	this.planets = [];

	var planetGeometry = new THREE.SphereGeometry(10000, 250, 250);
	var resources = new Resources();

	//do obliczania time uniform
	var startTime = Date.now();

	//slownik trzymajacy dane o dostepnych typach planet
	var planetTypes = {
		terran: {
			shader : resources.getShaderMaterial('planet/terran'),
			uniforms : {
				i: { planetDetails: 1 },
				f: { waterLevel: 0.5, surfaceHeight : 300, planetRadius : 10000  }
			},
		},

		desert: {
			shader : resources.getShaderMaterial('planet/desert')
		},
		lava: {
			shader : resources.getShaderMaterial('planet/lava'),
			uniforms : {
				t: { surfaceTex: resources.getTexture('gradients/lava.png') },
				f : { surfaceHeight : 300, planetRadius : 10000 }
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

		test : {
			shader : resources.getShaderMaterial('planet/test', { wireframe: true }),
			uniforms : {
				f: { planetRadius : 10000 }
			},
		}
	}

	//metoda odswiezajaca uniformy oparte na funkcjach
	var updateAnimatedUniforms = function(material, animatedUniforms) {
		var type, key;

		for(uniformType in animatedUniforms) {
			for(key in animatedUniforms[uniformType]) {

				if(!material.uniforms[key]) {
						material.uniforms[key] = {
						type : uniformType
					};
				}

				material.uniforms[key].value = animatedUniforms[uniformType][key]();
				console.log(animatedUniforms[uniformType][key]());
			}
		}
	}

	//tworzy material na podstawie danych.
	//kopiuje material zawierajacy shadery oraz zapelnia ich uniformy.
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

	//tworzy planete wybranego typu.
	//Dostepne typy sa zawarte w obiekcie planetTypes
	this.createPlanet = function(name) {
		var data = planetTypes[name];
		var material = createMaterial(data);
		//var material = new THREE.MeshBasicMaterial({wireframe: true});
		var planet = new Planet(material, 1);

		planet.animatedUniforms = data.animatedUniforms;

		this.planets.push(planet);
		return planet;
	}

	//odswieza planety
	this.update = function(userPosition) {
		var name;

		for(name in this.planets) {
			var planet = this.planets[name];
			updateAnimatedUniforms(planet.object.material,
				planet.animatedUniforms);

			planet.update(userPosition);
		}
	}
};
