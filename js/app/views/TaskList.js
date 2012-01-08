define(['dojo/_base/declare', 'dojo/on', 'dijit/registry', 'dojox/mobile/RadioButton', 'dojox/mobile/RoundRect', 'dojox/mobile/ListItem', 'dojo/dom-construct', 'dojo/dom', 'dojo/_base/lang', 'app/views/Map', 'dojo/dom-attr'], function(declare, on, registry, RadioButton, RoundRect, ListItem, domConstruct, dom, lang, Map, domAttr) {

	// module:
	//		views/TaskList
	// summary:
	//		Object encapsulating view and event handlers for displaying list of tasks to complete on activities.
	return declare('app.views.TaskList', null, {
		
		activityScore : null,
		
		tasksAndTriesMap : null,
		
		identifier : null,

		iMAGE_DOM_ID : "taskListViewImage",

		tITLE_DOM_ID : "taskListViewTitle",

		view : null,

		imageNode : null,

		titleNode : null,

		taskData : null,

		/**
		 * create a new instance, usage: new TaskList(view, taskData)
		 *
		 * Where view is the node where the Activity is to be shown
		 * TaskData is of the format seen on populateData function
		 */
		constructor : function(view, taskData) {
			this.activityScore = 0;
			this.tasksAndTriesMap = {};
			this.view = view;
			//persist the task data
			this.taskData = taskData;
			this._setupEventHandlers(this.view);
		},
		
		createLockAnswerFunction : function(option, correctAnswer, taskId){
			var _option = option,
				_correctAnswer = correctAnswer,
				_taskId = taskId;
				
			var func =  lang.hitch(this, function(event){
				console.debug(event.returnValue);
				//If it's false, ignore!
				if(!event.returnValue){
					console.debug("ignoring!");
					return;
				}
				console.debug("the current total is:", this.activityScore);
				if(_option == _correctAnswer){
					if(this.tasksAndTriesMap[taskId]){ //has tried before
						this.activityScore += Math.round(100 / (this.tasksAndTriesMap[_taskId]+1));
						console.debug("correct! your new total is ", this.activityScore);
					}
					else{ //first try
						this.activityScore += 100;
						console.debug("correct! your new total is ", this.activityScore);
					}
					var taskDiv = dom.byId("task_"+_taskId);
					domAttr.set(taskDiv, "innerHTML", '<img src="/img/customIcons/correct.png"/>'+_option);
					domAttr.set(taskDiv, "style", "color:green; vertical-align:middle;");
				}
				else{
					if(this.tasksAndTriesMap[taskId]){
						this.tasksAndTriesMap[taskId]++;
					}
					else{
						this.tasksAndTriesMap[taskId] = 1;
					}
					var optionDiv = dom.byId("" + _taskId + "_" + _option).parentNode;
					domAttr.set(optionDiv, "innerHTML", '<img src="/img/customIcons/errorSmall.png"/>'+_option);
					//domAttr.set(optionDiv, "innerHTML", '<div class="mblDomButtonRedBall"></div>'+_option);
					domAttr.set(optionDiv, "style", "color:red;");
				}
			});
			return func;
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
		populateData : function() {
			var taskData = this.taskData;
			this.identifier = this.taskData.title;
			//Set title and image
			this.imageNode = dom.byId(this.iMAGE_DOM_ID);
			this.imageNode.src = taskData.imgSource;
			this.imageNode.alt = taskData.title;

			if(!this.titleNode) {
				this.titleNode = dom.byId(this.tITLE_DOM_ID);
			}
			this.titleNode.innerHTML = taskData.title;
			
			//add tasks
			dojo.forEach(taskData.tasks, lang.hitch(this, function(task, index) {

				var taskWidget;
				taskWidget = new RoundRect({
					style : "clear: both;"
				});

				taskWidget.containerNode.innerHTML = "<h3>" + task.headline + "</h3>";
				var taskDiv = domConstruct.create("div");
				domAttr.set(taskDiv, "id", "task_" + task.id);
				// (domConstruct.create("h3", {innerHTML: task.title}), taskWidget, "first");
				if(task.type === "MULTIPLE_CHOICE") {
					//add options
					dojo.forEach(task.question.options, lang.hitch(this, function(option) {
						
						var optionDiv = domConstruct.create("div");
						var radioButton = new RadioButton({
							name : "" + task.id,
							id: "" + task.id + "_" + option
						});
						domConstruct.place(radioButton.domNode, optionDiv, "last");
						var label = domConstruct.create("label");
						
						domAttr.set(label, "innerHTML", option);
						domAttr.set(label, "for", "" + task.id + "_" + option);
						domConstruct.place(label, optionDiv, "last");
						domConstruct.place(optionDiv, taskDiv, "last");
						
						//radioButton.connect(this, "click", function(){alert("bla");});
						on(radioButton.domNode, "change", lang.hitch(this, this.createLockAnswerFunction(option, task.question.correctAnswer, task.id)));
					}));
				}
				domConstruct.place(taskDiv, taskWidget.containerNode, "last");
				domConstruct.place(taskWidget.domNode, dom.byId("taskListViewTaskContainer"), "last");
				//alert(taskWidget.domNode);
				//taskWidget.connect(this, "click", function(){alert("bla");});
				//on(taskWidget, "Click", function(){alert("bla");});
				//on(dom.byId("taskListViewTaskContainer"), "click", function(){alert("bla");});
			}));
		},
		
		show : function() {
			this.populateData();
			this.view.show();
		},
		
		_setupEventHandlers : function(view) {
			var mapBtn = registry.byId('taskListView_mapBtn');
			if(!viewCache.mapView) {
				viewCache.mapView = new Map();
			}
			mapBtn.on('Click', lang.hitch(this, this._showMapView));
		},
		
		_showMapView : function() {
			viewCache.mapView.populateData(this);
			viewCache.mapView.show();
		}
	});
});
