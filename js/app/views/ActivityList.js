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
        	
        	constructor: function(/*Object*/ args){
        		//mix in mobile view
        	    declare.safeMixin(this, args);
        	},
        	
        	// summary:
			//		Initialise the store 
        	//
        	populateList: function(activityListJson){
        		this.activityRectList = registry.byId('activityList');
        		for ( var idx = 0; idx < activityListJson.length; idx++) {
        			var item = activityListJson[idx];
        			var li = new ListItem({label: item.label});
        			this.activityRectList.addChild(li);
				}
        	}, 
        	
        	show: function(initialLoad){
        		this.view.show(initialLoad);
        	}
    });
});

