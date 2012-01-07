define(['dojo/_base/declare',
        'dojo/_base/Deferred',
        'dijit/registry', 
		'dojo/dom',
        'dojo/on',
        'dojo/_base/lang',
        'dojo/window',
        'dojo/query', 
        'app/views/GeoJSON'
        ], function (declare, Deferred, registry, dom, on, lang, win, query, GeoJSON) {
	
	// module:
	//		views/Map
	// summary:
	//		Object encapsulating view and map
	return declare('app.views.Map', null,{
			
        view: null,
		map: null,
		listBtn: null,
		currentPage: null,
		previousView: null,
		
        	

		constructor: function() {
			this.view = registry.byId('mapView');
			this._setupEventHandlers();
			
			var mapOptions = {
				zoom : 15,
				center : new google.maps.LatLng(53.38250, -6.24916),
				mapTypeId : google.maps.MapTypeId.ROADMAP,
				sensor : true
			};
			this.map = new google.maps.Map(dom.byId("map_canvas"), mapOptions);
					
			// dojo.connect(null, (dojo.global.onorientationchange !== undefined && !dojo.isAndroid)
					// ? "onorientationchange" : "onresize", null, this.fixHeight);
		},
		
		displayActivityMarkers: function(){
			
			//var geoJSONStr = localStorage.getItem("game_activities");
			var geoJSON = viewCache.activityList.activityListStore;
			var parser = new GeoJSON(geoJSON);
			var googleMarkers = parser.parse();
			if (googleMarkers.length){
				for (var i = 0; i < googleMarkers.length; i++){
					googleMarkers[i].setMap(this.map);
					if (googleMarkers[i].geojsonProperties) {
						this.setInfoWindow(googleMarkers[i]);
					}
				}
			}else{
				googleMarkers.setMap(this.map);
				if (googleMarkers.geojsonProperties) {
					this.setInfoWindow(googleMarkers);
				}
			}
		},

        
		show: function(activityStore, pageType, previousView) {
			this.populateData(previousView);
			this.view.show();
	        this.fixHeight(this);
	        this.displayActivityMarkers();
			//registry.byId('mapView_footer').resize();
		}, 
		
		populateData: function(previousView) {
			if(this.previousView !== previousView){
				this.previousView = previousView
				if(this.btnHandle){
					this.btnHandle.pause();
				}
			}
			//this.btnHandle = this.listBtn.on('Click', lang.hitch(this.previousView, this.previousView.show));
		},
		
		_setupEventHandlers: function(){
			this.listBtn = registry.byId('mapView_listBtn');
			
			
			on(window, (dojo.global.orientationchange !== undefined && !dojo.isAndroid)
					? "orientationchange" : "resize", this.fixHeight(this));
		},
		
		fixHeight: function(view)
		{
			//alert('fixHeight');
			//if(view.view._visible == true)
			{
				var vs = win.getBox();
				var mapCanvas = dom.byId("map_canvas");
				var mapView = query("#mapView");
				
		        var vs = win.getBox();
		        mapView[0].style.height = (vs.h)+'px';
		        //mapView[0].style.width = (vs.w)+'px';
		        
				google.maps.event.trigger(mapCanvas, 'resize');
			}
		},
		
		clearMap: function (){
			if (!currentFeature_or_Features)
				return;
			if (currentFeature_or_Features.length){
				for (var i = 0; i < currentFeature_or_Features.length; i++){
					currentFeature_or_Features[i].setMap(null);
				}
			}else{
				currentFeature_or_Features.setMap(null);
			}
			if (infowindow.getMap()){
				infowindow.close();
			}
		},
		
		rawGeoJSON: function (){
			clearMap();
			currentFeature_or_Features = new GeoJSON(JSON.parse(document.getElementById("put_geojson_string_here").value));
			if (currentFeature_or_Features.length){
				for (var i = 0; i < currentFeature_or_Features.length; i++){
					currentFeature_or_Features[i].setMap(map);
				}
			}else{
				currentFeature_or_Features.setMap(map);
			}
		},
		
		setInfoWindow: function  (feature) {
			google.maps.event.addListener(feature, "click", function(event) {
				var content = "<div id='infoBox'><strong>GeoJSON Feature Properties</strong><br />";
				for (var j in this.geojsonProperties) {
					content += j + ": " + this.geojsonProperties[j] + "<br />";
				}
				content += "</div>";
				infowindow.setContent(content);
				infowindow.position = event.latLng;
				infowindow.open(map);
			});
		}
		
		
		
    });
});

