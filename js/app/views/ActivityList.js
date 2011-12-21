define(['dojo/_base/declare',
        'dijit/registry', 
        'dojo/_base/lang', 
        'dojo/_base/Deferred',
        'dojo/_base/xhr', 
        'dojox/mobile/ListItem', 
        'app/views/TaskList'], function (declare, registry, lang, Deferred, xhr, ListItem, TaskList) {
	
	// module:
	//		views/ActivityList
	// summary:
	//		Object encapsulating view and event handlers for displaying list of activities to complete
	return declare('app.views.ActivityList', null,{
			
        	view: null,
        	activityRectList: null,
        	activityStore: null,
        	
        	constructor: function(){
        		this.view = registry.byId('activityListView');
        	},
        	
        	// summary:
			//		Populate the list of activities
        	//
        	populateData: function(activityListJson){
        		this.activityRectList = registry.byId('activityList');
        		for ( var idx = 0; idx < activityListJson.length; idx++) {
        			var item = activityListJson[idx];
        			
					var li = new ListItem({
						id : item.id,
						label : item.label,
						icon : item.icon,
						clickable : true,
						onClick : lang.hitch(this, function(event) {
							this.view.performTransition("taskListView", 1, "slide");
							if(!viewCache.taskList) {
								viewCache.taskList = new TaskList();
							}
							this.getActivityItemData(event.target.id);
						})
					});
	
	        		this.activityRectList.addChild(li);
				}
        	},
        	
        	// summary:
			//		Get data for activity from server (TODO: maybe cache tasks)
        	//
        	//Description:
        	//		When promise is resolved call the taskList to render the page
        	//
        	getActivityItemData: function(activityId){
        		
				return xhr.get({
						url : "js/dummydata/sampleActivityData.json",
						handleAs : "json",
						load : lang.hitch(this, function(activityData) {
							viewCache.taskList.populateData(activityData);
						}),
						error : function(error) {
							console.error("Error retrieving activity data ", error);
						}
				});
			},

        	// summary:
			//		Show the view
        	//
        	//Description:
        	//		Main calls this function to set the initial view
        	//
        	show: function(){
        		this.view.show(initialLoad);
				this.view.selected = true;
        	}
    });
});

