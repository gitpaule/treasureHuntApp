define(['dojo/_base/declare',
		'dojo/on',
        'dijit/registry', 
        'dojox/mobile/RadioButton',
        'dojox/mobile/RoundRect',
        'dojox/mobile/ListItem',
        'dojo/dom-construct',
        'dojo/dom'], function (declare, on, registry, RadioButton, RoundRect, ListItem, domConstruct, dom) {
	
	// module:
	//		views/TaskList
	// summary:
	//		Object encapsulating view and event handlers for displaying list of tasks to complete on activities.
	return declare('app.views.TaskList', null,{
			
			iMAGE_DOM_ID: "taskListViewImage",
			tITLE_DOM_ID: "taskListViewTitle",
			
        	view: null,
        	imageNode: null,
        	titleNode: null,
        	
        	constructor: function(){
        		this.view = registry.byId('taskListView');
        		this._setupEventHandlers();
        	},
        	
        	// summary:
			//		Initialise the store 
        	//
        	//taskData = {
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
        	//
        	// 192.168.1.29:10039/TestWeb
        	//
        	
        	populateData: function(taskData){
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
        		dojo.forEach(taskData.tasks, function(task){
    				var taskWidget;
    				taskWidget = new RoundRect();
    				
    				taskWidget.containerNode.innerHTML = "<h3>"+task.title+"</h3>";
    				
    				//(domConstruct.create("h3", {innerHTML: task.title}), taskWidget, "first");
    				if(task.type === "radio"){
    					//add options
    					dojo.forEach(task.options, function(option){
    						taskWidget.addChild(new RadioButton({label: option}), taskWidget, "last");
    					})
    				}
    				domConstruct.place(taskWidget, "taskListViewTaskContainer", "last");
    			});
        	},
        	
        	show: function(initialLoad){
        		this.view.show(initialLoad);
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

