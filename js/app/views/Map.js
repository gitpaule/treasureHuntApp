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
		tilesloadedPromise: new Deferred(),
        	

		constructor: function() {
			this.view = registry.byId('setupView');
			var mapOptions = {
				zoom : 15,
				center : new google.maps.LatLng(37.20084, -93.28121),
				mapTypeId : google.maps.MapTypeId.ROADMAP,
				sensor : true
			};
			this.map = new google.maps.Map(dom.byId("map_canvas"), mapOptions);

		},

        
		show: function() {
			this.view.show();
		}, 
		
		populateMapData: function(data) {

		}

    });
});

