define(['dojo/_base/declare',
        'dijit/registry', 
        'dojo/_base/lang', 
        'dojo/on', 
        'dojo/_base/xhr', 
        'dojo/dom-form',
        'dojo/_base/event',
        'app/views/ActivityList', ], function (declare, registry, lang, on, xhr, domForm, event, ActivityList) {
	
	// module:
	//		views/ActivityList
	// summary:
	//		Object encapsulating view and event handlers for displaying list game setup
	return declare('app.views.Setup', null,{
			
        	view: null,
        	
        	constructor: function(){
        		this.view = registry.byId('setupView');
        		this._setupEventHandlers();
        	},
        	
        	_setupEventHandlers: function(){
        		registry.byId('startGameBtn').on("Click", lang.hitch(this, this.generateActivities));
        	},
        	
        	show: function(){
        		this.view.show();
				this.view.selected = true;
        	}, 
        	
        	generateActivities: function(evt){
        		
        		this.view.performTransition("activityListView", 1, "slide");
                viewCache.activityList = new ActivityList();
                var formQuery = domForm.toQuery('gameSetupForm');
                viewCache.activityList.getActivitesForNewGame(formQuery);
                
                event.stop(evt);
                return false;
        	}
    });
});

