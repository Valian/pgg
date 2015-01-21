define(['galaxy/bucket'], function(Bucket) {

	function BucketContainer(galaxyData) {
		this.buckets = (function() {
			var buckets = [];
			galaxyData.sort(function(a, b) { return a.theta - b.theta; });
			var numberOfBuckets = 100;
			var lastIndex = 0;
			for(var i=0; i<numberOfBuckets; i++) {
				var valueFrom = i * Math.PI / numberOfBuckets;
				var valueTo = (i + 1) * Math.PI / numberOfBuckets;
				var bucket = new Bucket(valueFrom, valueTo, []);
				for(var j=lastIndex; j<galaxyData.length; j++) {
					if(bucket.contains(galaxyData[j].theta)) {
						bucket.data.push(galaxyData[j].theta);
						lastIndex = j;
					}
					else {
						break;
					}
				}
				buckets.push(bucket);
			}
			return buckets;
		})();
		this.getSystemCoordinates = getSystemCoordinates;

		function getSystemCoordinates(theta, phi) {
			for(var j=0; j<this.buckets.length; j++) {
				if(this.buckets[j].contains(theta)) {
					throw 'jest w ' + j;
				}
			}
			throw 'nie ma';
		}
	}

	return BucketContainer;
});

/*
    var skyboxGenerator = new SkyboxGenerator(12512512);
    var skybox = skyboxGenerator.generate(new THREE.Vector3(0,0,0));
    skybox.data.sort(function(a, b) { return a.phi - b.phi; });
    var buckets = [];
    var numberOfBuckets = 10;
    for(var i=0; i<numberOfBuckets; i++) {
        var bucket = skybox.data.slice(i * skybox.data.length / numberOfBuckets,
            (i + 1) * skybox.data.length / numberOfBuckets);
        bucket.sort(function(a, b) { return a.theta - b.theta; });
        buckets.push(bucket);
    }
*/