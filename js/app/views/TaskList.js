define(['dojo/_base/declare',
 		'dojo/on',
 		'dijit/registry',
 		'dojox/mobile/RadioButton', 
 		'dojox/mobile/Button',
 		'dojox/mobile/RoundRect', 
 		'dojox/mobile/ListItem', 
 		'dojo/dom-construct', 
 		'dojo/dom', 
 		'dojo/_base/lang', 
 		'dojo/_base/xhr', 
 		'app/views/Map', 
 		'dojo/dom-attr',
 		'dojo/dom-geometry',
 		'dojo/query',
 		'dojo/_base/event',
 		'dojo/_base/Deferred',
 		'dojox/gesture/tap',
		'dojo/dom-class'], 
		function(declare, on, registry, RadioButton, Button, RoundRect, ListItem, domConstruct, dom, lang, xhr, Map, domAttr, domGeom, query, event, Deferred, tap, domClass) {


	// module:
	//		views/TaskList
	// summary:
	//		Object encapsulating view and event handlers for displaying list of tasks to complete on activities.
	return declare('app.views.TaskList', null, {
		
		taskWidgetsClasswide : [],
		
		activityScore : null,
		
		tasksAndTriesMap : null,
		
		identifier : null,

		tITLE_DOM_ID : "taskListViewTitle",

		view : null,

		imageNode : null,

		titleNode : null,

		taskData : null,
		
		taskList : null,
		
		WALK_RADIUS: 20,
		VISIT_RADIUS: 100,
				
		taskIcons: {
			MULTIPLE_CHOICE : '/img/taskIcons/question.png',
			PICTURE : '/img/taskIcons/camera.png',
			VISIT : '/img/taskIcons/camera.png',
			ACTION : '/img/taskIcons/location.png'
		},
		taskCompletedIcons: {
			MULTIPLE_CHOICE : '/img/taskIcons/question_done.png',
			PICTURE : '/img/taskIcons/camera_done.png',
			VISIT : '/img/taskIcons/camera.png',
			ACTION : '/img/taskIcons/location_done.png'
		},
		
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
			
			viewCache.activityDetail = this;
			
			//persist the task data
			this.activityData = activityData;
			
			this._setupEventHandlers();
			
			this.taskList = registry.byId("taskList");
						
			localStorage.setItem("activityDetails_"+activityData.id, dojo.toJson(activityData));
			//this._setupEventHandlers(this.view);
			console.debug(activityData.tasks.length);
			var previousViewed = parseInt(localStorage.getItem("itemsViewed"));
			localStorage.setItem("itemsViewed",(previousViewed + activityData.tasks.length));
		},
		
		_setupEventHandlers: function(){
			var mapBtn = registry.byId('activityDetailView_mapBtn');
			
			mapBtn.on('Click', lang.hitch(this, function (){
				this._showMapView();
			}));
			
		},
		
		addToGlobalAccumulatedPoints: function(increment){
			var previousPointsAccumulated = parseInt(localStorage.getItem("pointsAccumulated"));
			localStorage.setItem("pointsAccumulated",(previousPointsAccumulated + increment));
		},
		
		
		createLockAnswerFunction : function(option, correctAnswer, taskId, taskIndex, evt) {
			event.stop(evt);
			var givenWrongAnswers;
			console.debug("the current total is:", this.activityScore);
			if(option === correctAnswer) {

				var previousFinished = parseInt(localStorage.getItem("itemsFinished"));
				localStorage.setItem("itemsFinished", (previousFinished + 1));

				//score tracking
				if(this.tasksAndTriesMap[taskId]) {//has tried before
					this.activityScore += Math.round(100 / (this.tasksAndTriesMap[taskId] + 1));
					this.addToGlobalAccumulatedPoints(Math.round(100 / (this.tasksAndTriesMap[taskId] + 1)));
					console.debug("correct! your new total is ", this.activityScore);
				} else {//first try
					this.activityScore += 100;
					this.addToGlobalAccumulatedPoints(100);
					console.debug("correct! your new total is ", this.activityScore);
				}
				this.activityData.tasks[taskIndex].completed = true;

				//change the display.
				var listItem = registry.byId("" + taskId);
				var taskDiv = query('.taskDetails', listItem.domNode)[0];
				this.setTaskDisplayToCompleted(correctAnswer, listItem);
				this._checkIfActivityTasksComplete();
			} else {
				//Wrong answer tracking
				if(!this.activityData.tasks[taskIndex].question.givenWrongAnswers) {
					this.activityData.tasks[taskIndex].question.givenWrongAnswers = [option];
				} else {
					this.activityData.tasks[taskIndex].question.givenWrongAnswers.push(option);
				}

				//Score tracking
				if(this.tasksAndTriesMap[taskId]) {
					this.tasksAndTriesMap[taskId]++;
				} else {
					this.tasksAndTriesMap[taskId] = 1;
				}
				var optionDiv = dom.byId("" + taskId + "_" + option).parentNode;
				this.setTaskDisplayToWrong(optionDiv, option);

			}
			return false;
		},

		
		setTaskDisplayToCompleted: function(completeTitle, listItem){
			var taskDiv = query('.taskDetails', listItem.domNode)[0];
			domAttr.set(taskDiv, "innerHTML", '<img src="/img/customIcons/correct.png"/><span style="margin-left: 5%">'+completeTitle+'</span>');
			domAttr.set(taskDiv, "style", "color:green; vertical-align:middle;");
			listItem.set('rightIcon2', 'mblDomButtonGreenCircleDownArrow');
			listItem.completed = true;
			
		},
		
		setTaskDisplayToWrong: function(optionDiv, wrongAnswer){
			domAttr.set(optionDiv, "innerHTML", '<img src="/img/customIcons/errorSmall.png"/><span style="margin-left: 5%">'+wrongAnswer+'</span>');
			domAttr.set(optionDiv, "style", "color:red;");
		},
		
		// summary:
		//		Initialise the store
		//
		populateData : function() {
			var taskData = this.activityData;
			this.identifier = this.activityData.title;

			if(!this.titleNode) {
				this.titleNode = dom.byId(this.tITLE_DOM_ID);
			}
			this.titleNode.innerHTML = taskData.title;

			this.taskList.destroyDescendants();
			var _this = this;

			for(var taskIndex = 0; taskIndex < taskData.tasks.length; taskIndex++) {
				// add list of tasks
				var task = taskData.tasks[taskIndex];
				var taskIcon = this.taskIcons[task.type];
				var li = new ListItem({
					id : task.id,
					label : task.headline,
					noArrow : true,
					icon : taskIcon,
					variableHeight : true,
					rightIcon2 : 'mblDomButtonSilverCircleDownArrow',
					variableHeight : true,
					clickable : true,
					onClick : function(evt) {
						/* problem with the click event being called twice -- need to debounce */
						var d = new Date();
						if(d - _this.lastClickTime < 500) {
							console.log("returning early ", d - _this.lastClickTime);
							return false;
						}
						event.stop(evt);
						_this.lastClickTime = d;
						for(var i = 0; i < taskData.tasks.length; i++) {
							if(this.id != taskData.tasks[i].id) {
								_this._hideTaskDetails(taskData.tasks[i]);
								console.log("hide", this);
							} else {
								_this._showTaskDetails(taskData.tasks[i], i);
								console.log("show", taskData.tasks[i].id);
							}
						}
					}
				});
				li.doneIcon = this.taskCompletedIcons[task.type];
				this.taskList.addChild(li);
			}
		},
		
		/*
		 * Shows task details
		 */
		_showTaskDetails : function(task, taskIndex){
			var listItem = registry.byId("" + task.id);
			
			var listItemTextDiv = query('.mblListItemTextBox', listItem.domNode)[0];
			if(listItemTextDiv.childNodes.length > 1){
				this._hideTaskDetails(task);
				return;
			}
			var taskDetailsDiv = domConstruct.create("div", {
				'class' : 'taskDetails'
			});
			domConstruct.place(taskDetailsDiv, listItemTextDiv, 'last');
			
			if(task.type === "MULTIPLE_CHOICE") {
				this._createQuestionOptions(task, taskIndex);
			}else if(task.type === "PICTURE") {
				this._createCameraDetails(task, taskIndex);
			}else if(task.type === "ACTION"){
				this._createWalkDetails(task, taskIndex);
			}else{
				this._createVisitDetails(task, taskIndex);
			}
		},
		
		/*
		 * Hides task details if the div is displayed
		 */
		_hideTaskDetails : function(task){
		
			var listItem = registry.byId("" + task.id);
			var taskDetailsArr = query('.taskDetails', listItem.domNode);
			if(taskDetailsArr.length == 0){
				return;
			}
			this._destroyTaskDetails(task);
			domConstruct.destroy(taskDetailsArr[0]);
		},
		
	
		_createQuestionOptions : function(task, taskIndex) {
			var listItem = registry.byId("" + task.id);
			var taskDetailsDiv = query('.taskDetails', listItem.domNode)[0];
			if(this.activityData.tasks[taskIndex].completed) {
				//If answered correctly, show only right answer and checkbox
				this.setTaskDisplayToCompleted(this.activityData.tasks[taskIndex].question.correctAnswer, listItem);
			} else {
				//show answer options
				dojo.forEach(task.question.options, lang.hitch(this, function(option) {
					var optionDiv = domConstruct.create("div", {
						'class' : 'questionOption'
					});

					//if this option has been answered incorrectly before
					var givenWrongAnswers = this.activityData.tasks[taskIndex].question.givenWrongAnswers;
					if(givenWrongAnswers && givenWrongAnswers.indexOf(option) >= 0) {
						this.setTaskDisplayToWrong(optionDiv, option);
						domConstruct.place(optionDiv, taskDetailsDiv, "last");
						return;
					}
					var radioButton = new RadioButton({
						name : "" + task.id,
						id : "" + task.id + "_" + option
					});
					domConstruct.place(radioButton.domNode, optionDiv, "last");
					var label = domConstruct.create("label");

					domAttr.set(label, "innerHTML", option);
					domAttr.set(label, "for", "" + task.id + "_" + option);
					domConstruct.place(label, optionDiv);
					domConstruct.place(optionDiv, taskDetailsDiv);

					on(radioButton.domNode, "click", lang.hitch(this, this.createLockAnswerFunction, option, task.question.correctAnswer, task.id, taskIndex));
				}));
			}
		},
		
		_createCameraDetails : function(taskDiv, task, taskIndex){
			console.error("not implemented yet");
		},
		
		_createWalkDetails : function(task, taskIndex) {
			var listItem = registry.byId("" + task.id);
			var taskDetailsDiv = query('.taskDetails', listItem.domNode)[0];
			if(this.activityData.tasks[taskIndex].completed) {
				//If answered correctly, show only right answer and checkbox
				this.setTaskDisplayToCompleted("walk completed", listItem);
			} else {
				domConstruct.place("<div>Check out the route in the map view</div>", checkpointDiv);
				dojo.forEach(['start', 'end'], lang.hitch(this, function(task, start_end){
					var checkpointDiv = domConstruct.create("div", {
						'class' : 'checkpoint'
					});
					if(task.walk[start_end].reached) {
						domConstruct.place("<div class='reached'>Reached "+start_end+" checkpoint </div>", checkpointDiv);
					}else {
						var verifyBtn = new Button({
							label : "Verify I am at "+start_end+" location",
							onClick : lang.hitch(this, function(task, start_end, evt) {
								event.stop(evt);
								this.checkLocationProximity(task, task.walk[start_end].location.coordinates, this.WALK_RADIUS).then(
									lang.hitch(this, function(response){
										if(response.result){
											domConstruct.empty(checkpointDiv);
											domConstruct.place("<div class='reached'>Reached "+response.type+" checkpoint </div>", checkpointDiv);
											task.walk[start_end].reached = true;
											
											if(task.walk["start"].reached && task.walk["end"].reached){
												var listItem = registry.byId("" + task.id);
												this.setTaskDisplayToCompleted("Walk Completed", listItem);
												this.addToGlobalAccumulatedPoints(100);
												alert("Task completed!");
												//check if all tasks complete
												this._checkIfActivityTasksComplete();
											}
											
										}else{
											alert("Not there yet!");
										}
									}),
									function(error){
										console.error("request to check proximity failed ", error);
									}
								);
							}, task, start_end)
						});
						
						domConstruct.place(verifyBtn.domNode, checkpointDiv);
					}
					domConstruct.place(checkpointDiv, taskDetailsDiv);
				}, task));
			}
		},

		_createVisitDetails: function(task, taskIndex){
			var listItem = registry.byId("" + task.id);
			var taskDetailsDiv = query('.taskDetails', listItem.domNode)[0];
			var checkpointDiv = domConstruct.create("div", {
						'class' : 'checkpoint'
					});
			if(task.reached) {
				domConstruct.place("<div class='reached'>Visited location</div>", checkpointDiv);
			}else {
				domConstruct.place("<div>Check location the map view</div>", checkpointDiv);
				var verifyBtn = new Button({
					label : "Verify I am at location",
					onClick : lang.hitch(this, 
						function(task, evt) {
							event.stop(evt);
							this.checkLocationProximity(task, task.location.coordinates,  this.VISIT_RADIUS).then(
								lang.hitch(this, 
									function(response){
										if(response.result){
											domConstruct.empty(checkpointDiv);
											task.reached = true;
											alert("Task completed!");
											var listItem = registry.byId("" + task.id);
											this.setTaskDisplayToCompleted("Visited location", listItem);
										}else{
											alert("Not there yet!");
										}
								}),
								function(error){
									console.error("request to check proximity failed ", error);
								}
							);
						}, task)
				});
				domConstruct.place(verifyBtn.domNode, checkpointDiv);
			}
			domConstruct.place(checkpointDiv, taskDetailsDiv);
		},
		
		_destroyTaskDetails : function(task){
			var listItem = registry.byId("" + task.id);
			var childWidgets = registry.findWidgets(listItem.domNode);
			for(var i = 0; i < childWidgets.length; i++) {
				childWidgets[i].destroy();
			};
		},
		
		checkLocationProximity: function(task, coords, bufferRadius){
			var geoPromise = new Deferred();
			var serverReqPromise = new Deferred();
			
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition( function(position){
					geoPromise.resolve(position.coords);
				}); 
			} else {
				console.log("navigator not supported");
				return false;
			}
			geoPromise.then(function(currentLocation){
				var checkpoint = coords[0]+' '+coords[1];
				var currentLocation = currentLocation.longitude+' '+currentLocation.latitude;
				return xhr.get({
					url : "/TreasureHuntWeb/rest/game/proximity/"+checkpoint+"/"+currentLocation,
					content: {radius: bufferRadius},
					handleAs : "json",
					load: function(atLocation){
						serverReqPromise.resolve({result: atLocation});
					}
				});
			});
			return serverReqPromise;
		},
		
		_checkIfActivityTasksComplete: function(){
			//check if all tasks complete
			for (var i=0; i < this.taskList.children.length; i++) {
			  if(!this.taskList.children[i].completed){
			  	return false;
			  }
			}
			//go to score view if all tasks are complete
			if(!viewCache.scoreView){
				viewCache.scoreView = registry.byId('scoreView');
			}
			viewCache.scoreView.show();
		},
		
		show : function() {
			
			this._set_list_tab_to_on();
			
			this.populateData();
			this.view.show();
		},
		
		_set_list_tab_to_on: function()
		{
			var selLi = query("#activityDetail_tab_bar .mblTabButtonSelected");
    		if(selLi.length){
    			domClass.remove(selLi[0], "mblTabButtonSelected");
    		}
        	domClass.add("activityDetailView_listBtn", "mblTabButtonSelected");
		},
		
		destroy : function(){
			localStorage.removeItem("activityDetails_"+this.identifier);
			this.taskWidgetsClasswide = [];
			this.activityScore = null;
			this.tasksAndTriesMap = null;
			this.identifier = null;
			this.view.destroy();
			this.imageNode = null;
			this.titleNode = null;
			this.activityData = null;
		},
		
		_showMapView : function() {
			viewCache.mapView.show(this.activityStore, 'activityDetail', this);
		}
	});
});
