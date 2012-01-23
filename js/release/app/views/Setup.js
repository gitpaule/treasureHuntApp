//>>built
define("app/views/Setup", ['dojo/_base/declare',
        'dijit/registry', 
        'dojo/_base/lang', 
        'dojo/on', 
        'dojo/_base/xhr', 
        'dojo/dom-form',
        'dojo/_base/event',
        'dojo/_base/Deferred',
        'app/views/ActivityList',
        'dojox/mobile/ProgressIndicator'], function (declare, registry, lang, on, xhr, domForm, event, Deferred, ActivityList, ProgressIndicator) {
	
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
        		registry.byId('startGameBtn').on("Click", lang.hitch(this, this.startNewGame));
        	},
        	
        	show: function(){
        		this.view.show();
        	}, 
        	
        	startNewGame: function(evt){
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(
								lang.hitch(this, function(position){
									this.currentLocation = position.coords;
									this.generateActivities();
								}));
				} else {
					this.generateActivities();
				}
        	},
        	
        
			generateActivities: function(evt) {
	
				this.view.performTransition("activityListView", 1, "slide");
				
				var loadedPromise =  new Deferred();
				Deferred.when(loadedPromise, function(){
					var prog = ProgressIndicator.getInstance();
					prog.stop();
				});
				//give a chance to transition to view
				setTimeout(lang.hitch(this, function() {
					var listItems = registry.byId("setup_check_list").getChildren();
					var selectedCategories = [];
					for(var i = 0; i < listItems.length; i++) {
						if(listItems[i].checked) {
							selectedCategories.push(listItems[i].id);
						}
					}
					viewCache.activityList = new ActivityList();
					var defer = viewCache.activityList.getActivitesForNewGame(selectedCategories);
					defer.then(function(){
						loadedPromise.resolve();
					});
				}), 150);
				
				return false;
			},

        	
        	destroy_game: function(){
        		localStorage.removeItem("game_activities");
        		// if(viewCache.activityList)
        			// viewCache.activityList = null;
        		viewCache.activityList.removeData();
        	}
    });
});

