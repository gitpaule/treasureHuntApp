define([ 'dojo/_base/Deferred',
         'dojo/_base/lang', 
         'dojo/_base/json',
         'dojo/dom',
         'dijit/registry', 
         'app/views/ActivityList',
         'app/views/Setup',
         'app/views/TaskList',
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
         'dojo/domReady!'], function ( Deferred, lang, djson, dom, registry, ActivityList, Setup, TaskList) {
	
	// module:
	//		controller/Main
	// summary:
	//		Main controller for bootstrapping application
	return {
		setActivity: function(activity){
			var taskList;
			
			//Task part
			taskList = new TaskList(activity.taskData);
			taskList.populateData();
		},
		
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
        		
        		//TEST CODE, DO NOT DELIVER!
        		/*
        		this.globalTaskDataArray = [
        			{
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
		        				correct: "Peter Farmleigh"//This is all speculation, I haven't got a clue.
		        			},
		        			{
		        				title: "What year was Farmleigh House founded?",
		        				type: "radio",
		        				options: [
		        					"1942",
		        					"400 B.C.",
		        					"2011"
		        				],
		        				correct: "1942"//This is all speculation, I haven't got a clue.
		        			}
		        	]},
		        	{
		        		title: "Farmleigh House Sample Task 2",
		        		imgSource: "/img/l/apple-touch-icon-precomposed.png",
		        		tasks: [
		        			{
		        				title: "What is the answer to this question?",
		        				type: "radio",
		        				options: [
		        					"this",
		        					"something else",
		        					"something else entirely"
		        				],
		        				correct: "this"//This is all speculation, I haven't got a clue :)
		        			},
		        			{
		        				title: "What year was Farmleigh House founded?",
		        				type: "radio",
		        				options: [
		        					"1942",
		        					"400 B.C.",
		        					"2011"
		        				],
		        				correct: "1942"//This is all speculation, I haven't got a clue.
		        			}
		        	]}
		        ];
	        	taskListView = registry.byId("taskListView");
	        	viewCache.taskList = new TaskList(taskListView);
        		viewCache.taskList.populateData(taskData);
	    		viewCache.taskList.setupEventHandlers(activityMobileView);
	    		viewCache.taskList.show();
	        	*/
        		//END TEST CODE
        		
        		
        		cachedActivitiesData = localStorage.getItem("fingalActivityChallenge");
        		if (cachedActivitiesData){
        			activityMobileView = registry.byId('activityListView');
        			viewCache.activityList = new ActivityList(activityMobileView);
        			viewCache.activityList.populateData(cachedActivitiesData);
	    			viewCache.activityList.setupEventHandlers(activityMobileView);
	    			viewCache.activityList.show();
        		}
        		else{
        			setupMobileView = registry.byId('setupView');
        			viewCache.setup = new Setup(setupMobileView);
        			viewCache.setup.setupEventHandlers(setupMobileView);
        			viewCache.setup.show(true);
        		}
        		dom.byId('contentContainer').style.display = 'block';
        	}
	}
        	
});

