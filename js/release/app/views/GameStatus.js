//>>built
define("app/views/GameStatus", ['dojo/_base/declare'], 
 function(declare){

	// module:
	//		views/ActivityList
	// summary:
	//		Object encapsulating view and event handlers for displaying list of activities to complete
	return declare('app.views.GameStatus', null, {

		view : null,
		gameData: {},


		constructor : function() {
			this.view = registry.byId('gameStatusView');
			this._setupEventHandlers();
		},
		
		
		
		// summary:
		//		Show the view
		//
		//Description:
		//		Main calls this function to set the initial view
		//
		show : function() {
			this.view.show();
		},
		
		_setupEventHandlers : function(view) {
			
		}
	});
});
