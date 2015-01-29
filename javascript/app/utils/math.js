define(['three'], function(THREE) {

    return {

        sphericalToCartesian: sphericalToCartesian,
        cartesianToSpherical: cartesianToSpherical

    };

	function sphericalToCartesian(r, theta, phi) {

		var x = r * Math.sin(theta) * Math.cos(phi);
		var y = r * Math.sin(theta) * Math.sin(phi);
		var z = r * Math.cos(theta);

		return new THREE.Vector3(x,y,z);

	}

	function cartesianToSpherical(x, y, z) {

		var r = Math.sqrt(x*x + y*y + z*z)
		var theta = Math.acos(z / r);
		var phi = Math.atan(y / x);

		return {

            r: r,
            theta: theta,
            phi: phi

        }
	}

});
