function timestamp(){
	// this function isn't really necessary...
	// just using it to show you can call a function to get a profile property value
	var d = new Date();
	return d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate() + "-" +
		d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
}

var profile = { 
        
        basePath: "./..", 
        releaseDir: "../../../release", 
        buildTimestamp:timestamp(),
        layerOptimize: "closure.keepLines", 
        stripConsole: "all", 
        cssOptimize: "comments", 
        selectorEngine:"lite",
        
        staticHasFeatures: {
	  "ie": 0,
	  "dom":1,
	  "host-browser":1,
	  "dojo-inject-api":1,
	  "dojo-combo-api":0,
	  "host-node":0,
	  "host-rhino":0,
	  "dojo-trace-api":0,
// 	  "dojo-sniff":0,
	  "dojo-test-sniff":0,
	  "dojo-undef-api":0,
// 	  "config-tlmSiblingOfDojo":0,
	  "dojo-timeout-api":0,
	  "dojo-amd-factory-scan":0,
	  "dojo-requirejs-api":0,
	  "config-dojo-loader-catches":0,
// 	  "dojo-sync-loader":0,
	  "dojo-log-api":0,
	  "dojo-publish-privates":0,
	  "dojo-firebug" : 0,
	  // maybe
// 	  "dojo-dom-ready-api":1,
// 	  "ie-event-behavior":1,
// 	  "dojo-config-api":1
      },
        
        packages:[ 
                { 
                        name: "dojo", 
                        location: "../../dojo" 
                }, 
                { 
                        name: "dijit", 
                        location: "../../dijit" 
                }, 
                { 
                        name: "dojox", 
                        location: "../../dojox" 
                }, 
                { 
                        name: "app", 
                        location: "../../../app" 
                } 
        ], 
        
         plugins: { // workaround to exclude acme.js from the build (until #13198 is fixed)
                
                "dojo/has":"../build/plugins/has"
        },

        
       
	layers: {
//it is assumed that dojo/dojo layer is excluded from other layers
		"dojo/dojo": 
		{ customBase: true,
			include:[
					"dojo/_base/Deferred", 
					"dojo/_base/lang", 
					"dojo/_base/json", 
					"dojo/dom", 
					"dijit/registry", 
					"dojo/on", 
					"dojox/mobile/parser", 
					"dojo/_base/xhr", 
					"dojo/_base/json", 
					"dojo/dom-form", 
					"dojo/_base/event"]
		} ,
		
		"app/ui_components": { include:[
			'dojox/mobile/EdgeToEdgeList',
			'dojox/mobile/ToolBarButton',
			'dojox/mobile/RoundRectList',
			'dojox/mobile/ListItem',
			'dojox/mobile/Button',
			'dojox/mobile/TabBar',
         	'dojox/mobile/TabBarButton',
         	'dojox/mobile/RoundRect',
         	'dojox/mobile/RoundRectCategory',
         	'dojox/mobile/Heading',
         	'dojox/mobile/ScrollableView',
         	'dojox/mobile/View'
			]
		},
		
		
		"app/tasklist": { 
			include:[
				"app/views/TaskList",
				"app/views/Map"
			],
			exclude:["app/ui_components"]
		},

		"app/main": { 
			include:["app/controller/Main", 'app/ui_components'],
			exclude:["app/tasklist"]
		}
	}

};