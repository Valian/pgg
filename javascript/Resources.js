

var StaticLoader = function() {
	this.ajaxGet = function(path) {
		var result;
		$.ajax({
			async: false,
			url: path,
			success: function(data) {
				result = data;
			},
		})
		return result;
	};

	this.loadShader = function(name) {
		var shaderDir = '/glsl/' + name;
		return {
			vertexShader: this.ajaxGet(shaderDir + '/vertex'),
			fragmentShader: this.ajaxGet(shaderDir + '/fragment'),
		}
	};
};

var Resources = function() {
	this.staticLoader = new StaticLoader();

	this.getPlanetMaterial = function(name, data) {
		var shaderCode = this.staticLoader.loadShader(name);

		data = data || {};
		data.vertexShader = shaderCode.vertexShader;
		data.fragmentShader = shaderCode.fragmentShader;

		return new PlanetMaterial(data);
	};

	this.getTexture = function(name) {
		return THREE.ImageUtils.loadTexture('textures/' + name);
	};
};
