define([], function() {

	return {
		sphericalToCartesian: function(r, theta, phi) { return sphericalToCartesian(r, theta, phi); }
	};

	function sphericalToCartesian(r, theta, phi) {
		return [r * Math.sin(theta) * Math.cos(phi),
				r * Math.sin(theta) * Math.sin(phi),
				r * Math.cos(theta)]
	}
});