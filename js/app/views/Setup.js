define(['dojo/_base/declare',
        'dijit/registry'], function (declare, registry) {
	
	// module:
	//		views/ActivityList
	// summary:
	//		Object encapsulating view and event handlers for displaying list game setup
	return declare('app.views.Setup', null,{
			
        	view: null,
        	
        	constructor: function(/*Object*/ args){
        		//mix in mobile view
        	    declare.safeMixin(this, args);
        	},
        	
        	show: function(){
        		this.view.show();
        	}
    });
});

