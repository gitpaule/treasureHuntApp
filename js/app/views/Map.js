define(['dojo/_base/declare',
        'dojo/_base/Deferred',
        'dijit/registry', 
		'dojo/dom',
		'dojo/dom-class',
        'dojo/on',
        'dojo/_base/lang',
        'dojo/window',
        'dojo/query', 
        'app/views/GeoJSON',
        'dojo/dom-construct'
        ], function (declare, Deferred, registry, dom, domClass, on, lang, win, query, GeoJSON, domConstruct) {
	
	// module:
	//		views/Map
	// summary:
	//		Object encapsulating view and map
	return declare('app.views.Map', null,{
			
        view: null,
		map: null,
		currentPage: null,
		previousView: null,
		infowindow: null,
		pageType: null,
		
        	

		constructor: function() {
			this.view = registry.byId('mapView');
			this._setupEventHandlers();
			
			var mapOptions = {
				zoom : 10,
				center : new google.maps.LatLng(53.38250, -6.24916),
				mapTypeId : google.maps.MapTypeId.ROADMAP,
				sensor : true
			};
			this.map = new google.maps.Map(dom.byId("map_canvas"), mapOptions);
			
			this.infowindow = new google.maps.InfoWindow();
			
			
			// dojo.connect(null, (dojo.global.onorientationchange !== undefined && !dojo.isAndroid)
					// ? "onorientationchange" : "onresize", null, this.fixHeight);
		},

        
		show: function(activityStore, pageType, previousView) {
			this.pageType = pageType;
			this.populateData(previousView);
			this.view.show();
	        this.fixHeight(this);
	        
	        if(this.pageType == 'activityList'){
	        	var selLi = query("#dojox_mobile_Heading_3 .mblTabButtonSelected");
	        	domClass.remove(selLi[0], "mblTabButtonSelected");
	        	domClass.add("mapBtn_map", "mblTabButtonSelected");
	        	
				var geoJSON = viewCache.activityList.activityListStore;
				this.displayActivityMarkers(geoJSON);
			}
			else if(this.pageType == 'activityDetail')
			{
				console.error("STUB: Next line needs to tell where geoJSON for displayActivityDetail is coming from.");
				var geoJSON;
				displayActivityDetailMarkers();
			}
			else{
				console.error("No valid pageType set [activityList]");
			}
	        
	        
			//registry.byId('mapView_footer').resize();
		}, 
		
		populateData: function(previousView) {
			if(this.previousView !== previousView){
				this.previousView = previousView
				if(this.btnHandle){
					this.btnHandle.pause();
				}
			}
		},
		
		_setupEventHandlers: function(){
			var listBtn = registry.byId('listBtn_map');
			
			listBtn.on('Click', lang.hitch(this, function (){
				if(!this.pageType || this.pageType == 'activityList'){
	        		var selLi = query("#dojox_mobile_Heading_1 .mblTabButtonSelected");
	        		if(selLi.length){
	        			domClass.remove(selLi[0], "mblTabButtonSelected");
	        		}
		        	domClass.add("activListBtn_actList", "mblTabButtonSelected");
				}
				
			}));
			
			
			
			
			on(window, (dojo.global.orientationchange !== undefined && !dojo.isAndroid)
					? "orientationchange" : "resize", this.fixHeight(this));
		},
		
		fixHeight: function(view)
		{
			//alert('fixHeight');
			//if(view.view._visible == true)
			{
				var vs = win.getBox();
				var mapView = query("#mapView");
				
		        var vs = win.getBox();
		        mapView[0].style.height = (vs.h)+'px';
		        
				var mapCanvas = dom.byId("map_canvas");
				google.maps.event.trigger(mapCanvas, 'resize');
			}
		},
		
		
		displayActivityMarkers: function(geoJSON){
			
			var parser = new GeoJSON(geoJSON);
			var googleMarkers = parser.parse();
			var latlngbounds = new google.maps.LatLngBounds( );
			if (googleMarkers.length){
				for (var i = 0; i < googleMarkers.length; i++){
					googleMarkers[i].setMap(this.map);
					latlngbounds.extend( googleMarkers[i].getPosition() );
					if (googleMarkers[i].geojsonProperties) {
						this.setInfoWindow(googleMarkers[i]);
					}
				}
			}else{
				googleMarkers.setMap(this.map);
				latlngbounds.extend( googleMarkers.getPosition() );
				if (googleMarkers.geojsonProperties) {
					this.setInfoWindow(googleMarkers);
				}
			}
			this.map.fitBounds( latlngbounds );
		},
		
		displayActivityDetailMarkers: function(geoJSON){
			
			var parser = new GeoJSON(geoJSON);
			var googleMarkers = parser.parse();
			var latlngbounds = new google.maps.LatLngBounds( );
			if (googleMarkers.length){
				for (var i = 0; i < googleMarkers.length; i++){
					googleMarkers[i].setMap(this.map);
					latlngbounds.extend( googleMarkers[i].getPosition() );
					if (googleMarkers[i].geojsonProperties) {
						this.setInfoWindow(googleMarkers[i]);
					}
				}
			}else{
				googleMarkers.setMap(this.map);
				latlngbounds.extend( googleMarkers.getPosition() );
				if (googleMarkers.geojsonProperties) {
					this.setInfoWindow(googleMarkers);
				}
			}
			this.map.fitBounds( latlngbounds );
		},
		
		
		setInfoWindow: function  (feature) {
			google.maps.event.addListener(feature, "click", lang.hitch(this, function(feature, event) {
				//var content = "<div id='infoBox'><span id='info_button_"+1+"'>"+this.geojsonProperties.name+"</span></div>";
				var content = domConstruct.create("div", { innerHTML: "<span id='"+feature.id+"'>"+feature.geojsonProperties.name+"</span>" });
				
				//if(this.infowindow == null)this.infowindow = new google.maps.InfoWindow();
				//else 
				//this.infowindow.close();
				
				this.infowindow.setContent(content);
				this.infowindow.position = event.latLng;
				this.infowindow.open(this.map);
				
				on(content, 'span:click', lang.hitch(this, function(event) {
					var i;//for loop iterator
					var itemId = event.target.id;
					this.view.performTransition("activityDetailView", 1, "slide");
					for(i=0; i<viewCache.activityList.activityStore.features.length; i++){
						if(viewCache.activityList.activityStore.features[i].id === itemId){
							lang.hitch(viewCache.activityList, "getActivityItemData", viewCache.activityList.activityStore.features[i])();
							//found it, exit.
							break;
						}
					}
					
				}));
				
			}, feature));
		}
		
		
		
    });
});

