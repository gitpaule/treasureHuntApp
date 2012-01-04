define(['dojo/_base/declare',
        'dojo/_base/Deferred',
        'dijit/registry', 
		'dojo/dom',
        'dojo/on',
        'dojo/_base/lang',
        'dojo/window',
        'dojo/query'], function (declare, Deferred, registry, dom, on, lang, win, query) {
	
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

        
		show: function(activityStore, pageType, previousView) {
			this.populateData(previousView);
			this.view.show();
	        this.fixHeight(this);
	        
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
				var mapView = query("#mapView .mblScrollableViewContainer");
				
		        var vs = win.getBox();
		        mapView[0].style.height = (vs.h)+'px';
		        //mapView[0].style.width = (vs.w)+'px';
		        
				google.maps.event.trigger(mapCanvas, 'resize');
			}
		}
    });
});

