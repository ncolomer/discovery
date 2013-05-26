
var esController = {
	url: null,
	isConnected: false,
	"connect": function(host) {
		this.url = 'http://' + host;
		ejs.client = ejs.jQueryClient(this.url);
		ejs.ClusterState().doState(function(result) {
			// on success
			esController.isConnected = true;
			uiController.setConnected(true);
			mapController.setEnabled(true);
			$("select#index").empty();
			for (indice in result.metadata.indices) {
				$("select#index").append('<option value="' + indice + '">' + indice + '</option>');
			}
		}, function() {
			// on error
			esController.isConnected = false;
			uiController.setConnected(false, true);
			mapController.setEnabled(false);
		});
	},
	"search": function(index, types, size, tags, shape) {
		var filters = [];
		// Add shape filter
		var geoShapeFilter = ejs.GeoShapeFilter()
			.field("shape")
			.shape(ejs.Shape(shape.type, shape.coordinates));
		filters.push(geoShapeFilter);
		// Add tag filters if any
		for (key in tags) {
			if (tags[key]) filters.push(ejs.TermFilter("tags." + key, tags[key]));
			else filters.push(ejs.ExistsFilter("tags." + key));
		}
		// Build query
		var andFilter = ejs.AndFilter(filters);		
		var filteredQuery = ejs.FilteredQuery(ejs.MatchAllQuery(), andFilter);
		// Build request
		var request = ejs.Request()
			.indices(index)
			.types(types)
			.size(size)
			.query(filteredQuery);
		console.log(request.toString());
		// Execute request
		request.doSearch(function(result) {
			console.log(result);
			var hits = result.hits.hits;
			var message = "<strong>" + result.hits.hits.length + "</strong> hits " + 
					" in <strong>" + result.took + "</strong> ms";
			$("span#took").html(message).show().delay(500).fadeOut(500);
			mapController.drawResult(hits);
		});

	}
}