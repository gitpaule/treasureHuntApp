define(['dojo/_base/declare',
        'dijit/registry', 
        'dojo/on', 
        'dojo/_base/xhr', 
        'dojox/mobile/ProgressIndicator'], function (declare, registry, on, xhr, ProgressIndicator) {
	
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
        		on(registry.byId('startGameBtn').domNode, "click", this.generateActivities);
        	},
        	
        	show: function(){
        		this.view.show();
        	}, 
        	
        	generateActivities: function(formValues){
        		var prog = ProgressIndicator.getInstance();
				dojo.body().appendChild(prog.domNode);
				prog.start();
        		xhr.get({
        			url:"js/dummydata/sampleActivityData.json",
        			handleAs:"json",
        			load: function(data){
                			activityMobileView = registry.byId('activityListView');
                			viewCache.activityList = new ActivityList(activityMobileView);
                			viewCache.activityList.populateData(data);
        	    			viewCache.activityList.setupEventHandlers(activityMobileView);
        	    			this.performTransition("activityListView", 1, "slide");
        	    			prog.stop();
        			}
        		});
        	}
    });
});

