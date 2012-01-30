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
        'dojo/dom-construct',
        'dojo/dom-style'
        ], function (declare, Deferred, registry, dom, domClass, on, lang, win, query, GeoJSON, domConstruct, domStyle) {
	
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
		map_overlays:null,
        	

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
			
			this.map_overlays  = {current_map_type: '', 
    							activityList:{},
    							activityDetails:{}
    							};
    		this.map_overlays.activityList.overlay_arr = new Array();
    		this.map_overlays.activityDetails.byID = {};
    		this.map_overlays.activityDetails.current_activity_detail_id = '';
    							
			// dojo.connect(null, (dojo.global.onorientationchange !== undefined && !dojo.isAndroid)
					// ? "onorientationchange" : "onresize", null, this.fixHeight);
		},

        
		show: function(activityStore, pageType, previousView) {
			this.pageType = pageType;
			this.populateData(previousView);
			this.view.show();
	        this.fixHeight(this);
	        
	        
        	var selLi = query("#map_tab_bar .mblTabButtonSelected");
        	domClass.remove(selLi[0], "mblTabButtonSelected");
        	domClass.add("mapBtn_map", "mblTabButtonSelected");
	        
	        if(this.pageType == 'activityList')
	        {
				domStyle.set('map_header_activityList', 'display', 'block');
				domStyle.set('map_header_activityDetail', 'display', 'none');
				
	        	
	        	var cachedActivitiesData = localStorage.getItem("game_activities");
				if(cachedActivitiesData){
					viewCache.activityList.activityListStore = dojo.fromJson(cachedActivitiesData);
				}
	        	
				var geoJSON = viewCache.activityList.activityListStore;
				this.displayActivityMarkers(geoJSON);
				
				
			}
			else if(this.pageType == 'activityDetail')
			{
				domStyle.set('map_header_activityDetail', 'display', 'block');
				domStyle.set('map_header_activityList', 'display', 'none');
				
				this.displayActivityDetailMarkers();
			}
			else{
				console.error("No valid pageType set [activityList, activityDetail]");
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
		        	viewCache.activityList.show();
				}
				else if(this.pageType == 'activityDetail')
				{
					viewCache.activityDetail.show();
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
			
			if(this.map_overlays.current_map_type == 'activityList')
			{
				// do nothing
			}
			else
			{
				this._hideActivityDetailOverlays(this.map_overlays.activityDetails.current_activity_detail_id);
				
				if(this.map_overlays.activityList.overlay_arr.length)
				{
					this._showAllActivityOverlays();
				}
				else
				{
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
						this.map_overlays.activityList.overlay_arr = googleMarkers;
					}
					else
					{
						googleMarkers.setMap(this.map);
						latlngbounds.extend( googleMarkers.getPosition() );
						if (googleMarkers.geojsonProperties) {
							this.setInfoWindow(googleMarkers);
						}
						this.map_overlays.activityList.overlay_arr.push(googleMarkers);
					}
					this.map.fitBounds( latlngbounds );
				}
				this.map_overlays.current_map_type = 'activityList';
			}
		},
		
		displayActivityDetailMarkers: function(){
			
			var activity_detail_id = viewCache.activityDetail.activityData.id;
			
			if(	this.map_overlays.current_map_type == 'activityList')
			{
				this._hideAllActivityOverlays();
			}
			
			if(	this.map_overlays.current_map_type == 'activityDetail' && 
				this.map_overlays.activityDetails.current_activity_detail_id == activity_detail_id)
			{
				// do nothing
			}
			else if(this.map_overlays.activityDetails.byID[activity_detail_id])
			{
				this._showActivityDetailOverlays(activity_detail_id);
			}
			else
			{
				this.map_overlays.activityDetails.byID[activity_detail_id] = {'overlay_arr': new Array()};
				
				var walkW, googleMapStuff, geoJSON; 
				var currentTasks = viewCache.activityDetail.activityData.tasks;
				
				var latlngbounds = new google.maps.LatLngBounds( );
				
				var line_options = {
					"strokeColor": "#CC33FF",
				    "strokeWeight": 7,
				    "strokeOpacity": 0.75
				};
				
				var walk_start_marker_options = {
				    "icon": new google.maps.MarkerImage('/img/map_icons/footprint_start.png')
				};
				
				var walk_end_marker_options = {
				    "icon": new google.maps.MarkerImage('/img/map_icons/footprint_end.png')
				};
				
				var location_marker_options = {
				    "icon": ""
				};
				
				for(var task_key in currentTasks)
				{
					if(currentTasks[task_key].walk)
					{
						geoJSON = {id:currentTasks[task_key].id+'_walkpath', 
									properties:{},
									type: 'Feature',
									geometry:currentTasks[task_key].walk.walkPath};
						walkW = new GeoJSON(geoJSON, line_options);
						googleMapStuff = walkW.parse();
						googleMapStuff.setMap(this.map);
						this.map_overlays.activityDetails.byID[activity_detail_id].overlay_arr.push(googleMapStuff);
						
						geoJSON = {id:currentTasks[task_key].id+'_walkstart', 
									properties:{},
									type: 'Feature',
									geometry:currentTasks[task_key].walk.start.location};
						walkW = new GeoJSON(geoJSON, walk_start_marker_options);
						googleMapStuff = walkW.parse();
						latlngbounds.extend( googleMapStuff.getPosition() );
						googleMapStuff.setMap(this.map);
						this.map_overlays.activityDetails.byID[activity_detail_id].overlay_arr.push(googleMapStuff);
						
						geoJSON = {id:currentTasks[task_key].id+'_walkend', 
									properties:{},
									type: 'Feature',
									geometry:currentTasks[task_key].walk.end.location};
						walkW = new GeoJSON(geoJSON, walk_end_marker_options);
						googleMapStuff = walkW.parse();
						latlngbounds.extend( googleMapStuff.getPosition() );
						googleMapStuff.setMap(this.map);
						this.map_overlays.activityDetails.byID[activity_detail_id].overlay_arr.push(googleMapStuff);
				    }
				    else
				    {
				    	geoJSON = {id:currentTasks[task_key].id+'_location', 
									properties:{},
									type: 'Feature',
									geometry:currentTasks[task_key].location};
						var loc = new GeoJSON(geoJSON, location_marker_options);
						googleMapStuff = loc.parse();
						latlngbounds.extend(googleMapStuff.getPosition());
						googleMapStuff.setMap(this.map);
						this.map_overlays.activityDetails.byID[activity_detail_id].overlay_arr.push(googleMapStuff);
				    }
					
				}	
				this.map.fitBounds( latlngbounds );
				
				if(this.map.getZoom() > 14)
				{
					this.map.setZoom(14);
				}
				
			}
			this.map_overlays.current_map_type = 'activityDetail';
			this.map_overlays.activityDetails.current_activity_detail_id = activity_detail_id;
		},
		
		
		_hideAllActivityOverlays: function()
		{
			if(this.map_overlays.activityList.overlay_arr.length)
			{
				for(var i in this.map_overlays.activityList.overlay_arr)
				{
					this.map_overlays.activityList.overlay_arr[i].setMap(null);
				}
			}
		},
		
		_showAllActivityOverlays: function()
		{
			if(this.map_overlays.activityList.overlay_arr.length)
			{
				var latlngbounds = new google.maps.LatLngBounds( );
				var el;
				for(var i in this.map_overlays.activityList.overlay_arr)
				{
					el = this.map_overlays.activityList.overlay_arr[i];
					el.setMap(this.map);
					latlngbounds.extend( el.getPosition() );
				}
				this.map.fitBounds( latlngbounds );
			}
		},
		
		
		_hideActivityDetailOverlays: function(activity_detail_id)
		{
			if(activity_detail_id != '' && 
			   typeof(this.map_overlays.activityDetails.byID[activity_detail_id]) != 'undefined' &&
			   this.map_overlays.activityDetails.byID[activity_detail_id].overlay_arr.length )
			{
				for(var i in this.map_overlays.activityDetails.byID[activity_detail_id].overlay_arr)
				{
					this.map_overlays.activityDetails.byID[activity_detail_id].overlay_arr[i].setMap(null);
				}
			}
		},
		
		_showActivityDetailOverlays: function(activity_detail_id)
		{
			if(activity_detail_id != '' &&
			   typeof(this.map_overlays.activityDetails.byID[activity_detail_id]) != 'undefined' &&
			   this.map_overlays.activityDetails.byID[activity_detail_id].overlay_arr.length )
			{
				var latlngbounds = new google.maps.LatLngBounds( );
				var el;
				for(var i in this.map_overlays.activityDetails.byID[activity_detail_id].overlay_arr)
				{
					el = this.map_overlays.activityDetails.byID[activity_detail_id].overlay_arr[i];
					el.setMap(this.map);
					if(typeof(el.getPosition)== 'function')latlngbounds.extend( el.getPosition() );
				}
				this.map.fitBounds( latlngbounds );
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

