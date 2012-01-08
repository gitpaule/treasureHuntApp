define(['dojo/_base/declare',
 		'dijit/registry', 
 		'dojo/_base/lang',
  		'dojo/on', 
  		'dojo/_base/Deferred',
  		'dojo/_base/xhr',
  		'dojo/_base/json',
		'dojox/mobile/ListItem',
		'app/views/TaskList', 
		'app/views/Map',
		'dojo/dom'], function(declare, registry, lang, on, Deferred, xhr, dojo, ListItem, TaskList, Map, dom) {

	// module:
	//		views/ActivityList
	// summary:
	//		Object encapsulating view and event handlers for displaying list of activities to complete
	return declare('app.views.ActivityList', null, {

		view : null,
		activityRectList : null,
		activityListStore: null,


		constructor : function() {
			this.view = registry.byId('activityListView');
			var cachedActivitiesData = localStorage.getItem("game_activities");
			if(cachedActivitiesData){
				this.activityListStore = dojo.fromJson(cachedActivitiesData);
				this._populateData(this.activityListStore);
			}
			this._setupEventHandlers();
			
			//Unsafe, but I'm tired: if itemsViewed is 0 or unset, reset all the below fields... it means the user hasn't done anything.
			if(!localStorage.getItem("itemsViewed")){
				localStorage.setItem("itemsFinished", "0");
				localStorage.setItem("itemsViewed", "0");
				localStorage.setItem("pointsAccumulated", "0");
				
			}
			
			on(dom.byId("ScoreButtonInActivityListView"), "click", function(){
				dom.byId("scoreViewAmountViewed").innerHTML = localStorage.getItem("itemsViewed");
				dom.byId("scoreViewAmountDone").innerHTML = localStorage.getItem("itemsFinished");
			});
			on(dom.byId("ScoreButtonInActivityListView"), "click", lang.hitch(this,function(){
				dom.byId("scoreViewScoreSpan").innerHTML = localStorage.getItem("pointsAccumulated");
			}));
			
		},
		
		
		// summary:
		//		retrieve list of activities based on criteria user entered in game setup
		//
		// gameSetupForm: query string generated from setup form
		getActivitesForNewGame: function(gameSetupForm) {
			
			xhr.get({
				url : "/js/dummydata/sampleActivityData.json",
				handleAs : "json",
				load : lang.hitch(this, function(data) {
					this._populateData(data);
					localStorage.setItem("game_activities", dojo.toJson(data));
				})
			});
		},

		
		// summary:
		//		Populate the list of activities in the view
		//
		_populateData : function(activityListJson) {
			this.activityRectList = registry.byId('activityList');
			this.activityStore = activityListJson;
			for(var idx = 0; idx < activityListJson.features.length; idx++) {
				var item = activityListJson.features[idx];

				var li = new ListItem({
					id : item.id,
					label : item.properties.name,
					icon : 'img/h/tower_clear-.png',
					clickable : true,
					onClick : lang.hitch(this, function(itemId, event) {
						var i;//for loop iterator
						this.view.performTransition("activityDetailView", 1, "slide");
						for(i=0; i<this.activityStore.features.length; i++){
							if(this.activityStore.features[i].id === itemId){
								this.getActivityItemData(this.activityStore.features[i]);
								//found it, exit.
								break;
							}
						}
					},
					item.id)
				});

				this.activityRectList.addChild(li);
			}
		},
		
				// summary:
		//		Reverses PopulateData above by removing the list items
		//
		removeData : function() {
			this.activityRectList.destroyDescendants();
			this.activityStore = null;
			localStorage.removeItem("itemsFinished");
			localStorage.removeItem("itemsViewed");
			localStorage.removeItem("pointsAccumulated");
		},
		
		// summary:
		//		Get data for activity from server (TODO: maybe cache tasks)
		//
		//Description:
		//		When promise is resolved call the taskList to render the page
		//
		getActivityItemData : function(activity) {
			//it's in memory, no need to do anything
			if(viewCache.activityDetailViews && viewCache.activityDetailViews[activity.id]){
				viewCache.activityDetailViews[activity.id].show();
			}
			else{
				if(!viewCache.activityDetailViews){
					viewCache.activityDetailViews = {};
				}
				var activityInLocalStorageJson = localStorage.getItem("activityDetails_"+activity.id);
				if(activityInLocalStorageJson){
					var activityInLocalStorage = dojo.fromJson(activityInLocalStorageJson);
					viewCache.activityDetailViews[activity.id] = new TaskList(registry.byId("activityListView"), 
							{
								id: activity.id,
								title : activity.properties.name,
								imgSource : activity.properties.img,
								tasks : activityInLocalStorage.tasks
							}
						);
						viewCache.activityDetailViews[activity.id].show();
						return null;
				}
				
				return xhr.get({
					url : "js/dummydata/tasks_"+activity.id+".json",
					handleAs : "json",
					load : lang.hitch(this, function(activityData) {
						viewCache.activityDetailViews[activity.id] = new TaskList(registry.byId("activityListView"), 
							{
								id : activity.id,
								title : activity.properties.name,
								imgSource : activity.properties.img,
								tasks : activityData
							}
						);
						viewCache.activityDetailViews[activity.id].show();
					}),
					error : function(error) {
						console.error("Error retrieving activity data ", error);
					}
				});
			}
		},
		
		// summary:
		//		Show the view
		//
		//Description:
		//		Main calls this function to set the initial view
		//
		show : function() {
			this.view.show();
			registry.byId('dojox_mobile_Heading_3').resize();
			
		},
		
		_setupEventHandlers : function(view) {
			var listBtn = registry.byId('activListBtn_actList');
			var listBtn_map = registry.byId('listBtn_map');
			var mapBtn = registry.byId('activMapBtn_actList');
			if(!viewCache.mapView) {
				viewCache.mapView = new Map();
			}
			listBtn.on('Click', lang.hitch(this, this.show));
			listBtn_map.on('Click', lang.hitch(this, this.show));
			mapBtn.on('Click', lang.hitch(this, this._showMapView));
			
			
			var header = registry.byId('activityListHeading');
			on(header.backBtnNode, "click", function(){
				
				viewCache.setup.destroy_game();
				
			});
		},
		
		// summary:
		//		Show the map view on the Activity List page
		//
		//
		_showMapView : function() {
			viewCache.mapView.show(this.activityStore, 'activityList', this);
		}
	});
});
