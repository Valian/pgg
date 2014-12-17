

function TextureGenerator(renderer) {
	this.renderer = renderer;

	this.createRectangle = function() {
		var rectangle = new THREE.Shape();
		rectangle.moveTo(0, 0);
		rectangle.lineTo(0, 100);
		rectangle.lineTo(100, 100);
		rectangle.lineTo(100, 0);
		rectangle.lineTo(0, 0);
		var rectangleShape = new THREE.ShapeGeometry(rectangle);
	};

	this.generateNoiseTexture = function(width, height) {
		var renderTarget = new THREE.WebGLRenderTarget(width, height,
			{minFilter: TRHEE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.LuminanceFormat})
		var renderCamera = new THREE.PerspectiveCamera(35, window.innerWidth/window.innerHeight, 0.1, 1000000);
		var scene = new THREE.Scene();
	};
};