define([ 'dojo/_base/Deferred',
         'dojo/_base/lang', 
         'dojo/_base/json',
         'dojo/dom',
         'dijit/registry', 
         'app/views/ActivityList',
         'app/views/Setup',
         'app/views/TaskList',
         'app/views/Map',
         'dojox/mobile/parser',
         'dojox/mobile/View',
         'dojox/mobile/ScrollableView',
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
         'dojo/domReady!'], function ( Deferred, lang, djson, dom, registry, ActivityList, Setup, TaskList, Map) {
	
	// module:
	//		controller/Main
	// summary:
	//		Main controller for bootstrapping application
	return {
        	
        	
        	// summary:
			//		Checks to see what initial page to load
			// description:
        	//		Check to see if there is a list of activities in localStorage
        	//		If none available then show setup page else show activity list page
        	//
        	setStartPage: function(){
        		var activityMobileView, 
        			setupMobileView,
        			taskListView;
        			
        		this.contentNode = dom.byId('content');
        		if (!window.localStorage){
        			console.error("Browser not supported");
        			return;
        		}
        		
        		//TEST CODE, DO NOT DELIVER!!
        		/*
        		taskData = {
	        		title: "Farmleigh House Sample Task",
	        		imgSource: "/img/l/apple-touch-icon-precomposed.png",
	        		tasks: [
	        			{
	        				title: "Who is the guy who founded this place?",
	        				type: "radio",
	        				options: [
	        					"Peter Frampton",
	        					"Peter Farmleigh",
	        					"Thomas Farmleigh"
	        				],
	        				correct: "Peter Farmleigh"
	        			}
	        	]};
	        	taskListView = registry.byId("taskListView");
	        	viewCache.taskList = new TaskList(taskListView);
        		viewCache.taskList.populateData(taskData);
	    		viewCache.taskList.setupEventHandlers(activityMobileView);
	    		viewCache.taskList.show();
	        	*/
        		//END TEST CODE
        		
        		
        		var cachedActivitiesData = localStorage.getItem("game_activities");
        		if (cachedActivitiesData){
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

