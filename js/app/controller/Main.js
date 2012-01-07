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
    		
    		//TEST CODE, DO NOT DELIVER!
    		
    		
			this.globalTaskDataArray2 = 
			[
				{
					"id": 4042,
					"headline": "Count the steps",
					"description": null,
					"type": "MULTIPLE_CHOICE",
					"duration": 10,
					"question": {
						"id": 0,
						"text": "How many steps to top of bell tower",
						"correctAnswer": "100",
						"options": ["100", "184", "149"]
					},
					"locations": null
				}, {
					"id": 4041,
					"headline": "Count the steps",
					"description": null,
					"type": "MULTIPLE_CHOICE",
					"duration": 10,
					"question": {
						"id": 0,
						"text": "How many steps to top of bell tower",
						"correctAnswer": "100",
						"options": ["100", "184", "149"]
					},
					"locations": null
				}, {
					"id": 4043,
					"headline": "Count the steps",
					"description": null,
					"type": "MULTIPLE_CHOICE",
					"duration": 10,
					"question": {
						"id": 0,
						"text": "How many steps to top of bell tower",
						"correctAnswer": "100",
						"options": ["100", "184", "149"]
					},
					"locations": null
				}
			]

    		
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
	        
        	taskListView = registry.byId("activityListView");
			viewCache.taskList = new TaskList(taskListView, {
				title : "Farmleigh House Sample Task",
				imgSource : "/img/l/apple-touch-icon-precomposed.png",
				tasks : this.globalTaskDataArray2
			});
    		var mockTaskPageLink = registry.byId("mockTaskPageLink");
    		viewCache.taskList.show();
        	
    		//END TEST CODE
    		
    		
    		cachedActivitiesData = localStorage.getItem("game_activities");
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

