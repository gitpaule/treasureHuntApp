define(['dojo/_base/declare',
        'dojo/_base/Deferred',
        'dijit/registry', 
		'dojo/dom',
        'dojo/on',
        'dojo/_base/lang' ], function (declare, Deferred, registry, dom, on, lang) {
	
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

		},

        
		show: function() {
			this.view.show();
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
		}

    });
});

