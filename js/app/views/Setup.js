define(['dojo/_base/declare',
        'dijit/registry', 
        'dojo/_base/lang', 
        'dojo/on', 
        'dojo/_base/xhr', 
        'app/views/ActivityList', ], function (declare, registry, lang, on, xhr, ActivityList) {
	
	// module:
	//		views/ActivityList
	// summary:
	//		Object encapsulating view and event handlers for displaying list game setup
	return declare('app.views.Setup', null,{
			
        	view: null,
        	
        	constructor: function(view){
        		this.view = view;
        	},
        	
        	setupEventHandlers: function(view){
        		on(registry.byId('startGameBtn').domNode, "click", lang.hitch(this, this.generateActivities));
        	},
        	
        	show: function(){
        		this.view.show();
        	}, 
        	
        	generateActivities: function(formValues){
        		var slideEef = this.view.performTransition("activityListView", 1, "slide");
        		xhr.get({
        			url:"js/dummydata/sampleActivityData.json",
        			handleAs:"json",
        			load: lang.hitch(this, function(data){
                			var activityMobileView = registry.byId('activityListView');
                			viewCache.activityList = new ActivityList(activityMobileView);
                			viewCache.activityList.populateData(data);
        	    			viewCache.activityList.setupEventHandlers(activityMobileView);
        			})
        		});
        	}
    });
});

