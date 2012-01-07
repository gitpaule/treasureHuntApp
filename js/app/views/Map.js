define(['dojo/_base/declare',
        'dojo/_base/Deferred',
        'dijit/registry', 
		'dojo/dom',
        'dojo/on',
        'dojo/_base/lang',
        'dojo/window',
        'dojo/query', 
        'app/views/GeoJSON',
        'dojo/dom-construct'
        ], function (declare, Deferred, registry, dom, on, lang, win, query, GeoJSON, domConstruct) {
	
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
		infowindow: null,
		
        	

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
				
				on(content, 'click', lang.hitch(this, function(event) {
					this.view.performTransition("activityDetailView", 1, "slide");
					if(!viewCache.taskList) {
						viewCache.taskList = new TaskList();
					}
					viewCache.activityList.getActivityItemData(event.target.id);
				}));
				
			}, feature));
		}
		
		
		
    });
});

