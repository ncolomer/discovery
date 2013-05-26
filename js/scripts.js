
$(document).ready(function() {
	// IE console compatibility
	console = (!window.console) ? {} : window.console;
	console.log = (!window.console.log) ? function() {} : window.console.log;
	// Override default Bootstrap dropdown behavior
	$('.dropdown-menu').click(function(e) {
		e.stopPropagation();
	});
	$(document).keypress(function(e){
	    if (e.which == 13 && esController.isConnected) {
	        $("#search").click();
	    }
	});
});

function getServerUrl() {
	if (window.location.href.indexOf("/_plugin/") != -1) {
 		return window.location.host;
    } else return null;
}

function normalizeUrl(url) {
	var regexp = new RegExp("^(http://)?([a-zA-Z0-9\-\.]+)(:([0-9]+))?(.*)$");
	var m = regexp.exec(url);
	if (m) {
		var host = m[2];
		var port = (m[4]) ? m[4] : 9200;
		return host + ":" + port;
	} else return url;
}

function getUrlHash() {
    return window.location.hash.slice(1);
}

function setUrlHash(hash) {
	window.location.hash = '#' + hash;
}

function mapToGeoJsonType(type) {
	var mapper = {
		"point": "Point",
		"linestring": "LineString",
		"polygon": "Polygon"
	}
    return mapper[type];
}
