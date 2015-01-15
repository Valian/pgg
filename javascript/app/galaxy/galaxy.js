define(['galaxy/galaxyBucket'], function(GalaxyBucket) {

	function Galaxy(galaxyData, numberOfBuckets) {
		this.buckets = [];
		for(var i=0; i<numberOfBuckets; i++) {
			var fromValue = i * 360.0 / numberOfBuckets;
			var toValue = (i + 1) * 360.0 / numberOfBuckets;
			this.buckets.push(new GalaxyBucket(fromValue, toValue));
		}
		for(var i=0; i<galaxyData.length; i++) {
			for(var j=0; j<this.buckets.length; j++) {
				if(this.buckets[j].contains(galaxyData[i].angles.theta)) {
					this.buckets[j].data.push(galaxyData[i]);
					break;
				}
			}
		}
	}

	return Galaxy;
});