define(['dojo/_base/declare'], function(declare) {

	return declare('app.views.GeoJSON', null, {
		geojson : null,
		options : null,

		constructor : function(geojson, options) {
			this.geojson = geojson;
			this.options = options || {};
		},
		
		
		
		parse: function() {
			var obj;
			switch ( this.geojson.type ) {

				case "FeatureCollection":
					if(!this.geojson.features) {
						obj = this._error("Invalid GeoJSON object: FeatureCollection object missing \"features\" member.");
					} else {
						obj = [];
						for(var i = 0; i < this.geojson.features.length; i++) {
							obj.push(this._geometryToGoogleMaps(this.geojson.features[i], this.options));
						}
					}
					break;

				case "GeometryCollection":
					if(!this.geojson.geometries) {
						obj = this._error("Invalid GeoJSON object: GeometryCollection object missing \"geometries\" member.");
					} else {
						obj = [];
						for(var i = 0; i < this.geojson.geometries.length; i++) {
							obj.push(this._geometryToGoogleMaps(this.geojson.geometries[i], this.options));
						}
					}
					break;

				case "Feature":
					if(!(this.geojson.properties && this.geojson.geometry )) {
						obj = this._error("Invalid GeoJSON object: Feature object missing \"properties\" or \"geometry\" member.");
					} else {
						obj = this._geometryToGoogleMaps(this.geojson, this.options);
					}
					break;

				case "Point":
				case "MultiPoint":
				case "LineString":
				case "MultiLineString":
				case "Polygon":
				case "MultiPolygon":
					obj = this.geojson.coordinates ? obj = this._geometryToGoogleMaps(this.geojson, this.options) : this._error("Invalid GeoJSON object: Geometry object missing \"coordinates\" member.");
					break;

				default:
					obj = this._error("Invalid GeoJSON object: GeoJSON object must be one of \"Point\", \"LineString\", \"Polygon\", \"MultiPolygon\", \"Feature\", \"FeatureCollection\" or \"GeometryCollection\".");

			}

			return obj;
		},

		_geometryToGoogleMaps : function(geojson, opts) {
			
			var geojsonGeometry = geojson.geometry;
			var geojsonProperties = geojson.properties;
			
			var googleObj;

			switch ( geojsonGeometry.type ) {
				case "Point":
					opts.position = new google.maps.LatLng(geojsonGeometry.coordinates[1], geojsonGeometry.coordinates[0]);
					googleObj = new google.maps.Marker(opts);
					googleObj.set("id", geojson.id);
					if(geojsonProperties) {
						googleObj.set("geojsonProperties", geojsonProperties);
					}
					break;

				case "MultiPoint":
					googleObj = [];
					for(var i = 0; i < geojsonGeometry.coordinates.length; i++) {
						opts.position = new google.maps.LatLng(geojsonGeometry.coordinates[i][1], geojsonGeometry.coordinates[i][0]);
						googleObj.push(new google.maps.Marker(opts));
					}
					if(geojsonProperties) {
						for(var k = 0; k < googleObj.length; k++) {
							googleObj[k].set("geojsonProperties", geojsonProperties);
							googleObj[k].set("id", geojson.id);
						}
					}
					break;

				case "LineString":
					var path = [];
					for(var i = 0; i < geojsonGeometry.coordinates.length; i++) {
						var coord = geojsonGeometry.coordinates[i];
						var ll = new google.maps.LatLng(coord[1], coord[0]);
						path.push(ll);
					}
					opts.path = path;
					googleObj = new google.maps.Polyline(opts);
					if(geojsonProperties) {
						googleObj.set("geojsonProperties", geojsonProperties);
						googleObj.set("id", geojson.id);
						
					}
					break;

				case "MultiLineString":
					googleObj = [];
					for(var i = 0; i < geojsonGeometry.coordinates.length; i++) {
						var path = [];
						for(var j = 0; j < geojsonGeometry.coordinates[i].length; j++) {
							var coord = geojsonGeometry.coordinates[i][j];
							var ll = new google.maps.LatLng(coord[1], coord[0]);
							path.push(ll);
						}
						opts.path = path;
						googleObj.push(new google.maps.Polyline(opts));
					}
					if(geojsonProperties) {
						for(var k = 0; k < googleObj.length; k++) {
							googleObj[k].set("geojsonProperties", geojsonProperties);
							googleObj[k].set("id", geojson.id);
						}
					}
					break;

				case "Polygon":
					var paths = [];
					for(var i = 0; i < geojsonGeometry.coordinates.length; i++) {
						var path = [];
						for(var j = 0; j < geojsonGeometry.coordinates[i].length; j++) {
							var ll = new google.maps.LatLng(geojsonGeometry.coordinates[i][j][1], geojsonGeometry.coordinates[i][j][0]);
							path.push(ll)
						}
						paths.push(path);
					}
					opts.paths = paths;
					googleObj = new google.maps.Polygon(opts);
					if(geojsonProperties) {
						googleObj.set("geojsonProperties", geojsonProperties);
						googleObj.set("id", geojson.id);
					}
					break;

				case "MultiPolygon":
					googleObj = [];
					for(var i = 0; i < geojsonGeometry.coordinates.length; i++) {
						var paths = [];
						for(var j = 0; j < geojsonGeometry.coordinates[i].length; j++) {
							var path = [];
							for(var k = 0; k < geojsonGeometry.coordinates[i][j].length; k++) {
								var ll = new google.maps.LatLng(geojsonGeometry.coordinates[i][j][k][1], geojsonGeometry.coordinates[i][j][k][0]);
								path.push(ll);
							}
							paths.push(path);
						}
						opts.paths = paths;
						googleObj.push(new google.maps.Polygon(opts));
					}
					if(geojsonProperties) {
						for(var k = 0; k < googleObj.length; k++) {
							googleObj[k].set("geojsonProperties", geojsonProperties);
							googleObj[k].set("id", geojson.id);
						}
					}
					break;

				case "GeometryCollection":
					googleObj = [];
					if(!geojsonGeometry.geometries) {
						googleObj = _error("Invalid GeoJSON object: GeometryCollection object missing \"geometries\" member.");
					} else {
						for(var i = 0; i < geojsonGeometry.geometries.length; i++) {
							googleObj.push(_geometryToGoogleMaps(geojsonGeometry.geometries[i], opts, geojsonProperties || null));
						}
					}
					break;

				default:
					googleObj = _error("Invalid GeoJSON object: Geometry object must be one of \"Point\", \"LineString\", \"Polygon\" or \"MultiPolygon\".");
			}

			return googleObj;

		},
		_error : function(message) {
			return {
				type : "Error",
				message : message
			};
		}
	});
});
