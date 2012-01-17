define([ 'dojo/_base/Deferred',
         'dojo/_base/lang', 
         'dojo/_base/json',
         'dojo/dom',
         'dijit/registry',
         'dojo/on',
         'app/views/ActivityList',
         'app/views/Setup',
         'app/views/TaskList',
         'app/views/Map',
         'dojox/mobile/parser',
         'dojox/mobile/View',
         'dojox/mobile/ScrollableView',
         'dojox/mobile/Opener',
         'dojox/mobile/Heading',
         'dojox/mobile/RoundRect',
         'dojox/mobile/RoundRectCategory',
         'dojox/mobile/RoundRectList',
         'dojox/mobile/TabBar',
         'dojox/mobile/TabBarButton',
         'dojox/mobile/Button',
         'dojox/mobile/TextBox',
         'dojox/mobile/RadioButton',
         'dojox/mobile/CheckBox', 
         'dojox/mobile/RoundRectList',
         'dojox/mobile/ListItem',
         'dojox/mobile/Switch',
         'dojox/mobile/EdgeToEdgeList',
         'dojox/mobile/ToolBarButton',
         'dojo/domReady!'], function ( Deferred, lang, djson, dom, registry, on, ActivityList, Setup, TaskList, Map) {
	
	// module:
	//		controller/Main
	// summary:
	//		Main controller for bootstrapping application
	return {
		
		// Activity List
		activityDetailList: null,
		
		/*setActivity: function(activityData){
			var taskList;
			
			//Task part
			taskList = new TaskList(activityData);
		},*/
		
    	// summary:
		//		Checks to see what initial page to load
		// description:
    	//		Check to see if there is a list of activities in localStorage
    	//		If none available then show setup page else show activity list page
    	//
    	setStartPage: function(){
    		var cachedActivities, 
    			activityMobileView, 
    			setupMobileView,
    			taskListView;
    			
    		this.contentNode = dom.byId('content');
    		if (!window.localStorage){
    			console.error("Browser not supported");
    			return;
    		}
    		
    		
    		
    		cachedActivitiesData = localStorage.getItem("game_activities");
    		if (cachedActivitiesData){
    			viewCache.setup = new Setup();
    			viewCache.activityList = new ActivityList();
    			viewCache.activityList.show();
    		}
    		else{
				viewCache.setup = new Setup();
				viewCache.setup.show();
    		}
    		dom.byId('contentContainer').style.display = 'block';
    	}
	}
        	
});

