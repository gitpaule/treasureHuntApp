define(['dojo/_base/declare',
        'dijit/registry', 
        'dojox/mobile/ListItem'], function (declare, registry, ListItem) {
	
	// module:
	//		views/ActivityList
	// summary:
	//		Object encapsulating view and event handlers for displaying list of activities to complete
	return declare('app.views.ActivityList', null,{
			
        	view: null,
        	activityRectList: null,
        	activityStore: null,
        	
        	constructor: function(view){
        		this.view = view;
        	},
        	
        	// summary:
			//		Initialise the store 
        	//
        	populateData: function(activityListJson){
        		this.activityRectList = registry.byId('activityList');
        		for ( var idx = 0; idx < activityListJson.length; idx++) {
        			var item = activityListJson[idx];
        			var li = new ListItem({label: item.label});
        			this.activityRectList.addChild(li);
				}
        	}, 
        	
        	setupEventHandlers: function(view){
        		
        	},
        	
        	show: function(initialLoad){
        		this.view.show(initialLoad);
        	}
    });
});

