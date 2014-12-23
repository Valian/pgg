

var TextureUtils = {
	createRenderTarget: function(width, height) {
		return new THREE.WebGLRenderTarget(width, height,
			{minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat});
	}
};
