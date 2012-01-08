define(['dojo/_base/declare', 'dojo/on', 'dijit/registry', 'dojox/mobile/RadioButton', 'dojox/mobile/RoundRect', 'dojox/mobile/ListItem', 'dojo/dom-construct', 'dojo/dom', 'dojo/_base/lang', 'app/views/Map', 'dojo/dom-attr'], function(declare, on, registry, RadioButton, RoundRect, ListItem, domConstruct, dom, lang, Map, domAttr) {

	// module:
	//		views/TaskList
	// summary:
	//		Object encapsulating view and event handlers for displaying list of tasks to complete on activities.
	return declare('app.views.TaskList', null, {
		
		taskWidgetsClasswide : [],
		
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
		constructor : function(view, activityData) {
			this.activityScore = 0;
			this.tasksAndTriesMap = {};
			this.view = view;
			//persist the task data
			this.activityData = activityData;
			localStorage.setItem("activityDetails_"+activityData.id, dojo.toJson(activityData));
			this._setupEventHandlers(this.view);
		},
		
		createLockAnswerFunction : function(option, correctAnswer, taskId, taskIndex){
			var _option = option,
				_correctAnswer = correctAnswer,
				_taskId = taskId;
				
			var func =  lang.hitch(this, function(event){
				var givenWrongAnswers;
				console.debug(event);
				console.debug("the current total is:", this.activityScore);
				
				if(_option == _correctAnswer){
					//score tracking
					if(this.tasksAndTriesMap[taskId]){ //has tried before
						this.activityScore += Math.round(100 / (this.tasksAndTriesMap[_taskId]+1));
						console.debug("correct! your new total is ", this.activityScore);
					}
					else{ //first try
						this.activityScore += 100;
						console.debug("correct! your new total is ", this.activityScore);
					}
					this.activityData.tasks[taskIndex].question.answeredCorrectly = true;
					
					//change the display.
					var taskDiv = dom.byId("task_"+_taskId);
					this.setTaskDisplayToAnswered(taskDiv,_correctAnswer);
				}
				else{
					//Wrong answer tracking
					if(!this.activityData.tasks[taskIndex].question.givenWrongAnswers){
						this.activityData.tasks[taskIndex].question.givenWrongAnswers = [_option];
					}
					else{
						this.activityData.tasks[taskIndex].question.givenWrongAnswers.push(_option);
					}
					
					//Score tracking
					if(this.tasksAndTriesMap[taskId]){
						this.tasksAndTriesMap[taskId]++;
					}
					else{
						this.tasksAndTriesMap[taskId] = 1;
					}
					var optionDiv = dom.byId("" + _taskId + "_" + _option).parentNode;
					this.setTaskDisplayToWrong(optionDiv,_option);
					
				}
			});
			return func;
		},
		
		setTaskDisplayToAnswered: function(taskDiv, correctAnswer){
			domAttr.set(taskDiv, "innerHTML", '<img src="/img/customIcons/correct.png"/>'+correctAnswer);
			domAttr.set(taskDiv, "style", "color:green; vertical-align:middle;");
		},
		
		setTaskDisplayToWrong: function(optionDiv, wrongAnswer){
			domAttr.set(optionDiv, "innerHTML", '<img src="/img/customIcons/errorSmall.png"/>'+wrongAnswer);
			domAttr.set(optionDiv, "style", "color:red;");
		},
		
		// summary:
		//		Initialise the store
		//
		//this.activityData = {
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
			var taskData = this.activityData;
			this.identifier = this.activityData.title;
			//Set title and image
			this.imageNode = dom.byId(this.iMAGE_DOM_ID);
			this.imageNode.src = taskData.imgSource;
			this.imageNode.alt = taskData.title;
			
			if(!this.titleNode) {
				this.titleNode = dom.byId(this.tITLE_DOM_ID);
			}
			this.titleNode.innerHTML = taskData.title;
			
			dojo.forEach(this.taskWidgetsClasswide, function(taskWidget) {
				taskWidget.destroyDescendants();
				taskWidget.destroyRecursive();
				console.debug("destroyed all widgets");
			});
			
			this.taskWidgetsClasswide = [];
			dom.byId("taskListViewTaskContainer").innerHTML = "";
			
			//add tasks
			dojo.forEach(taskData.tasks, lang.hitch(this, function(task, taskIndex) {

				var taskWidget;
				taskWidget = new RoundRect({
					style : "clear: both;"
				});
				this.taskWidgetsClasswide.push(taskWidget);

				taskWidget.containerNode.innerHTML = "<h3>" + task.headline + "</h3>";
				var taskDiv = domConstruct.create("div");
				domAttr.set(taskDiv, "id", "task_" + task.id);
				if(task.type === "MULTIPLE_CHOICE") {
					if(this.activityData.tasks[taskIndex].question.answeredCorrectly){
						//If answered correctly, show only right answer and checkbox
						this.setTaskDisplayToAnswered(taskDiv, this.activityData.tasks[taskIndex].question.correctAnswer);
						domConstruct.place(taskDiv, taskWidget.containerNode, "last");
						domConstruct.place(taskWidget.domNode, dom.byId("taskListViewTaskContainer"), "last");
						//do not render anything else.
						return;
					}
					
					//add options
					dojo.forEach(task.question.options, lang.hitch(this, function(option) {
						
						var optionDiv = domConstruct.create("div");
						//if this option has been answered incorrectly before
						var givenWrongAnswers = this.activityData.tasks[taskIndex].question.givenWrongAnswers;
						if(givenWrongAnswers && givenWrongAnswers.indexOf(option)>=0){
							this.setTaskDisplayToWrong(optionDiv, option);
							domConstruct.place(optionDiv, taskDiv, "last");
							return;
						}
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
						on(radioButton.domNode, "change", lang.hitch(this, this.createLockAnswerFunction(option, task.question.correctAnswer, task.id, taskIndex)));
					}));
				}
				domConstruct.place(taskDiv, taskWidget.containerNode, "last");
				domConstruct.place(taskWidget.domNode, dom.byId("taskListViewTaskContainer"), "last");
			}));
		},
		
		show : function() {
			this.populateData();
			this.view.show();
		},
		
		
		destroy : function(){
			localStorage.removeItem("activityDetails_"+this.identifier);
			
			this.taskWidgetsClasswide = [];
			this.activityScore = null;
			this.tasksAndTriesMap = null;
			this.identifier = null;
			this.view = null;
			this.imageNode = null;
			this.titleNode = null;
			this.activityData = null;
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
