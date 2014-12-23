

var AjaxUtils = {
	get: function(path) {
		var result;
		$.ajax({
			async: false,
			url: path,
			success: function(data) {
				result = data;
			},
		})
		return result;
	}
};