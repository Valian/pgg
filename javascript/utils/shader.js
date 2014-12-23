

var ShaderUtils = {
	loadCode: function(name) {
		var shaderDir = '/glsl/' + name;
		var code = {
			vertex: AjaxUtils.get(shaderDir + '/vertex'),
			fragment: AjaxUtils.get(shaderDir + '/fragment')
		};
		return code;
	},
	loadMaterial: function(name) {
		var code = ShaderUtils.loadCode(name);
		var material = new THREE.ShaderMaterial({
			vertexShader: code.vertex,
			fragmentShader: code.fragment
		});
		return material;
	}
};
