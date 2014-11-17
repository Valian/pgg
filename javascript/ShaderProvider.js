

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


var ShaderProvider = function() {
	this.staticLoader = new StaticLoader();

	this.getShaderMaterial = function(name) {
		var shaderCode = this.staticLoader.loadShader(name);
		return new THREE.ShaderMaterial({
			vertexShader: shaderCode.vertexShader,
			fragmentShader: shaderCode.fragmentShader
		});
	};
};