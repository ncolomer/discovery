
$(document).ready(function() {
	uiController.init();
	if (url = getServerUrl()) {
		$("input#url").val(url);
		$("button#connect").click();
	} else {
		uiController.setConnected(false);
	}
});

var uiController = {
	"init": function() {
		$("button#connect").click(function() {
			var url = $("input#url").val();
			url = normalizeUrl(url);
			$("input#url").val(url);
			esController.connect(url);
		});
		$("button#disconnect").click(function() {
			mapController.setEnabled(false);
			uiController.setConnected(false);
			esController.isConnected = false;
		});
		$("button#add-filter").click(function() {
			var template = '<div><input type="text" class="input-small" placeholder="Key"> ' +
					'<input type="text" class="input-small" placeholder="Value"> ' + 
					'<button type="button" class="btn"><i class="icon-minus"></i></button></div>';
			var html = $(template).find("button").click(function() {
				$(this).parent("div").remove();
			}).end();
			$("div#filters").append(html);
		});
		$("button#search").click(function() {
			esController.search({
				index: uiController.getIndex(),
				types: uiController.getTypes(),
				size: uiController.getSize(),
				name: uiController.getName(),
				tags: uiController.getTags(),
				shape: mapController.getFeatureShape()
			});
		});
	},
	"setConnected": function(connected, warning) {
		$("div#control-group").removeClass("warning success");
		$("button#connect").removeClass("btn-warning");
		if (connected) {
			$("input#url").prop('disabled', true);
			$("select#index, button#connect").hide();
			$("select#index, button#disconnect").show();
			$(".btn-group > button").removeClass("disabled");
			$("div#control-group").addClass("success");
		} else {
			$("input#url").prop('disabled', false);
			$("select#index, button#connect").show();
			$("select#index, button#disconnect").hide();
			$(".btn-group > button").addClass("disabled");
		}
		if (warning) {
			$("div#control-group").addClass("warning");
			$("button#connect").addClass("btn-warning");
		}
	},
	"getIndex": function() {
		return $("select#index").val();
	},
	"getTypes": function() {
		var types = [];
		$("input[type='checkbox'][name='types']:checked").each(function() {
			types.push($(this).val());
		});
		return types;
	},
	"getSize": function() {
		var size = $("input#max-results").val();
		if (parseInt(size)) {
			return size;
		} else {
			$("#max-result").val("");
			return 10;
		}
	},
	"getName": function() {
		var name = $("input#name").val();
		return (name !== '') ? name : null;
	},
	"getTags": function() {
		var tags = {};
		$("div#filters > div").each(function() {
			var key = $(this).find("input:first").val();
			var value = $(this).find("input:last").val();
			if (key !== '') {
				tags[key] = (value !== '') ? value : null;
			} else {
				$(this).remove();
			}
		});
		return tags;
	},
	"showTooltip": function(x, y, tags) {
		$("<div id='tooltip'>" + JSON.stringify(tags, undefined, 2) + "</div>").css({
			position: "absolute",
			display: "none",
			"border-radius": "4px",
			top: y + 5,
			left: x + 5,
			border: "1px solid red",
			padding: "2px 5px 2px 5px",
			"background-color": "red",
			"max-width": "300px",
			color: "white",
			opacity: 0.75
		}).appendTo("body").fadeIn(200);
	}
}
