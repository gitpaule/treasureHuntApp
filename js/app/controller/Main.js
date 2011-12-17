define([ 'dojo/_base/Deferred',
         'dojo/_base/lang', 
         'dojo/_base/json',
         'dojo/dom',
         'dijit/registry', 
         'app/views/ActivityList',
         'app/views/Setup',
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
         'dojo/domReady!'], function ( Deferred, lang, djson, dom, registry, ActivityList, Setup) {
	
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
        		var cachedActivities, activityMobileView, setupMobileView;
        		this.contentNode = dom.byId('content');
        		if (!window.localStorage){
        			console.error("Browser not supported");
        			return;
        		}
        		cachedActivitiesData = localStorage.getItem("fingalActivityChallenge");
        		if (cachedActivitiesData){
        			activityMobileView = registry.byId('activityListView');
        			viewCache.activityList = new ActivityList({view: activityMobileView});
        			viewCache.activityList.populateList(cachedActivitiesData);
        			viewCache.activityList.view = activityMobileView;
	    			viewCache.activityList.view.selected = true;
	    			viewCache.activityList.show();
        		}
        		else{
        			setupMobileView = registry.byId('setupView');
        			viewCache.setup = new Setup();
        			
        			viewCache.setup.view = setupMobileView;
        			viewCache.setup.view.selected = true;
        			viewCache.setup.show(true);
        		}
        		dom.byId('contentContainer').style.display = 'block';
        	}
	}
        	
});


