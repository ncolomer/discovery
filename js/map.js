
$(document).ready(function() {
	// Initialize Leaflet map
	mapController.init("map-canvas");
	mapController.setEnabled(false);
});

var mapController = {
	map: null,
	drawnFeature: null,
	resultFeatures: null,
	"init": function(target) {
		var map = L.map(target, {
			center: [0, 0],
			zoom: 1,
			maxBounds: [[-90, -360],[90, 360]]
		});
		L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png", {
			subdomains: ["otile1","otile2","otile3","otile4"],
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);
		// Set objects
		this.map = map;
		this.maskLayer = L.rectangle([[-90, -360], [90, 360]], {
			fillColor: "#fff", 
			fillOpacity: 0.5, 
			weight: 0
		}).addTo(map);
		this.resultFeatures = new L.FeatureGroup().addTo(map);
		// Add control
		var drawLayer = new L.FeatureGroup().addTo(map);
		var drawControl = new L.Control.Draw({
			draw: {
				polyline: false,
				marker: false,
				polygon: {allowIntersection: false, shapeOptions: {
					weight: 2, color: "#888", opacity: 0.5, fillColor: "#ccc", fillOpacity: 0.1
				}},
				rectangle: {shapeOptions: {
					weight: 2, color: "#888", opacity: 0.5, fillColor: "#ccc", fillOpacity: 0.1
				}},
				circle: false
			},
			edit: {
				featureGroup: drawLayer
			}
		});
		map.addControl(drawControl);
		// Add listeners
		map.on('draw:drawstart', function (e) {
			drawLayer.clearLayers();
			mapController.drawnFeature = null;
		});
		map.on('draw:created', function (e) {
			mapController.drawnFeature = e;
		    drawLayer.addLayer(e.layer);
		});
		map.on('draw:deleted', function (e) {
			drawLayer.clearLayers();
			mapController.drawnFeature = null;
		});
		map.on("click", function(event) {
			var latLng = event.latlng;
			console.log("Map clicked:", JSON.stringify(latLng));
		});
		map.on("moveend", function(event) {
			var bounds = mapController.getBounds();
			console.log("Map bounds changed:", JSON.stringify(bounds));
		});
	},
	"setEnabled": function(enabled) {
		if (enabled) this.map.removeLayer(this.maskLayer);
		else this.map.addLayer(this.maskLayer);
	},
	"getBounds": function() {
		var bounds = this.map.getBounds();
		return {
			"southLat": bounds.getSouthWest().lat,
			"northLat": bounds.getNorthEast().lat,
			"westLng": bounds.getSouthWest().lng,
			"eastLng": bounds.getNorthEast().lng
		};
	},
	"getFeatureShape": function() {
		if (this.drawnFeature) {
			var type = this.drawnFeature.layerType;
			var layer = this.drawnFeature.layer;
			switch (type) {
				case 'polygon':
					var latLngs = layer.getLatLngs() // LatLng[]
					var outer = [];
					for (var i = 0; i < latLngs.length; i++) {
						outer.push([latLngs[i].lng, latLngs[i].lat]);
					}
					// Close the Polygon
					outer.push([latLngs[0].lng, latLngs[0].lat]);
					return {
						"type": "polygon",
						"coordinates": [outer]
					};
				case 'rectangle':
					var latLngs = layer.getLatLngs() // LatLng[]
					return {
						"type": "envelope",
						"coordinates": [
							[latLngs[1].lng, latLngs[1].lat],
							[latLngs[3].lng, latLngs[3].lat]
						]
					};
				case 'circle':
					var center = layer.getLatLng(); // LatLng
					var radius = layer.getRadius(); // Radius in meter
					console.log('circle', center, radius);
					// do nothing yet
					break;
			}
		} else { // Fallback, get map bounds
			var bounds = mapController.getBounds();
			return {
				"type": "envelope",
				"coordinates": [
					[bounds.westLng, bounds.northLat],
					[bounds.eastLng, bounds.southLat]
				]
			};
		}
	},
	"drawResult": function(hits) {
		var features = [];
		for (var i = 0; i < hits.length; i++) {
			var hit = hits[i];
			var id = hit._id;
			var type = hit._type;
			var source = hit._source;
			// Bug see elasticsearch-osmosis-plugin/issues/10
			source.shape.type = mapToGeoJsonType(source.shape.type);
			features.push({
				"type": "Feature",
				"geometry": source.shape,
				"properties": {
					"id": id,
					"type": type,
					"tags": source.tags
				}
			});
		}
		// Build collection
		var featureCollection = {
			"type": "FeatureCollection",
			"features": features
		}
		// Add layer
		this.map.removeLayer(this.resultFeatures);
		this.resultFeatures = L.geoJson(featureCollection, {
			style: function(feature) {
				return {
					color: "#f00"
					//weight: 1, color: "#f00", opacity: 0.8, fillOpacity: 0.4
				};
			},
			pointToLayer: function(featureData, latlng) {
				return new L.CircleMarker(latlng, {
					radius: 4, weight: 2, color: "#f00", opacity: 0.8, fillOpacity: 0.8 
				});
			},
			onEachFeature: function(feature, layer) {
				layer.on('click', function(e) {
					// Do nothing yet
				}).on('mouseover', function(e) {
					uiController.showTooltip(e.originalEvent.clientX, e.originalEvent.clientY, feature.properties);
				}).on('mouseout', function(event) {
					$("#tooltip").remove();
				});
			}
		}).addTo(this.map);
	}
};
