define([], function() {

	return {
		sphericalToCartesian: function(r, theta, phi) { return sphericalToCartesian(r, theta, phi); }
	};

	function sphericalToCartesian(r, theta, phi) {
		return {
			x: r * Math.sin(theta) * Math.cos(phi),
			y: r * Math.sin(theta) * Math.sin(phi),
			z: r * Math.cos(theta)
		}
	}
});