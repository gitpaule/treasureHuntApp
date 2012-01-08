define(['dojo/_base/declare',
 		'dijit/registry', 
 		'dojo/_base/lang',
  		'dojo/on', 
  		'dojo/_base/Deferred',
  		'dojo/_base/xhr',
  		'dojo/_base/json',
		'dojox/mobile/ListItem',
		'app/views/TaskList', 
		'app/views/Map'], function(declare, registry, lang, on, Deferred, xhr, dojo, ListItem, TaskList, Map) {

	// module:
	//		views/ActivityList
	// summary:
	//		Object encapsulating view and event handlers for displaying list of activities to complete
	return declare('app.views.ActivityList', null, {

		view : null,
		activityRectList : null,
		activityListStore: null,
		activityDetailsStore: null,


		constructor : function() {
			activityDetailsStore = {};
			this.view = registry.byId('activityListView');
			var cachedActivitiesData = localStorage.getItem("game_activities");
			if(cachedActivitiesData){
				this.activityListStore = dojo.fromJson(cachedActivitiesData);
				this._populateData(this.activityListStore);
			}
			this._setupEventHandlers();
		},
		
		
		// summary:
		//		retrieve list of activities based on criteria user entered in game setup
		//
		// gameSetupForm: query string generated from setup form
		getActivitesForNewGame: function(gameSetupForm) {
			
			xhr.get({
				url : "js/dummydata/sampleActivityData.json",
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
			
		},
		
		// summary:
		//		Get data for activity from server (TODO: maybe cache tasks)
		//
		//Description:
		//		When promise is resolved call the taskList to render the page
		//
		getActivityItemData : function(activity) {
			if(viewCache.activityDetailViews && viewCache.activityDetailViews[activity.id]){
				viewCache.activityDetailViews[activity.id].show();
			}
			else{
				if(!viewCache.activityDetailViews){
					viewCache.activityDetailViews = {};
				}
				return xhr.get({
					url : "js/dummydata/tasks.json",
					handleAs : "json",
					load : lang.hitch(this, function(activityData) {
						viewCache.activityDetailViews[activity.id] = new TaskList(registry.byId("activityListView"), 
							{
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
			viewCache.mapView.show(this.activityStore, 'activityListPage', this);
		}
	});
});
