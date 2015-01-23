define([], function() {

	function Bucket(valueFrom, valueTo, data) {
		this.valueFrom = valueFrom;
		this.valueTo = valueTo;
		this.data = data;
		this.contains = contains;

		function contains(value) {
			return this.valueFrom <= value && value < this.valueTo;
		}
	}

	return Bucket;
});