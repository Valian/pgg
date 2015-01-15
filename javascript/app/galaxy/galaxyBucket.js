define([], function() {

	function GalaxyBucket(valueFrom, valueTo) {
		this.valueFrom = valueFrom;
		this.valueTo = valueTo;
		this.data = [];
		this.contains = contains;

		function contains(value) {
			return this.valueFrom <= value && value < this.valueTo;
		}
	}

	return GalaxyBucket;
});
