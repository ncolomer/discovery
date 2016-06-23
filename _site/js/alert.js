
function showAlert(title, message, type) {
	$("<div id='tooltip'>" + contents + "</div>").css({
		position: "absolute",
		display: "none",
		"border-radius": "4px",
		top: y + 5,
		left: x + 5,
		border: "1px solid " + color,
		padding: "2px 5px 2px 5px",
		"background-color": color,
		color: "white",
		opacity: 0.75
	}).appendTo("body").fadeIn(200);
}

function getAlertStyle(type) {
	switch (type) {
		case "success":
		return "alert-success";
		case "warning":
		return "alert-block";
		case "error":
		return "alert-success";
		case "info":
		default:
		return "alert-info";
	}
}