define(['dojo/_base/declare',
		'dojo/on',
        'dijit/registry', 
        'dojox/mobile/RadioButton',
        'dojox/mobile/RoundRect',
        'dojox/mobile/ListItem',
        'dojo/dom-construct',
        'dojo/dom',
        'app/views/Map'], function (declare, on, registry, RadioButton, RoundRect, ListItem, domConstruct, dom, Map) {
	
	// module:
	//		views/TaskList
	// summary:
	//		Object encapsulating view and event handlers for displaying list of tasks to complete on activities.
	return declare('app.views.TaskList', null, {
			
			iMAGE_DOM_ID: "taskListViewImage",
			
			tITLE_DOM_ID: "taskListViewTitle",
			
        	view: null,
        	
        	imageNode: null,
        	
        	titleNode: null,
        	
        	taskData: null,
        	
        	/**
        	 * create a new instance, usage: new TaskList(view, taskData)
        	 * 
        	 * Where view is the node where the Activity is to be shown
        	 * TaskData is of the format seen on populateData function
        	 */
        	constructor: function(view, taskData){
        		this.view = view;
        		//persist the task data
        		this.taskData = taskData;
        		this._setupEventHandlers(this.view);
        	},
        	
        	// summary:
			//		Initialise the store 
        	//
        	//this.taskData = {
        	//	title: "title string",
        	//	imgSource: "URL to image",
        	//	tasks: [
        	//		{
        	//			title: "Who is the guy who founded this place?",
        	//			type: "radio",
        	//			options: [
        	//				"Peter Frampton",
        	//				"Peter Farmleigh",
        	//				"Thomas Farmleigh"
        	//			],
        	//			correct: "Peter Farmleigh"
        	//		},
        	//		{
        	//			title: "What year was this place founded?",
        	//			type: "textbox",
        	//			correct: 1922
        	//		}
        	//]};
        	
        	populateData: function(){
        		var taskData = this.taskData;
        		
        		//Set title and image
        		if(!this.imageNode){
        			this.imageNode = dom.byId(this.iMAGE_DOM_ID);
        		}
        		
        		this.imageNode.src = taskData.imgSource;
        		this.imageNode.alt = taskData.title;
        		
        		if(!this.titleNode){
        			this.titleNode = dom.byId(this.tITLE_DOM_ID);
        		}
				this.titleNode.innerHTML = taskData.title;
        		
        		
        		//add tasks
        		dojo.forEach(taskData.tasks, function(task, index){
        			
    				var taskWidget;
    				
    				taskWidget = new RoundRect({style:"clear: both;"});
    				
    				taskWidget.containerNode.innerHTML = "<h3>"+task.title+"</h3>";
    				
    				// (domConstruct.create("h3", {innerHTML: task.title}), taskWidget, "first");
    				if(task.type === "radio"){
    					//add options
    					dojo.forEach(task.options, function(option){
    						var divThingy = domConstruct.create("div");
    						taskWidget.addChild(new RadioButton({name: task.title}), taskWidget, "last");
    						//TODO: Don't like this mix of innerHTML and addChild. addChild helpfully (or not) 
    						//closes opened div tags (it seems, maybe it's the browser though...)
    						taskWidget.containerNode.innerHTML += "<label for='"+option+"'>"+option+"</label><br/>";
    					})
    				}
    				domConstruct.place(taskWidget.domNode, dom.byId("taskListViewTaskContainer"), "last");
    			});
        	},
        	
        	show: function(){
        		this.populateData();
        		this.view.show();
        	},
        	
        	_setupEventHandlers: function(view){
        		var mapBtn = registry.byId('taskListView_mapBtn');
        		if(!viewCache.mapView){
        			viewCache.mapView = new Map();
        		}
				on(mapBtn.domNode, 'click', this._showMapView);
        	},
        	
        	_showMapView: function(){
				viewCache.mapView.populateData(this);
        		viewCache.mapView.show();
        	}
    });
});

