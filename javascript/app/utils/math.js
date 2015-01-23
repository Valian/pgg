define([], function() {

	function sphericalToCartesian(r, theta, phi) {
		var x = r * Math.sin(theta) * Math.cos(phi);
		var y = r * Math.sin(theta) * Math.sin(phi);
		var z = r * Math.cos(theta);
		return [x, y, z];
	}

	function cartesianToSpherical(x, y, z) {
		var r = Math.sqrt(x*x + y*y + z*z)
		var theta = Math.acos(z / r);
		var phi = Math.atan(y / x);
		return [r, theta, phi]
	}

	return {
		sphericalToCartesian: sphericalToCartesian,
		cartesianToSpherical: cartesianToSpherical
	};
});