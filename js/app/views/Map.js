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
			
			on(window, (dojo.global.orientationchange !== undefined && !dojo.isAndroid)
					? "orientationchange" : "resize", this.fixHeight);
					
			// dojo.connect(null, (dojo.global.onorientationchange !== undefined && !dojo.isAndroid)
					// ? "onorientationchange" : "onresize", null, this.fixHeight);
		},

        
		show: function() {
			this.view.show();
	        this.fixHeight();
	        
			registry.byId('mapView_footer').resize();
		}, 
		
		populateData: function(view, data) {
			if(this.previousView !== view){
				this.previousView = view
				if(this.btnHandle){
					this.btnHandle.pause();
				}
				this.btnHandle = this.listBtn.on('Click', lang.hitch(this.previousView, this.previousView.show));
			}
		},
		
		_setupEventHandlers: function(){
			this.listBtn = registry.byId('mapView_listBtn');
		},
		
		fixHeight: function()
		{
			//alert('fixHeight');
			var vs = win.getBox();
			var mapCanvas = dom.byId("map_canvas");
			var mapView = query("#mapView .mblScrollableViewContainer");
			
	        var vs = win.getBox();
	        mapView[0].style.height = (vs.h)+'px';
	        //mapView[0].style.width = (vs.w)+'px';
	        
			google.maps.event.trigger(this.map, 'resize');
		}
    });
});

