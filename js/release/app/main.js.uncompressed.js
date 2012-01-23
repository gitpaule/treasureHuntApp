//>>built
require({cache:{
'app/views/GeoJSON':function(){
define("app/views/GeoJSON", ['dojo/_base/declare'], function(declare) {

	return declare('app.views.GeoJSON', null, {
		geojson : null,
		options : null,

		constructor : function(geojson, options) {
			this.geojson = geojson;
			this.options = options || {};
		},
		
		
		
		parse: function() {
			var obj;
			switch ( this.geojson.type ) {

				case "FeatureCollection":
					if(!this.geojson.features) {
						obj = this._error("Invalid GeoJSON object: FeatureCollection object missing \"features\" member.");
					} else {
						obj = [];
						for(var i = 0; i < this.geojson.features.length; i++) {
							obj.push(this._geometryToGoogleMaps(this.geojson.features[i], this.options));
						}
					}
					break;

				case "GeometryCollection":
					if(!this.geojson.geometries) {
						obj = this._error("Invalid GeoJSON object: GeometryCollection object missing \"geometries\" member.");
					} else {
						obj = [];
						for(var i = 0; i < this.geojson.geometries.length; i++) {
							obj.push(this._geometryToGoogleMaps(this.geojson.geometries[i], this.options));
						}
					}
					break;

				case "Feature":
					if(!(this.geojson.properties && this.geojson.geometry )) {
						obj = this._error("Invalid GeoJSON object: Feature object missing \"properties\" or \"geometry\" member.");
					} else {
						obj = this._geometryToGoogleMaps(this.geojson, this.options);
					}
					break;

				case "POINT":
				case "MULTIPOINT":
				case "LINESTRING":
				case "MULTILINESTRING":
				case "POLYGON":
				case "MULTIPOLYGON":
					obj = this.geojson.coordinates ? obj = this._geometryToGoogleMaps(this.geojson, this.options) : this._error("Invalid GeoJSON object: Geometry object missing \"coordinates\" member.");
					break;

				default:
					obj = this._error("Invalid GeoJSON object: GeoJSON object must be one of \"Point\", \"LineString\", \"Polygon\", \"MultiPolygon\", \"Feature\", \"FeatureCollection\" or \"GeometryCollection\".");

			}

			return obj;
		},

		_geometryToGoogleMaps : function(geojson, opts) {
			
			var geojsonGeometry = geojson.geometry;
			var geojsonProperties = geojson.properties;
			
			var googleObj;

			switch ( geojsonGeometry.type ) {
				case "POINT":
					opts.position = new google.maps.LatLng(geojsonGeometry.coordinates[1], geojsonGeometry.coordinates[0]);
					opts.title = geojsonProperties.name;
					googleObj = new google.maps.Marker(opts);
					googleObj.set("id", geojson.id);
					if(geojsonProperties) {
						googleObj.set("geojsonProperties", geojsonProperties);
					}
					break;

				case "MULTIPOINT":
					googleObj = [];
					for(var i = 0; i < geojsonGeometry.coordinates.length; i++) {
						opts.position = new google.maps.LatLng(geojsonGeometry.coordinates[i][1], geojsonGeometry.coordinates[i][0]);
						googleObj.push(new google.maps.Marker(opts));
					}
					if(geojsonProperties) {
						for(var k = 0; k < googleObj.length; k++) {
							googleObj[k].set("geojsonProperties", geojsonProperties);
							googleObj[k].set("id", geojson.id);
						}
					}
					break;

				case "LineString":
					var path = [];
					for(var i = 0; i < geojsonGeometry.coordinates.length; i++) {
						var coord = geojsonGeometry.coordinates[i];
						var ll = new google.maps.LatLng(coord[1], coord[0]);
						path.push(ll);
					}
					opts.path = path;
					googleObj = new google.maps.Polyline(opts);
					if(geojsonProperties) {
						googleObj.set("geojsonProperties", geojsonProperties);
						googleObj.set("id", geojson.id);
						
					}
					break;

				case "MultiLineString":
					googleObj = [];
					for(var i = 0; i < geojsonGeometry.coordinates.length; i++) {
						var path = [];
						for(var j = 0; j < geojsonGeometry.coordinates[i].length; j++) {
							var coord = geojsonGeometry.coordinates[i][j];
							var ll = new google.maps.LatLng(coord[1], coord[0]);
							path.push(ll);
						}
						opts.path = path;
						googleObj.push(new google.maps.Polyline(opts));
					}
					if(geojsonProperties) {
						for(var k = 0; k < googleObj.length; k++) {
							googleObj[k].set("geojsonProperties", geojsonProperties);
							googleObj[k].set("id", geojson.id);
						}
					}
					break;

				case "Polygon":
					var paths = [];
					for(var i = 0; i < geojsonGeometry.coordinates.length; i++) {
						var path = [];
						for(var j = 0; j < geojsonGeometry.coordinates[i].length; j++) {
							var ll = new google.maps.LatLng(geojsonGeometry.coordinates[i][j][1], geojsonGeometry.coordinates[i][j][0]);
							path.push(ll)
						}
						paths.push(path);
					}
					opts.paths = paths;
					googleObj = new google.maps.Polygon(opts);
					if(geojsonProperties) {
						googleObj.set("geojsonProperties", geojsonProperties);
						googleObj.set("id", geojson.id);
					}
					break;

				case "MultiPolygon":
					googleObj = [];
					for(var i = 0; i < geojsonGeometry.coordinates.length; i++) {
						var paths = [];
						for(var j = 0; j < geojsonGeometry.coordinates[i].length; j++) {
							var path = [];
							for(var k = 0; k < geojsonGeometry.coordinates[i][j].length; k++) {
								var ll = new google.maps.LatLng(geojsonGeometry.coordinates[i][j][k][1], geojsonGeometry.coordinates[i][j][k][0]);
								path.push(ll);
							}
							paths.push(path);
						}
						opts.paths = paths;
						googleObj.push(new google.maps.Polygon(opts));
					}
					if(geojsonProperties) {
						for(var k = 0; k < googleObj.length; k++) {
							googleObj[k].set("geojsonProperties", geojsonProperties);
							googleObj[k].set("id", geojson.id);
						}
					}
					break;

				case "GeometryCollection":
					googleObj = [];
					if(!geojsonGeometry.geometries) {
						googleObj = _error("Invalid GeoJSON object: GeometryCollection object missing \"geometries\" member.");
					} else {
						for(var i = 0; i < geojsonGeometry.geometries.length; i++) {
							googleObj.push(_geometryToGoogleMaps(geojsonGeometry.geometries[i], opts, geojsonProperties || null));
						}
					}
					break;

				default:
					googleObj = _error("Invalid GeoJSON object: Geometry object must be one of \"Point\", \"LineString\", \"Polygon\" or \"MultiPolygon\".");
			}

			return googleObj;

		},
		_error : function(message) {
			return {
				type : "Error",
				message : message
			};
		}
	});
});

},
'dojox/mobile/TransitionEvent':function(){
define("dojox/mobile/TransitionEvent", [
	"dojo/_base/declare",
	"dojo/_base/Deferred",
	"dojo/_base/lang",
	"dojo/on",
	"./transition"
], function(declare, Deferred, lang, on, transitDeferred){

	return declare("dojox.mobile.TransitionEvent", null, {
		constructor: function(target, transitionOptions, triggerEvent){
			this.transitionOptions=transitionOptions;	
			this.target = target;
			this.triggerEvent=triggerEvent||null;	
		},

		dispatch: function(){
			var opts = {bubbles:true, cancelable:true, detail: this.transitionOptions, triggerEvent: this.triggerEvent};	
			//console.log("Target: ", this.target, " opts: ", opts);

			var evt = on.emit(this.target,"startTransition", opts);
			//console.log('evt: ', evt);
			if(evt){
				Deferred.when(transitDeferred, lang.hitch(this, function(transition){
					Deferred.when(transition.call(this, evt), lang.hitch(this, function(results){
						this.endTransition(results);
					})); 
				}));
			}
		},

		endTransition: function(results){
			on.emit(this.target, "endTransition" , {detail: results.transitionOptions});
		}
	});
});

},
'dojox/mobile/ViewController':function(){
define("dojox/mobile/ViewController", [
	"dojo/_base/kernel",
	"dojo/_base/array",
	"dojo/_base/connect",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/dom",
	"dojo/dom-class",
	"dojo/dom-construct",
//	"dojo/hash", // optionally prereq'ed
	"dojo/on",
	"dojo/ready",
	"dijit/registry",	// registry.byId
	"./ProgressIndicator",
	"./TransitionEvent"
], function(dojo, array, connect, declare, lang, win, dom, domClass, domConstruct, on, ready, registry, ProgressIndicator, TransitionEvent){

	// module:
	//		dojox/mobile/ViewController
	// summary:
	//		A singleton class that controlls view transition.

	var dm = lang.getObject("dojox.mobile", true);

	var Controller = declare("dojox.mobile.ViewController", null, {
		// summary:
		//		A singleton class that controlls view transition.
		// description:
		//		This class listens to the "startTransition" events and performs
		//		view transitions. If the transition destination is an external
		//		view specified with the url parameter, retrieves the view
		//		content and parses it to create a new target view.

		constructor: function(){
			this.viewMap={};
			this.currentView=null;
			this.defaultView=null;
			ready(lang.hitch(this, function(){
				on(win.body(), "startTransition", lang.hitch(this, "onStartTransition"));
			}));
		},

		findCurrentView: function(moveTo,src){
			// summary:
			//		Searches for the currently showing view.
			if(moveTo){
				var w = registry.byId(moveTo);
				if(w && w.getShowingView){ return w.getShowingView(); }
			}
			if(dm.currentView){
				return dm.currentView; //TODO:1.8 may not return an expected result especially when views are nested
			}
			//TODO:1.8 probably never reaches here
			w = src;
			while(true){
				w = w.getParent();
				if(!w){ return null; }
				if(domClass.contains(w.domNode, "mblView")){ break; }
			}
			return w;
		},

		onStartTransition: function(evt){
			// summary:
			//		A handler that performs view transition.

			evt.preventDefault();
			if(!evt.detail || (evt.detail && !evt.detail.moveTo && !evt.detail.href && !evt.detail.url && !evt.detail.scene)){ return; }
			var w = this.findCurrentView(evt.detail.moveTo, (evt.target && evt.target.id)?registry.byId(evt.target.id):registry.byId(evt.target)); // the current view widget
			if(!w || (evt.detail && evt.detail.moveTo && w === registry.byId(evt.detail.moveTo))){ return; }
			if(evt.detail.href){
				var t = registry.byId(evt.target.id).hrefTarget;
				if(t){
					dm.openWindow(evt.detail.href, t);
				}else{
					w.performTransition(null, evt.detail.transitionDir, evt.detail.transition, evt.target, function(){location.href = evt.detail.href;});
				}
				return;
			} else if(evt.detail.scene){
				connect.publish("/dojox/mobile/app/pushScene", [evt.detail.scene]);
				return;
			}
			var moveTo = evt.detail.moveTo;
			if(evt.detail.url){
				var id;
				if(dm._viewMap && dm._viewMap[evt.detail.url]){
					// external view has already been loaded
					id = dm._viewMap[evt.detail.url];
				}else{
					// get the specified external view and append it to the <body>
					var text = this._text;
					if(!text){
						if(registry.byId(evt.target.id).sync){
							// We do not add explicit dependency on dojo/_base/xhr to this module
							// to be able to create a build that does not contain dojo/_base/xhr.
							// User applications that do sync loading here need to explicitly
							// require dojo/_base/xhr up front.
							dojo.xhrGet({url:evt.detail.url, sync:true, load:function(result){
								text = lang.trim(result);
							}});
						}else{
							var s = "dojo/_base/xhr"; // assign to a variable so as not to be picked up by the build tool
							require([s], lang.hitch(this, function(xhr){
								var prog = ProgressIndicator.getInstance();
								win.body().appendChild(prog.domNode);
								prog.start();
								var obj = xhr.get({
									url: evt.detail.url,
									handleAs: "text"
								});
								obj.addCallback(lang.hitch(this, function(response, ioArgs){
									prog.stop();
									if(response){
										this._text = response;
										new TransitionEvent(evt.target, {
												transition: evt.detail.transition,
											 	transitionDir: evt.detail.transitionDir,
											 	moveTo: moveTo,
											 	href: evt.detail.href,
											 	url: evt.detail.url,
											 	scene: evt.detail.scene},
											 		evt.detail)
											 			.dispatch();
									}
								}));
								obj.addErrback(function(error){
									prog.stop();
									console.log("Failed to load "+evt.detail.url+"\n"+(error.description||error));
								});
							}));
							return;
						}
					}
					this._text = null;
					id = this._parse(text, registry.byId(evt.target.id).urlTarget);
					if(!dm._viewMap){
						dm._viewMap = [];
					}
					dm._viewMap[evt.detail.url] = id;
				}
				moveTo = id;
				w = this.findCurrentView(moveTo,registry.byId(evt.target.id)) || w; // the current view widget
			}
			w.performTransition(moveTo, evt.detail.transitionDir, evt.detail.transition, null, null);
		},

		_parse: function(text, id){
			// summary:
			//		Parses the given view content.
			// description:
			//		If the content is html fragment, constructs dom tree with it
			//		and runs the parser. If the content is json data, passes it
			//		to _instantiate().
			var container, view, i, j, len;
			var currentView	 = this.findCurrentView();
			var target = registry.byId(id) && registry.byId(id).containerNode
						|| dom.byId(id)
						|| currentView && currentView.domNode.parentNode
						|| win.body();
			// if a fixed bottom bar exists, a new view should be placed before it.
			var refNode = null;
			for(j = target.childNodes.length - 1; j >= 0; j--){
				var c = target.childNodes[j];
				if(c.nodeType === 1){
					if(c.getAttribute("fixed") === "bottom"){
						refNode = c;
					}
					break;
				}
			}
			if(text.charAt(0) === "<"){ // html markup
				container = domConstruct.create("DIV", {innerHTML: text});
				for(i = 0; i < container.childNodes.length; i++){
					var n = container.childNodes[i];
					if(n.nodeType === 1){
						view = n; // expecting <div dojoType="dojox.mobile.View">
						break;
					}
				}
				if(!view){
					console.log("dojox.mobile.ViewController#_parse: invalid view content");
					return;
				}
				view.style.visibility = "hidden";
				target.insertBefore(container, refNode);
				var ws = dojo.parser.parse(container);
				array.forEach(ws, function(w){
					if(w && !w._started && w.startup){
						w.startup();
					}
				});

				// allows multiple root nodes in the fragment,
				// but transition will be performed to the 1st view.
				for(i = 0, len = container.childNodes.length; i < len; i++){
					target.insertBefore(container.firstChild, refNode); // reparent
				}
				target.removeChild(container);

				registry.byNode(view)._visible = true;
			}else if(text.charAt(0) === "{"){ // json
				container = domConstruct.create("DIV");
				target.insertBefore(container, refNode);
				this._ws = [];
				view = this._instantiate(eval('('+text+')'), container);
				for(i = 0; i < this._ws.length; i++){
					var w = this._ws[i];
					w.startup && !w._started && (!w.getParent || !w.getParent()) && w.startup();
				}
				this._ws = null;
			}
			view.style.display = "none";
			view.style.visibility = "visible";
			return dojo.hash ? "#" + view.id : view.id;
		},

		_instantiate: function(/*Object*/obj, /*DomNode*/node, /*Widget*/parent){
			// summary:
			//		Given the evaluated json data, does the same thing as what
			//		the parser does.
			var widget;
			for(var key in obj){
				if(key.charAt(0) == "@"){ continue; }
				var cls = lang.getObject(key);
				if(!cls){ continue; }
				var params = {};
				var proto = cls.prototype;
				var objs = lang.isArray(obj[key]) ? obj[key] : [obj[key]];
				for(var i = 0; i < objs.length; i++){
					for(var prop in objs[i]){
						if(prop.charAt(0) == "@"){
							var val = objs[i][prop];
							prop = prop.substring(1);
							if(typeof proto[prop] == "string"){
								params[prop] = val;
							}else if(typeof proto[prop] == "number"){
								params[prop] = val - 0;
							}else if(typeof proto[prop] == "boolean"){
							params[prop] = (val != "false");
							}else if(typeof proto[prop] == "object"){
								params[prop] = eval("(" + val + ")");
							}
						}
					}
					widget = new cls(params, node);
					if(node){ // to call View's startup()
						widget._visible = true;
						this._ws.push(widget);
					}
					if(parent && parent.addChild){
						parent.addChild(widget);
					}
					this._instantiate(objs[i], null, widget);
				}
			}
			return widget && widget.domNode;
		}
	});
	new Controller(); // singleton
	return Controller;
});


},
'dojox/mobile/_ItemBase':function(){
define("dojox/mobile/_ItemBase", [
	"dojo/_base/kernel",
	"dojo/_base/config",
	"dojo/_base/declare",
	"dijit/registry",	// registry.getEnclosingWidget
	"dijit/_Contained",
	"dijit/_Container",
	"dijit/_WidgetBase",
	"./TransitionEvent",
	"./View"
], function(kernel, config, declare, registry, Contained, Container, WidgetBase, TransitionEvent, View){

/*=====
	var Contained = dijit._Contained;
	var Container = dijit._Container;
	var WidgetBase = dijit._WidgetBase;
	var TransitionEvent = dojox.mobile.TransitionEvent;
	var View = dojox.mobile.View;
=====*/

	// module:
	//		dojox/mobile/_ItemBase
	// summary:
	//		A base class for item classes (e.g. ListItem, IconItem, etc.)

	return declare("dojox.mobile._ItemBase", [WidgetBase, Container, Contained],{
		// summary:
		//		A base class for item classes (e.g. ListItem, IconItem, etc.)
		// description:
		//		_ItemBase is a base class for widgets that have capability to
		//		make a view transition when clicked.

		// icon: String
		//		An icon image to display. The value can be either a path for an
		//		image file or a class name of a DOM button. If icon is not
		//		specified, the iconBase parameter of the parent widget is used.
		icon: "",

		// iconPos: String
		//		The position of an aggregated icon. IconPos is comma separated
		//		values like top,left,width,height (ex. "0,0,29,29"). If iconPos
		//		is not specified, the iconPos parameter of the parent widget is
		//		used.
		iconPos: "", // top,left,width,height (ex. "0,0,29,29")

		// alt: String
		//		An alt text for the icon image.
		alt: "",

		// href: String
		//		A URL of another web page to go to.
		href: "",

		// hrefTarget: String
		//		A target that specifies where to open a page specified by
		//		href. The value will be passed to the 2nd argument of
		//		window.open().
		hrefTarget: "",

		// moveTo: String
		//		The id of the transition destination view which resides in the
		//		current page.
		//
		//		If the value has a hash sign ('#') before the id (e.g. #view1)
		//		and the dojo.hash module is loaded by the user application, the
		//		view transition updates the hash in the browser URL so that the
		//		user can bookmark the destination view. In this case, the user
		//		can also use the browser's back/forward button to navigate
		//		through the views in the browser history.
		//
		//		If null, transitions to a blank view.
		//		If '#', returns immediately without transition.
		moveTo: "",

		// scene: String
		//		The name of a scene. Used from dojox.mobile.app.
		scene: "",

		// clickable: Boolean
		//		If true, this item becomes clickable even if a transition
		//		destination (moveTo, etc.) is not specified.
		clickable: false,

		// url: String
		//		A URL of an html fragment page or JSON data that represents a
		//		new view content. The view content is loaded with XHR and
		//		inserted in the current page. Then a view transition occurs to
		//		the newly created view. The view is cached so that subsequent
		//		requests would not load the content again.
		url: "",

		// urlTarget: String
		//		Node id under which a new view will be created according to the
		//		url parameter. If not specified, The new view will be created as
		//		a sibling of the current view.
		urlTarget: "",

		// transition: String
		//		A type of animated transition effect. You can choose from the
		//		standard transition types, "slide", "fade", "flip", or from the
		//		extended transition types, "cover", "coverv", "dissolve",
		//		"reveal", "revealv", "scaleIn", "scaleOut", "slidev",
		//		"swirl", "zoomIn", "zoomOut". If "none" is specified, transition
		//		occurs immediately without animation.
		transition: "",

		// transitionDir: Number
		//		The transition direction. If 1, transition forward. If -1,
		//		transition backward. For example, the slide transition slides
		//		the view from right to left when dir == 1, and from left to
		//		right when dir == -1.
		transitionDir: 1,

		// transitionOptions: Object
		//		A hash object that holds transition options.
		transitionOptions: null,

		// callback: Function|String
		//		A callback function that is called when the transition has been
		//		finished. A function reference, or name of a function in
		//		context.
		callback: null,

		// sync: Boolean
		//		If true, XHR for the view content specified with the url
		//		parameter is performed synchronously. If false, it is done
		//		asynchronously and the progress indicator is displayed while
		//		loading the content. This parameter is effective only when the
		//		url parameter is used.
		sync: true,

		// label: String
		//		A label of the item. If the label is not specified, innerHTML is
		//		used as a label.
		label: "",

		// toggle: Boolean
		//		If true, the item acts like a toggle button.
		toggle: false,

		// _duration: Number
		//		Duration of selection, milliseconds.
		_duration: 800,

	
		inheritParams: function(){
			var parent = this.getParent();
			if(parent){
				if(!this.transition){ this.transition = parent.transition; }
				if(this.icon && parent.iconBase &&
					parent.iconBase.charAt(parent.iconBase.length - 1) === '/'){
					this.icon = parent.iconBase + this.icon;
				}
				if(!this.icon){ this.icon = parent.iconBase; }
				if(!this.iconPos){ this.iconPos = parent.iconPos; }
			}
		},
	
		select: function(){
			// summary:
			//		Makes this widget in the selected state.
			// description:
			//		Subclass must implement.
		},
	
		deselect: function(){
			// summary:
			//		Makes this widget in the deselected state.
			// description:
			//		Subclass must implement.
		},
	
		defaultClickAction: function(e){
			if(this.toggle){
				if(this.selected){
					this.deselect();
				}else{
					this.select();
				}
			}else if(!this.selected){
				this.select();
				if(!this.selectOne){
					var _this = this;
					setTimeout(function(){
						_this.deselect();
					}, this._duration);
				}
				var transOpts;
				if(this.moveTo || this.href || this.url || this.scene){
					transOpts = {moveTo: this.moveTo, href: this.href, url: this.url, scene: this.scene, transition: this.transition, transitionDir: this.transitionDir};
				}else if(this.transitionOptions){
					transOpts = this.transitionOptions;
				}	
				if(transOpts){
					return new TransitionEvent(this.domNode,transOpts,e).dispatch();
				}
			}
		},
	
		getParent: function(){
			// summary:
			//		Gets the parent widget.
			// description:
			//		Almost equivalent to _Contained#getParent, but this method
			//		does not cause a script error even if this widget has no
			//		parent yet.
			var ref = this.srcNodeRef || this.domNode;
			return ref && ref.parentNode ? registry.getEnclosingWidget(ref.parentNode) : null;
		},

		setTransitionPos: function(e){
			// summary:
			//		Stores the clicked position for later use.
			// description:
			//		Some of the transition animations (e.g. ScaleIn) needs the
			//		clicked position.
			var w = this;
			while(true){
				w = w.getParent();
				if(!w || w instanceof View){ break; }
			}
			if(w){
				w.clickedPosX = e.clientX;
				w.clickedPosY = e.clientY;
			}
		},

		transitionTo: function(moveTo, href, url, scene){
			// summary:
			//		Performs a view transition.
			// description:
			//		Given a transition destination, this method performs a view
			//		transition. This method is typically called when this item
			//		is clicked.
			if(config.isDebug){
				var alreadyCalledHash = arguments.callee._ach || (arguments.callee._ach = {}),
					caller = (arguments.callee.caller || "unknown caller").toString();
				if(!alreadyCalledHash[caller]){
					kernel.deprecated(this.declaredClass + "::transitionTo() is deprecated." +
					caller, "", "2.0");
					alreadyCalledHash[caller] = true;
				}
			}
			new TransitionEvent(this.domNode, {moveTo: moveTo, href: href, url: url, scene: scene,
						transition: this.transition, transitionDir: this.transitionDir}).dispatch();
		}
	});
});

},
'dojox/mobile/ToolBarButton':function(){
define("dojox/mobile/ToolBarButton", [
	"dojo/_base/declare",
	"dojo/_base/window",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-style",
	"./common",
	"./_ItemBase"
], function(declare, win, domClass, domConstruct, domStyle, common, ItemBase){
/*=====
	var ItemBase = dojox.mobile._ItemBase;
=====*/

	// module:
	//		dojox/mobile/ToolBarButton
	// summary:
	//		A button widget that is placed in the Heading widget.

	return declare("dojox.mobile.ToolBarButton", ItemBase, {
		// summary:
		//		A button widget that is placed in the Heading widget.
		// description:
		//		ToolBarButton is a button that is placed in the Heading
		//		widget. It is a subclass of dojox.mobile._ItemBase just like
		//		ListItem or IconItem. So, unlike Button, it has basically the
		//		same capability as ListItem or IconItem, such as icon support,
		//		transition, etc.

		// selected: Boolean
		//		If true, the button is in the selected status.
		selected: false,

		// btnClass: String
		//		Deprecated.
		btnClass: "",

		/* internal properties */	
		_defaultColor: "mblColorDefault",
		_selColor: "mblColorDefaultSel",

		buildRendering: function(){
			this.domNode = this.containerNode = this.srcNodeRef || win.doc.createElement("div");
			this.inheritParams();
			domClass.add(this.domNode, "mblToolBarButton mblArrowButtonText");
			var color;
			if(this.selected){
				color = this._selColor;
			}else if(this.domNode.className.indexOf("mblColor") == -1){
				color = this._defaultColor;
			}
			domClass.add(this.domNode, color);
	
			if(!this.label){
				this.label = this.domNode.innerHTML;
			}

			if(this.icon && this.icon != "none"){
				this.iconNode = domConstruct.create("div", {className:"mblToolBarButtonIcon"}, this.domNode);
				common.createIcon(this.icon, this.iconPos, null, this.alt, this.iconNode);
				if(this.iconPos){
					domClass.add(this.iconNode.firstChild, "mblToolBarButtonSpriteIcon");
				}
			}else{
				if(common.createDomButton(this.domNode)){
					domClass.add(this.domNode, "mblToolBarButtonDomButton");
				}else{
					domClass.add(this.domNode, "mblToolBarButtonText");
				}
			}
			this.connect(this.domNode, "onclick", "onClick");
		},
	
		select: function(){
			// summary:
			//		Makes this widget in the selected state.
			domClass.toggle(this.domNode, this._selColor, !arguments[0]);
			this.selected = !arguments[0];
		},
		
		deselect: function(){
			// summary:
			//		Makes this widget in the deselected state.
			this.select(true);
		},
	
		onClick: function(e){
			this.setTransitionPos(e);
			this.defaultClickAction();
		},
	
		_setBtnClassAttr: function(/*String*/btnClass){
			var node = this.domNode;
			if(node.className.match(/(mblDomButton\w+)/)){
				domClass.remove(node, RegExp.$1);
			}
			domClass.add(node, btnClass);
			if(common.createDomButton(this.domNode)){
				domClass.add(this.domNode, "mblToolBarButtonDomButton");
			}
		},

		_setLabelAttr: function(/*String*/text){
			this.label = text;
			this.domNode.innerHTML = this._cv ? this._cv(text) : text;
		}
	});
});

},
'dijit/_Contained':function(){
define("dijit/_Contained", [
	"dojo/_base/declare", // declare
	"./registry"	// registry.getEnclosingWidget(), registry.byNode()
], function(declare, registry){

	// module:
	//		dijit/_Contained
	// summary:
	//		Mixin for widgets that are children of a container widget

	return declare("dijit._Contained", null, {
		// summary:
		//		Mixin for widgets that are children of a container widget
		//
		// example:
		// | 	// make a basic custom widget that knows about it's parents
		// |	declare("my.customClass",[dijit._Widget,dijit._Contained],{});

		_getSibling: function(/*String*/ which){
			// summary:
			//      Returns next or previous sibling
			// which:
			//      Either "next" or "previous"
			// tags:
			//      private
			var node = this.domNode;
			do{
				node = node[which+"Sibling"];
			}while(node && node.nodeType != 1);
			return node && registry.byNode(node);	// dijit._Widget
		},

		getPreviousSibling: function(){
			// summary:
			//		Returns null if this is the first child of the parent,
			//		otherwise returns the next element sibling to the "left".

			return this._getSibling("previous"); // dijit._Widget
		},

		getNextSibling: function(){
			// summary:
			//		Returns null if this is the last child of the parent,
			//		otherwise returns the next element sibling to the "right".

			return this._getSibling("next"); // dijit._Widget
		},

		getIndexInParent: function(){
			// summary:
			//		Returns the index of this widget within its container parent.
			//		It returns -1 if the parent does not exist, or if the parent
			//		is not a dijit._Container

			var p = this.getParent();
			if(!p || !p.getIndexOfChild){
				return -1; // int
			}
			return p.getIndexOfChild(this); // int
		}
	});
});

},
'dijit/form/_TextBoxMixin':function(){
define("dijit/form/_TextBoxMixin", [
	"dojo/_base/array", // array.forEach
	"dojo/_base/declare", // declare
	"dojo/dom", // dom.byId
	"dojo/_base/event", // event.stop
	"dojo/keys", // keys.ALT keys.CAPS_LOCK keys.CTRL keys.META keys.SHIFT
	"dojo/_base/lang", // lang.mixin
	".."	// for exporting dijit._setSelectionRange, dijit.selectInputText
], function(array, declare, dom, event, keys, lang, dijit){

// module:
//		dijit/form/_TextBoxMixin
// summary:
//		A mixin for textbox form input widgets

var _TextBoxMixin = declare("dijit.form._TextBoxMixin", null, {
	// summary:
	//		A mixin for textbox form input widgets

	// trim: Boolean
	//		Removes leading and trailing whitespace if true.  Default is false.
	trim: false,

	// uppercase: Boolean
	//		Converts all characters to uppercase if true.  Default is false.
	uppercase: false,

	// lowercase: Boolean
	//		Converts all characters to lowercase if true.  Default is false.
	lowercase: false,

	// propercase: Boolean
	//		Converts the first character of each word to uppercase if true.
	propercase: false,

	// maxLength: String
	//		HTML INPUT tag maxLength declaration.
	maxLength: "",

	// selectOnClick: [const] Boolean
	//		If true, all text will be selected when focused with mouse
	selectOnClick: false,

	// placeHolder: String
	//		Defines a hint to help users fill out the input field (as defined in HTML 5).
	//		This should only contain plain text (no html markup).
	placeHolder: "",

	_getValueAttr: function(){
		// summary:
		//		Hook so get('value') works as we like.
		// description:
		//		For `dijit.form.TextBox` this basically returns the value of the <input>.
		//
		//		For `dijit.form.MappedTextBox` subclasses, which have both
		//		a "displayed value" and a separate "submit value",
		//		This treats the "displayed value" as the master value, computing the
		//		submit value from it via this.parse().
		return this.parse(this.get('displayedValue'), this.constraints);
	},

	_setValueAttr: function(value, /*Boolean?*/ priorityChange, /*String?*/ formattedValue){
		// summary:
		//		Hook so set('value', ...) works.
		//
		// description:
		//		Sets the value of the widget to "value" which can be of
		//		any type as determined by the widget.
		//
		// value:
		//		The visual element value is also set to a corresponding,
		//		but not necessarily the same, value.
		//
		// formattedValue:
		//		If specified, used to set the visual element value,
		//		otherwise a computed visual value is used.
		//
		// priorityChange:
		//		If true, an onChange event is fired immediately instead of
		//		waiting for the next blur event.

		var filteredValue;
		if(value !== undefined){
			// TODO: this is calling filter() on both the display value and the actual value.
			// I added a comment to the filter() definition about this, but it should be changed.
			filteredValue = this.filter(value);
			if(typeof formattedValue != "string"){
				if(filteredValue !== null && ((typeof filteredValue != "number") || !isNaN(filteredValue))){
					formattedValue = this.filter(this.format(filteredValue, this.constraints));
				}else{ formattedValue = ''; }
			}
		}
		if(formattedValue != null && formattedValue != undefined && ((typeof formattedValue) != "number" || !isNaN(formattedValue)) && this.textbox.value != formattedValue){
			this.textbox.value = formattedValue;
			this._set("displayedValue", this.get("displayedValue"));
		}

		if(this.textDir == "auto"){
			this.applyTextDir(this.focusNode, formattedValue);
		}

		this.inherited(arguments, [filteredValue, priorityChange]);
	},

	// displayedValue: String
	//		For subclasses like ComboBox where the displayed value
	//		(ex: Kentucky) and the serialized value (ex: KY) are different,
	//		this represents the displayed value.
	//
	//		Setting 'displayedValue' through set('displayedValue', ...)
	//		updates 'value', and vice-versa.  Otherwise 'value' is updated
	//		from 'displayedValue' periodically, like onBlur etc.
	//
	//		TODO: move declaration to MappedTextBox?
	//		Problem is that ComboBox references displayedValue,
	//		for benefit of FilteringSelect.
	displayedValue: "",

	_getDisplayedValueAttr: function(){
		// summary:
		//		Hook so get('displayedValue') works.
		// description:
		//		Returns the displayed value (what the user sees on the screen),
		// 		after filtering (ie, trimming spaces etc.).
		//
		//		For some subclasses of TextBox (like ComboBox), the displayed value
		//		is different from the serialized value that's actually
		//		sent to the server (see dijit.form.ValidationTextBox.serialize)

		// TODO: maybe we should update this.displayedValue on every keystroke so that we don't need
		// this method
		// TODO: this isn't really the displayed value when the user is typing
		return this.filter(this.textbox.value);
	},

	_setDisplayedValueAttr: function(/*String*/ value){
		// summary:
		//		Hook so set('displayedValue', ...) works.
		// description:
		//		Sets the value of the visual element to the string "value".
		//		The widget value is also set to a corresponding,
		//		but not necessarily the same, value.

		if(value === null || value === undefined){ value = '' }
		else if(typeof value != "string"){ value = String(value) }

		this.textbox.value = value;

		// sets the serialized value to something corresponding to specified displayedValue
		// (if possible), and also updates the textbox.value, for example converting "123"
		// to "123.00"
		this._setValueAttr(this.get('value'), undefined);

		this._set("displayedValue", this.get('displayedValue'));

		// textDir support
		if(this.textDir == "auto"){
			this.applyTextDir(this.focusNode, value);
		}
	},

	format: function(value /*=====, constraints =====*/){
		// summary:
		//		Replaceable function to convert a value to a properly formatted string.
		// value: String
		// constraints: Object
		// tags:
		//		protected extension
		return ((value == null || value == undefined) ? "" : (value.toString ? value.toString() : value));
	},

	parse: function(value /*=====, constraints =====*/){
		// summary:
		//		Replaceable function to convert a formatted string to a value
		// value: String
		// constraints: Object
		// tags:
		//		protected extension

		return value;	// String
	},

	_refreshState: function(){
		// summary:
		//		After the user types some characters, etc., this method is
		//		called to check the field for validity etc.  The base method
		//		in `dijit.form.TextBox` does nothing, but subclasses override.
		// tags:
		//		protected
	},

	/*=====
	onInput: function(event){
		// summary:
		//		Connect to this function to receive notifications of various user data-input events.
		//		Return false to cancel the event and prevent it from being processed.
		// event:
		//		keydown | keypress | cut | paste | input
		// tags:
		//		callback
	},
	=====*/
	onInput: function(){},

	__skipInputEvent: false,
	_onInput: function(){
		// summary:
		//		Called AFTER the input event has happened
		// set text direction according to textDir that was defined in creation
		if(this.textDir == "auto"){
			this.applyTextDir(this.focusNode, this.focusNode.value);
		}

		this._refreshState();

		// In case someone is watch()'ing for changes to displayedValue
		this._set("displayedValue", this.get("displayedValue"));
	},

	postCreate: function(){
		// setting the value here is needed since value="" in the template causes "undefined"
		// and setting in the DOM (instead of the JS object) helps with form reset actions
		this.textbox.setAttribute("value", this.textbox.value); // DOM and JS values should be the same

		this.inherited(arguments);

		// normalize input events to reduce spurious event processing
		//	onkeydown: do not forward modifier keys
		//	           set charOrCode to numeric keycode
		//	onkeypress: do not forward numeric charOrCode keys (already sent through onkeydown)
		//	onpaste & oncut: set charOrCode to 229 (IME)
		//	oninput: if primary event not already processed, set charOrCode to 229 (IME), else do not forward
		var handleEvent = function(e){
			var charCode = e.charOrCode || e.keyCode || 229;
			if(e.type == "keydown"){
				switch(charCode){ // ignore "state" keys
					case keys.SHIFT:
					case keys.ALT:
					case keys.CTRL:
					case keys.META:
					case keys.CAPS_LOCK:
						return;
					default:
						if(charCode >= 65 && charCode <= 90){ return; } // keydown for A-Z can be processed with keypress
				}
			}
			if(e.type == "keypress" && typeof charCode != "string"){ return; }
			if(e.type == "input"){
				if(this.__skipInputEvent){ // duplicate event
					this.__skipInputEvent = false;
					return;
				}
			}else{
				this.__skipInputEvent = true;
			}
			// create fake event to set charOrCode and to know if preventDefault() was called
			var faux = lang.mixin({}, e, {
				charOrCode: charCode,
				wasConsumed: false,
				preventDefault: function(){
					faux.wasConsumed = true;
					e.preventDefault();
				},
				stopPropagation: function(){ e.stopPropagation(); }
			});
			// give web page author a chance to consume the event
			if(this.onInput(faux) === false){
				event.stop(faux); // return false means stop
			}
			if(faux.wasConsumed){ return; } // if preventDefault was called
			setTimeout(lang.hitch(this, "_onInput", faux), 0); // widget notification after key has posted
		};
		array.forEach([ "onkeydown", "onkeypress", "onpaste", "oncut", "oninput" ], function(event){
			this.connect(this.textbox, event, handleEvent);
		}, this);
	},

	_blankValue: '', // if the textbox is blank, what value should be reported
	filter: function(val){
		// summary:
		//		Auto-corrections (such as trimming) that are applied to textbox
		//		value on blur or form submit.
		// description:
		//		For MappedTextBox subclasses, this is called twice
		// 			- once with the display value
		//			- once the value as set/returned by set('value', ...)
		//		and get('value'), ex: a Number for NumberTextBox.
		//
		//		In the latter case it does corrections like converting null to NaN.  In
		//		the former case the NumberTextBox.filter() method calls this.inherited()
		//		to execute standard trimming code in TextBox.filter().
		//
		//		TODO: break this into two methods in 2.0
		//
		// tags:
		//		protected extension
		if(val === null){ return this._blankValue; }
		if(typeof val != "string"){ return val; }
		if(this.trim){
			val = lang.trim(val);
		}
		if(this.uppercase){
			val = val.toUpperCase();
		}
		if(this.lowercase){
			val = val.toLowerCase();
		}
		if(this.propercase){
			val = val.replace(/[^\s]+/g, function(word){
				return word.substring(0,1).toUpperCase() + word.substring(1);
			});
		}
		return val;
	},

	_setBlurValue: function(){
		this._setValueAttr(this.get('value'), true);
	},

	_onBlur: function(e){
		if(this.disabled){ return; }
		this._setBlurValue();
		this.inherited(arguments);

		if(this._selectOnClickHandle){
			this.disconnect(this._selectOnClickHandle);
		}
	},

	_isTextSelected: function(){
		return this.textbox.selectionStart == this.textbox.selectionEnd;
	},

	_onFocus: function(/*String*/ by){
		if(this.disabled || this.readOnly){ return; }

		// Select all text on focus via click if nothing already selected.
		// Since mouse-up will clear the selection need to defer selection until after mouse-up.
		// Don't do anything on focus by tabbing into the widget since there's no associated mouse-up event.
		if(this.selectOnClick && by == "mouse"){
			this._selectOnClickHandle = this.connect(this.domNode, "onmouseup", function(){
				// Only select all text on first click; otherwise users would have no way to clear
				// the selection.
				this.disconnect(this._selectOnClickHandle);

				// Check if the user selected some text manually (mouse-down, mouse-move, mouse-up)
				// and if not, then select all the text
				if(this._isTextSelected()){
					_TextBoxMixin.selectInputText(this.textbox);
				}
			});
		}
		// call this.inherited() before refreshState(), since this.inherited() will possibly scroll the viewport
		// (to scroll the TextBox into view), which will affect how _refreshState() positions the tooltip
		this.inherited(arguments);

		this._refreshState();
	},

	reset: function(){
		// Overrides dijit._FormWidget.reset().
		// Additionally resets the displayed textbox value to ''
		this.textbox.value = '';
		this.inherited(arguments);
	},
	_setTextDirAttr: function(/*String*/ textDir){
		// summary:
		//		Setter for textDir.
		// description:
		//		Users shouldn't call this function; they should be calling
		//		set('textDir', value)
		// tags:
		//		private

		// only if new textDir is different from the old one
		// and on widgets creation.
		if(!this._created
			|| this.textDir != textDir){
				this._set("textDir", textDir);
				// so the change of the textDir will take place immediately.
				this.applyTextDir(this.focusNode, this.focusNode.value);
		}
	}
});


_TextBoxMixin._setSelectionRange = dijit._setSelectionRange = function(/*DomNode*/ element, /*Number?*/ start, /*Number?*/ stop){
	if(element.setSelectionRange){
		element.setSelectionRange(start, stop);
	}
};

_TextBoxMixin.selectInputText = dijit.selectInputText = function(/*DomNode*/ element, /*Number?*/ start, /*Number?*/ stop){
	// summary:
	//		Select text in the input element argument, from start (default 0), to stop (default end).

	// TODO: use functions in _editor/selection.js?
	element = dom.byId(element);
	if(isNaN(start)){ start = 0; }
	if(isNaN(stop)){ stop = element.value ? element.value.length : 0; }
	try{
		element.focus();
		_TextBoxMixin._setSelectionRange(element, start, stop);
	}catch(e){ /* squelch random errors (esp. on IE) from unexpected focus changes or DOM nodes being hidden */ }
};

return _TextBoxMixin;
});

},
'app/views/Setup':function(){
define("app/views/Setup", ['dojo/_base/declare',
        'dijit/registry', 
        'dojo/_base/lang', 
        'dojo/on', 
        'dojo/_base/xhr', 
        'dojo/dom-form',
        'dojo/_base/event',
        'dojo/_base/Deferred',
        'app/views/ActivityList',
        'dojox/mobile/ProgressIndicator'], function (declare, registry, lang, on, xhr, domForm, event, Deferred, ActivityList, ProgressIndicator) {
	
	// module:
	//		views/ActivityList
	// summary:
	//		Object encapsulating view and event handlers for displaying list game setup
	return declare('app.views.Setup', null,{
			
        	view: null,
        	
        	constructor: function(){
        		this.view = registry.byId('setupView');
        		this._setupEventHandlers();
        	},
        	
        	_setupEventHandlers: function(){
        		registry.byId('startGameBtn').on("Click", lang.hitch(this, this.startNewGame));
        	},
        	
        	show: function(){
        		this.view.show();
        	}, 
        	
        	startNewGame: function(evt){
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(
								lang.hitch(this, function(position){
									this.currentLocation = position.coords;
									this.generateActivities();
								}));
				} else {
					this.generateActivities();
				}
        	},
        	
        
			generateActivities: function(evt) {
	
				this.view.performTransition("activityListView", 1, "slide");
				
				var loadedPromise =  new Deferred();
				Deferred.when(loadedPromise, function(){
					var prog = ProgressIndicator.getInstance();
					prog.stop();
				});
				//give a chance to transition to view
				setTimeout(lang.hitch(this, function() {
					var listItems = registry.byId("setup_check_list").getChildren();
					var selectedCategories = [];
					for(var i = 0; i < listItems.length; i++) {
						if(listItems[i].checked) {
							selectedCategories.push(listItems[i].id);
						}
					}
					viewCache.activityList = new ActivityList();
					var defer = viewCache.activityList.getActivitesForNewGame(selectedCategories);
					defer.then(function(){
						loadedPromise.resolve();
					});
				}), 150);
				
				return false;
			},

        	
        	destroy_game: function(){
        		localStorage.removeItem("game_activities");
        		// if(viewCache.activityList)
        			// viewCache.activityList = null;
        		viewCache.activityList.removeData();
        	}
    });
});


},
'dojox/mobile/scrollable':function(){


define("dojox/mobile/scrollable", [
	"dojo/_base/kernel",
	"dojo/_base/connect",
	"dojo/_base/event",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-style",
	"./sniff"
], function(dojo, connect, event, lang, win, domClass, domConstruct, domStyle, has){

	var dm = lang.getObject("dojox.mobile", true);

/*=====
// summary:
//		Utility for enabling touch scrolling capability.
// description:
//		Mobile WebKit browsers do not allow scrolling inner DIVs. (You need
//		the two-finger operation to scroll them.)
//		That means you cannot have fixed-positioned header/footer bars.
//		To solve this issue, this module disables the browsers default scrolling
//		behavior, and re-builds its own scrolling machinery by handling touch
//		events. In this module, this.domNode has height "100%" and is fixed to
//		the window, and this.containerNode scrolls. If you place a bar outside
//		of this.containerNode, then it will be fixed-positioned while
//		this.containerNode is scrollable.
//
//		This module has the following features:
//		- Scrolls inner DIVs vertically, horizontally, or both.
//		- Vertical and horizontal scroll bars.
//		- Flashes the scroll bars when a view is shown.
//		- Simulates the flick operation using animation.
//		- Respects header/footer bars if any.
//
//		dojox.mobile.scrollable is a simple function object, which holds
//		several properties and functions in it. But if you transform it to a
//		dojo class, it can be used as a mix-in class for any custom dojo
//		widgets. dojox.mobile._ScrollableMixin is such a class.
//
//		Also, it can be used even for non-dojo applications. In such cases,
//		several dojo APIs used in this module, such as dojo.connect,
//		dojo.create, etc., are re-defined so that the code works without dojo.
//		When in dojo, of course those re-defined functions are not necessary.
//		So, they are surrounded by the includeStart and includeEnd directives
//		so that they can be excluded from the build.
//
//		If you use this module for non-dojo application, you need to explicitly
//		assign your outer fixed node and inner scrollable node to this.domNode
//		and this.containerNode respectively.
//
//		Non-dojo application should capture the onorientationchange or
//		the onresize event and call resize() in the event handler.
//
// example:
//		Use this module from a non-dojo applicatoin:
//		| function onLoad(){
//		| 	var scrollable = new dojox.mobile.scrollable(dojo, dojox);
//		| 	scrollable.init({
//		| 		domNode: "outer", // id or node
//		| 		containerNode: "inner" // id or node
//		| 	});
//		| }
//		| <body onload="onLoad()">
//		| 	<h1 id="hd1" style="position:relative;width:100%;z-index:1;">
//		| 		Fixed Header
//		| 	</h1>
//		| 	<div id="outer" style="position:relative;height:100%;overflow:hidden;">
//		| 		<div id="inner" style="position:absolute;width:100%;">
//		| 			... content ...
//		| 		</div>
//		| 	</div>
//		| </body>
=====*/

var scrollable = function(/*Object?*/dojo, /*Object?*/dojox){
	this.fixedHeaderHeight = 0; // height of a fixed header
	this.fixedFooterHeight = 0; // height of a fixed footer
	this.isLocalFooter = false; // footer is view-local (as opposed to application-wide)
	this.scrollBar = true; // show scroll bar or not
	this.scrollDir = "v"; // v: vertical, h: horizontal, vh: both, f: flip
	this.weight = 0.6; // frictional drag
	this.fadeScrollBar = true;
	this.disableFlashScrollBar = false;
	this.threshold = 4; // drag threshold value in pixels
	this.constraint = true; // bounce back to the content area
	this.touchNode = null; // a node that will have touch event handlers
	this.isNested = false; // this scrollable's parent is also a scrollable
	this.dirLock = false; // disable the move handler if scroll starts in the unexpected direction
	this.height = ""; // explicitly specified height of this widget (ex. "300px")
	this.androidWorkaroud = true; // workaround input field jumping issue


	this.init = function(/*Object?*/params){
		if(params){
			for(var p in params){
				if(params.hasOwnProperty(p)){
					this[p] = ((p == "domNode" || p == "containerNode") && typeof params[p] == "string") ?
						win.doc.getElementById(params[p]) : params[p]; // mix-in params
				}
			}
		}
		this.touchNode = this.touchNode || this.containerNode;
		this._v = (this.scrollDir.indexOf("v") != -1); // vertical scrolling
		this._h = (this.scrollDir.indexOf("h") != -1); // horizontal scrolling
		this._f = (this.scrollDir == "f"); // flipping views

		this._ch = []; // connect handlers
		this._ch.push(connect.connect(this.touchNode,
			has("touch") ? "touchstart" : "onmousedown", this, "onTouchStart"));
		if(has("webkit")){
			this._ch.push(connect.connect(this.domNode, "webkitAnimationEnd", this, "onFlickAnimationEnd"));
			this._ch.push(connect.connect(this.domNode, "webkitAnimationStart", this, "onFlickAnimationStart"));

			this._aw = this.androidWorkaroud &&
				has("android") >= 2.2 && has("android") < 3;
			if(this._aw){
				this._ch.push(connect.connect(win.global, "onresize", this, "onScreenSizeChanged"));
				this._ch.push(connect.connect(win.global, "onfocus", this, function(e){
					if(this.containerNode.style.webkitTransform){
						this.stopAnimation();
						this.toTopLeft();
					}
				}));
				this._sz = this.getScreenSize();
			}

			// Creation of keyframes takes a little time. If they are created
			// in a lazy manner, a slight delay is noticeable when you start
			// scrolling for the first time. This is to create keyframes up front.
			for(var i = 0; i < 3; i++){
				this.setKeyframes(null, null, i);
			}
		}
		// Workaround for iPhone flicker issue
		if(has("iphone")){
			domStyle.set(this.containerNode, "webkitTransform", "translate3d(0,0,0)");
		}
		
		this._speed = {x:0, y:0};
		this._appFooterHeight = 0;
		if(this.isTopLevel() && !this.noResize){
			this.resize();
		}
		var _this = this;
		setTimeout(function(){
			_this.flashScrollBar();
		}, 600);
	};

	this.isTopLevel = function(){
		// subclass may want to override
		return true;
	};

	this.cleanup = function(){
		if(this._ch){
			for(var i = 0; i < this._ch.length; i++){
				connect.disconnect(this._ch[i]);
			}
			this._ch = null;
		}
	};

	this.findDisp = function(/*DomNode*/node){
		// summary:
		//		Finds the currently displayed view node from my sibling nodes.
		if(!node.parentNode){ return null; }
		var nodes = node.parentNode.childNodes;
		for(var i = 0; i < nodes.length; i++){
			var n = nodes[i];
			if(n.nodeType === 1 && domClass.contains(n, "mblView") && n.style.display !== "none"){
				return n;
			}
		}
		return node;
	};

	this.getScreenSize = function(){
		// summary:
		//		Returns the dimensions of the browser window.
		return {
			h: win.global.innerHeight||win.doc.documentElement.clientHeight||win.doc.documentElement.offsetHeight,
			w: win.global.innerWidth||win.doc.documentElement.clientWidth||win.doc.documentElement.offsetWidth
		};
	};

	this.isKeyboardShown = function(e){
		// summary:
		//		Internal function for android workaround.
		// description:
		//		Returns true if a virtual keyboard is shown.
		//		Indirectly detects whether a virtual keyboard is shown or not by
		//		examining the screen size.
		// TODO: need more reliable detection logic
		if(!this._sz){ return false; }
		var sz = this.getScreenSize();
		return (sz.w * sz.h) / (this._sz.w * this._sz.h) < 0.8;
	};

	this.disableScroll = function(/*Boolean*/v){
		// summary:
		//		Internal function for android workaround.
		// description:
		//		Disables the touch scrolling and enables the browser's default
		//		scrolling.
		if(this.disableTouchScroll === v || this.domNode.style.display === "none"){ return; }
		this.disableTouchScroll = v;
		this.scrollBar = !v;
		dm.disableHideAddressBar = dm.disableResizeAll = v;
		var of = v ? "visible" : "hidden";
		domStyle.set(this.domNode, "overflow", of);
		domStyle.set(win.doc.documentElement, "overflow", of);
		domStyle.set(win.body(), "overflow", of);
		var c = this.containerNode;
		if(v){
			if(!c.style.webkitTransform){
				// stop animation when soft keyborad is shown before animation ends.
				// TODO: there might be a better way to wait for animation ending.
				this.stopAnimation();
				this.toTopLeft();
			}
			var mt = parseInt(c.style.marginTop) || 0;
			var h = c.offsetHeight + mt + this.fixedFooterHeight - this._appFooterHeight;
			domStyle.set(this.domNode, "height", h + "px");
			
			this._cPos = { // store containerNode's position
				x: parseInt(c.style.left) || 0,
				y: parseInt(c.style.top) || 0
			};
			domStyle.set(c, {
				top: "0px",
				left: "0px"
			});
			
			var a = win.doc.activeElement; // focused input field
			if(a){ // scrolling to show focused input field
				var at = 0; // top position of focused input field
				for(var n = a; n.tagName != "BODY"; n = n.offsetParent){
					at += n.offsetTop;
				}
				var st = at + a.clientHeight + 10 - this.getScreenSize().h; // top postion of browser scroll bar
				if(st > 0){
					win.body().scrollTop = st;
				}
			}	
		}else{
			if(this._cPos){ // restore containerNode's position
				domStyle.set(c, {
					top: this._cPos.y + "px",
					left: this._cPos.x + "px"
				});
				this._cPos = null;
			}
			var tags = this.domNode.getElementsByTagName("*");
			for(var i = 0; i < tags.length; i++){
				tags[i].blur && tags[i].blur();
			}
			// Call dojox.mobile.resizeAll if exists.
			dm.resizeAll && dm.resizeAll();
		}
	};

	this.onScreenSizeChanged = function(e){
		// summary:
		//		Internal function for android workaround.
		var sz = this.getScreenSize();
		if(sz.w * sz.h > this._sz.w * this._sz.h){
			this._sz = sz; // update the screen size
		}
		this.disableScroll(this.isKeyboardShown());
	};

	this.toTransform = function(e){
		// summary:
		//		Internal function for android workaround.
		var c = this.containerNode;
		if(c.offsetTop === 0 && c.offsetLeft === 0 || !c._webkitTransform){ return; }
		domStyle.set(c, {
			webkitTransform: c._webkitTransform,
			top: "0px",
			left: "0px"
		});
		c._webkitTransform = null;
	};

	this.toTopLeft = function(){
		// summary:
		//		Internal function for android workaround.
		var c = this.containerNode;
		if(!c.style.webkitTransform){ return; } // already converted to top/left
		c._webkitTransform = c.style.webkitTransform;
		var pos = this.getPos();
		domStyle.set(c, {
			webkitTransform: "",
			top: pos.y + "px",
			left: pos.x + "px"
		});
	};
	
	this.resize = function(e){
		// summary:
		//		Adjusts the height of the widget.
		// description:
		//		If the height property is 'inherit', the height is inherited
		//		from its offset parent. If 'auto', the content height, which
		//		could be smaller than the entire screen height, is used. If an
		//		explicit height value (ex. "300px"), it is used as the new
		//		height. If nothing is specified as the height property, from the
		//		current top position of the widget to the bottom of the screen
		//		will be the new height.

		// moved from init() to support dynamically added fixed bars
		this._appFooterHeight = (this.fixedFooterHeight && !this.isLocalFooter) ?
			this.fixedFooterHeight : 0;
		if(this.isLocalHeader){
			this.containerNode.style.marginTop = this.fixedHeaderHeight + "px";
		}

		// Get the top position. Same as dojo.position(node, true).y
		var top = 0;
		for(var n = this.domNode; n && n.tagName != "BODY"; n = n.offsetParent){
			n = this.findDisp(n); // find the first displayed view node
			if(!n){ break; }
			top += n.offsetTop;
		}

		// adjust the height of this view
		var	h,
			screenHeight = this.getScreenSize().h,
			dh = screenHeight - top - this._appFooterHeight; // default height
		if(this.height === "inherit"){
			if(this.domNode.offsetParent){
				h = this.domNode.offsetParent.offsetHeight + "px";
			}
		}else if(this.height === "auto"){
			var parent = this.domNode.offsetParent;
			if(parent){
				this.domNode.style.height = "0px";
				var	parentRect = parent.getBoundingClientRect(),
					scrollableRect = this.domNode.getBoundingClientRect(),
					contentBottom = parentRect.bottom - this._appFooterHeight;
				if(scrollableRect.bottom >= contentBottom){ // use entire screen
					dh = screenHeight - (scrollableRect.top - parentRect.top) - this._appFooterHeight;
				}else{ // stretch to fill predefined area
					dh = contentBottom - scrollableRect.bottom;
				}
			}
			// content could be smaller than entire screen height
			var contentHeight = Math.max(this.domNode.scrollHeight, this.containerNode.scrollHeight);
			h = (contentHeight ? Math.min(contentHeight, dh) : dh) + "px";
		}else if(this.height){
			h = this.height;
		}
		if(!h){
			h = dh + "px";
		}
		if(h.charAt(0) !== "-" && // to ensure that h is not negative (e.g. "-10px")
			h !== "default"){
			this.domNode.style.height = h;
		}

		// to ensure that the view is within a scrolling area when resized.
		this.onTouchEnd();
	};

	this.onFlickAnimationStart = function(e){
		event.stop(e);
	};

	this.onFlickAnimationEnd = function(e){
		var an = e && e.animationName;
		if(an && an.indexOf("scrollableViewScroll2") === -1){
			if(an.indexOf("scrollableViewScroll0") !== -1){ // scrollBarV
				domClass.remove(this._scrollBarNodeV, "mblScrollableScrollTo0");
			}else if(an.indexOf("scrollableViewScroll1") !== -1){ // scrollBarH
				domClass.remove(this._scrollBarNodeH, "mblScrollableScrollTo1");
			}else{ // fade or others
				if(this._scrollBarNodeV){ this._scrollBarNodeV.className = ""; }
				if(this._scrollBarNodeH){ this._scrollBarNodeH.className = ""; }
			}
			return;
		}
		if(e && e.srcElement){
			event.stop(e);
		}
		this.stopAnimation();
		if(this._bounce){
			var _this = this;
			var bounce = _this._bounce;
			setTimeout(function(){
				_this.slideTo(bounce, 0.3, "ease-out");
			}, 0);
			_this._bounce = undefined;
		}else{
			this.hideScrollBar();
			this.removeCover();
			if(this._aw){ this.toTopLeft(); } // android workaround
		}
	};

	this.isFormElement = function(node){
		if(node && node.nodeType !== 1){ node = node.parentNode; }
		if(!node || node.nodeType !== 1){ return false; }
		var t = node.tagName;
		return (t === "SELECT" || t === "INPUT" || t === "TEXTAREA" || t === "BUTTON");
	};

	this.onTouchStart = function(e){
		if(this.disableTouchScroll){ return; }
		if(this._conn && (new Date()).getTime() - this.startTime < 500){
			return; // ignore successive onTouchStart calls
		}
		if(!this._conn){
			this._conn = [];
			this._conn.push(connect.connect(win.doc, has("touch") ? "touchmove" : "onmousemove", this, "onTouchMove"));
			this._conn.push(connect.connect(win.doc, has("touch") ? "touchend" : "onmouseup", this, "onTouchEnd"));
		}

		this._aborted = false;
		if(domClass.contains(this.containerNode, "mblScrollableScrollTo2")){
			this.abort();
		}else{ // reset scrollbar class especially for reseting fade-out animation
			if(this._scrollBarNodeV){ this._scrollBarNodeV.className = ""; }
			if(this._scrollBarNodeH){ this._scrollBarNodeH.className = ""; }
		}
		if(this._aw){ this.toTransform(e); } // android workaround
		this.touchStartX = e.touches ? e.touches[0].pageX : e.clientX;
		this.touchStartY = e.touches ? e.touches[0].pageY : e.clientY;
		this.startTime = (new Date()).getTime();
		this.startPos = this.getPos();
		this._dim = this.getDim();
		this._time = [0];
		this._posX = [this.touchStartX];
		this._posY = [this.touchStartY];
		this._locked = false;

		if(!this.isFormElement(e.target) && !this.isNested){
			event.stop(e);
		}
	};

	this.onTouchMove = function(e){
		if(this._locked){ return; }
		var x = e.touches ? e.touches[0].pageX : e.clientX;
		var y = e.touches ? e.touches[0].pageY : e.clientY;
		var dx = x - this.touchStartX;
		var dy = y - this.touchStartY;
		var to = {x:this.startPos.x + dx, y:this.startPos.y + dy};
		var dim = this._dim;

		dx = Math.abs(dx);
		dy = Math.abs(dy);
		if(this._time.length == 1){ // the first TouchMove after TouchStart
			if(this.dirLock){
				if(this._v && !this._h && dx >= this.threshold && dx >= dy ||
					(this._h || this._f) && !this._v && dy >= this.threshold && dy >= dx){
					this._locked = true;
					return;
				}
			}
			if(this._v && Math.abs(dy) < this.threshold ||
				(this._h || this._f) && Math.abs(dx) < this.threshold){
				return;
			}
			this.addCover();
			this.showScrollBar();
		}

		var weight = this.weight;
		if(this._v && this.constraint){
			if(to.y > 0){ // content is below the screen area
				to.y = Math.round(to.y * weight);
			}else if(to.y < -dim.o.h){ // content is above the screen area
				if(dim.c.h < dim.d.h){ // content is shorter than display
					to.y = Math.round(to.y * weight);
				}else{
					to.y = -dim.o.h - Math.round((-dim.o.h - to.y) * weight);
				}
			}
		}
		if((this._h || this._f) && this.constraint){
			if(to.x > 0){
				to.x = Math.round(to.x * weight);
			}else if(to.x < -dim.o.w){
				if(dim.c.w < dim.d.w){
					to.x = Math.round(to.x * weight);
				}else{
					to.x = -dim.o.w - Math.round((-dim.o.w - to.x) * weight);
				}
			}
		}
		this.scrollTo(to);

		var max = 10;
		var n = this._time.length; // # of samples
		if(n >= 2){
			// Check the direction of the finger move.
			// If the direction has been changed, discard the old data.
			var d0, d1;
			if(this._v && !this._h){
				d0 = this._posY[n - 1] - this._posY[n - 2];
				d1 = y - this._posY[n - 1];
			}else if(!this._v && this._h){
				d0 = this._posX[n - 1] - this._posX[n - 2];
				d1 = x - this._posX[n - 1];
			}
			if(d0 * d1 < 0){ // direction changed
				// leave only the latest data
				this._time = [this._time[n - 1]];
				this._posX = [this._posX[n - 1]];
				this._posY = [this._posY[n - 1]];
				n = 1;
			}
		}
		if(n == max){
			this._time.shift();
			this._posX.shift();
			this._posY.shift();
		}
		this._time.push((new Date()).getTime() - this.startTime);
		this._posX.push(x);
		this._posY.push(y);
	};

	this.onTouchEnd = function(e){
		if(this._locked){ return; }
		var speed = this._speed = {x:0, y:0};
		var dim = this._dim;
		var pos = this.getPos();
		var to = {}; // destination
		if(e){
			if(!this._conn){ return; } // if we get onTouchEnd without onTouchStart, ignore it.
			for(var i = 0; i < this._conn.length; i++){
				connect.disconnect(this._conn[i]);
			}
			this._conn = null;
	
			var n = this._time.length; // # of samples
			var clicked = false;
			if(!this._aborted){
				if(n <= 1){
					clicked = true;
				}else if(n == 2 && Math.abs(this._posY[1] - this._posY[0]) < 4
					&& has("touch")){ // for desktop browsers, posY could be the same, since we're using clientY, see onTouchMove()
					clicked = true;
				}
			}
			var isFormElem = this.isFormElement(e.target);
			if(clicked && !isFormElem){ // clicked, not dragged or flicked
				this.hideScrollBar();
				this.removeCover();
				if(has("touch")){
					var elem = e.target;
					if(elem.nodeType != 1){
						elem = elem.parentNode;
					}
					var ev = win.doc.createEvent("MouseEvents");
					ev.initMouseEvent("click", true, true, win.global, 1, e.screenX, e.screenY, e.clientX, e.clientY);
					setTimeout(function(){
						elem.dispatchEvent(ev);
					}, 0);
				}
				return;
			}else if(this._aw && clicked && isFormElem){ // clicked input fields
				this.hideScrollBar();
				this.toTopLeft();
				return;
			}
			speed = this._speed = this.getSpeed();
		}else{
			if(pos.x == 0 && pos.y == 0){ return; } // initializing
			dim = this.getDim();
		}

		if(this._v){
			to.y = pos.y + speed.y;
		}
		if(this._h || this._f){
			to.x = pos.x + speed.x;
		}

		this.adjustDestination(to, pos);

		if(this.scrollDir == "v" && dim.c.h < dim.d.h){ // content is shorter than display
			this.slideTo({y:0}, 0.3, "ease-out"); // go back to the top
			return;
		}else if(this.scrollDir == "h" && dim.c.w < dim.d.w){ // content is narrower than display
			this.slideTo({x:0}, 0.3, "ease-out"); // go back to the left
			return;
		}else if(this._v && this._h && dim.c.h < dim.d.h && dim.c.w < dim.d.w){
			this.slideTo({x:0, y:0}, 0.3, "ease-out"); // go back to the top-left
			return;
		}

		var duration, easing = "ease-out";
		var bounce = {};
		if(this._v && this.constraint){
			if(to.y > 0){ // going down. bounce back to the top.
				if(pos.y > 0){ // started from below the screen area. return quickly.
					duration = 0.3;
					to.y = 0;
				}else{
					to.y = Math.min(to.y, 20);
					easing = "linear";
					bounce.y = 0;
				}
			}else if(-speed.y > dim.o.h - (-pos.y)){ // going up. bounce back to the bottom.
				if(pos.y < -dim.o.h){ // started from above the screen top. return quickly.
					duration = 0.3;
					to.y = dim.c.h <= dim.d.h ? 0 : -dim.o.h; // if shorter, move to 0
				}else{
					to.y = Math.max(to.y, -dim.o.h - 20);
					easing = "linear";
					bounce.y = -dim.o.h;
				}
			}
		}
		if((this._h || this._f) && this.constraint){
			if(to.x > 0){ // going right. bounce back to the left.
				if(pos.x > 0){ // started from right of the screen area. return quickly.
					duration = 0.3;
					to.x = 0;
				}else{
					to.x = Math.min(to.x, 20);
					easing = "linear";
					bounce.x = 0;
				}
			}else if(-speed.x > dim.o.w - (-pos.x)){ // going left. bounce back to the right.
				if(pos.x < -dim.o.w){ // started from left of the screen top. return quickly.
					duration = 0.3;
					to.x = dim.c.w <= dim.d.w ? 0 : -dim.o.w; // if narrower, move to 0
				}else{
					to.x = Math.max(to.x, -dim.o.w - 20);
					easing = "linear";
					bounce.x = -dim.o.w;
				}
			}
		}
		this._bounce = (bounce.x !== undefined || bounce.y !== undefined) ? bounce : undefined;

		if(duration === undefined){
			var distance, velocity;
			if(this._v && this._h){
				velocity = Math.sqrt(speed.x+speed.x + speed.y*speed.y);
				distance = Math.sqrt(Math.pow(to.y - pos.y, 2) + Math.pow(to.x - pos.x, 2));
			}else if(this._v){
				velocity = speed.y;
				distance = to.y - pos.y;
			}else if(this._h){
				velocity = speed.x;
				distance = to.x - pos.x;
			}
			if(distance === 0 && !e){ return; } // #13154
			duration = velocity !== 0 ? Math.abs(distance / velocity) : 0.01; // time = distance / velocity
		}
		this.slideTo(to, duration, easing);
	};

	this.adjustDestination = function(to, pos){
		// subclass may want to implement
	};

	this.abort = function(){
		this.scrollTo(this.getPos());
		this.stopAnimation();
		this._aborted = true;
	};

	this.stopAnimation = function(){
		// stop the currently running animation
		domClass.remove(this.containerNode, "mblScrollableScrollTo2");
		if(has("android")){
			domStyle.set(this.containerNode, "webkitAnimationDuration", "0s"); // workaround for android screen flicker problem
		}
		if(this._scrollBarV){
			this._scrollBarV.className = "";
		}
		if(this._scrollBarH){
			this._scrollBarH.className = "";
		}
	};

	this.getSpeed = function(){
		var x = 0, y = 0, n = this._time.length;
		// if the user holds the mouse or finger more than 0.5 sec, do not move.
		if(n >= 2 && (new Date()).getTime() - this.startTime - this._time[n - 1] < 500){
			var dy = this._posY[n - (n > 3 ? 2 : 1)] - this._posY[(n - 6) >= 0 ? n - 6 : 0];
			var dx = this._posX[n - (n > 3 ? 2 : 1)] - this._posX[(n - 6) >= 0 ? n - 6 : 0];
			var dt = this._time[n - (n > 3 ? 2 : 1)] - this._time[(n - 6) >= 0 ? n - 6 : 0];
			y = this.calcSpeed(dy, dt);
			x = this.calcSpeed(dx, dt);
		}
		return {x:x, y:y};
	};

	this.calcSpeed = function(/*Number*/d, /*Number*/t){
		return Math.round(d / t * 100) * 4;
	};

	this.scrollTo = function(/*Object*/to, /*Boolean?*/doNotMoveScrollBar, /*DomNode?*/node){ // to: {x, y}
		// summary:
		//		Scrolls to the given position.
		var s = (node || this.containerNode).style;
		if(has("webkit")){
			s.webkitTransform = this.makeTranslateStr(to);
		}else{
			if(this._v){
				s.top = to.y + "px";
			}
			if(this._h || this._f){
				s.left = to.x + "px";
			}
		}
		if(!doNotMoveScrollBar){
			this.scrollScrollBarTo(this.calcScrollBarPos(to));
		}
	};

	this.slideTo = function(/*Object*/to, /*Number*/duration, /*String*/easing){
		// summary:
		//		Scrolls to the given position with slide animation.
		this._runSlideAnimation(this.getPos(), to, duration, easing, this.containerNode, 2);
		this.slideScrollBarTo(to, duration, easing);
	};

	this.makeTranslateStr = function(to){
		var y = this._v && typeof to.y == "number" ? to.y+"px" : "0px";
		var x = (this._h||this._f) && typeof to.x == "number" ? to.x+"px" : "0px";
		return dm.hasTranslate3d ?
				"translate3d("+x+","+y+",0px)" : "translate("+x+","+y+")";
	};

	this.getPos = function(){
		// summary:
		//		Get the top position in the midst of animation
		if(has("webkit")){
			var m = win.doc.defaultView.getComputedStyle(this.containerNode, '')["-webkit-transform"];
			if(m && m.indexOf("matrix") === 0){
				var arr = m.split(/[,\s\)]+/);
				return {y:arr[5] - 0, x:arr[4] - 0};
			}
			return {x:0, y:0};
		}else{
			// this.containerNode.offsetTop does not work here,
			// because it adds the height of the top margin.
			var y = parseInt(this.containerNode.style.top) || 0;
			return {y:y, x:this.containerNode.offsetLeft};
		}
	};

	this.getDim = function(){
		var d = {};
		// content width/height
		d.c = {h:this.containerNode.offsetHeight, w:this.containerNode.offsetWidth};

		// view width/height
		d.v = {h:this.domNode.offsetHeight + this._appFooterHeight, w:this.domNode.offsetWidth};

		// display width/height
		d.d = {h:d.v.h - this.fixedHeaderHeight - this.fixedFooterHeight, w:d.v.w};

		// overflowed width/height
		d.o = {h:d.c.h - d.v.h + this.fixedHeaderHeight + this.fixedFooterHeight, w:d.c.w - d.v.w};
		return d;
	};

	this.showScrollBar = function(){
		if(!this.scrollBar){ return; }

		var dim = this._dim;
		if(this.scrollDir == "v" && dim.c.h <= dim.d.h){ return; }
		if(this.scrollDir == "h" && dim.c.w <= dim.d.w){ return; }
		if(this._v && this._h && dim.c.h <= dim.d.h && dim.c.w <= dim.d.w){ return; }

		var createBar = function(self, dir){
			var bar = self["_scrollBarNode" + dir];
			if(!bar){
				var wrapper = domConstruct.create("div", null, self.domNode);
				var props = { position: "absolute", overflow: "hidden" };
				if(dir == "V"){
					props.right = "2px";
					props.width = "5px";
				}else{
					props.bottom = (self.isLocalFooter ? self.fixedFooterHeight : 0) + 2 + "px";
					props.height = "5px";
				}
				domStyle.set(wrapper, props);
				wrapper.className = "mblScrollBarWrapper";
				self["_scrollBarWrapper"+dir] = wrapper;

				bar = domConstruct.create("div", null, wrapper);
				domStyle.set(bar, {
					opacity: 0.6,
					position: "absolute",
					backgroundColor: "#606060",
					fontSize: "1px",
					webkitBorderRadius: "2px",
					MozBorderRadius: "2px",
					webkitTransformOrigin: "0 0",
					zIndex: 2147483647 // max of signed 32-bit integer
				});
				domStyle.set(bar, dir == "V" ? {width: "5px"} : {height: "5px"});
				self["_scrollBarNode" + dir] = bar;
			}
			return bar;
		};
		if(this._v && !this._scrollBarV){
			this._scrollBarV = createBar(this, "V");
		}
		if(this._h && !this._scrollBarH){
			this._scrollBarH = createBar(this, "H");
		}
		this.resetScrollBar();
	};

	this.hideScrollBar = function(){
		var fadeRule;
		if(this.fadeScrollBar && has("webkit")){
			if(!dm._fadeRule){
				var node = domConstruct.create("style", null, win.doc.getElementsByTagName("head")[0]);
				node.textContent =
					".mblScrollableFadeScrollBar{"+
					"  -webkit-animation-duration: 1s;"+
					"  -webkit-animation-name: scrollableViewFadeScrollBar;}"+
					"@-webkit-keyframes scrollableViewFadeScrollBar{"+
					"  from { opacity: 0.6; }"+
					"  to { opacity: 0; }}";
				dm._fadeRule = node.sheet.cssRules[1];
			}
			fadeRule = dm._fadeRule;
		}
		if(!this.scrollBar){ return; }
		var f = function(bar, self){
			domStyle.set(bar, {
				opacity: 0,
				webkitAnimationDuration: ""
			});
			if(self._aw){ // android workaround
				bar.style.webkitTransform = "";
			}else{
				bar.className = "mblScrollableFadeScrollBar";
			}
		};
		if(this._scrollBarV){
			f(this._scrollBarV, this);
			this._scrollBarV = null;
		}
		if(this._scrollBarH){
			f(this._scrollBarH, this);
			this._scrollBarH = null;
		}
	};

	this.calcScrollBarPos = function(/*Object*/to){ // to: {x, y}
		var pos = {};
		var dim = this._dim;
		var f = function(wrapperH, barH, t, d, c){
			var y = Math.round((d - barH - 8) / (d - c) * t);
			if(y < -barH + 5){
				y = -barH + 5;
			}
			if(y > wrapperH - 5){
				y = wrapperH - 5;
			}
			return y;
		};
		if(typeof to.y == "number" && this._scrollBarV){
			pos.y = f(this._scrollBarWrapperV.offsetHeight, this._scrollBarV.offsetHeight, to.y, dim.d.h, dim.c.h);
		}
		if(typeof to.x == "number" && this._scrollBarH){
			pos.x = f(this._scrollBarWrapperH.offsetWidth, this._scrollBarH.offsetWidth, to.x, dim.d.w, dim.c.w);
		}
		return pos;
	};

	this.scrollScrollBarTo = function(/*Object*/to){ // to: {x, y}
		if(!this.scrollBar){ return; }
		if(this._v && this._scrollBarV && typeof to.y == "number"){
			if(has("webkit")){
				this._scrollBarV.style.webkitTransform = this.makeTranslateStr({y:to.y});
			}else{
				this._scrollBarV.style.top = to.y + "px";
			}
		}
		if(this._h && this._scrollBarH && typeof to.x == "number"){
			if(has("webkit")){
				this._scrollBarH.style.webkitTransform = this.makeTranslateStr({x:to.x});
			}else{
				this._scrollBarH.style.left = to.x + "px";
			}
		}
	};

	this.slideScrollBarTo = function(/*Object*/to, /*Number*/duration, /*String*/easing){
		if(!this.scrollBar){ return; }
		var fromPos = this.calcScrollBarPos(this.getPos());
		var toPos = this.calcScrollBarPos(to);
		if(this._v && this._scrollBarV){
			this._runSlideAnimation({y:fromPos.y}, {y:toPos.y}, duration, easing, this._scrollBarV, 0);
		}
		if(this._h && this._scrollBarH){
			this._runSlideAnimation({x:fromPos.x}, {x:toPos.x}, duration, easing, this._scrollBarH, 1);
		}
	};

	this._runSlideAnimation = function(/*Object*/from, /*Object*/to, /*Number*/duration, /*String*/easing, node, idx){
		// idx: 0:scrollbarV, 1:scrollbarH, 2:content
		if(has("webkit")){
			this.setKeyframes(from, to, idx);
			domStyle.set(node, {
				webkitAnimationDuration: duration + "s",
				webkitAnimationTimingFunction: easing
			});
			domClass.add(node, "mblScrollableScrollTo"+idx);
			if(idx == 2){
				this.scrollTo(to, true, node);
			}else{
				this.scrollScrollBarTo(to);
			}
		}else if(dojo.fx && dojo.fx.easing && duration){
			// If you want to support non-webkit browsers,
			// your application needs to load necessary modules as follows:
			//
			// | dojo.require("dojo.fx");
			// | dojo.require("dojo.fx.easing");
			//
			// This module itself does not make dependency on them.
			var s = dojo.fx.slideTo({
				node: node,
				duration: duration*1000,
				left: to.x,
				top: to.y,
				easing: (easing == "ease-out") ? dojo.fx.easing.quadOut : dojo.fx.easing.linear
			}).play();
			if(idx == 2){
				connect.connect(s, "onEnd", this, "onFlickAnimationEnd");
			}
		}else{
			// directly jump to the destination without animation
			if(idx == 2){
				this.scrollTo(to, false, node);
				this.onFlickAnimationEnd();
			}else{
				this.scrollScrollBarTo(to);
			}
		}
	};

	this.resetScrollBar = function(){
		//	summary:
		//		Resets the scroll bar length, position, etc.
		var f = function(wrapper, bar, d, c, hd, v){
			if(!bar){ return; }
			var props = {};
			props[v ? "top" : "left"] = hd + 4 + "px"; // +4 is for top or left margin
			var t = (d - 8) <= 0 ? 1 : d - 8;
			props[v ? "height" : "width"] = t + "px";
			domStyle.set(wrapper, props);
			var l = Math.round(d * d / c); // scroll bar length
			l = Math.min(Math.max(l - 8, 5), t); // -8 is for margin for both ends
			bar.style[v ? "height" : "width"] = l + "px";
			domStyle.set(bar, {"opacity": 0.6});
		};
		var dim = this.getDim();
		f(this._scrollBarWrapperV, this._scrollBarV, dim.d.h, dim.c.h, this.fixedHeaderHeight, true);
		f(this._scrollBarWrapperH, this._scrollBarH, dim.d.w, dim.c.w, 0);
		this.createMask();
	};

	this.createMask = function(){
		//	summary:
		//		Creates a mask for a scroll bar edge.
		// description:
		//		This function creates a mask that hides corners of one scroll
		//		bar edge to make it round edge. The other side of the edge is
		//		always visible and round shaped with the border-radius style.
		if(!has("webkit")){ return; }
		var ctx;
		if(this._scrollBarWrapperV){
			var h = this._scrollBarWrapperV.offsetHeight;
			ctx = win.doc.getCSSCanvasContext("2d", "scrollBarMaskV", 5, h);
			ctx.fillStyle = "rgba(0,0,0,0.5)";
			ctx.fillRect(1, 0, 3, 2);
			ctx.fillRect(0, 1, 5, 1);
			ctx.fillRect(0, h - 2, 5, 1);
			ctx.fillRect(1, h - 1, 3, 2);
			ctx.fillStyle = "rgb(0,0,0)";
			ctx.fillRect(0, 2, 5, h - 4);
			this._scrollBarWrapperV.style.webkitMaskImage = "-webkit-canvas(scrollBarMaskV)";
		}
		if(this._scrollBarWrapperH){
			var w = this._scrollBarWrapperH.offsetWidth;
			ctx = win.doc.getCSSCanvasContext("2d", "scrollBarMaskH", w, 5);
			ctx.fillStyle = "rgba(0,0,0,0.5)";
			ctx.fillRect(0, 1, 2, 3);
			ctx.fillRect(1, 0, 1, 5);
			ctx.fillRect(w - 2, 0, 1, 5);
			ctx.fillRect(w - 1, 1, 2, 3);
			ctx.fillStyle = "rgb(0,0,0)";
			ctx.fillRect(2, 0, w - 4, 5);
			this._scrollBarWrapperH.style.webkitMaskImage = "-webkit-canvas(scrollBarMaskH)";
		}
	};

	this.flashScrollBar = function(){
		if(this.disableFlashScrollBar){ return; }
		this._dim = this.getDim();
		if(this._dim.d.h <= 0){ return; } // dom is not ready
		this.showScrollBar();
		var _this = this;
		setTimeout(function(){
			_this.hideScrollBar();
		}, 300);
	};

	this.addCover = function(){
		if(!has("touch") && !this.noCover){
			if(!this._cover){
				this._cover = domConstruct.create("div", null, win.doc.body);
				domStyle.set(this._cover, {
					backgroundColor: "#ffff00",
					opacity: 0,
					position: "absolute",
					top: "0px",
					left: "0px",
					width: "100%",
					height: "100%",
					zIndex: 2147483647 // max of signed 32-bit integer
				});
				this._ch.push(connect.connect(this._cover,
					has("touch") ? "touchstart" : "onmousedown", this, "onTouchEnd"));
			}else{
				this._cover.style.display = "";
			}
			this.setSelectable(this._cover, false);
			this.setSelectable(this.domNode, false);
		}
	};

	this.removeCover = function(){
		if(!has("touch") && this._cover){
			this._cover.style.display = "none";
			this.setSelectable(this._cover, true);
			this.setSelectable(this.domNode, true);
		}
	};

	this.setKeyframes = function(/*Object*/from, /*Object*/to, /*Number*/idx){
		if(!dm._rule){
			dm._rule = [];
		}
		// idx: 0:scrollbarV, 1:scrollbarH, 2:content
		if(!dm._rule[idx]){
			var node = domConstruct.create("style", null, win.doc.getElementsByTagName("head")[0]);
			node.textContent =
				".mblScrollableScrollTo"+idx+"{-webkit-animation-name: scrollableViewScroll"+idx+";}"+
				"@-webkit-keyframes scrollableViewScroll"+idx+"{}";
			dm._rule[idx] = node.sheet.cssRules[1];
		}
		var rule = dm._rule[idx];
		if(rule){
			if(from){
				rule.deleteRule("from");
				rule.insertRule("from { -webkit-transform: "+this.makeTranslateStr(from)+"; }");
			}
			if(to){
				if(to.x === undefined){ to.x = from.x; }
				if(to.y === undefined){ to.y = from.y; }
				rule.deleteRule("to");
				rule.insertRule("to { -webkit-transform: "+this.makeTranslateStr(to)+"; }");
			}
		}
	};

	this.setSelectable = function(node, selectable){
		// dojo.setSelectable has dependency on dojo.query. Re-define our own.
		node.style.KhtmlUserSelect = selectable ? "auto" : "none";
		node.style.MozUserSelect = selectable ? "" : "none";
		node.onselectstart = selectable ? null : function(){return false;};
		if(0){
			node.unselectable = selectable ? "" : "on";
			var nodes = node.getElementsByTagName("*");
			for(var i = 0; i < nodes.length; i++){
				nodes[i].unselectable = selectable ? "" : "on";
			}
		}
	};

	// feature detection
	if(has("webkit")){
		var elem = win.doc.createElement("div");
		elem.style.webkitTransform = "translate3d(0px,1px,0px)";
		win.doc.documentElement.appendChild(elem);
		var v = win.doc.defaultView.getComputedStyle(elem, '')["-webkit-transform"];
		dm.hasTranslate3d = v && v.indexOf("matrix") === 0;
		win.doc.documentElement.removeChild(elem);
	}
};

dm.scrollable = scrollable; // for backward compatibility
return scrollable;
});

},
'dijit/_Container':function(){
define("dijit/_Container", [
	"dojo/_base/array", // array.forEach array.indexOf
	"dojo/_base/declare", // declare
	"dojo/dom-construct", // domConstruct.place
	"./registry"	// registry.byNode()
], function(array, declare, domConstruct, registry){

	// module:
	//		dijit/_Container
	// summary:
	//		Mixin for widgets that contain a set of widget children.

	return declare("dijit._Container", null, {
		// summary:
		//		Mixin for widgets that contain a set of widget children.
		// description:
		//		Use this mixin for widgets that needs to know about and
		//		keep track of their widget children. Suitable for widgets like BorderContainer
		//		and TabContainer which contain (only) a set of child widgets.
		//
		//		It's not suitable for widgets like ContentPane
		//		which contains mixed HTML (plain DOM nodes in addition to widgets),
		//		and where contained widgets are not necessarily directly below
		//		this.containerNode.   In that case calls like addChild(node, position)
		//		wouldn't make sense.

		buildRendering: function(){
			this.inherited(arguments);
			if(!this.containerNode){
				// all widgets with descendants must set containerNode
	 			this.containerNode = this.domNode;
			}
		},

		addChild: function(/*dijit._Widget*/ widget, /*int?*/ insertIndex){
			// summary:
			//		Makes the given widget a child of this widget.
			// description:
			//		Inserts specified child widget's dom node as a child of this widget's
			//		container node, and possibly does other processing (such as layout).

			var refNode = this.containerNode;
			if(insertIndex && typeof insertIndex == "number"){
				var children = this.getChildren();
				if(children && children.length >= insertIndex){
					refNode = children[insertIndex-1].domNode;
					insertIndex = "after";
				}
			}
			domConstruct.place(widget.domNode, refNode, insertIndex);

			// If I've been started but the child widget hasn't been started,
			// start it now.  Make sure to do this after widget has been
			// inserted into the DOM tree, so it can see that it's being controlled by me,
			// so it doesn't try to size itself.
			if(this._started && !widget._started){
				widget.startup();
			}
		},

		removeChild: function(/*Widget|int*/ widget){
			// summary:
			//		Removes the passed widget instance from this widget but does
			//		not destroy it.  You can also pass in an integer indicating
			//		the index within the container to remove

			if(typeof widget == "number"){
				widget = this.getChildren()[widget];
			}

			if(widget){
				var node = widget.domNode;
				if(node && node.parentNode){
					node.parentNode.removeChild(node); // detach but don't destroy
				}
			}
		},

		hasChildren: function(){
			// summary:
			//		Returns true if widget has children, i.e. if this.containerNode contains something.
			return this.getChildren().length > 0;	// Boolean
		},

		_getSiblingOfChild: function(/*dijit._Widget*/ child, /*int*/ dir){
			// summary:
			//		Get the next or previous widget sibling of child
			// dir:
			//		if 1, get the next sibling
			//		if -1, get the previous sibling
			// tags:
			//      private
			var node = child.domNode,
				which = (dir>0 ? "nextSibling" : "previousSibling");
			do{
				node = node[which];
			}while(node && (node.nodeType != 1 || !registry.byNode(node)));
			return node && registry.byNode(node);	// dijit._Widget
		},

		getIndexOfChild: function(/*dijit._Widget*/ child){
			// summary:
			//		Gets the index of the child in this container or -1 if not found
			return array.indexOf(this.getChildren(), child);	// int
		}
	});
});

},
'app/controller/Main':function(){
define("app/controller/Main", [ 'dojo/_base/Deferred',
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
         'dojox/mobile/Opener',
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
         'dojox/mobile/EdgeToEdgeList',
         'dojox/mobile/ToolBarButton',
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
    		
    		
    		
    		cachedActivitiesData = localStorage.getItem("game_activities");
    		if (cachedActivitiesData){
    			viewCache.setup = new Setup();
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


},
'dojox/mobile/ScrollableView':function(){
define("dojox/mobile/ScrollableView", [
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dijit/registry",	// registry.byNode
	"./View",
	"./_ScrollableMixin"
], function(array, declare, domClass, domConstruct, registry, View, ScrollableMixin){

	/*=====
		var View = dojox.mobile.View;
		var ScrollableMixin = dojox.mobile._ScrollableMixin;
	=====*/

	// module:
	//		dojox/mobile/ScrollableView
	// summary:
	//		A container that has a touch scrolling capability.

	return declare("dojox.mobile.ScrollableView", [View, ScrollableMixin], {
		// summary:
		//		A container that has a touch scrolling capability.
		// description:
		//		ScrollableView is a subclass of View (=dojox.mobile.View).
		//		Unlike the base View class, ScrollableView's domNode always stays
		//		at the top of the screen and its height is "100%" of the screen.
		//		In this fixed domNode, containerNode scrolls. Browser's default
		//		scrolling behavior is disabled, and the scrolling machinery is
		//		re-implemented with JavaScript. Thus the user does not need to use the
		//		two-finger operation to scroll an inner DIV (containerNode).
		//		The main purpose of this widget is to realize fixed-positioned header
		//		and/or footer bars.

		// scrollableParams: Object
		//		Parameters for dojox.mobile.scrollable.init().
		scrollableParams: null,

		// keepScrollPos: Boolean
		//		Overrides dojox.mobile.View.keepScrollPos.
		keepScrollPos: false,

		constructor: function(){
			this.scrollableParams = {noResize: true};
		},

		buildRendering: function(){
			this.inherited(arguments);
			domClass.add(this.domNode, "mblScrollableView");
			this.domNode.style.overflow = "hidden";
			this.domNode.style.top = "0px";
			this.containerNode = domConstruct.create("DIV",
				{className:"mblScrollableViewContainer"}, this.domNode);
			this.containerNode.style.position = "absolute";
			this.containerNode.style.top = "0px"; // view bar is relative
			if(this.scrollDir === "v"){
				this.containerNode.style.width = "100%";
			}
			this.reparent();
			this.findAppBars();
		},

		resize: function(){
			// summary:
			//		Calls resize() of each child widget.
			this.inherited(arguments); // scrollable#resize() will be called
			array.forEach(this.getChildren(), function(child){
				if(child.resize){ child.resize(); }
			});
		},

		isTopLevel: function(e){
			// summary:
			//		Returns true if this is a top-level widget.
			//		Overrides dojox.mobile.scrollable.
			var parent = this.getParent && this.getParent();
			return (!parent || !parent.resize); // top level widget
		},

		addChild: function(widget, /*Number?*/insertIndex){
			var c = widget.domNode;
			var fixed = this.checkFixedBar(c, true);
			if(fixed){
				// Addition of a fixed bar is an exceptional case.
				// It has to be added to domNode, not containerNode.
				// In this case, insertIndex is ignored.
				this.domNode.appendChild(c);
				if(fixed === "top"){
					this.fixedHeaderHeight = c.offsetHeight;
					this.isLocalHeader = true;
				}else if(fixed === "bottom"){
					this.fixedFooterHeight = c.offsetHeight;
					this.isLocalFooter = true;
					c.style.bottom = "0px";
				}
				this.resize();
				if(this._started && !widget._started){
					widget.startup();
				}
			}else{
				this.inherited(arguments);
			}
		},

		reparent: function(){
			// summary:
			//		Moves all the children, except header and footer, to
			//		containerNode.
			var i, idx, len, c;
			for(i = 0, idx = 0, len = this.domNode.childNodes.length; i < len; i++){
				c = this.domNode.childNodes[idx];
				// search for view-specific header or footer
				if(c === this.containerNode || this.checkFixedBar(c, true)){
					idx++;
					continue;
				}
				this.containerNode.appendChild(this.domNode.removeChild(c));
			}
		},

		onAfterTransitionIn: function(moveTo, dir, transition, context, method){
			this.flashScrollBar();
		},
	
		getChildren: function(){
			// summary:
			//		Overrides _WidgetBase#getChildren to add local fixed bars,
			//		which are not under containerNode, to the children array.
			var children = this.inherited(arguments);
			if(this.fixedHeader && this.fixedHeader.parentNode === this.domNode){
				children.push(registry.byNode(this.fixedHeader));
			}
			if(this.fixedFooter && this.fixedFooter.parentNode === this.domNode){
				children.push(registry.byNode(this.fixedFooter));
			}
			return children;
		}
	});
});

},
'dojo/selector/_loader':function(){
define("dojo/selector/_loader", ["../has", "require"],
		function(has, require){
// summary:
//		This module handles loading the appropriate selector engine for the given browser
"use strict";
var testDiv = document.createElement("div");
has.add("dom-qsa2.1", !!testDiv.querySelectorAll);
has.add("dom-qsa3", function(){
			// test to see if we have a reasonable native selector engine available
			try{
				testDiv.innerHTML = "<p class='TEST'></p>"; // test kind of from sizzle
				// Safari can't handle uppercase or unicode characters when
				// in quirks mode, IE8 can't handle pseudos like :empty
				return testDiv.querySelectorAll(".TEST:empty").length == 1;
			}catch(e){}
		});
var fullEngine;
var acme = "./acme", lite = "./lite";
return {
	load: function(id, parentRequire, loaded, config){
		var req = require;
		// here we implement the default logic for choosing a selector engine
		id = id == "default" ? has("config-selectorEngine") || "css3" : id;
		id = id == "css2" || id == "lite" ? lite :
				id == "css2.1" ? has("dom-qsa2.1") ? lite : acme :
				id == "css3" ? has("dom-qsa3") ? lite : acme :
				id == "acme" ? acme : (req = parentRequire) && id;
		if(id.charAt(id.length-1) == '?'){
			id = id.substring(0,id.length - 1);
			var optionalLoad = true;
		}
		// the query engine is optional, only load it if a native one is not available or existing one has not been loaded
		if(optionalLoad && (has("dom-compliant-qsa") || fullEngine)){
			return loaded(fullEngine);
		}
		// load the referenced selector engine
		req([id], function(engine){
			if(id != "./lite"){
				fullEngine = engine;
			}
			loaded(engine);
		});
	}
};
});

},
'dojo/_base/declare':function(){
define("dojo/_base/declare", ["./kernel", "../has", "./lang"], function(dojo, has, lang){
	// module:
	//		dojo/_base/declare
	// summary:
	//		This module defines dojo.declare.

	var mix = lang.mixin, op = Object.prototype, opts = op.toString,
		xtor = new Function, counter = 0, cname = "constructor";

	function err(msg, cls){ throw new Error("declare" + (cls ? " " + cls : "") + ": " + msg); }

	// C3 Method Resolution Order (see http://www.python.org/download/releases/2.3/mro/)
	function c3mro(bases, className){
		var result = [], roots = [{cls: 0, refs: []}], nameMap = {}, clsCount = 1,
			l = bases.length, i = 0, j, lin, base, top, proto, rec, name, refs;

		// build a list of bases naming them if needed
		for(; i < l; ++i){
			base = bases[i];
			if(!base){
				err("mixin #" + i + " is unknown. Did you use dojo.require to pull it in?", className);
			}else if(opts.call(base) != "[object Function]"){
				err("mixin #" + i + " is not a callable constructor.", className);
			}
			lin = base._meta ? base._meta.bases : [base];
			top = 0;
			// add bases to the name map
			for(j = lin.length - 1; j >= 0; --j){
				proto = lin[j].prototype;
				if(!proto.hasOwnProperty("declaredClass")){
					proto.declaredClass = "uniqName_" + (counter++);
				}
				name = proto.declaredClass;
				if(!nameMap.hasOwnProperty(name)){
					nameMap[name] = {count: 0, refs: [], cls: lin[j]};
					++clsCount;
				}
				rec = nameMap[name];
				if(top && top !== rec){
					rec.refs.push(top);
					++top.count;
				}
				top = rec;
			}
			++top.count;
			roots[0].refs.push(top);
		}

		// remove classes without external references recursively
		while(roots.length){
			top = roots.pop();
			result.push(top.cls);
			--clsCount;
			// optimization: follow a single-linked chain
			while(refs = top.refs, refs.length == 1){
				top = refs[0];
				if(!top || --top.count){
					// branch or end of chain => do not end to roots
					top = 0;
					break;
				}
				result.push(top.cls);
				--clsCount;
			}
			if(top){
				// branch
				for(i = 0, l = refs.length; i < l; ++i){
					top = refs[i];
					if(!--top.count){
						roots.push(top);
					}
				}
			}
		}
		if(clsCount){
			err("can't build consistent linearization", className);
		}

		// calculate the superclass offset
		base = bases[0];
		result[0] = base ?
			base._meta && base === result[result.length - base._meta.bases.length] ?
				base._meta.bases.length : 1 : 0;

		return result;
	}

	function inherited(args, a, f){
		var name, chains, bases, caller, meta, base, proto, opf, pos,
			cache = this._inherited = this._inherited || {};

		// crack arguments
		if(typeof args == "string"){
			name = args;
			args = a;
			a = f;
		}
		f = 0;

		caller = args.callee;
		name = name || caller.nom;
		if(!name){
			err("can't deduce a name to call inherited()", this.declaredClass);
		}

		meta = this.constructor._meta;
		bases = meta.bases;

		pos = cache.p;
		if(name != cname){
			// method
			if(cache.c !== caller){
				// cache bust
				pos = 0;
				base = bases[0];
				meta = base._meta;
				if(meta.hidden[name] !== caller){
					// error detection
					chains = meta.chains;
					if(chains && typeof chains[name] == "string"){
						err("calling chained method with inherited: " + name, this.declaredClass);
					}
					// find caller
					do{
						meta = base._meta;
						proto = base.prototype;
						if(meta && (proto[name] === caller && proto.hasOwnProperty(name) || meta.hidden[name] === caller)){
							break;
						}
					}while(base = bases[++pos]); // intentional assignment
					pos = base ? pos : -1;
				}
			}
			// find next
			base = bases[++pos];
			if(base){
				proto = base.prototype;
				if(base._meta && proto.hasOwnProperty(name)){
					f = proto[name];
				}else{
					opf = op[name];
					do{
						proto = base.prototype;
						f = proto[name];
						if(f && (base._meta ? proto.hasOwnProperty(name) : f !== opf)){
							break;
						}
					}while(base = bases[++pos]); // intentional assignment
				}
			}
			f = base && f || op[name];
		}else{
			// constructor
			if(cache.c !== caller){
				// cache bust
				pos = 0;
				meta = bases[0]._meta;
				if(meta && meta.ctor !== caller){
					// error detection
					chains = meta.chains;
					if(!chains || chains.constructor !== "manual"){
						err("calling chained constructor with inherited", this.declaredClass);
					}
					// find caller
					while(base = bases[++pos]){ // intentional assignment
						meta = base._meta;
						if(meta && meta.ctor === caller){
							break;
						}
					}
					pos = base ? pos : -1;
				}
			}
			// find next
			while(base = bases[++pos]){	// intentional assignment
				meta = base._meta;
				f = meta ? meta.ctor : base;
				if(f){
					break;
				}
			}
			f = base && f;
		}

		// cache the found super method
		cache.c = f;
		cache.p = pos;

		// now we have the result
		if(f){
			return a === true ? f : f.apply(this, a || args);
		}
		// intentionally no return if a super method was not found
	}

	function getInherited(name, args){
		if(typeof name == "string"){
			return this.__inherited(name, args, true);
		}
		return this.__inherited(name, true);
	}

	function inherited__debug(args, a1, a2){
		var f = this.getInherited(args, a1);
		if(f){ return f.apply(this, a2 || a1 || args); }
		// intentionally no return if a super method was not found
	}

	var inheritedImpl = dojo.config.isDebug ? inherited__debug : inherited;

	// emulation of "instanceof"
	function isInstanceOf(cls){
		var bases = this.constructor._meta.bases;
		for(var i = 0, l = bases.length; i < l; ++i){
			if(bases[i] === cls){
				return true;
			}
		}
		return this instanceof cls;
	}

	function mixOwn(target, source){
		// add props adding metadata for incoming functions skipping a constructor
		for(var name in source){
			if(name != cname && source.hasOwnProperty(name)){
				target[name] = source[name];
			}
		}
		if(has("bug-for-in-skips-shadowed")){
			for(var extraNames= lang._extraNames, i= extraNames.length; i;){
				name = extraNames[--i];
				if(name != cname && source.hasOwnProperty(name)){
					  target[name] = source[name];
				}
			}
		}
	}

	// implementation of safe mixin function
	function safeMixin(target, source){
		var name, t;
		// add props adding metadata for incoming functions skipping a constructor
		for(name in source){
			t = source[name];
			if((t !== op[name] || !(name in op)) && name != cname){
				if(opts.call(t) == "[object Function]"){
					// non-trivial function method => attach its name
					t.nom = name;
				}
				target[name] = t;
			}
		}
		if(has("bug-for-in-skips-shadowed")){
			for(var extraNames= lang._extraNames, i= extraNames.length; i;){
				name = extraNames[--i];
				t = source[name];
				if((t !== op[name] || !(name in op)) && name != cname){
					if(opts.call(t) == "[object Function]"){
						// non-trivial function method => attach its name
						  t.nom = name;
					}
					target[name] = t;
				}
			}
		}
		return target;
	}

	function extend(source){
		declare.safeMixin(this.prototype, source);
		return this;
	}

	// chained constructor compatible with the legacy dojo.declare()
	function chainedConstructor(bases, ctorSpecial){
		return function(){
			var a = arguments, args = a, a0 = a[0], f, i, m,
				l = bases.length, preArgs;

			if(!(this instanceof a.callee)){
				// not called via new, so force it
				return applyNew(a);
			}

			//this._inherited = {};
			// perform the shaman's rituals of the original dojo.declare()
			// 1) call two types of the preamble
			if(ctorSpecial && (a0 && a0.preamble || this.preamble)){
				// full blown ritual
				preArgs = new Array(bases.length);
				// prepare parameters
				preArgs[0] = a;
				for(i = 0;;){
					// process the preamble of the 1st argument
					a0 = a[0];
					if(a0){
						f = a0.preamble;
						if(f){
							a = f.apply(this, a) || a;
						}
					}
					// process the preamble of this class
					f = bases[i].prototype;
					f = f.hasOwnProperty("preamble") && f.preamble;
					if(f){
						a = f.apply(this, a) || a;
					}
					// one peculiarity of the preamble:
					// it is called if it is not needed,
					// e.g., there is no constructor to call
					// let's watch for the last constructor
					// (see ticket #9795)
					if(++i == l){
						break;
					}
					preArgs[i] = a;
				}
			}
			// 2) call all non-trivial constructors using prepared arguments
			for(i = l - 1; i >= 0; --i){
				f = bases[i];
				m = f._meta;
				f = m ? m.ctor : f;
				if(f){
					f.apply(this, preArgs ? preArgs[i] : a);
				}
			}
			// 3) continue the original ritual: call the postscript
			f = this.postscript;
			if(f){
				f.apply(this, args);
			}
		};
	}


	// chained constructor compatible with the legacy dojo.declare()
	function singleConstructor(ctor, ctorSpecial){
		return function(){
			var a = arguments, t = a, a0 = a[0], f;

			if(!(this instanceof a.callee)){
				// not called via new, so force it
				return applyNew(a);
			}

			//this._inherited = {};
			// perform the shaman's rituals of the original dojo.declare()
			// 1) call two types of the preamble
			if(ctorSpecial){
				// full blown ritual
				if(a0){
					// process the preamble of the 1st argument
					f = a0.preamble;
					if(f){
						t = f.apply(this, t) || t;
					}
				}
				f = this.preamble;
				if(f){
					// process the preamble of this class
					f.apply(this, t);
					// one peculiarity of the preamble:
					// it is called even if it is not needed,
					// e.g., there is no constructor to call
					// let's watch for the last constructor
					// (see ticket #9795)
				}
			}
			// 2) call a constructor
			if(ctor){
				ctor.apply(this, a);
			}
			// 3) continue the original ritual: call the postscript
			f = this.postscript;
			if(f){
				f.apply(this, a);
			}
		};
	}

	// plain vanilla constructor (can use inherited() to call its base constructor)
	function simpleConstructor(bases){
		return function(){
			var a = arguments, i = 0, f, m;

			if(!(this instanceof a.callee)){
				// not called via new, so force it
				return applyNew(a);
			}

			//this._inherited = {};
			// perform the shaman's rituals of the original dojo.declare()
			// 1) do not call the preamble
			// 2) call the top constructor (it can use this.inherited())
			for(; f = bases[i]; ++i){ // intentional assignment
				m = f._meta;
				f = m ? m.ctor : f;
				if(f){
					f.apply(this, a);
					break;
				}
			}
			// 3) call the postscript
			f = this.postscript;
			if(f){
				f.apply(this, a);
			}
		};
	}

	function chain(name, bases, reversed){
		return function(){
			var b, m, f, i = 0, step = 1;
			if(reversed){
				i = bases.length - 1;
				step = -1;
			}
			for(; b = bases[i]; i += step){ // intentional assignment
				m = b._meta;
				f = (m ? m.hidden : b.prototype)[name];
				if(f){
					f.apply(this, arguments);
				}
			}
		};
	}

	// forceNew(ctor)
	// return a new object that inherits from ctor.prototype but
	// without actually running ctor on the object.
	function forceNew(ctor){
		// create object with correct prototype using a do-nothing
		// constructor
		xtor.prototype = ctor.prototype;
		var t = new xtor;
		xtor.prototype = null;	// clean up
		return t;
	}

	// applyNew(args)
	// just like 'new ctor()' except that the constructor and its arguments come
	// from args, which must be an array or an arguments object
	function applyNew(args){
		// create an object with ctor's prototype but without
		// calling ctor on it.
		var ctor = args.callee, t = forceNew(ctor);
		// execute the real constructor on the new object
		ctor.apply(t, args);
		return t;
	}

	function declare(className, superclass, props){
		// crack parameters
		if(typeof className != "string"){
			props = superclass;
			superclass = className;
			className = "";
		}
		props = props || {};

		var proto, i, t, ctor, name, bases, chains, mixins = 1, parents = superclass;

		// build a prototype
		if(opts.call(superclass) == "[object Array]"){
			// C3 MRO
			bases = c3mro(superclass, className);
			t = bases[0];
			mixins = bases.length - t;
			superclass = bases[mixins];
		}else{
			bases = [0];
			if(superclass){
				if(opts.call(superclass) == "[object Function]"){
					t = superclass._meta;
					bases = bases.concat(t ? t.bases : superclass);
				}else{
					err("base class is not a callable constructor.", className);
				}
			}else if(superclass !== null){
				err("unknown base class. Did you use dojo.require to pull it in?", className);
			}
		}
		if(superclass){
			for(i = mixins - 1;; --i){
				proto = forceNew(superclass);
				if(!i){
					// stop if nothing to add (the last base)
					break;
				}
				// mix in properties
				t = bases[i];
				(t._meta ? mixOwn : mix)(proto, t.prototype);
				// chain in new constructor
				ctor = new Function;
				ctor.superclass = superclass;
				ctor.prototype = proto;
				superclass = proto.constructor = ctor;
			}
		}else{
			proto = {};
		}
		// add all properties
		declare.safeMixin(proto, props);
		// add constructor
		t = props.constructor;
		if(t !== op.constructor){
			t.nom = cname;
			proto.constructor = t;
		}

		// collect chains and flags
		for(i = mixins - 1; i; --i){ // intentional assignment
			t = bases[i]._meta;
			if(t && t.chains){
				chains = mix(chains || {}, t.chains);
			}
		}
		if(proto["-chains-"]){
			chains = mix(chains || {}, proto["-chains-"]);
		}

		// build ctor
		t = !chains || !chains.hasOwnProperty(cname);
		bases[0] = ctor = (chains && chains.constructor === "manual") ? simpleConstructor(bases) :
			(bases.length == 1 ? singleConstructor(props.constructor, t) : chainedConstructor(bases, t));

		// add meta information to the constructor
		ctor._meta  = {bases: bases, hidden: props, chains: chains,
			parents: parents, ctor: props.constructor};
		ctor.superclass = superclass && superclass.prototype;
		ctor.extend = extend;
		ctor.prototype = proto;
		proto.constructor = ctor;

		// add "standard" methods to the prototype
		proto.getInherited = getInherited;
		proto.isInstanceOf = isInstanceOf;
		proto.inherited    = inheritedImpl;
		proto.__inherited  = inherited;

		// add name if specified
		if(className){
			proto.declaredClass = className;
			lang.setObject(className, ctor);
		}

		// build chains and add them to the prototype
		if(chains){
			for(name in chains){
				if(proto[name] && typeof chains[name] == "string" && name != cname){
					t = proto[name] = chain(name, bases, chains[name] === "after");
					t.nom = name;
				}
			}
		}
		// chained methods do not return values
		// no need to chain "invisible" functions

		return ctor;	// Function
	}

	/*=====
	dojo.declare = function(className, superclass, props){
		//	summary:
		//		Create a feature-rich constructor from compact notation.
		//	className: String?:
		//		The optional name of the constructor (loosely, a "class")
		//		stored in the "declaredClass" property in the created prototype.
		//		It will be used as a global name for a created constructor.
		//	superclass: Function|Function[]:
		//		May be null, a Function, or an Array of Functions. This argument
		//		specifies a list of bases (the left-most one is the most deepest
		//		base).
		//	props: Object:
		//		An object whose properties are copied to the created prototype.
		//		Add an instance-initialization function by making it a property
		//		named "constructor".
		//	returns:
		//		New constructor function.
		//	description:
		//		Create a constructor using a compact notation for inheritance and
		//		prototype extension.
		//
		//		Mixin ancestors provide a type of multiple inheritance.
		//		Prototypes of mixin ancestors are copied to the new class:
		//		changes to mixin prototypes will not affect classes to which
		//		they have been mixed in.
		//
		//		Ancestors can be compound classes created by this version of
		//		dojo.declare. In complex cases all base classes are going to be
		//		linearized according to C3 MRO algorithm
		//		(see http://www.python.org/download/releases/2.3/mro/ for more
		//		details).
		//
		//		"className" is cached in "declaredClass" property of the new class,
		//		if it was supplied. The immediate super class will be cached in
		//		"superclass" property of the new class.
		//
		//		Methods in "props" will be copied and modified: "nom" property
		//		(the declared name of the method) will be added to all copied
		//		functions to help identify them for the internal machinery. Be
		//		very careful, while reusing methods: if you use the same
		//		function under different names, it can produce errors in some
		//		cases.
		//
		//		It is possible to use constructors created "manually" (without
		//		dojo.declare) as bases. They will be called as usual during the
		//		creation of an instance, their methods will be chained, and even
		//		called by "this.inherited()".
		//
		//		Special property "-chains-" governs how to chain methods. It is
		//		a dictionary, which uses method names as keys, and hint strings
		//		as values. If a hint string is "after", this method will be
		//		called after methods of its base classes. If a hint string is
		//		"before", this method will be called before methods of its base
		//		classes.
		//
		//		If "constructor" is not mentioned in "-chains-" property, it will
		//		be chained using the legacy mode: using "after" chaining,
		//		calling preamble() method before each constructor, if available,
		//		and calling postscript() after all constructors were executed.
		//		If the hint is "after", it is chained as a regular method, but
		//		postscript() will be called after the chain of constructors.
		//		"constructor" cannot be chained "before", but it allows
		//		a special hint string: "manual", which means that constructors
		//		are not going to be chained in any way, and programmer will call
		//		them manually using this.inherited(). In the latter case
		//		postscript() will be called after the construction.
		//
		//		All chaining hints are "inherited" from base classes and
		//		potentially can be overridden. Be very careful when overriding
		//		hints! Make sure that all chained methods can work in a proposed
		//		manner of chaining.
		//
		//		Once a method was chained, it is impossible to unchain it. The
		//		only exception is "constructor". You don't need to define a
		//		method in order to supply a chaining hint.
		//
		//		If a method is chained, it cannot use this.inherited() because
		//		all other methods in the hierarchy will be called automatically.
		//
		//		Usually constructors and initializers of any kind are chained
		//		using "after" and destructors of any kind are chained as
		//		"before". Note that chaining assumes that chained methods do not
		//		return any value: any returned value will be discarded.
		//
		//	example:
		//	|	dojo.declare("my.classes.bar", my.classes.foo, {
		//	|		// properties to be added to the class prototype
		//	|		someValue: 2,
		//	|		// initialization function
		//	|		constructor: function(){
		//	|			this.myComplicatedObject = new ReallyComplicatedObject();
		//	|		},
		//	|		// other functions
		//	|		someMethod: function(){
		//	|			doStuff();
		//	|		}
		//	|	});
		//
		//	example:
		//	|	var MyBase = dojo.declare(null, {
		//	|		// constructor, properties, and methods go here
		//	|		// ...
		//	|	});
		//	|	var MyClass1 = dojo.declare(MyBase, {
		//	|		// constructor, properties, and methods go here
		//	|		// ...
		//	|	});
		//	|	var MyClass2 = dojo.declare(MyBase, {
		//	|		// constructor, properties, and methods go here
		//	|		// ...
		//	|	});
		//	|	var MyDiamond = dojo.declare([MyClass1, MyClass2], {
		//	|		// constructor, properties, and methods go here
		//	|		// ...
		//	|	});
		//
		//	example:
		//	|	var F = function(){ console.log("raw constructor"); };
		//	|	F.prototype.method = function(){
		//	|		console.log("raw method");
		//	|	};
		//	|	var A = dojo.declare(F, {
		//	|		constructor: function(){
		//	|			console.log("A.constructor");
		//	|		},
		//	|		method: function(){
		//	|			console.log("before calling F.method...");
		//	|			this.inherited(arguments);
		//	|			console.log("...back in A");
		//	|		}
		//	|	});
		//	|	new A().method();
		//	|	// will print:
		//	|	// raw constructor
		//	|	// A.constructor
		//	|	// before calling F.method...
		//	|	// raw method
		//	|	// ...back in A
		//
		//	example:
		//	|	var A = dojo.declare(null, {
		//	|		"-chains-": {
		//	|			destroy: "before"
		//	|		}
		//	|	});
		//	|	var B = dojo.declare(A, {
		//	|		constructor: function(){
		//	|			console.log("B.constructor");
		//	|		},
		//	|		destroy: function(){
		//	|			console.log("B.destroy");
		//	|		}
		//	|	});
		//	|	var C = dojo.declare(B, {
		//	|		constructor: function(){
		//	|			console.log("C.constructor");
		//	|		},
		//	|		destroy: function(){
		//	|			console.log("C.destroy");
		//	|		}
		//	|	});
		//	|	new C().destroy();
		//	|	// prints:
		//	|	// B.constructor
		//	|	// C.constructor
		//	|	// C.destroy
		//	|	// B.destroy
		//
		//	example:
		//	|	var A = dojo.declare(null, {
		//	|		"-chains-": {
		//	|			constructor: "manual"
		//	|		}
		//	|	});
		//	|	var B = dojo.declare(A, {
		//	|		constructor: function(){
		//	|			// ...
		//	|			// call the base constructor with new parameters
		//	|			this.inherited(arguments, [1, 2, 3]);
		//	|			// ...
		//	|		}
		//	|	});
		//
		//	example:
		//	|	var A = dojo.declare(null, {
		//	|		"-chains-": {
		//	|			m1: "before"
		//	|		},
		//	|		m1: function(){
		//	|			console.log("A.m1");
		//	|		},
		//	|		m2: function(){
		//	|			console.log("A.m2");
		//	|		}
		//	|	});
		//	|	var B = dojo.declare(A, {
		//	|		"-chains-": {
		//	|			m2: "after"
		//	|		},
		//	|		m1: function(){
		//	|			console.log("B.m1");
		//	|		},
		//	|		m2: function(){
		//	|			console.log("B.m2");
		//	|		}
		//	|	});
		//	|	var x = new B();
		//	|	x.m1();
		//	|	// prints:
		//	|	// B.m1
		//	|	// A.m1
		//	|	x.m2();
		//	|	// prints:
		//	|	// A.m2
		//	|	// B.m2
		return new Function(); // Function
	};
	=====*/

	/*=====
	dojo.safeMixin = function(target, source){
		//	summary:
		//		Mix in properties skipping a constructor and decorating functions
		//		like it is done by dojo.declare.
		//	target: Object
		//		Target object to accept new properties.
		//	source: Object
		//		Source object for new properties.
		//	description:
		//		This function is used to mix in properties like lang.mixin does,
		//		but it skips a constructor property and decorates functions like
		//		dojo.declare does.
		//
		//		It is meant to be used with classes and objects produced with
		//		dojo.declare. Functions mixed in with dojo.safeMixin can use
		//		this.inherited() like normal methods.
		//
		//		This function is used to implement extend() method of a constructor
		//		produced with dojo.declare().
		//
		//	example:
		//	|	var A = dojo.declare(null, {
		//	|		m1: function(){
		//	|			console.log("A.m1");
		//	|		},
		//	|		m2: function(){
		//	|			console.log("A.m2");
		//	|		}
		//	|	});
		//	|	var B = dojo.declare(A, {
		//	|		m1: function(){
		//	|			this.inherited(arguments);
		//	|			console.log("B.m1");
		//	|		}
		//	|	});
		//	|	B.extend({
		//	|		m2: function(){
		//	|			this.inherited(arguments);
		//	|			console.log("B.m2");
		//	|		}
		//	|	});
		//	|	var x = new B();
		//	|	dojo.safeMixin(x, {
		//	|		m1: function(){
		//	|			this.inherited(arguments);
		//	|			console.log("X.m1");
		//	|		},
		//	|		m2: function(){
		//	|			this.inherited(arguments);
		//	|			console.log("X.m2");
		//	|		}
		//	|	});
		//	|	x.m2();
		//	|	// prints:
		//	|	// A.m1
		//	|	// B.m1
		//	|	// X.m1
	};
	=====*/

	/*=====
	Object.inherited = function(name, args, newArgs){
		//	summary:
		//		Calls a super method.
		//	name: String?
		//		The optional method name. Should be the same as the caller's
		//		name. Usually "name" is specified in complex dynamic cases, when
		//		the calling method was dynamically added, undecorated by
		//		dojo.declare, and it cannot be determined.
		//	args: Arguments
		//		The caller supply this argument, which should be the original
		//		"arguments".
		//	newArgs: Object?
		//		If "true", the found function will be returned without
		//		executing it.
		//		If Array, it will be used to call a super method. Otherwise
		//		"args" will be used.
		//	returns:
		//		Whatever is returned by a super method, or a super method itself,
		//		if "true" was specified as newArgs.
		//	description:
		//		This method is used inside method of classes produced with
		//		dojo.declare to call a super method (next in the chain). It is
		//		used for manually controlled chaining. Consider using the regular
		//		chaining, because it is faster. Use "this.inherited()" only in
		//		complex cases.
		//
		//		This method cannot me called from automatically chained
		//		constructors including the case of a special (legacy)
		//		constructor chaining. It cannot be called from chained methods.
		//
		//		If "this.inherited()" cannot find the next-in-chain method, it
		//		does nothing and returns "undefined". The last method in chain
		//		can be a default method implemented in Object, which will be
		//		called last.
		//
		//		If "name" is specified, it is assumed that the method that
		//		received "args" is the parent method for this call. It is looked
		//		up in the chain list and if it is found the next-in-chain method
		//		is called. If it is not found, the first-in-chain method is
		//		called.
		//
		//		If "name" is not specified, it will be derived from the calling
		//		method (using a methoid property "nom").
		//
		//	example:
		//	|	var B = dojo.declare(A, {
		//	|		method1: function(a, b, c){
		//	|			this.inherited(arguments);
		//	|		},
		//	|		method2: function(a, b){
		//	|			return this.inherited(arguments, [a + b]);
		//	|		}
		//	|	});
		//	|	// next method is not in the chain list because it is added
		//	|	// manually after the class was created.
		//	|	B.prototype.method3 = function(){
		//	|		console.log("This is a dynamically-added method.");
		//	|		this.inherited("method3", arguments);
		//	|	};
		//	example:
		//	|	var B = dojo.declare(A, {
		//	|		method: function(a, b){
		//	|			var super = this.inherited(arguments, true);
		//	|			// ...
		//	|			if(!super){
		//	|				console.log("there is no super method");
		//	|				return 0;
		//	|			}
		//	|			return super.apply(this, arguments);
		//	|		}
		//	|	});
		return	{};	// Object
	}
	=====*/

	/*=====
	Object.getInherited = function(name, args){
		//	summary:
		//		Returns a super method.
		//	name: String?
		//		The optional method name. Should be the same as the caller's
		//		name. Usually "name" is specified in complex dynamic cases, when
		//		the calling method was dynamically added, undecorated by
		//		dojo.declare, and it cannot be determined.
		//	args: Arguments
		//		The caller supply this argument, which should be the original
		//		"arguments".
		//	returns:
		//		Returns a super method (Function) or "undefined".
		//	description:
		//		This method is a convenience method for "this.inherited()".
		//		It uses the same algorithm but instead of executing a super
		//		method, it returns it, or "undefined" if not found.
		//
		//	example:
		//	|	var B = dojo.declare(A, {
		//	|		method: function(a, b){
		//	|			var super = this.getInherited(arguments);
		//	|			// ...
		//	|			if(!super){
		//	|				console.log("there is no super method");
		//	|				return 0;
		//	|			}
		//	|			return super.apply(this, arguments);
		//	|		}
		//	|	});
		return	{};	// Object
	}
	=====*/

	/*=====
	Object.isInstanceOf = function(cls){
		//	summary:
		//		Checks the inheritance chain to see if it is inherited from this
		//		class.
		//	cls: Function
		//		Class constructor.
		//	returns:
		//		"true", if this object is inherited from this class, "false"
		//		otherwise.
		//	description:
		//		This method is used with instances of classes produced with
		//		dojo.declare to determine of they support a certain interface or
		//		not. It models "instanceof" operator.
		//
		//	example:
		//	|	var A = dojo.declare(null, {
		//	|		// constructor, properties, and methods go here
		//	|		// ...
		//	|	});
		//	|	var B = dojo.declare(null, {
		//	|		// constructor, properties, and methods go here
		//	|		// ...
		//	|	});
		//	|	var C = dojo.declare([A, B], {
		//	|		// constructor, properties, and methods go here
		//	|		// ...
		//	|	});
		//	|	var D = dojo.declare(A, {
		//	|		// constructor, properties, and methods go here
		//	|		// ...
		//	|	});
		//	|
		//	|	var a = new A(), b = new B(), c = new C(), d = new D();
		//	|
		//	|	console.log(a.isInstanceOf(A)); // true
		//	|	console.log(b.isInstanceOf(A)); // false
		//	|	console.log(c.isInstanceOf(A)); // true
		//	|	console.log(d.isInstanceOf(A)); // true
		//	|
		//	|	console.log(a.isInstanceOf(B)); // false
		//	|	console.log(b.isInstanceOf(B)); // true
		//	|	console.log(c.isInstanceOf(B)); // true
		//	|	console.log(d.isInstanceOf(B)); // false
		//	|
		//	|	console.log(a.isInstanceOf(C)); // false
		//	|	console.log(b.isInstanceOf(C)); // false
		//	|	console.log(c.isInstanceOf(C)); // true
		//	|	console.log(d.isInstanceOf(C)); // false
		//	|
		//	|	console.log(a.isInstanceOf(D)); // false
		//	|	console.log(b.isInstanceOf(D)); // false
		//	|	console.log(c.isInstanceOf(D)); // false
		//	|	console.log(d.isInstanceOf(D)); // true
		return	{};	// Object
	}
	=====*/

	/*=====
	Object.extend = function(source){
		//	summary:
		//		Adds all properties and methods of source to constructor's
		//		prototype, making them available to all instances created with
		//		constructor. This method is specific to constructors created with
		//		dojo.declare.
		//	source: Object
		//		Source object which properties are going to be copied to the
		//		constructor's prototype.
		//	description:
		//		Adds source properties to the constructor's prototype. It can
		//		override existing properties.
		//
		//		This method is similar to dojo.extend function, but it is specific
		//		to constructors produced by dojo.declare. It is implemented
		//		using dojo.safeMixin, and it skips a constructor property,
		//		and properly decorates copied functions.
		//
		//	example:
		//	|	var A = dojo.declare(null, {
		//	|		m1: function(){},
		//	|		s1: "Popokatepetl"
		//	|	});
		//	|	A.extend({
		//	|		m1: function(){},
		//	|		m2: function(){},
		//	|		f1: true,
		//	|		d1: 42
		//	|	});
	};
	=====*/

	dojo.safeMixin = declare.safeMixin = safeMixin;
	dojo.declare = declare;

	return declare;
});

},
'dojox/mobile/sniff':function(){
define("dojox/mobile/sniff", [
	"dojo/_base/window",
	"dojo/_base/sniff"
], function(win, has){

	var ua = navigator.userAgent;

	// BlackBerry (OS 6 or later only)
	has.add("bb", ua.indexOf("BlackBerry") >= 0 && parseFloat(ua.split("Version/")[1]) || undefined, undefined, true);

	// Android
	has.add("android", parseFloat(ua.split("Android ")[1]) || undefined, undefined, true);

	// iPhone, iPod, or iPad
	// If iPod or iPad is detected, in addition to has("ipod") or has("ipad"),
	// has("iphone") will also have iOS version number.
	if(ua.match(/(iPhone|iPod|iPad)/)){
		var p = RegExp.$1.replace(/P/, 'p');
		var v = ua.match(/OS ([\d_]+)/) ? RegExp.$1 : "1";
		var os = parseFloat(v.replace(/_/, '.').replace(/_/g, ''));
		has.add(p, os, undefined, true);
		has.add("iphone", os, undefined, true);
	}

	if(has("webkit")){
		has.add("touch", (typeof win.doc.documentElement.ontouchstart != "undefined" &&
			navigator.appVersion.indexOf("Mobile") != -1) || !!has("android"), undefined, true);
	}

	return has;
});

},
'dojox/mobile/ProgressIndicator':function(){
define("dojox/mobile/ProgressIndicator", [
	"dojo/_base/config",
	"dojo/_base/declare",
	"dojo/dom-construct",
	"dojo/dom-style",
	"dojo/has"
], function(config, declare, domConstruct, domStyle, has){

	// module:
	//		dojox/mobile/ProgressIndicator
	// summary:
	//		A progress indication widget.

	var cls = declare("dojox.mobile.ProgressIndicator", null, {
		// summary:
		//		A progress indication widget.
		// description:
		//		ProgressIndicator is a round spinning graphical representation
		//		that indicates the current task is on-going.

		// interval: Number
		//		The time interval in milliseconds for updating the spinning
		//		indicator.
		interval: 100,

		// colors: Array
		//		An array of indicator colors.
		colors: [
			"#C0C0C0", "#C0C0C0", "#C0C0C0", "#C0C0C0",
			"#C0C0C0", "#C0C0C0", "#B8B9B8", "#AEAFAE",
			"#A4A5A4", "#9A9A9A", "#8E8E8E", "#838383"
		],

		constructor: function(){
			this._bars = [];
			this.domNode = domConstruct.create("DIV");
			this.domNode.className = "mblProgContainer";
			if(config["mblAndroidWorkaround"] !== false && has("android") >= 2.2 && has("android") < 3){
				// workaround to avoid the side effects of the fixes for android screen flicker problem
				domStyle.set(this.domNode, "webkitTransform", "translate3d(0,0,0)");
			}
			this.spinnerNode = domConstruct.create("DIV", null, this.domNode);
			for(var i = 0; i < this.colors.length; i++){
				var div = domConstruct.create("DIV", {className:"mblProg mblProg"+i}, this.spinnerNode);
				this._bars.push(div);
			}
		},
	
		start: function(){
			// summary:
			//		Starts the ProgressIndicator spinning.
			if(this.imageNode){
				var img = this.imageNode;
				var l = Math.round((this.domNode.offsetWidth - img.offsetWidth) / 2);
				var t = Math.round((this.domNode.offsetHeight - img.offsetHeight) / 2);
				img.style.margin = t+"px "+l+"px";
				return;
			}
			var cntr = 0;
			var _this = this;
			var n = this.colors.length;
			this.timer = setInterval(function(){
				cntr--;
				cntr = cntr < 0 ? n - 1 : cntr;
				var c = _this.colors;
				for(var i = 0; i < n; i++){
					var idx = (cntr + i) % n;
					_this._bars[i].style.backgroundColor = c[idx];
				}
			}, this.interval);
		},
	
		stop: function(){
			// summary:
			//		Stops the ProgressIndicator spinning.
			if(this.timer){
				clearInterval(this.timer);
			}
			this.timer = null;
			if(this.domNode.parentNode){
				this.domNode.parentNode.removeChild(this.domNode);
			}
		},

		setImage: function(/*String*/file){
			// summary:
			//		Sets an indicator icon image file (typically animated GIF).
			//		If null is specified, restores the default spinner.
			if(file){
				this.imageNode = domConstruct.create("IMG", {src:file}, this.domNode);
				this.spinnerNode.style.display = "none";
			}else{
				if(this.imageNode){
					this.domNode.removeChild(this.imageNode);
					this.imageNode = null;
				}
				this.spinnerNode.style.display = "";
			}
		}
	});

	cls._instance = null;
	cls.getInstance = function(){
		if(!cls._instance){
			cls._instance = new cls();
		}
		return cls._instance;
	};

	return cls;
});

},
'dijit/form/_FormWidgetMixin':function(){
define("dijit/form/_FormWidgetMixin", [
	"dojo/_base/array", // array.forEach
	"dojo/_base/declare", // declare
	"dojo/dom-attr", // domAttr.set
	"dojo/dom-style", // domStyle.get
	"dojo/_base/lang", // lang.hitch lang.isArray
	"dojo/mouse", // mouse.isLeft
	"dojo/_base/sniff", // has("webkit")
	"dojo/_base/window", // win.body
	"dojo/window", // winUtils.scrollIntoView
	"../a11y"	// a11y.hasDefaultTabStop
], function(array, declare, domAttr, domStyle, lang, mouse, has, win, winUtils, a11y){

// module:
//		dijit/form/_FormWidgetMixin
// summary:
//		Mixin for widgets corresponding to native HTML elements such as <checkbox> or <button>,
//		which can be children of a <form> node or a `dijit.form.Form` widget.

return declare("dijit.form._FormWidgetMixin", null, {
	// summary:
	//		Mixin for widgets corresponding to native HTML elements such as <checkbox> or <button>,
	//		which can be children of a <form> node or a `dijit.form.Form` widget.
	//
	// description:
	//		Represents a single HTML element.
	//		All these widgets should have these attributes just like native HTML input elements.
	//		You can set them during widget construction or afterwards, via `dijit._Widget.attr`.
	//
	//		They also share some common methods.

	// name: [const] String
	//		Name used when submitting form; same as "name" attribute or plain HTML elements
	name: "",

	// alt: String
	//		Corresponds to the native HTML <input> element's attribute.
	alt: "",

	// value: String
	//		Corresponds to the native HTML <input> element's attribute.
	value: "",

	// type: [const] String
	//		Corresponds to the native HTML <input> element's attribute.
	type: "text",

	// tabIndex: Integer
	//		Order fields are traversed when user hits the tab key
	tabIndex: "0",
	_setTabIndexAttr: "focusNode",	// force copy even when tabIndex default value, needed since Button is <span>

	// disabled: Boolean
	//		Should this widget respond to user input?
	//		In markup, this is specified as "disabled='disabled'", or just "disabled".
	disabled: false,

	// intermediateChanges: Boolean
	//		Fires onChange for each value change or only on demand
	intermediateChanges: false,

	// scrollOnFocus: Boolean
	//		On focus, should this widget scroll into view?
	scrollOnFocus: true,

	// Override _WidgetBase mapping id to this.domNode, needs to be on focusNode so <label> etc.
	// works with screen reader
	_setIdAttr: "focusNode",

	postCreate: function(){
		this.inherited(arguments);
		this.connect(this.domNode, "onmousedown", "_onMouseDown");
	},

	_setDisabledAttr: function(/*Boolean*/ value){
		this._set("disabled", value);
		domAttr.set(this.focusNode, 'disabled', value);
		if(this.valueNode){
			domAttr.set(this.valueNode, 'disabled', value);
		}
		this.focusNode.setAttribute("aria-disabled", value);

		if(value){
			// reset these, because after the domNode is disabled, we can no longer receive
			// mouse related events, see #4200
			this._set("hovering", false);
			this._set("active", false);

			// clear tab stop(s) on this widget's focusable node(s)  (ComboBox has two focusable nodes)
			var attachPointNames = "tabIndex" in this.attributeMap ? this.attributeMap.tabIndex :
				("_setTabIndexAttr" in this) ? this._setTabIndexAttr : "focusNode";
			array.forEach(lang.isArray(attachPointNames) ? attachPointNames : [attachPointNames], function(attachPointName){
				var node = this[attachPointName];
				// complex code because tabIndex=-1 on a <div> doesn't work on FF
				if(has("webkit") || a11y.hasDefaultTabStop(node)){	// see #11064 about webkit bug
					node.setAttribute('tabIndex', "-1");
				}else{
					node.removeAttribute('tabIndex');
				}
			}, this);
		}else{
			if(this.tabIndex != ""){
				this.set('tabIndex', this.tabIndex);
			}
		}
	},

	_onFocus: function(e){
		if(this.scrollOnFocus){
			winUtils.scrollIntoView(this.domNode);
		}
		this.inherited(arguments);
	},

	isFocusable: function(){
		// summary:
		//		Tells if this widget is focusable or not.  Used internally by dijit.
		// tags:
		//		protected
		return !this.disabled && this.focusNode && (domStyle.get(this.domNode, "display") != "none");
	},

	focus: function(){
		// summary:
		//		Put focus on this widget
		if(!this.disabled && this.focusNode.focus){
			try{ this.focusNode.focus(); }catch(e){}/*squelch errors from hidden nodes*/
		}
	},

	compare: function(/*anything*/ val1, /*anything*/ val2){
		// summary:
		//		Compare 2 values (as returned by get('value') for this widget).
		// tags:
		//		protected
		if(typeof val1 == "number" && typeof val2 == "number"){
			return (isNaN(val1) && isNaN(val2)) ? 0 : val1 - val2;
		}else if(val1 > val2){
			return 1;
		}else if(val1 < val2){
			return -1;
		}else{
			return 0;
		}
	},

	onChange: function(/*===== newValue =====*/){
		// summary:
		//		Callback when this widget's value is changed.
		// tags:
		//		callback
	},

	// _onChangeActive: [private] Boolean
	//		Indicates that changes to the value should call onChange() callback.
	//		This is false during widget initialization, to avoid calling onChange()
	//		when the initial value is set.
	_onChangeActive: false,

	_handleOnChange: function(/*anything*/ newValue, /*Boolean?*/ priorityChange){
		// summary:
		//		Called when the value of the widget is set.  Calls onChange() if appropriate
		// newValue:
		//		the new value
		// priorityChange:
		//		For a slider, for example, dragging the slider is priorityChange==false,
		//		but on mouse up, it's priorityChange==true.  If intermediateChanges==false,
		//		onChange is only called form priorityChange=true events.
		// tags:
		//		private
		if(this._lastValueReported == undefined && (priorityChange === null || !this._onChangeActive)){
			// this block executes not for a change, but during initialization,
			// and is used to store away the original value (or for ToggleButton, the original checked state)
			this._resetValue = this._lastValueReported = newValue;
		}
		this._pendingOnChange = this._pendingOnChange
			|| (typeof newValue != typeof this._lastValueReported)
			|| (this.compare(newValue, this._lastValueReported) != 0);
		if((this.intermediateChanges || priorityChange || priorityChange === undefined) && this._pendingOnChange){
			this._lastValueReported = newValue;
			this._pendingOnChange = false;
			if(this._onChangeActive){
				if(this._onChangeHandle){
					clearTimeout(this._onChangeHandle);
				}
				// setTimeout allows hidden value processing to run and
				// also the onChange handler can safely adjust focus, etc
				this._onChangeHandle = setTimeout(lang.hitch(this,
					function(){
						this._onChangeHandle = null;
						this.onChange(newValue);
					}), 0); // try to collapse multiple onChange's fired faster than can be processed
			}
		}
	},

	create: function(){
		// Overrides _Widget.create()
		this.inherited(arguments);
		this._onChangeActive = true;
	},

	destroy: function(){
		if(this._onChangeHandle){ // destroy called before last onChange has fired
			clearTimeout(this._onChangeHandle);
			this.onChange(this._lastValueReported);
		}
		this.inherited(arguments);
	},

	_onMouseDown: function(e){
		// If user clicks on the button, even if the mouse is released outside of it,
		// this button should get focus (to mimics native browser buttons).
		// This is also needed on chrome because otherwise buttons won't get focus at all,
		// which leads to bizarre focus restore on Dialog close etc.
		// IE exhibits strange scrolling behavior when focusing a node so only do it when !focused.
		// FF needs the extra help to make sure the mousedown actually gets to the focusNode
		if((!this.focused || !0) && !e.ctrlKey && mouse.isLeft(e) && this.isFocusable()){ // !e.ctrlKey to ignore right-click on mac
			// Set a global event to handle mouseup, so it fires properly
			// even if the cursor leaves this.domNode before the mouse up event.
			var mouseUpConnector = this.connect(win.body(), "onmouseup", function(){
				if(this.isFocusable()){
					this.focus();
				}
				this.disconnect(mouseUpConnector);
			});
		}
	}
});

});

},
'dojo/dom-construct':function(){
define("dojo/dom-construct", ["exports", "./_base/kernel", "./_base/sniff", "./_base/window", "./dom", "./dom-attr", "./on"],
		function(exports, dojo, has, win, dom, attr, on){
	// module:
	//		dojo/dom-construct
	// summary:
	//		This module defines the core dojo DOM construction API.

	/*=====
	dojo.toDom = function(frag, doc){
		// summary:
		//		instantiates an HTML fragment returning the corresponding DOM.
		// frag: String
		//		the HTML fragment
		// doc: DocumentNode?
		//		optional document to use when creating DOM nodes, defaults to
		//		dojo.doc if not specified.
		// returns: DocumentFragment
		//
		// example:
		//		Create a table row:
		//	|	var tr = dojo.toDom("<tr><td>First!</td></tr>");
	};
	=====*/

	/*=====
	dojo._toDom = function(frag, doc){
		// summary:
		//		Existing alias for `dojo.toDom`. Deprecated, will be removed in 2.0.
	};
	=====*/

	/*=====
	dojo.place = function(node, refNode, position){
		// summary:
		//		Attempt to insert node into the DOM, choosing from various positioning options.
		//		Returns the first argument resolved to a DOM node.
		//
		// node: DOMNode|String
		//		id or node reference, or HTML fragment starting with "<" to place relative to refNode
		//
		// refNode: DOMNode|String
		//		id or node reference to use as basis for placement
		//
		// position: String|Number?
		//		string noting the position of node relative to refNode or a
		//		number indicating the location in the childNodes collection of refNode.
		//		Accepted string values are:
		//	|	* before
		//	|	* after
		//	|	* replace
		//	|	* only
		//	|	* first
		//	|	* last
		//		"first" and "last" indicate positions as children of refNode, "replace" replaces refNode,
		//		"only" replaces all children.  position defaults to "last" if not specified
		//
		// returns: DOMNode
		//		Returned values is the first argument resolved to a DOM node.
		//
		//		.place() is also a method of `dojo.NodeList`, allowing `dojo.query` node lookups.
		//
		// example:
		//		Place a node by string id as the last child of another node by string id:
		//	|	dojo.place("someNode", "anotherNode");
		//
		// example:
		//		Place a node by string id before another node by string id
		//	|	dojo.place("someNode", "anotherNode", "before");
		//
		// example:
		//		Create a Node, and place it in the body element (last child):
		//	|	dojo.place("<div></div>", dojo.body());
		//
		// example:
		//		Put a new LI as the first child of a list by id:
		//	|	dojo.place("<li></li>", "someUl", "first");
	};
	=====*/

	/*=====
	dojo.create = function(tag, attrs, refNode, pos){
		// summary:
		//		Create an element, allowing for optional attribute decoration
		//		and placement.
		//
		// description:
		//		A DOM Element creation function. A shorthand method for creating a node or
		//		a fragment, and allowing for a convenient optional attribute setting step,
		//		as well as an optional DOM placement reference.
		//|
		//		Attributes are set by passing the optional object through `dojo.setAttr`.
		//		See `dojo.setAttr` for noted caveats and nuances, and API if applicable.
		//|
		//		Placement is done via `dojo.place`, assuming the new node to be the action
		//		node, passing along the optional reference node and position.
		//
		// tag: DOMNode|String
		//		A string of the element to create (eg: "div", "a", "p", "li", "script", "br"),
		//		or an existing DOM node to process.
		//
		// attrs: Object
		//		An object-hash of attributes to set on the newly created node.
		//		Can be null, if you don't want to set any attributes/styles.
		//		See: `dojo.setAttr` for a description of available attributes.
		//
		// refNode: DOMNode?|String?
		//		Optional reference node. Used by `dojo.place` to place the newly created
		//		node somewhere in the dom relative to refNode. Can be a DomNode reference
		//		or String ID of a node.
		//
		// pos: String?
		//		Optional positional reference. Defaults to "last" by way of `dojo.place`,
		//		though can be set to "first","after","before","last", "replace" or "only"
		//		to further control the placement of the new node relative to the refNode.
		//		'refNode' is required if a 'pos' is specified.
		//
		// returns: DOMNode
		//
		// example:
		//		Create a DIV:
		//	|	var n = dojo.create("div");
		//
		// example:
		//		Create a DIV with content:
		//	|	var n = dojo.create("div", { innerHTML:"<p>hi</p>" });
		//
		// example:
		//		Place a new DIV in the BODY, with no attributes set
		//	|	var n = dojo.create("div", null, dojo.body());
		//
		// example:
		//		Create an UL, and populate it with LI's. Place the list as the first-child of a
		//		node with id="someId":
		//	|	var ul = dojo.create("ul", null, "someId", "first");
		//	|	var items = ["one", "two", "three", "four"];
		//	|	dojo.forEach(items, function(data){
		//	|		dojo.create("li", { innerHTML: data }, ul);
		//	|	});
		//
		// example:
		//		Create an anchor, with an href. Place in BODY:
		//	|	dojo.create("a", { href:"foo.html", title:"Goto FOO!" }, dojo.body());
		//
		// example:
		//		Create a `dojo.NodeList()` from a new element (for syntatic sugar):
		//	|	dojo.query(dojo.create('div'))
		//	|		.addClass("newDiv")
		//	|		.onclick(function(e){ console.log('clicked', e.target) })
		//	|		.place("#someNode"); // redundant, but cleaner.
	};
	=====*/

	/*=====
	dojo.empty = function(node){
			// summary:
			//		safely removes all children of the node.
			// node: DOMNode|String
			//		a reference to a DOM node or an id.
			// example:
			//		Destroy node's children byId:
			//	|	dojo.empty("someId");
			//
			// example:
			//		Destroy all nodes' children in a list by reference:
			//	|	dojo.query(".someNode").forEach(dojo.empty);
	}
	=====*/

	/*=====
	dojo.destroy = function(node){
		// summary:
		//		Removes a node from its parent, clobbering it and all of its
		//		children.
		//
		// description:
		//		Removes a node from its parent, clobbering it and all of its
		//		children. Function only works with DomNodes, and returns nothing.
		//
		// node: DOMNode|String
		//		A String ID or DomNode reference of the element to be destroyed
		//
		// example:
		//		Destroy a node byId:
		//	|	dojo.destroy("someId");
		//
		// example:
		//		Destroy all nodes in a list by reference:
		//	|	dojo.query(".someNode").forEach(dojo.destroy);
	};
	=====*/

	/*=====
	dojo._destroyElement = function(node){
		// summary:
		//		Existing alias for `dojo.destroy`. Deprecated, will be removed in 2.0.
	};
	=====*/

	// support stuff for dojo.toDom
	var tagWrap = {
			option: ["select"],
			tbody: ["table"],
			thead: ["table"],
			tfoot: ["table"],
			tr: ["table", "tbody"],
			td: ["table", "tbody", "tr"],
			th: ["table", "thead", "tr"],
			legend: ["fieldset"],
			caption: ["table"],
			colgroup: ["table"],
			col: ["table", "colgroup"],
			li: ["ul"]
		},
		reTag = /<\s*([\w\:]+)/,
		masterNode = {}, masterNum = 0,
		masterName = "__" + dojo._scopeName + "ToDomId";

	// generate start/end tag strings to use
	// for the injection for each special tag wrap case.
	for(var param in tagWrap){
		if(tagWrap.hasOwnProperty(param)){
			var tw = tagWrap[param];
			tw.pre = param == "option" ? '<select multiple="multiple">' : "<" + tw.join("><") + ">";
			tw.post = "</" + tw.reverse().join("></") + ">";
			// the last line is destructive: it reverses the array,
			// but we don't care at this point
		}
	}

	function _insertBefore(/*DomNode*/node, /*DomNode*/ref){
		var parent = ref.parentNode;
		if(parent){
			parent.insertBefore(node, ref);
		}
	}

	function _insertAfter(/*DomNode*/node, /*DomNode*/ref){
		// summary:
		//		Try to insert node after ref
		var parent = ref.parentNode;
		if(parent){
			if(parent.lastChild == ref){
				parent.appendChild(node);
			}else{
				parent.insertBefore(node, ref.nextSibling);
			}
		}
	}

	var _destroyContainer = null,
		_destroyDoc;
		on(window, "unload", function(){
		_destroyContainer = null; //prevent IE leak
	});
	
	exports.toDom = function toDom(frag, doc){
		doc = doc || win.doc;
		var masterId = doc[masterName];
		if(!masterId){
			doc[masterName] = masterId = ++masterNum + "";
			masterNode[masterId] = doc.createElement("div");
		}

		// make sure the frag is a string.
		frag += "";

		// find the starting tag, and get node wrapper
		var match = frag.match(reTag),
			tag = match ? match[1].toLowerCase() : "",
			master = masterNode[masterId],
			wrap, i, fc, df;
		if(match && tagWrap[tag]){
			wrap = tagWrap[tag];
			master.innerHTML = wrap.pre + frag + wrap.post;
			for(i = wrap.length; i; --i){
				master = master.firstChild;
			}
		}else{
			master.innerHTML = frag;
		}

		// one node shortcut => return the node itself
		if(master.childNodes.length == 1){
			return master.removeChild(master.firstChild); // DOMNode
		}

		// return multiple nodes as a document fragment
		df = doc.createDocumentFragment();
		while(fc = master.firstChild){ // intentional assignment
			df.appendChild(fc);
		}
		return df; // DOMNode
	};

	exports.place = function place(/*DOMNode|String*/node, /*DOMNode|String*/refNode, /*String|Number?*/position){
		refNode = dom.byId(refNode);
		if(typeof node == "string"){ // inline'd type check
			node = /^\s*</.test(node) ? exports.toDom(node, refNode.ownerDocument) : dom.byId(node);
		}
		if(typeof position == "number"){ // inline'd type check
			var cn = refNode.childNodes;
			if(!cn.length || cn.length <= position){
				refNode.appendChild(node);
			}else{
				_insertBefore(node, cn[position < 0 ? 0 : position]);
			}
		}else{
			switch(position){
				case "before":
					_insertBefore(node, refNode);
					break;
				case "after":
					_insertAfter(node, refNode);
					break;
				case "replace":
					refNode.parentNode.replaceChild(node, refNode);
					break;
				case "only":
					exports.empty(refNode);
					refNode.appendChild(node);
					break;
				case "first":
					if(refNode.firstChild){
						_insertBefore(node, refNode.firstChild);
						break;
					}
					// else fallthrough...
				default: // aka: last
					refNode.appendChild(node);
			}
		}
		return node; // DomNode
	};

	exports.create = function create(/*DOMNode|String*/tag, /*Object*/attrs, /*DOMNode?|String?*/refNode, /*String?*/pos){
		var doc = win.doc;
		if(refNode){
			refNode = dom.byId(refNode);
			doc = refNode.ownerDocument;
		}
		if(typeof tag == "string"){ // inline'd type check
			tag = doc.createElement(tag);
		}
		if(attrs){ attr.set(tag, attrs); }
		if(refNode){ exports.place(tag, refNode, pos); }
		return tag; // DomNode
	};

	exports.empty =
				0 ? function(node){
			node = dom.byId(node);
			for(var c; c = node.lastChild;){ // intentional assignment
				exports.destroy(c);
			}
		} :
				function(node){
			dom.byId(node).innerHTML = "";
		};

	exports.destroy = function destroy(/*DOMNode|String*/node){
		node = dom.byId(node);
		try{
			var doc = node.ownerDocument;
			// cannot use _destroyContainer.ownerDocument since this can throw an exception on IE
			if(!_destroyContainer || _destroyDoc != doc){
				_destroyContainer = doc.createElement("div");
				_destroyDoc = doc;
			}
			_destroyContainer.appendChild(node.parentNode ? node.parentNode.removeChild(node) : node);
			// NOTE: see http://trac.dojotoolkit.org/ticket/2931. This may be a bug and not a feature
			_destroyContainer.innerHTML = "";
		}catch(e){
			/* squelch */
		}
	};
});

},
'dojox/mobile/Opener':function(){
define("dojox/mobile/Opener", [
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-style",
	"dojo/dom-geometry",
	"./Tooltip",
	"./Overlay"
], function(declare, lang, win, domClass, domConstruct, domStyle, domGeometry, Tooltip, Overlay){

	/*=====
		Tooltip = dojox.mobile.Tooltip;
		Overlay = dojox.mobile.Overlay;
	=====*/
	var isOverlay = domClass.contains(win.doc.documentElement, "dj_phone");
	var cls = declare("dojox.mobile.Opener", isOverlay ? Overlay : Tooltip, {
		// summary:
		//		A non-templated popup widget that will use either Tooltip or Overlay depending on screen size
		//
		buildRendering: function(){
			this.inherited(arguments);
			this.cover = domConstruct.create('div', { onclick: lang.hitch(this, '_onBlur'), 'class': 'mblOpenerUnderlay', style: { top:'0px', left:'0px', width:'0px', height:'0px', position: isOverlay ? 'absolute' : 'fixed', backgroundColor:'transparent', overflow:'hidden', zIndex:'-1' }}, this.domNode, 'first');
			this.connect(null, win.global.onorientationchange !== undefined ? "onorientationchange" : "onresize", lang.hitch(this, function(){
				if(domStyle.get(this.cover, "height") !== '0px'){ // resize cover when shown
					this._resizeCover();
				}
			}));
		},

		onShow: function(/*DomNode*/node){},
		onHide: function(/*DomNode*/node, /*Anything*/v){},

		show: function(node, positions){
			this.node = node;
			this.onShow(node);
			this._resizeCover();
			return this.inherited(arguments);
		},

		hide: function(/*Anything*/ val){
			this.inherited(arguments);
			domStyle.set(this.cover, { height:'0px' });
			this.onHide(this.node, val);
		},
		
		_resizeCover: function(){
			if(isOverlay){
				domStyle.set(this.cover, { height:'0px' }); // hide cover temporarily to calculate domNode size
				setTimeout(lang.hitch(this, function(){ // show cover after positioning popup
					var pos = domGeometry.position(this.domNode, false);
					domStyle.set(this.cover, { top:-pos.y+'px', left:-pos.x+'px', width:(pos.w+pos.x)+'px', height:(pos.h+pos.y)+'px' });
				}), 0);
			}else{
				domStyle.set(this.cover, { 
					width:Math.max(win.doc.documentElement.scrollWidth || win.body().scrollWidth || win.doc.documentElement.clientWidth)+'px', 
					height:Math.max(win.doc.documentElement.scrollHeight || win.body().scrollHeight || win.doc.documentElement.clientHeight)+'px' 
				});
			}			
		},
		
		_onBlur: function(e){
			var ret = this.onBlur(e);
			if(ret !== false){ // only exactly false prevents hide()
				this.hide(e);
			}
			return ret;
		}
	});
	cls.prototype.baseClass += " mblOpener"; // add to either mblOverlay or mblTooltip
	return cls;
});

},
'dijit/form/_FormValueMixin':function(){
define("dijit/form/_FormValueMixin", [
	"dojo/_base/declare", // declare
	"dojo/dom-attr", // domAttr.set
	"dojo/keys", // keys.ESCAPE
	"dojo/_base/sniff", // 0, has("quirks")
	"./_FormWidgetMixin"
], function(declare, domAttr, keys, has, _FormWidgetMixin){

/*=====
	var _FormWidgetMixin = dijit.form._FormWidgetMixin;
=====*/

	// module:
	//		dijit/form/_FormValueMixin
	// summary:
	//		Mixin for widgets corresponding to native HTML elements such as <input> or <select> that have user changeable values.

	return declare("dijit.form._FormValueMixin", _FormWidgetMixin, {
		// summary:
		//		Mixin for widgets corresponding to native HTML elements such as <input> or <select> that have user changeable values.
		// description:
		//		Each _FormValueMixin represents a single input value, and has a (possibly hidden) <input> element,
		//		to which it serializes it's input value, so that form submission (either normal submission or via FormBind?)
		//		works as expected.

		// readOnly: Boolean
		//		Should this widget respond to user input?
		//		In markup, this is specified as "readOnly".
		//		Similar to disabled except readOnly form values are submitted.
		readOnly: false,

		_setReadOnlyAttr: function(/*Boolean*/ value){
			domAttr.set(this.focusNode, 'readOnly', value);
			this.focusNode.setAttribute("aria-readonly", value);
			this._set("readOnly", value);
		},

		postCreate: function(){
			this.inherited(arguments);

			if(0){ // IE won't stop the event with keypress
				this.connect(this.focusNode || this.domNode, "onkeydown", this._onKeyDown);
			}
			// Update our reset value if it hasn't yet been set (because this.set()
			// is only called when there *is* a value)
			if(this._resetValue === undefined){
				this._lastValueReported = this._resetValue = this.value;
			}
		},

		_setValueAttr: function(/*anything*/ newValue, /*Boolean?*/ priorityChange){
			// summary:
			//		Hook so set('value', value) works.
			// description:
			//		Sets the value of the widget.
			//		If the value has changed, then fire onChange event, unless priorityChange
			//		is specified as null (or false?)
			this._handleOnChange(newValue, priorityChange);
		},

		_handleOnChange: function(/*anything*/ newValue, /*Boolean?*/ priorityChange){
			// summary:
			//		Called when the value of the widget has changed.  Saves the new value in this.value,
			//		and calls onChange() if appropriate.   See _FormWidget._handleOnChange() for details.
			this._set("value", newValue);
			this.inherited(arguments);
		},

		undo: function(){
			// summary:
			//		Restore the value to the last value passed to onChange
			this._setValueAttr(this._lastValueReported, false);
		},

		reset: function(){
			// summary:
			//		Reset the widget's value to what it was at initialization time
			this._hasBeenBlurred = false;
			this._setValueAttr(this._resetValue, true);
		},

		_onKeyDown: function(e){
			if(e.keyCode == keys.ESCAPE && !(e.ctrlKey || e.altKey || e.metaKey)){
				var te;
				if(0 < 9 || (0 && has("quirks"))){
					e.preventDefault(); // default behavior needs to be stopped here since keypress is too late
					te = document.createEventObject();
					te.keyCode = keys.ESCAPE;
					te.shiftKey = e.shiftKey;
					e.srcElement.fireEvent('onkeypress', te);
				}
			}
		}
	});
});

},
'dojox/mobile/common':function(){
define("dojox/mobile/common", [
	"dojo/_base/kernel", // to test dojo.hash
	"dojo/_base/array",
	"dojo/_base/config",
	"dojo/_base/connect",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-style",
//	"dojo/hash", // optionally prereq'ed
	"dojo/ready",
	"dijit/registry",	// registry.toArray
	"./sniff",
	"./uacss"
], function(dojo, array, config, connect, lang, win, domClass, domConstruct, domStyle, ready, registry, has, uacss){

	var dm = lang.getObject("dojox.mobile", true);
/*=====
	var dm = dojox.mobile;
=====*/

	// module:
	//		dojox/mobile/common
	// summary:
	//		A common module for dojox.mobile.
	// description:
	//		This module includes common utility functions that are used by
	//		dojox.mobile widgets. Also, it provides functions that are commonly
	//		necessary for mobile web applications, such as the hide address bar
	//		function.

	dm.getScreenSize = function(){
		// summary:
		//		Returns the dimensions of the browser window.
		return {
			h: win.global.innerHeight || win.doc.documentElement.clientHeight,
			w: win.global.innerWidth || win.doc.documentElement.clientWidth
		};
	};

	dm.updateOrient = function(){
		// summary:
		//		Updates the orientation specific css classes, 'dj_portrait' and
		//		'dj_landscape'.
		var dim = dm.getScreenSize();
		domClass.replace(win.doc.documentElement,
				  dim.h > dim.w ? "dj_portrait" : "dj_landscape",
				  dim.h > dim.w ? "dj_landscape" : "dj_portrait");
	};
	dm.updateOrient();

	dm.tabletSize = 500;
	dm.detectScreenSize = function(/*Boolean?*/force){
		// summary:
		//		Detects the screen size and determines if the screen is like
		//		phone or like tablet. If the result is changed,
		//		it sets either of the following css class to <html>
		//			- 'dj_phone'
		//			- 'dj_tablet'
		//		and it publishes either of the following events.
		//			- '/dojox/mobile/screenSize/phone'
		//			- '/dojox/mobile/screenSize/tablet'
		var dim = dm.getScreenSize();
		var sz = Math.min(dim.w, dim.h);
		var from, to;
		if(sz >= dm.tabletSize && (force || (!this._sz || this._sz < dm.tabletSize))){
			from = "phone";
			to = "tablet";
		}else if(sz < dm.tabletSize && (force || (!this._sz || this._sz >= dm.tabletSize))){
			from = "tablet";
			to = "phone";
		}
		if(to){
			domClass.replace(win.doc.documentElement, "dj_"+to, "dj_"+from);
			connect.publish("/dojox/mobile/screenSize/"+to, [dim]);
		}
		this._sz = sz;
	};
	dm.detectScreenSize();

	dm.setupIcon = function(/*DomNode*/iconNode, /*String*/iconPos){
		// summary:
		//		Sets up CSS sprite for a foreground image.
		if(iconNode && iconPos){
			var arr = array.map(iconPos.split(/[ ,]/),function(item){return item-0});
			var t = arr[0]; // top
			var r = arr[1] + arr[2]; // right
			var b = arr[0] + arr[3]; // bottom
			var l = arr[1]; // left
			domStyle.set(iconNode, {
				clip: "rect("+t+"px "+r+"px "+b+"px "+l+"px)",
				top: (iconNode.parentNode ? domStyle.get(iconNode, "top") : 0) - t + "px",
				left: -l + "px"
			});
		}
	};

	// dojox.mobile.hideAddressBarWait: Number
	//		The time in milliseconds to wait before the fail-safe hiding address
	//		bar runs. The value must be larger than 800.
	dm.hideAddressBarWait = typeof(config["mblHideAddressBarWait"]) === "number" ?
		config["mblHideAddressBarWait"] : 1500;

	dm.hide_1 = function(force){
		// summary:
		//		Internal function to hide the address bar.
		scrollTo(0, 1);
		var h = dm.getScreenSize().h + "px";
		if(has("android")){
			if(force){
				win.body().style.minHeight = h;
			}
			dm.resizeAll();
		}else{
			if(force || dm._h === h && h !== win.body().style.minHeight){
				win.body().style.minHeight = h;
				dm.resizeAll();
			}
		}
		dm._h = h;
	};

	dm.hide_fs = function(){
		// summary:
		//		Internal function to hide the address bar for fail-safe.
		// description:
		//		Resets the height of the body, performs hiding the address
		//		bar, and calls resizeAll().
		//		This is for fail-safe, in case of failure to complete the
		//		address bar hiding in time.
		var t = win.body().style.minHeight;
		win.body().style.minHeight = (dm.getScreenSize().h * 2) + "px"; // to ensure enough height for scrollTo to work
		scrollTo(0, 1);
		setTimeout(function(){
			dm.hide_1(1);
			dm._hiding = false;
		}, 1000);
	};
	dm.hideAddressBar = function(/*Event?*/evt){
		// summary:
		//		Hides the address bar.
		// description:
		//		Tries hiding of the address bar a couple of times to do it as
		//		quick as possible while ensuring resize is done after the hiding
		//		finishes.
		if(dm.disableHideAddressBar || dm._hiding){ return; }
		dm._hiding = true;
		dm._h = 0;
		win.body().style.minHeight = (dm.getScreenSize().h * 2) + "px"; // to ensure enough height for scrollTo to work
		setTimeout(dm.hide_1, 0);
		setTimeout(dm.hide_1, 200);
		setTimeout(dm.hide_1, 800);
		setTimeout(dm.hide_fs, dm.hideAddressBarWait);
	};

	dm.resizeAll = function(/*Event?*/evt, /*Widget?*/root){
		// summary:
		//		Call the resize() method of all the top level resizable widgets.
		// description:
		//		Find all widgets that do not have a parent or the parent does not
		//		have the resize() method, and call resize() for them.
		//		If a widget has a parent that has resize(), call of the widget's
		//		resize() is its parent's responsibility.
		// evt:
		//		Native event object
		// root:
		//		If specified, search the specified widget recursively for top level
		//		resizable widgets.
		//		root.resize() is always called regardless of whether root is a
		//		top level widget or not.
		//		If omitted, search the entire page.
		if(dm.disableResizeAll){ return; }
		connect.publish("/dojox/mobile/resizeAll", [evt, root]);
		dm.updateOrient();
		dm.detectScreenSize();
		var isTopLevel = function(w){
			var parent = w.getParent && w.getParent();
			return !!((!parent || !parent.resize) && w.resize);
		};
		var resizeRecursively = function(w){
			array.forEach(w.getChildren(), function(child){
				if(isTopLevel(child)){ child.resize(); }
				resizeRecursively(child);
			});
		};
		if(root){
			if(root.resize){ root.resize(); }
			resizeRecursively(root);
		}else{
			array.forEach(array.filter(registry.toArray(), isTopLevel),
					function(w){ w.resize(); });
		}
	};

	dm.openWindow = function(url, target){
		// summary:
		//		Opens a new browser window with the given url.
		win.global.open(url, target || "_blank");
	};

	dm.createDomButton = function(/*DomNode*/refNode, /*Object?*/style, /*DomNode?*/toNode){
		// summary:
		//		Creates a DOM button.
		// description:
		//		DOM button is a simple graphical object that consists of one or
		//		more nested DIV elements with some CSS styling. It can be used
		//		in place of an icon image on ListItem, IconItem, and so on.
		//		The kind of DOM button to create is given as a class name of
		//		refNode. The number of DIVs to create is searched from the style
		//		sheets in the page. However, if the class name has a suffix that
		//		starts with an underscore, like mblDomButtonGoldStar_5, then the
		//		suffixed number is used instead. A class name for DOM button
		//		must starts with 'mblDomButton'.
		// refNode:
		//		A node that has a DOM button class name.
		// style:
		//		A hash object to set styles to the node.
		// toNode:
		//		A root node to create a DOM button. If omitted, refNode is used.

		if(!dm._domButtons){
			if(has("webkit")){
				var findDomButtons = function(sheet, dic){
					// summary:
					//		Searches the style sheets for DOM buttons.
					// description:
					//		Returns a key-value pair object whose keys are DOM
					//		button class names and values are the number of DOM
					//		elements they need.
					var i, j;
					if(!sheet){
						var dic = {};
						var ss = dojo.doc.styleSheets;
						for (i = 0; i < ss.length; i++){
							ss[i] && findDomButtons(ss[i], dic);
						}
						return dic;
					}
					var rules = sheet.cssRules || [];
					for (i = 0; i < rules.length; i++){
						var rule = rules[i];
						if(rule.href && rule.styleSheet){
							findDomButtons(rule.styleSheet, dic);
						}else if(rule.selectorText){
							var sels = rule.selectorText.split(/,/);
							for (j = 0; j < sels.length; j++){
								var sel = sels[j];
								var n = sel.split(/>/).length - 1;
								if(sel.match(/(mblDomButton\w+)/)){
									var cls = RegExp.$1;
									if(!dic[cls] || n > dic[cls]){
										dic[cls] = n;
									}
								}
							}
						}
					}
				}
				dm._domButtons = findDomButtons();
			}else{
				dm._domButtons = {};
			}
		}

		var s = refNode.className;
		var node = toNode || refNode;
		if(s.match(/(mblDomButton\w+)/) && s.indexOf("/") === -1){
			var btnClass = RegExp.$1;
			var nDiv = 4;
			if(s.match(/(mblDomButton\w+_(\d+))/)){
				nDiv = RegExp.$2 - 0;
			}else if(dm._domButtons[btnClass] !== undefined){
				nDiv = dm._domButtons[btnClass];
			}
			var props = null;
			if(has("bb") && config["mblBBBoxShadowWorkaround"] !== false){
				// Removes box-shadow because BlackBerry incorrectly renders it.
				props = {style:"-webkit-box-shadow:none"};
			}
			for(var i = 0, p = node; i < nDiv; i++){
				p = p.firstChild || domConstruct.create("DIV", props, p);
			}
			if(toNode){
				setTimeout(function(){
					domClass.remove(refNode, btnClass);
				}, 0);
				domClass.add(toNode, btnClass);
			}
		}else if(s.indexOf(".") !== -1){ // file name
			domConstruct.create("IMG", {src:s}, node);
		}else{
			return null;
		}
		domClass.add(node, "mblDomButton");
		if(config["mblAndroidWorkaround"] !== false && has("android") >= 2.2){
			// Android workaround for the issue that domButtons' -webkit-transform styles sometimes invalidated
			// by applying -webkit-transform:translated3d(x,y,z) style programmatically to non-ancestor elements,
			// which results in breaking domButtons.
			domStyle.set(node, "webkitTransform", "translate3d(0,0,0)");
		}
		!!style && domStyle.set(node, style);
		return node;
	};
	
	dm.createIcon = function(/*String*/icon, /*String*/iconPos, /*DomNode*/node, /*String?*/title, /*DomNode?*/parent){
		// summary:
		//		Creates or updates an icon node
		// description:
		//		If node exists, updates the existing node. Otherwise, creates a new one.
		// icon:
		//		Path for an image, or DOM button class name.
		if(icon && icon.indexOf("mblDomButton") === 0){
			// DOM button
			if(node && node.className.match(/(mblDomButton\w+)/)){
				domClass.remove(node, RegExp.$1);
			}else{
				node = domConstruct.create("DIV");
			}
			node.title = title;
			domClass.add(node, icon);
			dm.createDomButton(node);
		}else if(icon && icon !== "none"){
			// Image
			if(!node || node.nodeName !== "IMG"){
				node = domConstruct.create("IMG", {
					alt: title
				});
			}
			node.src = (icon || "").replace("${theme}", dm.currentTheme);
			dm.setupIcon(node, iconPos);
			if(parent && iconPos){
				var arr = iconPos.split(/[ ,]/);
				domStyle.set(parent, {
					width: arr[2] + "px",
					height: arr[3] + "px"
				});
			}
		}
		if(parent){
			parent.appendChild(node);
		}
		return node;
	};

	// flag for iphone flicker workaround
	dm._iw = config["mblIosWorkaround"] !== false && has("iphone");
	if(dm._iw){
		dm._iwBgCover = domConstruct.create("div"); // Cover to hide flicker in the background
	}
	
	if(config.parseOnLoad){
		ready(90, function(){
			// avoid use of query
			/*
			var list = query('[lazy=true] [dojoType]', null);
			list.forEach(function(node, index, nodeList){
				node.setAttribute("__dojoType", node.getAttribute("dojoType"));
				node.removeAttribute("dojoType");
			});
			*/
		
			var nodes = win.body().getElementsByTagName("*");
			var i, len, s;
			len = nodes.length;
			for(i = 0; i < len; i++){
				s = nodes[i].getAttribute("dojoType");
				if(s){
					if(nodes[i].parentNode.getAttribute("lazy") == "true"){
						nodes[i].setAttribute("__dojoType", s);
						nodes[i].removeAttribute("dojoType");
					}
				}
			}
		});
	}
	
	ready(function(){
		dm.detectScreenSize(true);
		if(config["mblApplyPageStyles"] !== false){
			domClass.add(win.doc.documentElement, "mobile");
		}
		if(has("chrome")){
			// dojox.mobile does not load uacss (only _compat does), but we need dj_chrome.
			domClass.add(win.doc.documentElement, "dj_chrome");
		}

		if(config["mblAndroidWorkaround"] !== false && has("android") >= 2.2){ // workaround for android screen flicker problem
			if(config["mblAndroidWorkaroundButtonStyle"] !== false){
				// workaround to avoid buttons disappear due to the side-effect of the webkitTransform workaroud below
				domConstruct.create("style", {innerHTML:"BUTTON,INPUT[type='button'],INPUT[type='submit'],INPUT[type='reset'],INPUT[type='file']::-webkit-file-upload-button{-webkit-appearance:none;}"}, win.doc.head, "first");
			}
			if(has("android") < 3){ // for Android 2.2.x and 2.3.x
				domStyle.set(win.doc.documentElement, "webkitTransform", "translate3d(0,0,0)");
				// workaround for auto-scroll issue when focusing input fields
				connect.connect(null, "onfocus", null, function(e){
					domStyle.set(win.doc.documentElement, "webkitTransform", "");
				});
				connect.connect(null, "onblur", null, function(e){
					domStyle.set(win.doc.documentElement, "webkitTransform", "translate3d(0,0,0)");
				});
			}else{ // for Android 3.x
				if(config["mblAndroid3Workaround"] !== false){
					domStyle.set(win.doc.documentElement, {
						webkitBackfaceVisibility: "hidden",
						webkitPerspective: 8000
					});
				}
			}
		}
	
		//	You can disable hiding the address bar with the following djConfig.
		//	var djConfig = { mblHideAddressBar: false };
		var f = dm.resizeAll;
		if(config["mblHideAddressBar"] !== false &&
			navigator.appVersion.indexOf("Mobile") != -1 ||
			config["mblForceHideAddressBar"] === true){
			dm.hideAddressBar();
			if(config["mblAlwaysHideAddressBar"] === true){
				f = dm.hideAddressBar;
			}
		}
		connect.connect(null, (win.global.onorientationchange !== undefined && !has("android"))
			? "onorientationchange" : "onresize", null, f);
	
		// avoid use of query
		/*
		var list = query('[__dojoType]', null);
		list.forEach(function(node, index, nodeList){
			node.setAttribute("dojoType", node.getAttribute("__dojoType"));
			node.removeAttribute("__dojoType");
		});
		*/
	
		var nodes = win.body().getElementsByTagName("*");
		var i, len = nodes.length, s;
		for(i = 0; i < len; i++){
			s = nodes[i].getAttribute("__dojoType");
			if(s){
				nodes[i].setAttribute("dojoType", s);
				nodes[i].removeAttribute("__dojoType");
			}
		}
	
		if(dojo.hash){
			// find widgets under root recursively
			var findWidgets = function(root){
				if(!root){ return []; }
				var arr = registry.findWidgets(root);
				var widgets = arr;
				for(var i = 0; i < widgets.length; i++){
					arr = arr.concat(findWidgets(widgets[i].containerNode));
				}
				return arr;
			};
			connect.subscribe("/dojo/hashchange", null, function(value){
				var view = dm.currentView;
				if(!view){ return; }
				var params = dm._params;
				if(!params){ // browser back/forward button was pressed
					var moveTo = value ? value : dm._defaultView.id;
					var widgets = findWidgets(view.domNode);
					var dir = 1, transition = "slide";
					for(i = 0; i < widgets.length; i++){
						var w = widgets[i];
						if("#"+moveTo == w.moveTo){
							// found a widget that has the given moveTo
							transition = w.transition;
							dir = (w instanceof dm.Heading) ? -1 : 1;
							break;
						}
					}
					params = [ moveTo, dir, transition ];
				}
				view.performTransition.apply(view, params);
				dm._params = null;
			});
		}
	
		win.body().style.visibility = "visible";
	});

	// To search _parentNode first.  TODO:1.8 reconsider this redefinition.
	registry.getEnclosingWidget = function(node){
		while(node){
			var id = node.getAttribute && node.getAttribute("widgetId");
			if(id){
				return registry.byId(id);
			}
			node = node._parentNode || node.parentNode;
		}
		return null;
	};

	return dm;
});

},
'dojox/mobile/Heading':function(){
define("dojox/mobile/Heading", [
	"dojo/_base/array",
	"dojo/_base/connect",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-style",
	"dijit/registry",	// registry.byId
	"dijit/_Contained",
	"dijit/_Container",
	"dijit/_WidgetBase",
	"./View"
], function(array, connect, declare, lang, win, domClass, domConstruct, domStyle, registry, Contained, Container, WidgetBase, View){

	var dm = lang.getObject("dojox.mobile", true);

/*=====
	var Contained = dijit._Contained;
	var Container = dijit._Container;
	var WidgetBase = dijit._WidgetBase;
=====*/

	// module:
	//		dojox/mobile/Heading
	// summary:
	//		A widget that represents a navigation bar.

	return declare("dojox.mobile.Heading", [WidgetBase, Container, Contained],{
		// summary:
		//		A widget that represents a navigation bar.
		// description:
		//		Heading is a widget that represents a navigation bar, which
		//		usually appears at the top of an application. It usually
		//		displays the title of the current view and can contain a
		//		navigational control. If you use it with
		//		dojox.mobile.ScrollableView, it can also be used as a fixed
		//		header bar or a fixed footer bar. In such cases, specify the
		//		fixed="top" attribute to be a fixed header bar or the
		//		fixed="bottom" attribute to be a fixed footer bar. Heading can
		//		have one or more ToolBarButton widgets as its children.

		// back: String
		//		A label for the navigational control to return to the previous
		//		View.
		back: "",

		// href: String
		//		A URL to open when the navigational control is pressed.
		href: "",

		// moveTo: String
		//		The id of the transition destination view which resides in the
		//		current page.
		//
		//		If the value has a hash sign ('#') before the id (e.g. #view1)
		//		and the dojo.hash module is loaded by the user application, the
		//		view transition updates the hash in the browser URL so that the
		//		user can bookmark the destination view. In this case, the user
		//		can also use the browser's back/forward button to navigate
		//		through the views in the browser history.
		//
		//		If null, transitions to a blank view.
		//		If '#', returns immediately without transition.
		moveTo: "",

		// transition: String
		//		A type of animated transition effect. You can choose from the
		//		standard transition types, "slide", "fade", "flip", or from the
		//		extended transition types, "cover", "coverv", "dissolve",
		//		"reveal", "revealv", "scaleIn", "scaleOut", "slidev",
		//		"swirl", "zoomIn", "zoomOut". If "none" is specified, transition
		//		occurs immediately without animation.
		transition: "slide",

		// label: String
		//		A title text of the heading. If the label is not specified, the
		//		innerHTML of the node is used as a label.
		label: "",

		// iconBase: String
		//		The default icon path for child items.
		iconBase: "",

		// backProp: Object
		//		Properties for the back button.
		backProp: {className: "mblArrowButton"},

		// tag: String
		//		A name of html tag to create as domNode.
		tag: "H1",

		buildRendering: function(){
			this.domNode = this.containerNode = this.srcNodeRef || win.doc.createElement(this.tag);
			this.domNode.className = "mblHeading";
			if(!this.label){
				array.forEach(this.domNode.childNodes, function(n){
					if(n.nodeType == 3){
						var v = lang.trim(n.nodeValue);
						if(v){
							this.label = v;
							this.labelNode = domConstruct.create("SPAN", {innerHTML:v}, n, "replace");
						}
					}
				}, this);
			}
			if(!this.labelNode){
				this.labelNode = domConstruct.create("SPAN", null, this.domNode);
			}
			this.labelNode.className = "mblHeadingSpanTitle";
			this.labelDivNode = domConstruct.create("DIV", {
				className: "mblHeadingDivTitle",
				innerHTML: this.labelNode.innerHTML
			}, this.domNode);
		},

		startup: function(){
			if(this._started){ return; }
			var parent = this.getParent && this.getParent();
			if(!parent || !parent.resize){ // top level widget
				var _this = this;
				setTimeout(function(){ // necessary to render correctly
					_this.resize();
				}, 0);
			}
			this.inherited(arguments);
		},
	
		resize: function(){
			if(this._btn){
				this._btn.style.width = this._body.offsetWidth + this._head.offsetWidth + "px";
			}
			if(this.labelNode){
				// find the rightmost left button (B), and leftmost right button (C)
				// +-----------------------------+
				// | |A| |B|             |C| |D| |
				// +-----------------------------+
				var leftBtn, rightBtn;
				var children = this.containerNode.childNodes;
				for(var i = children.length - 1; i >= 0; i--){
					var c = children[i];
					if(c.nodeType === 1){
						if(!rightBtn && domClass.contains(c, "mblToolBarButton") && domStyle.get(c, "float") === "right"){
							rightBtn = c;
						}
						if(!leftBtn && (domClass.contains(c, "mblToolBarButton") && domStyle.get(c, "float") === "left" || c === this._btn)){
							leftBtn = c;
						}
					}
				}

				if(!this.labelNodeLen && this.label){
					this.labelNode.style.display = "inline";
					this.labelNodeLen = this.labelNode.offsetWidth;
					this.labelNode.style.display = "";
				}

				var bw = this.domNode.offsetWidth; // bar width
				var rw = rightBtn ? bw - rightBtn.offsetLeft + 5 : 0; // rightBtn width
				var lw = leftBtn ? leftBtn.offsetLeft + leftBtn.offsetWidth + 5 : 0; // leftBtn width
				var tw = this.labelNodeLen || 0; // title width
				domClass[bw - Math.max(rw,lw)*2 > tw ? "add" : "remove"](this.domNode, "mblHeadingCenterTitle");
			}
			array.forEach(this.getChildren(), function(child){
				if(child.resize){ child.resize(); }
			});
		},

		_setBackAttr: function(/*String*/back){
			if (!back){
				domConstruct.destroy(this._btn);
				this._btn = null;
				this.back = "";
			}else{
				if(!this._btn){
					var btn = domConstruct.create("DIV", this.backProp, this.domNode, "first");
					var head = domConstruct.create("DIV", {className:"mblArrowButtonHead"}, btn);
					var body = domConstruct.create("DIV", {className:"mblArrowButtonBody mblArrowButtonText"}, btn);

					this._body = body;
					this._head = head;
					this._btn = btn;
					this.backBtnNode = btn;
					this.connect(body, "onclick", "onClick");
				}
				this.back = back;
				this._body.innerHTML = this._cv ? this._cv(this.back) : this.back;
			}
			this.resize();
		},
	
		_setLabelAttr: function(/*String*/label){
			this.label = label;
			this.labelNode.innerHTML = this.labelDivNode.innerHTML = this._cv ? this._cv(label) : label;
		},
	
		findCurrentView: function(){
			// summary:
			//		Search for the view widget that contains this widget.
			var w = this;
			while(true){
				w = w.getParent();
				if(!w){ return null; }
				if(w instanceof View){ break; }
			}
			return w;
		},

		onClick: function(e){
			var h1 = this.domNode;
			domClass.add(h1, "mblArrowButtonSelected");
			setTimeout(function(){
				domClass.remove(h1, "mblArrowButtonSelected");
			}, 1000);

			if(this.back && !this.moveTo && !this.href && history){
				history.back();	
				return;
			}	
	
			// keep the clicked position for transition animations
			var view = this.findCurrentView();
			if(view){
				view.clickedPosX = e.clientX;
				view.clickedPosY = e.clientY;
			}
			this.goTo(this.moveTo, this.href);
		},
	
		goTo: function(moveTo, href){
			// summary:
			//		Given the destination, makes a view transition.
			var view = this.findCurrentView();
			if(!view){ return; }
			if(href){
				view.performTransition(null, -1, this.transition, this, function(){location.href = href;});
			}else{
				if(dm.app && dm.app.STAGE_CONTROLLER_ACTIVE){
					// If in a full mobile app, then use its mechanisms to move back a scene
					connect.publish("/dojox/mobile/app/goback");
				}else{
					// Basically transition should be performed between two
					// siblings that share the same parent.
					// However, when views are nested and transition occurs from
					// an inner view, search for an ancestor view that is a sibling
					// of the target view, and use it as a source view.
					var node = registry.byId(view.convertToId(moveTo));
					if(node){
						var parent = node.getParent();
						while(view){
							var myParent = view.getParent();
							if(parent === myParent){
								break;
							}
							view = myParent;
						}
					}
					if(view){
						view.performTransition(moveTo, -1, this.transition);
					}
				}
			}
		}
	});
});

},
'dojox/main':function(){
define("dojox/main", ["dojo/_base/kernel"], function(dojo) {
	// module:
	//		dojox/main
	// summary:
	//		The dojox package main module; dojox package is somewhat unusual in that the main module currently just provides an empty object.

	return dojo.dojox;
});
},
'dojox/mobile/RoundRectList':function(){
define("dojox/mobile/RoundRectList", [
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/_base/window",
	"dijit/_Contained",
	"dijit/_Container",
	"dijit/_WidgetBase"
], function(array, declare, win, Contained, Container, WidgetBase){

/*=====
	var Contained = dijit._Contained;
	var Container = dijit._Container;
	var WidgetBase = dijit._WidgetBase;
=====*/

	// module:
	//		dojox/mobile/RoundRectList
	// summary:
	//		A rounded rectangle list.

	return declare("dojox.mobile.RoundRectList", [WidgetBase, Container, Contained], {
		// summary:
		//		A rounded rectangle list.
		// description:
		//		RoundRectList is a rounded rectangle list, which can be used to
		//		display a group of items. Each item must be
		//		dojox.mobile.ListItem.

		// transition: String
		//		The default animated transition effect for child items.
		transition: "slide",

		// iconBase: String
		//		The default icon path for child items.
		iconBase: "",

		// iconPos: String
		//		The default icon position for child items.
		iconPos: "",

		// select: String
		//		Selection mode of the list. The check mark is shown for the
		//		selected list item(s). The value can be "single", "multiple", or
		//		"". If "single", there can be only one selected item at a time.
		//		If "multiple", there can be multiple selected items at a time.
		select: "",

		// stateful: String
		//		If true, the last selected item remains highlighted.
		stateful: false,

		buildRendering: function(){
			this.domNode = this.containerNode = this.srcNodeRef || win.doc.createElement("UL");
			this.domNode.className = "mblRoundRectList";
		},
	
		resize: function(){
			// summary:
			//		Calls resize() of each child widget.
			array.forEach(this.getChildren(), function(child){
				if(child.resize){ child.resize(); }
			});
		},

		onCheckStateChanged: function(/*Widget*/listItem, /*String*/newState){
			// summary:
			//		Stub function to connect to from your application.
			// description:
			//		Called when the check state has been changed.
		},

		_setStatefulAttr: function(stateful){
			this.stateful = stateful;
			array.forEach(this.getChildren(), function(child){
				child.setArrow && child.setArrow();
			});
		},

		deselectItem: function(/*ListItem*/item){
			// summary:
			//		Deselects the given item.
			item.deselect();
		},

		deselectAll: function(){
			// summary:
			//		Deselects all the items.
			array.forEach(this.getChildren(), function(child){
				child.deselect && child.deselect();
			});
		},

		selectItem: function(/*ListItem*/item){
			// summary:
			//		Selects the given item.
			item.select();
		}
	});
});

},
'dojox/mobile/RadioButton':function(){
define("dojox/mobile/RadioButton", [
	"dojo/_base/declare",
	"dijit/form/_RadioButtonMixin",
	"./CheckBox"
], function(declare, RadioButtonMixin, CheckBox){
	/*=====
		CheckBox = dojox.mobile.CheckBox;
		RadioButtonMixin = dijit.form._RadioButtonMixin;
	=====*/
	return declare("dojox.mobile.RadioButton", [CheckBox, RadioButtonMixin], {
		// summary:
		//		A non-templated radiobutton widget that can be in two states (checked or not).

		// Override automatic assigning type --> node, it causes exception on IE8.
		// Instead, type must be specified as this.type when the node is created, as part of the original DOM
		_setTypeAttr: null,

		baseClass: "mblRadioButton"
	});
});

},
'app/views/Map':function(){
define("app/views/Map", ['dojo/_base/declare',
        'dojo/_base/Deferred',
        'dijit/registry', 
		'dojo/dom',
		'dojo/dom-class',
        'dojo/on',
        'dojo/_base/lang',
        'dojo/window',
        'dojo/query', 
        'app/views/GeoJSON',
        'dojo/dom-construct'
        ], function (declare, Deferred, registry, dom, domClass, on, lang, win, query, GeoJSON, domConstruct) {
	
	// module:
	//		views/Map
	// summary:
	//		Object encapsulating view and map
	return declare('app.views.Map', null,{
			
        view: null,
		map: null,
		currentPage: null,
		previousView: null,
		infowindow: null,
		pageType: null,
		
        	

		constructor: function() {
			this.view = registry.byId('mapView');
			this._setupEventHandlers();
			
			var mapOptions = {
				zoom : 10,
				center : new google.maps.LatLng(53.38250, -6.24916),
				mapTypeId : google.maps.MapTypeId.ROADMAP,
				sensor : true
			};
			this.map = new google.maps.Map(dom.byId("map_canvas"), mapOptions);
			
			this.infowindow = new google.maps.InfoWindow();
			
			
			// dojo.connect(null, (dojo.global.onorientationchange !== undefined && !dojo.isAndroid)
					// ? "onorientationchange" : "onresize", null, this.fixHeight);
		},

        
		show: function(activityStore, pageType, previousView) {
			this.pageType = pageType;
			this.populateData(previousView);
			this.view.show();
	        this.fixHeight(this);
	        
	        if(this.pageType == 'activityList'){
	        	var selLi = query("#dojox_mobile_Heading_3 .mblTabButtonSelected");
	        	domClass.remove(selLi[0], "mblTabButtonSelected");
	        	domClass.add("mapBtn_map", "mblTabButtonSelected");
	        	
	        	var cachedActivitiesData = localStorage.getItem("game_activities");
				if(cachedActivitiesData){
					viewCache.activityList.activityListStore = dojo.fromJson(cachedActivitiesData);
				}
	        	
				var geoJSON = viewCache.activityList.activityListStore;
				this.displayActivityMarkers(geoJSON);
			}
			else if(this.pageType == 'activityDetail')
			{
				console.error("STUB: Next line needs to tell where geoJSON for displayActivityDetail is coming from.");
				var geoJSON;
				displayActivityDetailMarkers();
			}
			else{
				console.error("No valid pageType set [activityList]");
			}
	        
	        
			//registry.byId('mapView_footer').resize();
		}, 
		
		populateData: function(previousView) {
			if(this.previousView !== previousView){
				this.previousView = previousView
				if(this.btnHandle){
					this.btnHandle.pause();
				}
			}
		},
		
		_setupEventHandlers: function(){
			var listBtn = registry.byId('listBtn_map');
			
			listBtn.on('Click', lang.hitch(this, function (){
				if(!this.pageType || this.pageType == 'activityList'){
	        		var selLi = query("#dojox_mobile_Heading_1 .mblTabButtonSelected");
	        		if(selLi.length){
	        			domClass.remove(selLi[0], "mblTabButtonSelected");
	        		}
		        	domClass.add("activListBtn_actList", "mblTabButtonSelected");
				}
				
			}));
			
			
			
			
			on(window, (dojo.global.orientationchange !== undefined && !dojo.isAndroid)
					? "orientationchange" : "resize", this.fixHeight(this));
		},
		
		fixHeight: function(view)
		{
			//alert('fixHeight');
			//if(view.view._visible == true)
			{
				var vs = win.getBox();
				var mapView = query("#mapView");
				
		        var vs = win.getBox();
		        mapView[0].style.height = (vs.h)+'px';
		        
				var mapCanvas = dom.byId("map_canvas");
				google.maps.event.trigger(mapCanvas, 'resize');
			}
		},
		
		
		displayActivityMarkers: function(geoJSON){
			
			var parser = new GeoJSON(geoJSON);
			var googleMarkers = parser.parse();
			var latlngbounds = new google.maps.LatLngBounds( );
			if (googleMarkers.length){
				for (var i = 0; i < googleMarkers.length; i++){
					googleMarkers[i].setMap(this.map);
					latlngbounds.extend( googleMarkers[i].getPosition() );
					if (googleMarkers[i].geojsonProperties) {
						this.setInfoWindow(googleMarkers[i]);
					}
				}
			}else{
				googleMarkers.setMap(this.map);
				latlngbounds.extend( googleMarkers.getPosition() );
				if (googleMarkers.geojsonProperties) {
					this.setInfoWindow(googleMarkers);
				}
			}
			this.map.fitBounds( latlngbounds );
		},
		
		displayActivityDetailMarkers: function(geoJSON){
			
			var parser = new GeoJSON(geoJSON);
			var googleMarkers = parser.parse();
			var latlngbounds = new google.maps.LatLngBounds( );
			if (googleMarkers.length){
				for (var i = 0; i < googleMarkers.length; i++){
					googleMarkers[i].setMap(this.map);
					latlngbounds.extend( googleMarkers[i].getPosition() );
					if (googleMarkers[i].geojsonProperties) {
						this.setInfoWindow(googleMarkers[i]);
					}
				}
			}else{
				googleMarkers.setMap(this.map);
				latlngbounds.extend( googleMarkers.getPosition() );
				if (googleMarkers.geojsonProperties) {
					this.setInfoWindow(googleMarkers);
				}
			}
			this.map.fitBounds( latlngbounds );
		},
		
		
		setInfoWindow: function  (feature) {
			google.maps.event.addListener(feature, "click", lang.hitch(this, function(feature, event) {
				//var content = "<div id='infoBox'><span id='info_button_"+1+"'>"+this.geojsonProperties.name+"</span></div>";
				var content = domConstruct.create("div", { innerHTML: "<span id='"+feature.id+"'>"+feature.geojsonProperties.name+"</span>" });
				
				//if(this.infowindow == null)this.infowindow = new google.maps.InfoWindow();
				//else 
				//this.infowindow.close();
				
				this.infowindow.setContent(content);
				this.infowindow.position = event.latLng;
				this.infowindow.open(this.map);
				
				on(content, 'span:click', lang.hitch(this, function(event) {
					var i;//for loop iterator
					var itemId = event.target.id;
					this.view.performTransition("activityDetailView", 1, "slide");
					for(i=0; i<viewCache.activityList.activityStore.features.length; i++){
						if(viewCache.activityList.activityStore.features[i].id === itemId){
							lang.hitch(viewCache.activityList, "getActivityItemData", viewCache.activityList.activityStore.features[i])();
							//found it, exit.
							break;
						}
					}
					
				}));
				
			}, feature));
		}
		
		
		
    });
});


},
'dojo/Stateful':function(){
define("dojo/Stateful", ["./_base/kernel", "./_base/declare", "./_base/lang", "./_base/array"], function(dojo, declare, lang, array) {
	// module:
	//		dojo/Stateful
	// summary:
	//		TODOC

return dojo.declare("dojo.Stateful", null, {
	// summary:
	//		Base class for objects that provide named properties with optional getter/setter
	//		control and the ability to watch for property changes
	// example:
	//	|	var obj = new dojo.Stateful();
	//	|	obj.watch("foo", function(){
	//	|		console.log("foo changed to " + this.get("foo"));
	//	|	});
	//	|	obj.set("foo","bar");
	postscript: function(mixin){
		if(mixin){
			lang.mixin(this, mixin);
		}
	},

	get: function(/*String*/name){
		// summary:
		//		Get a property on a Stateful instance.
		//	name:
		//		The property to get.
		//	returns:
		//		The property value on this Stateful instance.
		// description:
		//		Get a named property on a Stateful object. The property may
		//		potentially be retrieved via a getter method in subclasses. In the base class
		// 		this just retrieves the object's property.
		// 		For example:
		//	|	stateful = new dojo.Stateful({foo: 3});
		//	|	stateful.get("foo") // returns 3
		//	|	stateful.foo // returns 3

		return this[name]; //Any
	},
	set: function(/*String*/name, /*Object*/value){
		// summary:
		//		Set a property on a Stateful instance
		//	name:
		//		The property to set.
		//	value:
		//		The value to set in the property.
		//	returns:
		//		The function returns this dojo.Stateful instance.
		// description:
		//		Sets named properties on a stateful object and notifies any watchers of
		// 		the property. A programmatic setter may be defined in subclasses.
		// 		For example:
		//	|	stateful = new dojo.Stateful();
		//	|	stateful.watch(function(name, oldValue, value){
		//	|		// this will be called on the set below
		//	|	}
		//	|	stateful.set(foo, 5);
		//
		//	set() may also be called with a hash of name/value pairs, ex:
		//	|	myObj.set({
		//	|		foo: "Howdy",
		//	|		bar: 3
		//	|	})
		//	This is equivalent to calling set(foo, "Howdy") and set(bar, 3)
		if(typeof name === "object"){
			for(var x in name){
				this.set(x, name[x]);
			}
			return this;
		}
		var oldValue = this[name];
		this[name] = value;
		if(this._watchCallbacks){
			this._watchCallbacks(name, oldValue, value);
		}
		return this; //dojo.Stateful
	},
	watch: function(/*String?*/name, /*Function*/callback){
		// summary:
		//		Watches a property for changes
		//	name:
		//		Indicates the property to watch. This is optional (the callback may be the
		// 		only parameter), and if omitted, all the properties will be watched
		// returns:
		//		An object handle for the watch. The unwatch method of this object
		// 		can be used to discontinue watching this property:
		//		|	var watchHandle = obj.watch("foo", callback);
		//		|	watchHandle.unwatch(); // callback won't be called now
		//	callback:
		//		The function to execute when the property changes. This will be called after
		//		the property has been changed. The callback will be called with the |this|
		//		set to the instance, the first argument as the name of the property, the
		// 		second argument as the old value and the third argument as the new value.

		var callbacks = this._watchCallbacks;
		if(!callbacks){
			var self = this;
			callbacks = this._watchCallbacks = function(name, oldValue, value, ignoreCatchall){
				var notify = function(propertyCallbacks){
					if(propertyCallbacks){
                        propertyCallbacks = propertyCallbacks.slice();
						for(var i = 0, l = propertyCallbacks.length; i < l; i++){
							try{
								propertyCallbacks[i].call(self, name, oldValue, value);
							}catch(e){
								console.error(e);
							}
						}
					}
				};
				notify(callbacks['_' + name]);
				if(!ignoreCatchall){
					notify(callbacks["*"]); // the catch-all
				}
			}; // we use a function instead of an object so it will be ignored by JSON conversion
		}
		if(!callback && typeof name === "function"){
			callback = name;
			name = "*";
		}else{
			// prepend with dash to prevent name conflicts with function (like "name" property)
			name = '_' + name;
		}
		var propertyCallbacks = callbacks[name];
		if(typeof propertyCallbacks !== "object"){
			propertyCallbacks = callbacks[name] = [];
		}
		propertyCallbacks.push(callback);
		return {
			unwatch: function(){
				propertyCallbacks.splice(array.indexOf(propertyCallbacks, callback), 1);
			}
		}; //Object
	}

});

});

},
'dojo/touch':function(){
define("dojo/touch", ["./_base/kernel", "./on", "./has", "./mouse"], function(dojo, on, has, mouse){
// module:
//		dojo/touch

/*=====
	dojo.touch = {
		// summary:
		//		This module provides unified touch event handlers by exporting
		//		press, move, release and cancel which can also run well on desktop.
		//		Based on http://dvcs.w3.org/hg/webevents/raw-file/tip/touchevents.html
		//
		// example:
		//		1. Used with dojo.connect()
		//		|	dojo.connect(node, dojo.touch.press, function(e){});
		//		|	dojo.connect(node, dojo.touch.move, function(e){});
		//		|	dojo.connect(node, dojo.touch.release, function(e){});
		//		|	dojo.connect(node, dojo.touch.cancel, function(e){});
		//
		//		2. Used with dojo.on
		//		|	define(["dojo/on", "dojo/touch"], function(on, touch){
		//		|		on(node, touch.press, function(e){});
		//		|		on(node, touch.move, function(e){});
		//		|		on(node, touch.release, function(e){});
		//		|		on(node, touch.cancel, function(e){});
		//
		//		3. Used with dojo.touch.* directly
		//		|	dojo.touch.press(node, function(e){});
		//		|	dojo.touch.move(node, function(e){});
		//		|	dojo.touch.release(node, function(e){});
		//		|	dojo.touch.cancel(node, function(e){});
		
		press: function(node, listener){
			// summary:
			//		Register a listener to 'touchstart'|'mousedown' for the given node
			// node: Dom
			//		Target node to listen to
			// listener: Function
			//		Callback function
			// returns:
			//		A handle which will be used to remove the listener by handle.remove()
		},
		move: function(node, listener){
			// summary:
			//		Register a listener to 'touchmove'|'mousemove' for the given node
			// node: Dom
			//		Target node to listen to
			// listener: Function
			//		Callback function
			// returns:
			//		A handle which will be used to remove the listener by handle.remove()
		},
		release: function(node, listener){
			// summary:
			//		Register a listener to 'touchend'|'mouseup' for the given node
			// node: Dom
			//		Target node to listen to
			// listener: Function
			//		Callback function
			// returns:
			//		A handle which will be used to remove the listener by handle.remove()
		},
		cancel: function(node, listener){
			// summary:
			//		Register a listener to 'touchcancel'|'mouseleave' for the given node
			// node: Dom
			//		Target node to listen to
			// listener: Function
			//		Callback function
			// returns:
			//		A handle which will be used to remove the listener by handle.remove()
		}
	};
=====*/

	function _handle(/*String - press | move | release | cancel*/type){
		return function(node, listener){//called by on(), see dojo.on
			return on(node, type, listener);
		};
	}
	var touch = has("touch");
	//device neutral events - dojo.touch.press|move|release|cancel
	dojo.touch = {
		press: _handle(touch ? "touchstart": "mousedown"),
		move: _handle(touch ? "touchmove": "mousemove"),
		release: _handle(touch ? "touchend": "mouseup"),
		cancel: touch ? _handle("touchcancel") : mouse.leave
	};
	return dojo.touch;
});
},
'dojox/mobile/Overlay':function(){
define("dojox/mobile/Overlay", [
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/sniff",
	"dojo/_base/window",
	"dojo/dom-class",
	"dojo/dom-geometry",
	"dojo/dom-style",
	"dojo/window",
	"dijit/_WidgetBase",
	"dojo/_base/array",
	"dijit/registry"
], function(declare, lang, has, win, domClass, domGeometry, domStyle, windowUtils, WidgetBase, array, registry){

	/*=====
		WidgetBase = dijit._WidgetBase;
	=====*/
	return declare("dojox.mobile.Overlay", WidgetBase, {
		// summary:
		//		A non-templated widget that animates up from the bottom, overlaying the current content
		//

		baseClass: "mblOverlay mblOverlayHidden",

		show: function(/*DomNode?*/aroundNode){
			// summary:
			//		Scroll the overlay up into view
			array.forEach(registry.findWidgets(this.domNode), function(w){
				if(w && w.height == "auto" && typeof w.resize == "function"){
					w.resize();
				}
			});
			var vp, popupPos;
			var reposition = lang.hitch(this, function(){
				domStyle.set(this.domNode, { position: "", top: "auto", bottom: "0px" });
				popupPos = domGeometry.position(this.domNode);
				vp = windowUtils.getBox();
				if((popupPos.y+popupPos.h) != vp.h // TODO: should be a has() test for position:fixed not scrolling
					|| has("android") < 3){ // android 2.x supports position:fixed but child transforms don't persist
					popupPos.y = vp.t + vp.h - popupPos.h;
					domStyle.set(this.domNode, { position: "absolute", top: popupPos.y + "px", bottom: "auto" });
				}
			});
			reposition();
			if(aroundNode){
				var aroundPos = domGeometry.position(aroundNode);
				if(popupPos.y < aroundPos.y){ // if the aroundNode is under the popup, try to scroll it up
					win.global.scrollBy(0, aroundPos.y + aroundPos.h - popupPos.y);
					reposition();
				}
			}
			domClass.replace(this.domNode, ["mblCoverv", "mblIn"], ["mblOverlayHidden", "mblRevealv", "mblOut", "mblReverse"]);
			var _domNode = this.domNode;
			setTimeout(function(){
				domClass.add(_domNode, "mblTransition");
			}, 100);
			var timeoutHandler = null;
			this._moveHandle = this.connect(win.doc.documentElement, "ontouchmove", function(){
				if(timeoutHandler){
					clearTimeout(timeoutHandler);
				}
				timeoutHandler = setTimeout(function(){
					reposition();
					timeoutHandler = null;
				}, 0);
			});
		},

		hide: function(){
			// summary:
			//		Scroll the overlay down and then make it invisible
			if(this._moveHandle){
				this.disconnect(this._moveHandle);
				this._moveHandle = null;
			}
			if(has("webkit")){
				var handler = this.connect(this.domNode, "webkitTransitionEnd", function(){
					this.disconnect(handler);
					domClass.replace(this.domNode, ["mblOverlayHidden"], ["mblRevealv", "mblOut", "mblReverse", "mblTransition"]);
				});
				domClass.replace(this.domNode, ["mblRevealv", "mblOut", "mblReverse"], ["mblCoverv", "mblIn", "mblTransition"]);
				var _domNode = this.domNode;
				setTimeout(function(){
					domClass.add(_domNode, "mblTransition");
				}, 100);
			}else{
				domClass.replace(this.domNode, ["mblOverlayHidden"], ["mblCoverv", "mblIn", "mblRevealv", "mblOut", "mblReverse"]);
			}
		},

		onBlur: function(/*Event*/e){
			return false; // touching outside the overlay area does not call hide()
		}
	});
});

},
'dojox/mobile/TextBox':function(){
define("dojox/mobile/TextBox", [
	"dojo/_base/declare",
	"dojo/dom-construct",
	"dijit/_WidgetBase",
	"dijit/form/_FormValueMixin",
	"dijit/form/_TextBoxMixin"
], function(declare, domConstruct, WidgetBase, FormValueMixin, TextBoxMixin){

	/*=====
		WidgetBase = dijit._WidgetBase;
		FormValueMixin = dijit.form._FormValueMixin;
		TextBoxMixin = dijit.form._TextBoxMixin;
	=====*/
	return declare("dojox.mobile.TextBox",[WidgetBase, FormValueMixin, TextBoxMixin],{
		// summary:
		//		A non-templated base class for textbox form inputs

		baseClass: "mblTextBox",

		// Override automatic assigning type --> node, it causes exception on IE8.
		// Instead, type must be specified as this.type when the node is created, as part of the original DOM
		_setTypeAttr: null,

		// Map widget attributes to DOMNode attributes.
		_setPlaceHolderAttr: "textbox",

		buildRendering: function(){
			if(!this.srcNodeRef){
				this.srcNodeRef = domConstruct.create("input", {"type":this.type});
			}
			this.inherited(arguments);
			this.textbox = this.focusNode = this.domNode;
		},

		postCreate: function(){
			this.inherited(arguments);
			this.connect(this.textbox, "onfocus", "_onFocus");
			this.connect(this.textbox, "onblur", "_onBlur");
		}
	});
});

},
'dojo/dom-prop':function(){
define("dojo/dom-prop", ["exports", "./_base/kernel", "./_base/sniff", "./_base/lang", "./dom", "./dom-style", "./dom-construct", "./_base/connect"],
		function(exports, dojo, has, lang, dom, style, ctr, conn){
	// module:
	//		dojo/dom-prop
	// summary:
	//		This module defines the core dojo DOM properties API.
	//      Indirectly depends on dojo.empty() and dojo.toDom().

	// =============================
	// Element properties Functions
	// =============================

	/*=====
	prop.get = function(node, name){
		// summary:
		//		Gets a property on an HTML element.
		// description:
		//		Handles normalized getting of properties on DOM nodes.
		//
		// node: DOMNode|String
		//		id or reference to the element to get the property on
		// name: String
		//		the name of the property to get.
		// returns:
		//		the value of the requested property or its default value
		//
		// example:
		//	|	// get the current value of the "foo" property on a node
		//	|	dojo.getProp(dojo.byId("nodeId"), "foo");
		//	|	// or we can just pass the id:
		//	|	dojo.getProp("nodeId", "foo");
	};
	=====*/

	/*=====
	prop.set = function(node, name, value){
		// summary:
		//		Sets a property on an HTML element.
		// description:
		//		Handles normalized setting of properties on DOM nodes.
		//
		//		When passing functions as values, note that they will not be
		//		directly assigned to slots on the node, but rather the default
		//		behavior will be removed and the new behavior will be added
		//		using `dojo.connect()`, meaning that event handler properties
		//		will be normalized and that some caveats with regards to
		//		non-standard behaviors for onsubmit apply. Namely that you
		//		should cancel form submission using `dojo.stopEvent()` on the
		//		passed event object instead of returning a boolean value from
		//		the handler itself.
		// node: DOMNode|String
		//		id or reference to the element to set the property on
		// name: String|Object
		//		the name of the property to set, or a hash object to set
		//		multiple properties at once.
		// value: String?
		//		The value to set for the property
		// returns:
		//		the DOM node
		//
		// example:
		//	|	// use prop() to set the tab index
		//	|	dojo.setProp("nodeId", "tabIndex", 3);
		//	|
		//
		// example:
		//	Set multiple values at once, including event handlers:
		//	|	dojo.setProp("formId", {
		//	|		"foo": "bar",
		//	|		"tabIndex": -1,
		//	|		"method": "POST",
		//	|		"onsubmit": function(e){
		//	|			// stop submitting the form. Note that the IE behavior
		//	|			// of returning true or false will have no effect here
		//	|			// since our handler is connect()ed to the built-in
		//	|			// onsubmit behavior and so we need to use
		//	|			// dojo.stopEvent() to ensure that the submission
		//	|			// doesn't proceed.
		//	|			dojo.stopEvent(e);
		//	|
		//	|			// submit the form with Ajax
		//	|			dojo.xhrPost({ form: "formId" });
		//	|		}
		//	|	});
		//
		// example:
		//	Style is s special case: Only set with an object hash of styles
		//	|	dojo.setProp("someNode",{
		//	|		id:"bar",
		//	|		style:{
		//	|			width:"200px", height:"100px", color:"#000"
		//	|		}
		//	|	});
		//
		// example:
		//	Again, only set style as an object hash of styles:
		//	|	var obj = { color:"#fff", backgroundColor:"#000" };
		//	|	dojo.setProp("someNode", "style", obj);
		//	|
		//	|	// though shorter to use `dojo.style()` in this case:
		//	|	dojo.style("someNode", obj);
	};
	=====*/

	// helper to connect events
	var _evtHdlrMap = {}, _ctr = 0, _attrId = dojo._scopeName + "attrid";

		// the next dictionary lists elements with read-only innerHTML on IE
	var _roInnerHtml = {col: 1, colgroup: 1,
			// frameset: 1, head: 1, html: 1, style: 1,
			table: 1, tbody: 1, tfoot: 1, thead: 1, tr: 1, title: 1};
	
	exports.names = {
		// properties renamed to avoid clashes with reserved words
		"class": "className",
		"for": "htmlFor",
		// properties written as camelCase
		tabindex: "tabIndex",
		readonly: "readOnly",
		colspan: "colSpan",
		frameborder: "frameBorder",
		rowspan: "rowSpan",
		valuetype: "valueType"
	};

	exports.get = function getProp(/*DOMNode|String*/node, /*String*/name){
		node = dom.byId(node);
		var lc = name.toLowerCase(), propName = exports.names[lc] || name;
		return node[propName];	// Anything
	};

	exports.set = function setProp(/*DOMNode|String*/node, /*String|Object*/name, /*String?*/value){
		node = dom.byId(node);
		var l = arguments.length;
		if(l == 2 && typeof name != "string"){ // inline'd type check
			// the object form of setter: the 2nd argument is a dictionary
			for(var x in name){
				exports.set(node, x, name[x]);
			}
			return node; // DomNode
		}
		var lc = name.toLowerCase(), propName = exports.names[lc] || name;
		if(propName == "style" && typeof value != "string"){ // inline'd type check
			// special case: setting a style
			style.style(node, value);
			return node; // DomNode
		}
		if(propName == "innerHTML"){
			// special case: assigning HTML
						if(0 && node.tagName.toLowerCase() in _roInnerHtml){
				ctr.empty(node);
				node.appendChild(ctr.toDom(value, node.ownerDocument));
			}else{
							node[propName] = value;
						}
						return node; // DomNode
		}
		if(lang.isFunction(value)){
			// special case: assigning an event handler
			// clobber if we can
			var attrId = node[_attrId];
			if(!attrId){
				attrId = _ctr++;
				node[_attrId] = attrId;
			}
			if(!_evtHdlrMap[attrId]){
				_evtHdlrMap[attrId] = {};
			}
			var h = _evtHdlrMap[attrId][propName];
			if(h){
				//h.remove();
				conn.disconnect(h);
			}else{
				try{
					delete node[propName];
				}catch(e){}
			}
			// ensure that event objects are normalized, etc.
			if(value){
				//_evtHdlrMap[attrId][propName] = on(node, propName, value);
				_evtHdlrMap[attrId][propName] = conn.connect(node, propName, value);
			}else{
				node[propName] = null;
			}
			return node; // DomNode
		}
		node[propName] = value;
		return node;	// DomNode
	};
});

},
'dojox/gesture/Base':function(){
define("dojox/gesture/Base", [
	"dojo/_base/kernel",
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/dom",
	"dojo/on",
	"dojo/touch",
	"dojo/has",
	"../main"
], function(kernel, declare, array, lang, dom, on, touch, has, dojox){
	// module:
	//		dojox/gesture/Base
	// summary:
	//		This module provides an abstract parental class for various gesture implementations.
	
/*=====
	dojox.gesture.Base = {
		// summary:
		//		An abstract parental class for various gesture implementations.
		//
		//		It's mainly responsible for:
		//
		//		1. Binding on() listening handlers for supported gesture events.
		//
		//		2. Monitoring underneath events and process different phases - 'press'|'move'|'release'|'cancel'.
		//
		//		3. Firing and bubbling gesture events with on() API.
		//
		//		A gesture implementation only needs to extend this class and overwrite appropriate phase handlers:
		//
		//		- press()|move()|release()|cancel for recognizing and firing gestures
		//
		// example:
		//		1. A typical gesture implementation.
		//
		//		Suppose we have dojox/gesture/a which provides 3 gesture events:"a", "a.x", "a.y" to be used as:
		//		|	dojo.connect(node, dojox.gesture.a, function(e){});
		//		|	dojo.connect(node, dojox.gesture.a.x, function(e){});
		//		|	dojo.connect(node, dojox.gesture.a.y, function(e){});
		//
		//		The definition of the gesture "a" may look like:
		//		|	define([..., "./Base"], function(..., Base){
		//		|		var clz = declare(Base, {
		//		|			defaultEvent: "a",
		//		|
		//		|			subEvents: ["x", "y"],
		//		|			
		//		|			press: function(data, e){
		//		|				this.fire(node, {type: "a.x", ...});
		//		|			},
		//		|			move: function(data, e){
		//		|				this.fire(node, {type: "a.y", ...});
		//		|			},
		//		|			release: function(data, e){
		//		|				this.fire(node, {type: "a", ...});
		//		|			},
		//		|			cancel: function(data, e){
		//		|				// clean up
		//		|			}
		//		|		});
		//		|
		//		|		// in order to have a default instance for handy use
		//		|		dojox.gesture.a = new clz();
		//		|
		//		|		// so that we can create new instances like
		//		|		// var mine = new dojox.gesture.a.A({...})
		//		|		dojox.gesture.a.A = clz;
		//		|
		//		|		return dojox.gesture.a;
		//		|	});
		//
		//		2. A gesture can be used in the following ways(taking dojox.gestre.tap for example):
		//
		//		A. Used with dojo.connect()
		//		|	dojo.connect(node, dojox.gesture.tap, function(e){});
		//		|	dojo.connect(node, dojox.gesture.tap.hold, function(e){});
		//		|	dojo.connect(node, dojox.gesture.tap.doubletap, function(e){});		
		//
		//		B. Used with dojo.on
		//		|	define(["dojo/on", "dojox/gesture/tap"], function(on, tap){
		//		|		on(node, tap, function(e){});
		//		|		on(node, tap.hold, function(e){});
		//		|		on(node, tap.doubletap, function(e){});
		//
		//		C. Used with dojox.gesture.tap directly
		//		|	dojox.gesture.tap(node, function(e){});
		//		|	dojox.gesture.tap.hold(node, function(e){});
		//		|	dojox.gesture.tap.doubletap(node, function(e){});
		//
		//		Though there is always a default gesture instance after being required, e.g 
		//		|	require(["dojox/gesture/tap"], function(){...});
		//
		//		It's possible to create a new one with different parameter setting:
		//		|	var myTap = new dojox.gesture.tap.Tap({holdThreshold: 300});
		//		|	dojo.connect(node, myTap, function(e){});
		//		|	dojo.connect(node, myTap.hold, function(e){});
		//		|	dojo.connect(node, myTap.doubletap, function(e){});
		//		
		//		Please refer to dojox/gesture/ for more gesture usages
	};
=====*/
	kernel.experimental("dojox.gesture.Base");
	
	lang.getObject("gesture", true, dojox);

	// Declare an internal anonymous class which will only be exported by module return value
	return declare(/*===== "dojox.gesture.Base", =====*/null, {

		// defaultEvent: [readonly] String
		//		Default event e.g. 'tap' is a default event of dojox.gesture.tap
		defaultEvent: " ",

		// subEvents: [readonly] Array
		//		A list of sub events e.g ['hold', 'doubletap'],
		//		used by being combined with defaultEvent like 'tap.hold', 'tap.doubletap' etc.
		subEvents: [],

		// touchOnly: boolean
		//		Whether the gesture is touch-device only
		touchOnly : false,

		//	_elements: Array
		//		List of elements that wraps target node and gesture data
		_elements: null,

		/*=====
		// _lock: Dom
		//		The dom node whose descendants are all locked for processing
		_lock: null,
		
		// _events: [readonly] Array
		//		The complete list of supported gesture events with full name space
		//		e.g ['tap', 'tap.hold', 'tap.doubletap']
		_events: null,
		=====*/

		constructor: function(args){
			lang.mixin(this, args);
			this.init();
		},
		init: function(){
			// summary:
			//		Initialization works
			this._elements = [];

			if(!has("touch") && this.touchOnly){
				console.warn("Gestures:[", this.defaultEvent, "] is only supported on touch devices!");
				return;
			}

			// bind on() handlers for various events
			var evt = this.defaultEvent;
			this.call = this._handle(evt);

			this._events = [evt];
			array.forEach(this.subEvents, function(subEvt){
				this[subEvt] = this._handle(evt + '.' + subEvt);
				this._events.push(evt + '.' + subEvt);
			}, this);
		},
		_handle: function(/*String*/eventType){
			// summary:
			//		Bind listen handler for the given gesture event(e.g. 'tap', 'tap.hold' etc.)
			//		the returned handle will be used internally by dojo/on
			var self = this;
			//called by dojo/on
			return function(node, listener){
				// normalize, arguments might be (null, node, listener)
				var a = arguments;
				if(a.length > 2){
					node = a[1];
					listener = a[2];
				}
				var isNode = node && (node.nodeType || node.attachEvent || node.addEventListener);
				if(!isNode){
					return on(node, eventType, listener);
				}else{
					var onHandle = self._add(node, eventType, listener);
					// FIXME - users are supposed to explicitly call either
					// disconnect(signal) or signal.remove() to release resources
					var signal = {
						remove: function(){
							onHandle.remove();
							self._remove(node, eventType);
						}
					};
					return signal;
				}
			}; // dojo/on handle
		},
		_add: function(/*Dom*/node, /*String*/type, /*function*/listener){
			// summary:
			//		Bind dojo/on handlers for both gesture event(e.g 'tab.hold')
			//		and underneath 'press'|'move'|'release' events
			var element = this._getGestureElement(node);
			if(!element){
				// the first time listening to the node
				element = {
					target: node,
					data: {},
					handles: {}
				};

				var _press = lang.hitch(this, "_process", element, "press");
				var _move = lang.hitch(this, "_process", element, "move");
				var _release = lang.hitch(this, "_process", element, "release");
				var _cancel = lang.hitch(this, "_process", element, "cancel");

				var handles = element.handles;
				if(this.touchOnly){
					handles.press = on(node, 'touchstart', _press);
					handles.move = on(node, 'touchmove', _move);
					handles.release = on(node, 'touchend', _release);
					handles.cancel = on(node, 'touchcancel', _cancel);
				}else{
					handles.press = touch.press(node, _press);
					handles.move = touch.move(node, _move);
					handles.release = touch.release(node, _release);
					handles.cancel = touch.cancel(node, _cancel);
				}
				this._elements.push(element);
			}
			// track num of listeners for the gesture event - type
			// so that we can release element if no more gestures being monitored
			element.handles[type] = !element.handles[type] ? 1 : ++element.handles[type];

			return on(node, type, listener); //handle
		},
		_getGestureElement: function(/*Dom*/node){
			// summary:
			//		Obtain a gesture element for the give node
			var i = 0, element;
			for(; i < this._elements.length; i++){
				element = this._elements[i];
				if(element.target === node){
					return element;
				}
			}
		},
		_process: function(element, phase, e){
			// summary:
			//		Process and dispatch to appropriate phase handlers.
			//		Also provides the machinery for managing gesture bubbling.
			// description:
			//		1. e._locking is used to make sure only the most inner node
			//		will be processed for the same gesture, suppose we have:
			//	|	on(inner, dojox.gesture.tap, func1);
			//	|	on(outer, dojox.gesture.tap, func2);
			//		only the inner node will be processed by tap gesture, once matched,
			//		the 'tap' event will be bubbled up from inner to outer, dojo.StopEvent(e)
			//		can be used at any level to stop the 'tap' event.
			//
			//		2. Once a node starts being processed, all it's descendant nodes will be locked.
			//		The same gesture won't be processed on its descendant nodes until the lock is released.
			// element: Object
			//		Gesture element
			// phase: String
			//		Phase of a gesture to be processed, might be 'press'|'move'|'release'|'cancel'
			// e: Event
			//		Native event
			e._locking = e._locking || {};
			if(e._locking[this.defaultEvent] || this.isLocked(e.currentTarget)){
				return;
			}
			// invoking gesture.press()|move()|release()|cancel()
			e.preventDefault();
			e._locking[this.defaultEvent] = true;
			this[phase](element.data, e);
		},
		press: function(data, e){
			// summary:
			//		Process the 'press' phase of a gesture
		},
		move: function(data, e){
			// summary:
			//		Process the 'move' phase of a gesture
		},
		release: function(data, e){
			// summary:
			//		Process the 'release' phase of a gesture
		},
		cancel: function(data, e){
			// summary:
			//		Process the 'cancel' phase of a gesture
		},
		fire: function(node, event){
			// summary:
			//		Fire a gesture event and invoke registered listeners
			//		a simulated GestureEvent will also be sent along
			// node: DomNode
			//		Target node to fire the gesture
			// event: Object
			//		An object containing specific gesture info e.g {type: 'tap.hold'|'swipe.left'), ...}
			//		all these properties will be put into a simulated GestureEvent when fired.
			//		Note - Default properties in a native Event won't be overwritten, see on.emit() for more details.
			if(!node || !event){
				return;
			}
			event.bubbles = true;
			event.cancelable = true;
			on.emit(node, event.type, event);
		},
		_remove: function(/*Dom*/node, /*String*/type){
			// summary:
			//		Check and remove underneath handlers if node
			//		is not being listened for 'this' gesture anymore,
			//		this happens when user removed all previous on() handlers.
			var element = this._getGestureElement(node);
			if(!element || !element.handles){ return; }
			
			element.handles[type]--;

			var handles = element.handles;
			if(!array.some(this._events, function(evt){
				return handles[evt] > 0;
			})){
				// clean up if node is not being listened anymore
				this._cleanHandles(handles);
				var i = array.indexOf(this._elements, element);
				if(i >= 0){
					this._elements.splice(i, 1);
				}
			}
		},
		_cleanHandles: function(/*Object*/handles){
			// summary:
			//		Clean up on handles
			for(var x in handles){
				//remove handles for "press"|"move"|"release"|"cancel"
				if(handles[x].remove){
					handles[x].remove();
				}
				delete handles[x];
			}
		},
		lock: function(/*Dom*/node){
			// summary:
			//		Lock all descendants of the node.
			// tags:
			//		protected
			this._lock = node;
		},
		unLock: function(){
			// summary:
			//		Release the lock
			// tags:
			//		protected
			this._lock = null;
		},
		isLocked: function(node){
			// summary:
			//		Check if the node is locked, isLocked(node) means
			//		whether it's a descendant of the currently locked node.
			// tags:
			//		protected
			if(!this._lock || !node){
				return false;
			}
			return this._lock !== node && dom.isDescendant(node, this._lock);
		},
		destroy: function(){
			// summary:
			//		Release all handlers and resources
			array.forEach(this._elements, function(element){
				this._cleanHandles(element.handles);
			}, this);
			this._elements = null;
		}
	});
});
},
'dijit/_base/manager':function(){
define("dijit/_base/manager", [
	"dojo/_base/array",
	"dojo/_base/config", // defaultDuration
	"../registry",
	".."	// for setting exports to dijit namespace
], function(array, config, registry, dijit){

	// module:
	//		dijit/_base/manager
	// summary:
	//		Shim to methods on registry, plus a few other declarations.
	//		New code should access dijit/registry directly when possible.

	/*=====
	dijit.byId = function(id){
		// summary:
		//		Returns a widget by it's id, or if passed a widget, no-op (like dom.byId())
		// id: String|dijit._Widget
		return registry.byId(id); // dijit._Widget
	};

	dijit.getUniqueId = function(widgetType){
		// summary:
		//		Generates a unique id for a given widgetType
		// widgetType: String
		return registry.getUniqueId(widgetType); // String
	};

	dijit.findWidgets = function(root){
		// summary:
		//		Search subtree under root returning widgets found.
		//		Doesn't search for nested widgets (ie, widgets inside other widgets).
		// root: DOMNode
		return registry.findWidgets(root);
	};

	dijit._destroyAll = function(){
		// summary:
		//		Code to destroy all widgets and do other cleanup on page unload

		return registry._destroyAll();
	};

	dijit.byNode = function(node){
		// summary:
		//		Returns the widget corresponding to the given DOMNode
		// node: DOMNode
		return registry.byNode(node); // dijit._Widget
	};

	dijit.getEnclosingWidget = function(node){
		// summary:
		//		Returns the widget whose DOM tree contains the specified DOMNode, or null if
		//		the node is not contained within the DOM tree of any widget
		// node: DOMNode
		return registry.getEnclosingWidget(node);
	};
	=====*/
	array.forEach(["byId", "getUniqueId", "findWidgets", "_destroyAll", "byNode", "getEnclosingWidget"], function(name){
		dijit[name] = registry[name];
	});

	/*=====
	dojo.mixin(dijit, {
		// defaultDuration: Integer
		//		The default fx.animation speed (in ms) to use for all Dijit
		//		transitional fx.animations, unless otherwise specified
		//		on a per-instance basis. Defaults to 200, overrided by
		//		`djConfig.defaultDuration`
		defaultDuration: 200
	});
	=====*/
	dijit.defaultDuration = config["defaultDuration"] || 200;

	return dijit;
});

},
'app/views/ActivityList':function(){
define("app/views/ActivityList", ['dojo/_base/declare',
 		'dijit/registry', 
 		'dojo/_base/lang',
  		'dojo/on', 
  		'dojo/_base/Deferred',
  		'dojox/mobile/ProgressIndicator',
  		'dojo/_base/xhr',
  		'dojo/_base/json',
		'dojox/mobile/ListItem',
		'app/views/TaskList', 
		'app/views/Map',
		'dojo/dom',
 		'dojo/dom-style'], function(declare, registry, lang, on, Deferred, ProgressIndicator,  xhr, dojo, ListItem, TaskList, Map, dom, domStyle) {

	// module:
	//		views/ActivityList
	// summary:
	//		Object encapsulating view and event handlers for displaying list of activities to complete
	return declare('app.views.ActivityList', null, {

		view : null,
		activityRectList : null,
		activityListStore: null,


		constructor : function() {
			var prog = this.startProgressSpinner();
			this.view = registry.byId('activityListView');
			var cachedActivitiesData = localStorage.getItem("game_activities");
			if(cachedActivitiesData){
				this.activityListStore = dojo.fromJson(cachedActivitiesData);
				Deferred.when(this._populateData(this.activityListStore), function(){
					prog.stop();
				});
			}
			this._setupEventHandlers();
			
			//Unsafe, but I'm tired: if itemsViewed is 0 or unset, reset all the below fields... it means the user hasn't done anything.
			if(!localStorage.getItem("itemsViewed")){
				localStorage.setItem("itemsFinished", "0");
				localStorage.setItem("itemsViewed", "0");
				localStorage.setItem("pointsAccumulated", "0");
				
			}
			
			on(dom.byId("ScoreButtonInActivityListView"), "click", function(){
				dom.byId("scoreViewAmountViewed").innerHTML = localStorage.getItem("itemsViewed");
				dom.byId("scoreViewAmountDone").innerHTML = localStorage.getItem("itemsFinished");
			});
			on(dom.byId("ScoreButtonInActivityListView"), "click", lang.hitch(this,function(){
				dom.byId("scoreViewScoreSpan").innerHTML = localStorage.getItem("pointsAccumulated");
			}));
			
		},
		
		startProgressSpinner: function(){
			var prog = ProgressIndicator.getInstance();
			dom.byId('progressSpinnerDiv').appendChild(prog.domNode);
			prog.start();
			return prog;
		},
		
		// summary:
		//		retrieve list of activities based on criteria user entered in game setup
		//
		// gameSetupForm: query string generated from setup form
		getActivitesForNewGame: function(gameSetupForm) {
			var getActivitiesPromise = new Deferred();
			var geoPromise = new Deferred();
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition( function(position){
					geoPromise.resolve(position.coords);
				}); 
			} else {
				console.log("navigator not supported");
				return false;
			}
			Deferred.when(geoPromise, lang.hitch(this, function(currentLocation){
				xhr.get({
					url : "/TreasureHuntWeb/rest/game",
					content: {categories: gameSetupForm, lon_lat : currentLocation.longitude+' '+currentLocation.latitude},
					handleAs : "json",
					load : lang.hitch(this, function(data) {
						this._populateData(data);
						localStorage.setItem("game_activities", dojo.toJson(data));
						getActivitiesPromise.resolve();
					})
				});
			}));
			return getActivitiesPromise;
		},

		
		// summary:
		//		Populate the list of activities in the view
		//
		_populateData : function(activityListJson) {
			this.activityRectList = registry.byId('activityList');
			domStyle.set(this.activityRectList.domNode, 'visibility', 'hidden');
			this.activityStore = activityListJson;
			for(var idx = 0; idx < activityListJson.features.length; idx++) {
				var item = activityListJson.features[idx];

				var li = new ListItem({
					id : item.id,
					label : item.properties.name,
					icon : 'img/h/'+item.properties.category+'.png',
					clickable : true,
					onClick : lang.hitch(this, function(itemId, event) {
						var i;//for loop iterator
						this.view.performTransition("activityDetailView", 1, "slide");
						for(i=0; i<this.activityStore.features.length; i++){
							if(this.activityStore.features[i].id === itemId){
								this.getActivityItemData(this.activityStore.features[i]);
								//found it, exit.
								break;
							}
						}
					},
					item.id)
				});
				this.activityRectList.addChild(li);
			}
			domStyle.set(this.activityRectList.domNode, 'visibility', 'visible');
		},
		
				// summary:
		//		Reverses PopulateData above by removing the list items
		//
		removeData : function() {
			this.activityRectList.destroyDescendants();
			this.activityStore = null;
			localStorage.removeItem("itemsFinished");
			localStorage.removeItem("itemsViewed");
			localStorage.removeItem("pointsAccumulated");
			//destroy task list views
			for (var i=0; i < viewCache.activityDetailViews.length; i++) {
			  viewCache.activityDetailViews[i].destroy();
			};
		},
		
		// summary:
		//		Get data for activity from server (TODO: maybe cache tasks)
		//
		//Description:
		//		When promise is resolved call the taskList to render the page
		//
		getActivityItemData : function(activity) {
			//it's in memory, no need to do anything
			if(viewCache.activityDetailViews && viewCache.activityDetailViews[activity.id]){
				viewCache.activityDetailViews[activity.id].show();
			}
			else{
				if(!viewCache.activityDetailViews){
					viewCache.activityDetailViews = {};
				}
				var activityInLocalStorageJson = localStorage.getItem("activityDetails_"+activity.id);
				if(activityInLocalStorageJson){
					var activityInLocalStorage = dojo.fromJson(activityInLocalStorageJson);
					viewCache.activityDetailViews[activity.id] = new TaskList(registry.byId("activityDetailView"), 
							{
								id: activity.id,
								title : activity.properties.name,
								imgSource : activity.properties.imgSource,
								tasks : activityInLocalStorage.tasks
							}
						);
						viewCache.activityDetailViews[activity.id].show();
						return null;
				}
				
				return xhr.get({
					url : "/TreasureHuntWeb/rest/tasks",
					content: {facilityid: activity.id},
					handleAs : "json",
					load : lang.hitch(this, function(activityData) {
						viewCache.activityDetailViews[activity.id] = new TaskList(registry.byId("activityDetailView"), 
							{
								id : activity.id,
								title : activity.properties.name,
								imgSource : activity.properties.imgSource,
								tasks : activityData
							}
						);
						viewCache.activityDetailViews[activity.id].show();
					}),
					error : function(error) {
						console.error("Error retrieving activity data ", error);
					}
				});
			}
		},
		
		// summary:
		//		Show the view
		//
		//Description:
		//		Main calls this function to set the initial view
		//
		show : function() {
			this.view.show();
			registry.byId('dojox_mobile_Heading_3').resize();
			
		},
		
		_setupEventHandlers : function(view) {
			var listBtn = registry.byId('activListBtn_actList');
			var listBtn_map = registry.byId('listBtn_map');
			var mapBtn = registry.byId('activMapBtn_actList');
			if(!viewCache.mapView) {
				viewCache.mapView = new Map();
			}
			listBtn.on('Click', lang.hitch(this, this.show));
			listBtn_map.on('Click', lang.hitch(this, this.show));
			mapBtn.on('Click', lang.hitch(this, this._showMapView));
			
			
			var header = registry.byId('activityListHeading');
			on(header.backBtnNode, "click", function(){
				
				viewCache.setup.destroy_game();
				
			});
		},
		
		// summary:
		//		Show the map view on the Activity List page
		//
		//
		_showMapView : function() {
			viewCache.mapView.show(this.activityStore, 'activityList', this);
		}
	});
});

},
'dojox/mobile/View':function(){
define("dojox/mobile/View", [
	"dojo/_base/kernel", // to test dojo.hash
	"dojo/_base/array",
	"dojo/_base/config",
	"dojo/_base/connect",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/sniff",
	"dojo/_base/window",
	"dojo/_base/Deferred",
	"dojo/dom",
	"dojo/dom-class",
	"dojo/dom-geometry",
	"dojo/dom-style",
//	"dojo/hash", // optionally prereq'ed
	"dijit/registry",	// registry.byNode
	"dijit/_Contained",
	"dijit/_Container",
	"dijit/_WidgetBase",
	"./ViewController", // to load ViewController for you (no direct references)
	"./transition"
], function(dojo, array, config, connect, declare, lang, has, win, Deferred, dom, domClass, domGeometry, domStyle, registry, Contained, Container, WidgetBase, ViewController, transitDeferred){

/*=====
	var Contained = dijit._Contained;
	var Container = dijit._Container;
	var WidgetBase = dijit._WidgetBase;
	var ViewController = dojox.mobile.ViewController;
=====*/

	// module:
	//		dojox/mobile/View
	// summary:
	//		A widget that represents a view that occupies the full screen

	var dm = lang.getObject("dojox.mobile", true);

	return declare("dojox.mobile.View", [WidgetBase, Container, Contained], {
		// summary:
		//		A widget that represents a view that occupies the full screen
		// description:
		//		View acts as a container for any HTML and/or widgets. An entire
		//		HTML page can have multiple View widgets and the user can
		//		navigate through the views back and forth without page
		//		transitions.
	
		// selected: Boolean
		//		If true, the view is displayed at startup time.
		selected: false,

		// keepScrollPos: Boolean
		//		If true, the scroll position is kept between views.
		keepScrollPos: true,
	
		constructor: function(params, node){
			if(node){
				dom.byId(node).style.visibility = "hidden";
			}
			this._aw = has("android") >= 2.2 && has("android") < 3; // flag for android animation workaround
		},
	
		buildRendering: function(){
			this.domNode = this.containerNode = this.srcNodeRef || win.doc.createElement("DIV");
			this.domNode.className = "mblView";
			this.connect(this.domNode, "webkitAnimationEnd", "onAnimationEnd");
			this.connect(this.domNode, "webkitAnimationStart", "onAnimationStart");
			if(!config['mblCSS3Transition']){
			    this.connect(this.domNode, "webkitTransitionEnd", "onAnimationEnd");
			}
			var id = location.href.match(/#(\w+)([^\w=]|$)/) ? RegExp.$1 : null;
	
			this._visible = this.selected && !id || this.id == id;
	
			if(this.selected){
				dm._defaultView = this;
			}
		},

		startup: function(){
			if(this._started){ return; }
			var siblings = [];
			var children = this.domNode.parentNode.childNodes;
			var visible = false;
			// check if a visible view exists
			for(var i = 0; i < children.length; i++){
				var c = children[i];
				if(c.nodeType === 1 && domClass.contains(c, "mblView")){
					siblings.push(c);
					visible = visible || registry.byNode(c)._visible;
				}
			}
			var _visible = this._visible;
			// if no visible view exists, make the first view visible
			if(siblings.length === 1 || (!visible && siblings[0] === this.domNode)){
				_visible = true;
			}
			var _this = this;
			setTimeout(function(){ // necessary to render the view correctly
				if(!_visible){
					_this.domNode.style.display = "none";
				}else{
					dm.currentView = _this; //TODO:1.8 reconsider this. currentView may not have a currently showing view when views are nested.
					_this.onStartView();
					connect.publish("/dojox/mobile/startView", [_this]);
				}
				if(_this.domNode.style.visibility != "visible"){ // this check is to avoid screen flickers
					_this.domNode.style.visibility = "visible";
				}
				var parent = _this.getParent && _this.getParent();
				if(!parent || !parent.resize){ // top level widget
					_this.resize();
				}
			}, 0 ? 100 : 0); // give IE a little time to complete drawing
			this.inherited(arguments);
		},
	
		resize: function(){
			// summary:
			//		Calls resize() of each child widget.
			array.forEach(this.getChildren(), function(child){
				if(child.resize){ child.resize(); }
			});
		},

		onStartView: function(){
			// summary:
			//		Stub function to connect to from your application.
			// description:
			//		Called only when this view is shown at startup time.
		},
	
		onBeforeTransitionIn: function(moveTo, dir, transition, context, method){
			// summary:
			//		Stub function to connect to from your application.
			// description:
			//		Called before the arriving transition occurs.
		},
	
		onAfterTransitionIn: function(moveTo, dir, transition, context, method){
			// summary:
			//		Stub function to connect to from your application.
			// description:
			//		Called after the arriving transition occurs.
		},
	
		onBeforeTransitionOut: function(moveTo, dir, transition, context, method){
			// summary:
			//		Stub function to connect to from your application.
			// description:
			//		Called before the leaving transition occurs.
		},
	
		onAfterTransitionOut: function(moveTo, dir, transition, context, method){
			// summary:
			//		Stub function to connect to from your application.
			// description:
			//		Called after the leaving transition occurs.
		},
	
		_saveState: function(moveTo, dir, transition, context, method){
			this._context = context;
			this._method = method;
			if(transition == "none"){
				transition = null;
			}
			this._moveTo = moveTo;
			this._dir = dir;
			this._transition = transition;
			this._arguments = lang._toArray(arguments);
			this._args = [];
			if(context || method){
				for(var i = 5; i < arguments.length; i++){
					this._args.push(arguments[i]);
				}
			}
		},
		
		_fixViewState: function(/*DomNode*/toNode){
			// summary:
			//		Sanity check for view transition states.
			// description:
			//		Sometimes uninitialization of Views fails after making view transition,
			//		and that results in failure of subsequent view transitions.
			//		This function does the uninitialization for all the sibling views.
			var nodes = this.domNode.parentNode.childNodes;
			for(var i = 0; i < nodes.length; i++){
				var n = nodes[i];
				if(n.nodeType === 1 && domClass.contains(n, "mblView")){
					n.className = "mblView"; //TODO: Should remove classes one by one. This would clear user defined classes or even mblScrollableView.
				}
			}
			toNode.className = "mblView"; // just in case toNode is a sibling of an ancestor.
		},
	
		convertToId: function(moveTo){
			if(typeof(moveTo) == "string"){
				// removes a leading hash mark (#) and params if exists
				// ex. "#bar&myParam=0003" -> "bar"
				moveTo.match(/^#?([^&?]+)/);
				return RegExp.$1;
			}
			return moveTo;
		},
	
		performTransition: function(/*String*/moveTo, /*Number*/dir, /*String*/transition,
									/*Object|null*/context, /*String|Function*/method /*optional args*/){
			// summary:
			//		Function to perform the various types of view transitions, such as fade, slide, and flip.
			// moveTo: String
			//		The id of the transition destination view which resides in
			//		the current page.
			//		If the value has a hash sign ('#') before the id
			//		(e.g. #view1) and the dojo.hash module is loaded by the user
			//		application, the view transition updates the hash in the
			//		browser URL so that the user can bookmark the destination
			//		view. In this case, the user can also use the browser's
			//		back/forward button to navigate through the views in the
			//		browser history.
			//		If null, transitions to a blank view.
			//		If '#', returns immediately without transition.
			// dir: Number
			//		The transition direction. If 1, transition forward. If -1, transition backward.
			//		For example, the slide transition slides the view from right to left when dir == 1,
			//		and from left to right when dir == -1.
			// transition: String
			//		A type of animated transition effect. You can choose from
			//		the standard transition types, "slide", "fade", "flip", or
			//		from the extended transition types, "cover", "coverv",
			//		"dissolve", "reveal", "revealv", "scaleIn",
			//		"scaleOut", "slidev", "swirl", "zoomIn", "zoomOut". If
			//		"none" is specified, transition occurs immediately without
			//		animation.
			// context: Object
			//		The object that the callback function will receive as "this".
			// method: String|Function
			//		A callback function that is called when the transition has been finished.
			//		A function reference, or name of a function in context.
			// tags:
			//		public
			//
			// example:
			//		Transition backward to a view whose id is "foo" with the slide animation.
			//	|	performTransition("foo", -1, "slide");
			//
			// example:
			//		Transition forward to a blank view, and then open another page.
			//	|	performTransition(null, 1, "slide", null, function(){location.href = href;});
			if(moveTo === "#"){ return; }
			if(dojo.hash){
				if(typeof(moveTo) == "string" && moveTo.charAt(0) == '#' && !dm._params){
					dm._params = [];
					for(var i = 0; i < arguments.length; i++){
						dm._params.push(arguments[i]);
					}
					dojo.hash(moveTo);
					return;
				}
			}
			this._saveState.apply(this, arguments);
			var toNode;
			if(moveTo){
				toNode = this.convertToId(moveTo);
			}else{
				if(!this._dummyNode){
					this._dummyNode = win.doc.createElement("DIV");
					win.body().appendChild(this._dummyNode);
				}
				toNode = this._dummyNode;
			}
			var fromNode = this.domNode;
			var fromTop = fromNode.offsetTop;
			toNode = this.toNode = dom.byId(toNode);
			if(!toNode){ console.log("dojox.mobile.View#performTransition: destination view not found: "+moveTo); return; }
			toNode.style.visibility = this._aw ? "visible" : "hidden";
			toNode.style.display = "";
			this._fixViewState(toNode);
			var toWidget = registry.byNode(toNode);
			if(toWidget){
				// Now that the target view became visible, it's time to run resize()
				if(config["mblAlwaysResizeOnTransition"] || !toWidget._resized){
					dm.resizeAll(null, toWidget);
					toWidget._resized = true;
				}
	
				if(transition && transition != "none"){
					// Temporarily add padding to align with the fromNode while transition
					toWidget.containerNode.style.paddingTop = fromTop + "px";
				}

				toWidget.movedFrom = fromNode.id;
			}
	
			this.onBeforeTransitionOut.apply(this, arguments);
			connect.publish("/dojox/mobile/beforeTransitionOut", [this].concat(lang._toArray(arguments)));
			if(toWidget){
				// perform view transition keeping the scroll position
				if(this.keepScrollPos && !this.getParent()){
					var scrollTop = win.body().scrollTop || win.doc.documentElement.scrollTop || win.global.pageYOffset || 0;
					fromNode._scrollTop = scrollTop;
					var toTop = (dir == 1) ? 0 : (toNode._scrollTop || 0);
					toNode.style.top = "0px";
					if(scrollTop > 1 || toTop !== 0){
						fromNode.style.top = toTop - scrollTop + "px";
						if(config["mblHideAddressBar"] !== false){
							setTimeout(function(){ // iPhone needs setTimeout
								win.global.scrollTo(0, (toTop || 1));
							}, 0);
						}
					}
				}else{
					toNode.style.top = "0px";
				}
				toWidget.onBeforeTransitionIn.apply(toWidget, arguments);
				connect.publish("/dojox/mobile/beforeTransitionIn", [toWidget].concat(lang._toArray(arguments)));
			}
			if(!this._aw){
				toNode.style.display = "none";
				toNode.style.visibility = "visible";
			}
			
			if(dm._iw && dm.scrollable){ // Workaround for iPhone flicker issue (only when scrollable.js is loaded)
				var ss = dm.getScreenSize();
				// Show cover behind the view.
				// cover's z-index is set to -10000, lower than z-index value specified in transition css.
				win.body().appendChild(dm._iwBgCover);
				domStyle.set(dm._iwBgCover, {
					position: "absolute",
					top: "0px",
					left: "0px",
					height: (ss.h + 1) + "px", // "+1" means the height of scrollTo(0,1)
					width: ss.w + "px",
					backgroundColor: domStyle.get(win.body(), "background-color"),
					zIndex: -10000,
					display: ""
				});
				// Show toNode behind the cover.
				domStyle.set(toNode, {
					position: "absolute",
					zIndex: -10001,
					visibility: "visible",
					display: ""
				});
				// setTimeout seems to be necessary to avoid flicker.
				// Also the duration of setTimeout should be long enough to avoid flicker.
				// 0 is not effective. 50 sometimes causes flicker.
				setTimeout(lang.hitch(this, function(){
					this._doTransition(fromNode, toNode, transition, dir);
				}), 80);
			}else{
				this._doTransition(fromNode, toNode, transition, dir);
			}
		},
		_toCls: function(s){
			// convert from transition name to corresponding class name
			// ex. "slide" -> "mblSlide"
			return "mbl"+s.charAt(0).toUpperCase() + s.substring(1);
		},
	
		_doTransition: function(fromNode, toNode, transition, dir){
			var rev = (dir == -1) ? " mblReverse" : "";
			if(dm._iw && dm.scrollable){ // Workaround for iPhone flicker issue (only when scrollable.js is loaded)
				// Show toNode after flicker ends
				domStyle.set(toNode, {
					position: "",
					zIndex: ""
				});
				// Remove cover
				win.body().removeChild(dm._iwBgCover);
			}else if(!this._aw){
				toNode.style.display = "";
			}
			if(!transition || transition == "none"){
				this.domNode.style.display = "none";
				this.invokeCallback();
			}else if(config['mblCSS3Transition']){
				//get dojox/css3/transit first
				Deferred.when(transitDeferred, lang.hitch(this, function(transit){
					//follow the style of .mblView.mblIn in View.css
					//need to set the toNode to absolute position
					var toPosition = domStyle.get(toNode, "position");
					domStyle.set(toNode, "position", "absolute");
					Deferred.when(transit(fromNode, toNode, {transition: transition, reverse: (dir===-1)?true:false}),lang.hitch(this,function(){
						domStyle.set(toNode, "position", toPosition);
						this.invokeCallback();
					}));
				}));
			}else{
				var s = this._toCls(transition);
				domClass.add(fromNode, s + " mblOut" + rev);
				domClass.add(toNode, s + " mblIn" + rev);
				setTimeout(function(){
					domClass.add(fromNode, "mblTransition");
					domClass.add(toNode, "mblTransition");
				}, 100);
				// set transform origin
				var fromOrigin = "50% 50%";
				var toOrigin = "50% 50%";
				var scrollTop, posX, posY;
				if(transition.indexOf("swirl") != -1 || transition.indexOf("zoom") != -1){
					if(this.keepScrollPos && !this.getParent()){
						scrollTop = win.body().scrollTop || win.doc.documentElement.scrollTop || win.global.pageYOffset || 0;
					}else{
						scrollTop = -domGeometry.position(fromNode, true).y;
					}
					posY = win.global.innerHeight / 2 + scrollTop;
					fromOrigin = "50% " + posY + "px";
					toOrigin = "50% " + posY + "px";
				}else if(transition.indexOf("scale") != -1){
					var viewPos = domGeometry.position(fromNode, true);
					posX = ((this.clickedPosX !== undefined) ? this.clickedPosX : win.global.innerWidth / 2) - viewPos.x;
					if(this.keepScrollPos && !this.getParent()){
						scrollTop = win.body().scrollTop || win.doc.documentElement.scrollTop || win.global.pageYOffset || 0;
					}else{
						scrollTop = -viewPos.y;
					}
					posY = ((this.clickedPosY !== undefined) ? this.clickedPosY : win.global.innerHeight / 2) + scrollTop;
					fromOrigin = posX + "px " + posY + "px";
					toOrigin = posX + "px " + posY + "px";
				}
				domStyle.set(fromNode, {webkitTransformOrigin:fromOrigin});
				domStyle.set(toNode, {webkitTransformOrigin:toOrigin});
			}
			dm.currentView = registry.byNode(toNode);
		},
	
		onAnimationStart: function(e){
		},


		onAnimationEnd: function(e){
			var name = e.animationName || e.target.className;
			if(name.indexOf("Out") === -1 &&
				name.indexOf("In") === -1 &&
				name.indexOf("Shrink") === -1){ return; }
			var isOut = false;
			if(domClass.contains(this.domNode, "mblOut")){
				isOut = true;
				this.domNode.style.display = "none";
				domClass.remove(this.domNode, [this._toCls(this._transition), "mblIn", "mblOut", "mblReverse"]);
			}else{
				// Reset the temporary padding
				this.containerNode.style.paddingTop = "";
			}
			domStyle.set(this.domNode, {webkitTransformOrigin:""});
			if(name.indexOf("Shrink") !== -1){
				var li = e.target;
				li.style.display = "none";
				domClass.remove(li, "mblCloseContent");
			}
			if(isOut){
				this.invokeCallback();
			}
			// this.domNode may be destroyed as a result of invoking the callback,
			// so check for that before accessing it.
			this.domNode && (this.domNode.className = "mblView");

			// clear the clicked position
			this.clickedPosX = this.clickedPosY = undefined;
		},

		invokeCallback: function(){
			this.onAfterTransitionOut.apply(this, this._arguments);
			connect.publish("/dojox/mobile/afterTransitionOut", [this].concat(this._arguments));
			var toWidget = registry.byNode(this.toNode);
			if(toWidget){
				toWidget.onAfterTransitionIn.apply(toWidget, this._arguments);
				connect.publish("/dojox/mobile/afterTransitionIn", [toWidget].concat(this._arguments));
				toWidget.movedFrom = undefined;
			}

			var c = this._context, m = this._method;
			if(!c && !m){ return; }
			if(!m){
				m = c;
				c = null;
			}
			c = c || win.global;
			if(typeof(m) == "string"){
				c[m].apply(c, this._args);
			}else{
				m.apply(c, this._args);
			}
		},
	
		getShowingView: function(){
			// summary:
			//		Find the currently showing view from my sibling views.
			// description:
			//		Note that dojox.mobile.currentView is the last shown view.
			//		If the page consists of a splitter, there are multiple showing views.
			var nodes = this.domNode.parentNode.childNodes;
			for(var i = 0; i < nodes.length; i++){
				var n = nodes[i];
				if(n.nodeType === 1 && domClass.contains(n, "mblView") && domStyle.get(n, "display") !== "none"){
					return registry.byNode(n);
				}
			}
			return null;
		},
	
		show: function(){
			// summary:
			//		Shows this view without a transition animation.
			var view = this.getShowingView();
			if(view){
				view.domNode.style.display = "none"; // from-style
			}
			this.domNode.style.display = ""; // to-style
			dm.currentView = this;
		}
	});
});

},
'dijit/a11y':function(){
define("dijit/a11y", [
	"dojo/_base/array", // array.forEach array.map
	"dojo/_base/config", // defaultDuration
	"dojo/_base/declare", // declare
	"dojo/dom",			// dom.byId
	"dojo/dom-attr", // domAttr.attr domAttr.has
	"dojo/dom-style", // style.style
	"dojo/_base/sniff", // 0
	"./_base/manager",	// manager._isElementShown
	"."	// for exporting methods to dijit namespace
], function(array, config, declare, dom, domAttr, domStyle, has, manager, dijit){

	// module:
	//		dijit/a11y
	// summary:
	//		Accessibility utility functions (keyboard, tab stops, etc.)

	var shown = (dijit._isElementShown = function(/*Element*/ elem){
		var s = domStyle.get(elem);
		return (s.visibility != "hidden")
			&& (s.visibility != "collapsed")
			&& (s.display != "none")
			&& (domAttr.get(elem, "type") != "hidden");
	});

	dijit.hasDefaultTabStop = function(/*Element*/ elem){
		// summary:
		//		Tests if element is tab-navigable even without an explicit tabIndex setting

		// No explicit tabIndex setting, need to investigate node type
		switch(elem.nodeName.toLowerCase()){
			case "a":
				// An <a> w/out a tabindex is only navigable if it has an href
				return domAttr.has(elem, "href");
			case "area":
			case "button":
			case "input":
			case "object":
			case "select":
			case "textarea":
				// These are navigable by default
				return true;
			case "iframe":
				// If it's an editor <iframe> then it's tab navigable.
				var body;
				try{
					// non-IE
					var contentDocument = elem.contentDocument;
					if("designMode" in contentDocument && contentDocument.designMode == "on"){
						return true;
					}
					body = contentDocument.body;
				}catch(e1){
					// contentWindow.document isn't accessible within IE7/8
					// if the iframe.src points to a foreign url and this
					// page contains an element, that could get focus
					try{
						body = elem.contentWindow.document.body;
					}catch(e2){
						return false;
					}
				}
				return body && (body.contentEditable == 'true' ||
					(body.firstChild && body.firstChild.contentEditable == 'true'));
			default:
				return elem.contentEditable == 'true';
		}
	};

	var isTabNavigable = (dijit.isTabNavigable = function(/*Element*/ elem){
		// summary:
		//		Tests if an element is tab-navigable

		// TODO: convert (and rename method) to return effective tabIndex; will save time in _getTabNavigable()
		if(domAttr.get(elem, "disabled")){
			return false;
		}else if(domAttr.has(elem, "tabIndex")){
			// Explicit tab index setting
			return domAttr.get(elem, "tabIndex") >= 0; // boolean
		}else{
			// No explicit tabIndex setting, so depends on node type
			return dijit.hasDefaultTabStop(elem);
		}
	});

	dijit._getTabNavigable = function(/*DOMNode*/ root){
		// summary:
		//		Finds descendants of the specified root node.
		//
		// description:
		//		Finds the following descendants of the specified root node:
		//		* the first tab-navigable element in document order
		//		  without a tabIndex or with tabIndex="0"
		//		* the last tab-navigable element in document order
		//		  without a tabIndex or with tabIndex="0"
		//		* the first element in document order with the lowest
		//		  positive tabIndex value
		//		* the last element in document order with the highest
		//		  positive tabIndex value
		var first, last, lowest, lowestTabindex, highest, highestTabindex, radioSelected = {};

		function radioName(node){
			// If this element is part of a radio button group, return the name for that group.
			return node && node.tagName.toLowerCase() == "input" &&
				node.type && node.type.toLowerCase() == "radio" &&
				node.name && node.name.toLowerCase();
		}

		var walkTree = function(/*DOMNode*/parent){
			for(var child = parent.firstChild; child; child = child.nextSibling){
				// Skip text elements, hidden elements, and also non-HTML elements (those in custom namespaces) in IE,
				// since show() invokes getAttribute("type"), which crash on VML nodes in IE.
				if(child.nodeType != 1 || (0 && child.scopeName !== "HTML") || !shown(child)){
					continue;
				}

				if(isTabNavigable(child)){
					var tabindex = domAttr.get(child, "tabIndex");
					if(!domAttr.has(child, "tabIndex") || tabindex == 0){
						if(!first){
							first = child;
						}
						last = child;
					}else if(tabindex > 0){
						if(!lowest || tabindex < lowestTabindex){
							lowestTabindex = tabindex;
							lowest = child;
						}
						if(!highest || tabindex >= highestTabindex){
							highestTabindex = tabindex;
							highest = child;
						}
					}
					var rn = radioName(child);
					if(domAttr.get(child, "checked") && rn){
						radioSelected[rn] = child;
					}
				}
				if(child.nodeName.toUpperCase() != 'SELECT'){
					walkTree(child);
				}
			}
		};
		if(shown(root)){
			walkTree(root);
		}
		function rs(node){
			// substitute checked radio button for unchecked one, if there is a checked one with the same name.
			return radioSelected[radioName(node)] || node;
		}

		return { first: rs(first), last: rs(last), lowest: rs(lowest), highest: rs(highest) };
	};
	dijit.getFirstInTabbingOrder = function(/*String|DOMNode*/ root){
		// summary:
		//		Finds the descendant of the specified root node
		//		that is first in the tabbing order
		var elems = dijit._getTabNavigable(dom.byId(root));
		return elems.lowest ? elems.lowest : elems.first; // DomNode
	};

	dijit.getLastInTabbingOrder = function(/*String|DOMNode*/ root){
		// summary:
		//		Finds the descendant of the specified root node
		//		that is last in the tabbing order
		var elems = dijit._getTabNavigable(dom.byId(root));
		return elems.last ? elems.last : elems.highest; // DomNode
	};

	return {
		hasDefaultTabStop: dijit.hasDefaultTabStop,
		isTabNavigable: dijit.isTabNavigable,
		_getTabNavigable: dijit._getTabNavigable,
		getFirstInTabbingOrder: dijit.getFirstInTabbingOrder,
		getLastInTabbingOrder: dijit.getLastInTabbingOrder
	};
});

},
'dojox/gesture/tap':function(){
define("dojox/gesture/tap", [
	"dojo/_base/kernel",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"./Base",
	"../main"
], function(kernel, declare, lang, Base, dojox){
// module:
//		dojox/gesture/tap
	
/*=====
	dojox.gesture.tap = {
		// summary:
		//		This module provides tap gesture event handlers:
		//
		//		1. dojox.gesture.tap: 'tap' event
		//
		//		2. dojox.gesture.tap.hold: 'tap.hold' event
		//
		//		3. dojox.gesture.tap.doubletap: 'tap.doubletap' event
		//
		// example:
		//		A. Used with dojo.connect()
		//		|	dojo.connect(node, dojox.gesture.tap, function(e){});
		//		|	dojo.connect(node, dojox.gesture.tap.hold, function(e){});
		//		|	dojo.connect(node, dojox.gesture.tap.doubletap, function(e){});
		//
		//		B. Used with dojo.on
		//		|	define(['dojo/on', 'dojox/gesture/tap'], function(on, tap){
		//		|		on(node, tap, function(e){});
		//		|		on(node, tap.hold, function(e){});
		//		|		on(node, tap.doubletap, function(e){});
		//
		//		C. Used with dojox.gesture.tap.* directly
		//		|	dojox.gesture.tap(node, function(e){});
		//		|	dojox.gesture.tap.hold(node, function(e){});
		//		|	dojox.gesture.tap.doubletap(node, function(e){});
		//
		//		Though there is always a default gesture instance after being required, e.g
		//		|	require(['dojox/gesture/tap'], function(){...});
		//
		//		It's possible to create a new one with different parameter setting:
		//		|	var myTap = new dojox.gesture.tap.Tap({holdThreshold: 300});
		//		|	dojo.connect(node, myTap, function(e){});
		//		|	dojo.connect(node, myTap.hold, function(e){});
		//		|	dojo.connect(node, myTap.doubletap, function(e){});
	};
=====*/

kernel.experimental("dojox.gesture.tap");

// Declare an internal anonymous class which will only be exported
// by module return value e.g. dojox.gesture.tap.Tap
var clz = declare(/*===== "dojox.gesture.tap", =====*/Base, {
	// defaultEvent: [readonly] String
	//		Default event - 'tap'
	defaultEvent: "tap",

	// subEvents: [readonly] Array
	//		List of sub events, used by being
	//		combined with defaultEvent as 'tap.hold', 'tap.doubletap'.
	subEvents: ["hold", "doubletap"],

	// holdThreshold: Integer
	//		Threshold(in milliseconds) for 'tap.hold'
	holdThreshold: 500,

	// holdThreshold: Integer
	//		Timeout (in milliseconds) for 'tap.doubletap'
	doubleTapTimeout: 250,

	// tapRadius: Integer
	//		Valid tap radius from previous touch point
	tapRadius: 10,

	press: function(/*Object*/data, /*Event*/e){
		// summary:
		//		Overwritten, record initial tap info and register a timeout checker for 'tap.hold'
		if(e.touches && e.touches.length >= 2){
			//tap gesture is only for single touch
			delete data.context;
			return;
		}
		var target = e.target;
		this._initTap(data, e);
		data.tapTimeOut = setTimeout(lang.hitch(this, function(){
			if(this._isTap(data, e)){
				this.fire(target, {type: "tap.hold"});
			}
			delete data.context;
		}), this.holdThreshold);
	},
	release: function(/*Object*/data, /*Event*/e){
		// summary:
		//		Overwritten, fire matched 'tap' or 'tap.doubletap' during touchend
		if(!data.context){
			clearTimeout(data.tapTimeOut);
			return;
		}
		if(this._isTap(data, e)){
			switch(data.context.c){
			case 1: 
				this.fire(e.target, {type: "tap"});
				break;
			case 2:
				this.fire(e.target, {type: "tap.doubletap"});
				break;
			}
		}
		clearTimeout(data.tapTimeOut);
	},
	_initTap: function(/*Object*/data, /*Event*/e){
		// summary:
		//		Update the gesture data with new tap info 
		if(!data.context){
			data.context = {x: 0, y: 0, t: 0, c: 0};
		}
		var ct = new Date().getTime();
		if(ct - data.context.t <= this.doubleTapTimeout){
			data.context.c++;
		}else{
			data.context.c = 1;
			data.context.x = e.screenX;
			data.context.y = e.screenY;
		}
		data.context.t = ct;
	},
	_isTap: function(/*Object*/data, /*Event*/e){
		// summary:
		//		Check whether it's an valid tap
		var dx = Math.abs(data.context.x - e.screenX);
		var dy = Math.abs(data.context.y - e.screenY);
		return dx <= this.tapRadius && dy <= this.tapRadius;
	}
});

// the default tap instance for handy use
dojox.gesture.tap = new clz();
// Class for creating a new Tap instance
dojox.gesture.tap.Tap = clz;

return dojox.gesture.tap;

});
},
'dojox/mobile/ListItem':function(){
define("dojox/mobile/ListItem", [
	"dojo/_base/array",
	"dojo/_base/connect",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/has",
	"./common",
	"./_ItemBase",
	"./TransitionEvent"
], function(array, connect, declare, lang, domClass, domConstruct, has, common, ItemBase, TransitionEvent){

/*=====
	var ItemBase = dojox.mobile._ItemBase;
=====*/

	// module:
	//		dojox/mobile/ListItem
	// summary:
	//		An item of either RoundRectList or EdgeToEdgeList.

	return declare("dojox.mobile.ListItem", ItemBase, {
		// summary:
		//		An item of either RoundRectList or EdgeToEdgeList.
		// description:
		//		ListItem represents an item of either RoundRectList or
		//		EdgeToEdgeList. There are three ways to move to a different
		//		view, moveTo, href, and url. You can choose only one of them.

		// rightText: String
		//		A right-aligned text to display on the item.
		rightText: "",

		// rightIcon: String
		//		An icon to display at the right hand side of the item. The value
		//		can be either a path for an image file or a class name of a DOM
		//		button.
		rightIcon: "",

		// rightIcon2: String
		//		An icon to display at the left of the rightIcon. The value can
		//		be either a path for an image file or a class name of a DOM
		//		button.
		rightIcon2: "",


		// anchorLabel: Boolean
		//		If true, the label text becomes a clickable anchor text. When
		//		the user clicks on the text, the onAnchorLabelClicked handler is
		//		called. You can override or connect to the handler and implement
		//		any action. The handler has no default action.
		anchorLabel: false,

		// noArrow: Boolean
		//		If true, the right hand side arrow is not displayed.
		noArrow: false,

		// selected: Boolean
		//		If true, the item is highlighted to indicate it is selected.
		selected: false,

		// checked: Boolean
		//		If true, a check mark is displayed at the right of the item.
		checked: false,

		// arrowClass: String
		//		An icon to display as an arrow. The value can be either a path
		//		for an image file or a class name of a DOM button.
		arrowClass: "mblDomButtonArrow",

		// checkClass: String
		//		An icon to display as a check mark. The value can be either a
		//		path for an image file or a class name of a DOM button.
		checkClass: "mblDomButtonCheck",

		// variableHeight: Boolean
		//		If true, the height of the item varies according to its
		//		content. In dojo 1.6 or older, the "mblVariableHeight" class was
		//		used for this purpose. In dojo 1.7, adding the mblVariableHeight
		//		class still works for backward compatibility.
		variableHeight: false,


		// rightIconTitle: String
		//		An alt text for the right icon.
		rightIconTitle: "",

		// rightIcon2Title: String
		//		An alt text for the right icon2.
		rightIcon2Title: "",


		// btnClass: String
		//		Deprecated. For backward compatibility.
		btnClass: "",

		// btnClass2: String
		//		Deprecated. For backward compatibility.
		btnClass2: "",

	
		postMixInProperties: function(){
			// for backward compatibility
			if(this.btnClass){
				this.rightIcon = this.btnClass;
			}
			this._setBtnClassAttr = this._setRightIconAttr;
			this._setBtnClass2Attr = this._setRightIcon2Attr;
		},

		buildRendering: function(){
			this.inherited(arguments);
			this.domNode.className = "mblListItem" + (this.selected ? " mblItemSelected" : "");

			// label
			var box = this.box = domConstruct.create("DIV");
			box.className = "mblListItemTextBox";
			if(this.anchorLabel){
				box.style.cursor = "pointer";
			}
			var r = this.srcNodeRef;
			if(r && !this.label){
				this.label = "";
				for(var i = 0, len = r.childNodes.length; i < len; i++){
					var n = r.firstChild;
					if(n.nodeType === 3 && lang.trim(n.nodeValue) !== ""){
						n.nodeValue = this._cv ? this._cv(n.nodeValue) : n.nodeValue;
						this.labelNode = domConstruct.create("SPAN", {className:"mblListItemLabel"});
						this.labelNode.appendChild(n);
						n = this.labelNode;
					}
					box.appendChild(n);
				}
			}
			if(!this.labelNode){
				this.labelNode = domConstruct.create("SPAN", {className:"mblListItemLabel"}, box);
			}
			if(this.anchorLabel){
				box.style.display = "inline"; // to narrow the text region
			}

			var a = this.anchorNode = domConstruct.create("A");
			a.className = "mblListItemAnchor";
			this.domNode.appendChild(a);
			a.appendChild(box);
		},

		startup: function(){
			if(this._started){ return; }
			this.inheritParams();
			var parent = this.getParent();
			if(this.moveTo || this.href || this.url || this.clickable || (parent && parent.select)){
				this._onClickHandle = this.connect(this.anchorNode, "onclick", "onClick");
			}
			this.setArrow();

			if(domClass.contains(this.domNode, "mblVariableHeight")){
				this.variableHeight = true;
			}
			if(this.variableHeight){
				domClass.add(this.domNode, "mblVariableHeight");
				setTimeout(lang.hitch(this, "layoutVariableHeight"));
			}

			this.set("icon", this.icon); // _setIconAttr may be called twice but this is necessary for offline instantiation
			if(!this.checked && this.checkClass.indexOf(',') !== -1){
				this.set("checked", this.checked);
			}
			this.inherited(arguments);
		},

		resize: function(){
			if(this.variableHeight){
				this.layoutVariableHeight();
			}
		},

		onClick: function(e){
			var a = e.currentTarget;
			var li = a.parentNode;
			if(domClass.contains(li, "mblItemSelected")){ return; } // already selected
			if(this.anchorLabel){
				for(var p = e.target; p.tagName !== "LI"; p = p.parentNode){
					if(p.className == "mblListItemTextBox"){
						domClass.add(p, "mblListItemTextBoxSelected");
						setTimeout(function(){
							domClass.remove(p, "mblListItemTextBoxSelected");
						}, has("android") ? 300 : 1000);
						this.onAnchorLabelClicked(e);
						return;
					}
				}
			}
			var parent = this.getParent();
			if(parent.select){
				if(parent.select === "single"){
					if(!this.checked){
						this.set("checked", true);
					}
				}else if(parent.select === "multiple"){
					this.set("checked", !this.checked);
				}
			}
			this.select();

			if (this.href && this.hrefTarget) {
				common.openWindow(this.href, this.hrefTarget);
				return;
			}
			var transOpts;
			if(this.moveTo || this.href || this.url || this.scene){
				transOpts = {moveTo: this.moveTo, href: this.href, url: this.url, scene: this.scene, transition: this.transition, transitionDir: this.transitionDir};
			}else if(this.transitionOptions){
				transOpts = this.transitionOptions;
			}	

			if(transOpts){
				this.setTransitionPos(e);
				return new TransitionEvent(this.domNode,transOpts,e).dispatch();
			}
		},
	
		select: function(){
			// summary:
			//		Makes this widget in the selected state.
			var parent = this.getParent();
			if(parent.stateful){
				parent.deselectAll();
			}else{
				var _this = this;
				setTimeout(function(){
					_this.deselect();
				}, has("android") ? 300 : 1000);
			}
			domClass.add(this.domNode, "mblItemSelected");
		},
	
		deselect: function(){
			// summary:
			//		Makes this widget in the deselected state.
			domClass.remove(this.domNode, "mblItemSelected");
		},
	
		onAnchorLabelClicked: function(e){
			// summary:
			//		Stub function to connect to from your application.
		},

		layoutVariableHeight: function(){
			var h = this.anchorNode.offsetHeight;
			if(h === this.anchorNodeHeight){ return; }
			this.anchorNodeHeight = h;
			array.forEach([
					this.rightTextNode,
					this.rightIcon2Node,
					this.rightIconNode,
					this.iconNode
				], function(n){
					if(n){
						var t = Math.round((h - n.offsetHeight) / 2);
						n.style.marginTop = t + "px";
					}
				});
		},

		setArrow: function(){
			// summary:
			//		Sets the arrow icon if necessary.
			if(this.checked){ return; }
			var c = "";
			var parent = this.getParent();
			if(this.moveTo || this.href || this.url || this.clickable){
				if(!this.noArrow && !(parent && parent.stateful)){
					c = this.arrowClass;
				}
			}
			if(c){
				this._setRightIconAttr(c);
			}
		},

		_setIconAttr: function(icon){
			if(!this.getParent()){ return; } // icon may be invalid because inheritParams is not called yet
			this.icon = icon;
			var a = this.anchorNode;
			if(!this.iconNode){
				if(icon){
					var ref = this.rightIconNode || this.rightIcon2Node || this.rightTextNode || this.box;
					this.iconNode = domConstruct.create("DIV", {className:"mblListItemIcon"}, ref, "before");
				}
			}else{
				domConstruct.empty(this.iconNode);
			}
			if(icon && icon !== "none"){
				common.createIcon(icon, this.iconPos, null, this.alt, this.iconNode);
				if(this.iconPos){
					domClass.add(this.iconNode.firstChild, "mblListItemSpriteIcon");
				}
				domClass.remove(a, "mblListItemAnchorNoIcon");
			}else{
				domClass.add(a, "mblListItemAnchorNoIcon");
			}
		},
	
		_setCheckedAttr: function(/*Boolean*/checked){
			var parent = this.getParent();
			if(parent && parent.select === "single" && checked){
				array.forEach(parent.getChildren(), function(child){
					child.set("checked", false);
				});
			}
			this._setRightIconAttr(this.checkClass);

			var icons = this.rightIconNode.childNodes;
			if(icons.length === 1){
				this.rightIconNode.style.display = checked ? "" : "none";
			}else{
				icons[0].style.display = checked ? "" : "none";
				icons[1].style.display = !checked ? "" : "none";
			}

			domClass.toggle(this.domNode, "mblListItemChecked", checked);
			if(parent && this.checked !== checked){
				parent.onCheckStateChanged(this, checked);
			}
			this.checked = checked;
		},
	
		_setRightTextAttr: function(/*String*/text){
			if(!this.rightTextNode){
				this.rightTextNode = domConstruct.create("DIV", {className:"mblListItemRightText"}, this.box, "before");
			}
			this.rightText = text;
			this.rightTextNode.innerHTML = this._cv ? this._cv(text) : text;
		},
	
		_setRightIconAttr: function(/*String*/icon){
			if(!this.rightIconNode){
				var ref = this.rightIcon2Node || this.rightTextNode || this.box;
				this.rightIconNode = domConstruct.create("DIV", {className:"mblListItemRightIcon"}, ref, "before");
			}else{
				domConstruct.empty(this.rightIconNode);
			}
			this.rightIcon = icon;
			var arr = (icon || "").split(/,/);
			if(arr.length === 1){
				common.createIcon(icon, null, null, this.rightIconTitle, this.rightIconNode);
			}else{
				common.createIcon(arr[0], null, null, this.rightIconTitle, this.rightIconNode);
				common.createIcon(arr[1], null, null, this.rightIconTitle, this.rightIconNode);
			}
		},
	
		_setRightIcon2Attr: function(/*String*/icon){
			if(!this.rightIcon2Node){
				var ref = this.rightTextNode || this.box;
				this.rightIcon2Node = domConstruct.create("DIV", {className:"mblListItemRightIcon2"}, ref, "before");
			}else{
				domConstruct.empty(this.rightIcon2Node);
			}
			this.rightIcon2 = icon;
			common.createIcon(icon, null, null, this.rightIcon2Title, this.rightIcon2Node);
		},
	
		_setLabelAttr: function(/*String*/text){
			this.label = text;
			this.labelNode.innerHTML = this._cv ? this._cv(text) : text;
		}
	});
});

},
'dijit/place':function(){
define("dijit/place", [
	"dojo/_base/array", // array.forEach array.map array.some
	"dojo/dom-geometry", // domGeometry.getMarginBox domGeometry.position
	"dojo/dom-style", // domStyle.getComputedStyle
	"dojo/_base/kernel", // kernel.deprecated
	"dojo/_base/window", // win.body
	"dojo/window", // winUtils.getBox
	"."	// dijit (defining dijit.place to match API doc)
], function(array, domGeometry, domStyle, kernel, win, winUtils, dijit){

	// module:
	//		dijit/place
	// summary:
	//		Code to place a popup relative to another node


	function _place(/*DomNode*/ node, choices, layoutNode, aroundNodeCoords){
		// summary:
		//		Given a list of spots to put node, put it at the first spot where it fits,
		//		of if it doesn't fit anywhere then the place with the least overflow
		// choices: Array
		//		Array of elements like: {corner: 'TL', pos: {x: 10, y: 20} }
		//		Above example says to put the top-left corner of the node at (10,20)
		// layoutNode: Function(node, aroundNodeCorner, nodeCorner, size)
		//		for things like tooltip, they are displayed differently (and have different dimensions)
		//		based on their orientation relative to the parent.	 This adjusts the popup based on orientation.
		//		It also passes in the available size for the popup, which is useful for tooltips to
		//		tell them that their width is limited to a certain amount.	 layoutNode() may return a value expressing
		//		how much the popup had to be modified to fit into the available space.	 This is used to determine
		//		what the best placement is.
		// aroundNodeCoords: Object
		//		Size of aroundNode, ex: {w: 200, h: 50}

		// get {x: 10, y: 10, w: 100, h:100} type obj representing position of
		// viewport over document
		var view = winUtils.getBox();

		// This won't work if the node is inside a <div style="position: relative">,
		// so reattach it to win.doc.body.	 (Otherwise, the positioning will be wrong
		// and also it might get cutoff)
		if(!node.parentNode || String(node.parentNode.tagName).toLowerCase() != "body"){
			win.body().appendChild(node);
		}

		var best = null;
		array.some(choices, function(choice){
			var corner = choice.corner;
			var pos = choice.pos;
			var overflow = 0;

			// calculate amount of space available given specified position of node
			var spaceAvailable = {
				w: {
					'L': view.l + view.w - pos.x,
					'R': pos.x - view.l,
					'M': view.w
				   }[corner.charAt(1)],
				h: {
					'T': view.t + view.h - pos.y,
					'B': pos.y - view.t,
					'M': view.h
				   }[corner.charAt(0)]
			};

			// configure node to be displayed in given position relative to button
			// (need to do this in order to get an accurate size for the node, because
			// a tooltip's size changes based on position, due to triangle)
			if(layoutNode){
				var res = layoutNode(node, choice.aroundCorner, corner, spaceAvailable, aroundNodeCoords);
				overflow = typeof res == "undefined" ? 0 : res;
			}

			// get node's size
			var style = node.style;
			var oldDisplay = style.display;
			var oldVis = style.visibility;
			if(style.display == "none"){
				style.visibility = "hidden";
				style.display = "";
			}
			var mb = domGeometry. getMarginBox(node);
			style.display = oldDisplay;
			style.visibility = oldVis;

			// coordinates and size of node with specified corner placed at pos,
			// and clipped by viewport
			var
				startXpos = {
					'L': pos.x,
					'R': pos.x - mb.w,
					'M': Math.max(view.l, Math.min(view.l + view.w, pos.x + (mb.w >> 1)) - mb.w) // M orientation is more flexible
				}[corner.charAt(1)],
				startYpos = {
					'T': pos.y,
					'B': pos.y - mb.h,
					'M': Math.max(view.t, Math.min(view.t + view.h, pos.y + (mb.h >> 1)) - mb.h)
				}[corner.charAt(0)],
				startX = Math.max(view.l, startXpos),
				startY = Math.max(view.t, startYpos),
				endX = Math.min(view.l + view.w, startXpos + mb.w),
				endY = Math.min(view.t + view.h, startYpos + mb.h),
				width = endX - startX,
				height = endY - startY;

			overflow += (mb.w - width) + (mb.h - height);

			if(best == null || overflow < best.overflow){
				best = {
					corner: corner,
					aroundCorner: choice.aroundCorner,
					x: startX,
					y: startY,
					w: width,
					h: height,
					overflow: overflow,
					spaceAvailable: spaceAvailable
				};
			}

			return !overflow;
		});

		// In case the best position is not the last one we checked, need to call
		// layoutNode() again.
		if(best.overflow && layoutNode){
			layoutNode(node, best.aroundCorner, best.corner, best.spaceAvailable, aroundNodeCoords);
		}

		// And then position the node.  Do this last, after the layoutNode() above
		// has sized the node, due to browser quirks when the viewport is scrolled
		// (specifically that a Tooltip will shrink to fit as though the window was
		// scrolled to the left).
		//
		// In RTL mode, set style.right rather than style.left so in the common case,
		// window resizes move the popup along with the aroundNode.
		var l = domGeometry.isBodyLtr(),
			s = node.style;
		s.top = best.y + "px";
		s[l ? "left" : "right"] = (l ? best.x : view.w - best.x - best.w) + "px";
		s[l ? "right" : "left"] = "auto";	// needed for FF or else tooltip goes to far left

		return best;
	}

	/*=====
	dijit.place.__Position = function(){
		// x: Integer
		//		horizontal coordinate in pixels, relative to document body
		// y: Integer
		//		vertical coordinate in pixels, relative to document body

		this.x = x;
		this.y = y;
	};
	=====*/

	/*=====
	dijit.place.__Rectangle = function(){
		// x: Integer
		//		horizontal offset in pixels, relative to document body
		// y: Integer
		//		vertical offset in pixels, relative to document body
		// w: Integer
		//		width in pixels.   Can also be specified as "width" for backwards-compatibility.
		// h: Integer
		//		height in pixels.   Can also be specified as "height" from backwards-compatibility.

		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	};
	=====*/

	return (dijit.place = {
		// summary:
		//		Code to place a DOMNode relative to another DOMNode.
		//		Load using require(["dijit/place"], function(place){ ... }).

		at: function(node, pos, corners, padding){
			// summary:
			//		Positions one of the node's corners at specified position
			//		such that node is fully visible in viewport.
			// description:
			//		NOTE: node is assumed to be absolutely or relatively positioned.
			// node: DOMNode
			//		The node to position
			// pos: dijit.place.__Position
			//		Object like {x: 10, y: 20}
			// corners: String[]
			//		Array of Strings representing order to try corners in, like ["TR", "BL"].
			//		Possible values are:
			//			* "BL" - bottom left
			//			* "BR" - bottom right
			//			* "TL" - top left
			//			* "TR" - top right
			// padding: dijit.place.__Position?
			//		optional param to set padding, to put some buffer around the element you want to position.
			// example:
			//		Try to place node's top right corner at (10,20).
			//		If that makes node go (partially) off screen, then try placing
			//		bottom left corner at (10,20).
			//	|	place(node, {x: 10, y: 20}, ["TR", "BL"])
			var choices = array.map(corners, function(corner){
				var c = { corner: corner, pos: {x:pos.x,y:pos.y} };
				if(padding){
					c.pos.x += corner.charAt(1) == 'L' ? padding.x : -padding.x;
					c.pos.y += corner.charAt(0) == 'T' ? padding.y : -padding.y;
				}
				return c;
			});

			return _place(node, choices);
		},

		around: function(
			/*DomNode*/		node,
			/*DomNode || dijit.place.__Rectangle*/ anchor,
			/*String[]*/	positions,
			/*Boolean*/		leftToRight,
			/*Function?*/	layoutNode){

			// summary:
			//		Position node adjacent or kitty-corner to anchor
			//		such that it's fully visible in viewport.
			//
			// description:
			//		Place node such that corner of node touches a corner of
			//		aroundNode, and that node is fully visible.
			//
			// anchor:
			//		Either a DOMNode or a __Rectangle (object with x, y, width, height).
			//
			// positions:
			//		Ordered list of positions to try matching up.
			//			* before: places drop down to the left of the anchor node/widget, or to the right in
			//				the case of RTL scripts like Hebrew and Arabic
			//			* after: places drop down to the right of the anchor node/widget, or to the left in
			//				the case of RTL scripts like Hebrew and Arabic
			//			* above: drop down goes above anchor node
			//			* above-alt: same as above except right sides aligned instead of left
			//			* below: drop down goes below anchor node
			//			* below-alt: same as below except right sides aligned instead of left
			//
			// layoutNode: Function(node, aroundNodeCorner, nodeCorner)
			//		For things like tooltip, they are displayed differently (and have different dimensions)
			//		based on their orientation relative to the parent.	 This adjusts the popup based on orientation.
			//
			// leftToRight:
			//		True if widget is LTR, false if widget is RTL.   Affects the behavior of "above" and "below"
			//		positions slightly.
			//
			// example:
			//	|	placeAroundNode(node, aroundNode, {'BL':'TL', 'TR':'BR'});
			//		This will try to position node such that node's top-left corner is at the same position
			//		as the bottom left corner of the aroundNode (ie, put node below
			//		aroundNode, with left edges aligned).	If that fails it will try to put
			// 		the bottom-right corner of node where the top right corner of aroundNode is
			//		(ie, put node above aroundNode, with right edges aligned)
			//

			// if around is a DOMNode (or DOMNode id), convert to coordinates
			var aroundNodePos = (typeof anchor == "string" || "offsetWidth" in anchor)
				? domGeometry.position(anchor, true)
				: anchor;

			// Adjust anchor positioning for the case that a parent node has overflw hidden, therefore cuasing the anchor not to be completely visible
			if(anchor.parentNode){
				var parent = anchor.parentNode;
				while(parent && parent.nodeType == 1 && parent.nodeName != "BODY"){  //ignoring the body will help performance
					var parentPos = domGeometry.position(parent, true);
					var parentStyleOverflow = domStyle.getComputedStyle(parent).overflow;
					if(parentStyleOverflow == "hidden" || parentStyleOverflow == "auto" || parentStyleOverflow == "scroll"){
						var bottomYCoord = Math.min(aroundNodePos.y + aroundNodePos.h, parentPos.y + parentPos.h);
						var rightXCoord = Math.min(aroundNodePos.x + aroundNodePos.w, parentPos.x + parentPos.w);
						aroundNodePos.x = Math.max(aroundNodePos.x, parentPos.x);
						aroundNodePos.y = Math.max(aroundNodePos.y, parentPos.y);
						aroundNodePos.h = bottomYCoord - aroundNodePos.y;
						aroundNodePos.w = rightXCoord - aroundNodePos.x;
					}	
					parent = parent.parentNode;
				}
			}			

			var x = aroundNodePos.x,
				y = aroundNodePos.y,
				width = "w" in aroundNodePos ? aroundNodePos.w : (aroundNodePos.w = aroundNodePos.width),
				height = "h" in aroundNodePos ? aroundNodePos.h : (kernel.deprecated("place.around: dijit.place.__Rectangle: { x:"+x+", y:"+y+", height:"+aroundNodePos.height+", width:"+width+" } has been deprecated.  Please use { x:"+x+", y:"+y+", h:"+aroundNodePos.height+", w:"+width+" }", "", "2.0"), aroundNodePos.h = aroundNodePos.height);

			// Convert positions arguments into choices argument for _place()
			var choices = [];
			function push(aroundCorner, corner){
				choices.push({
					aroundCorner: aroundCorner,
					corner: corner,
					pos: {
						x: {
							'L': x,
							'R': x + width,
							'M': x + (width >> 1)
						   }[aroundCorner.charAt(1)],
						y: {
							'T': y,
							'B': y + height,
							'M': y + (height >> 1)
						   }[aroundCorner.charAt(0)]
					}
				})
			}
			array.forEach(positions, function(pos){
				var ltr =  leftToRight;
				switch(pos){
					case "above-centered":
						push("TM", "BM");
						break;
					case "below-centered":
						push("BM", "TM");
						break;
					case "after":
						ltr = !ltr;
						// fall through
					case "before":
						push(ltr ? "ML" : "MR", ltr ? "MR" : "ML");
						break;
					case "below-alt":
						ltr = !ltr;
						// fall through
					case "below":
						// first try to align left borders, next try to align right borders (or reverse for RTL mode)
						push(ltr ? "BL" : "BR", ltr ? "TL" : "TR");
						push(ltr ? "BR" : "BL", ltr ? "TR" : "TL");
						break;
					case "above-alt":
						ltr = !ltr;
						// fall through
					case "above":
						// first try to align left borders, next try to align right borders (or reverse for RTL mode)
						push(ltr ? "TL" : "TR", ltr ? "BL" : "BR");
						push(ltr ? "TR" : "TL", ltr ? "BR" : "BL");
						break;
					default:
						// To assist dijit/_base/place, accept arguments of type {aroundCorner: "BL", corner: "TL"}.
						// Not meant to be used directly.
						push(pos.aroundCorner, pos.corner);
				}
			});

			var position = _place(node, choices, layoutNode, {w: width, h: height});
			position.aroundNodePos = aroundNodePos;

			return position;
		}
	});
});

},
'dijit/form/_CheckBoxMixin':function(){
define("dijit/form/_CheckBoxMixin", [
	"dojo/_base/declare", // declare
	"dojo/dom-attr", // domAttr.set
	"dojo/_base/event" // event.stop
], function(declare, domAttr, event){

	// module:
	//		dijit/form/_CheckBoxMixin
	// summary:
	// 		Mixin to provide widget functionality corresponding to an HTML checkbox

	return declare("dijit.form._CheckBoxMixin", null, {
		// summary:
		// 		Mixin to provide widget functionality corresponding to an HTML checkbox
		//
		// description:
		//		User interacts with real html inputs.
		//		On onclick (which occurs by mouse click, space-bar, or
		//		using the arrow keys to switch the selected radio button),
		//		we update the state of the checkbox/radio.
		//

		// type: [private] String
		//		type attribute on <input> node.
		//		Overrides `dijit.form.Button.type`.  Users should not change this value.
		type: "checkbox",

		// value: String
		//		As an initialization parameter, equivalent to value field on normal checkbox
		//		(if checked, the value is passed as the value when form is submitted).
		value: "on",

		// readOnly: Boolean
		//		Should this widget respond to user input?
		//		In markup, this is specified as "readOnly".
		//		Similar to disabled except readOnly form values are submitted.
		readOnly: false,
		
		// aria-pressed for toggle buttons, and aria-checked for checkboxes
		_aria_attr: "aria-checked",

		_setReadOnlyAttr: function(/*Boolean*/ value){
			this._set("readOnly", value);
			domAttr.set(this.focusNode, 'readOnly', value);
			this.focusNode.setAttribute("aria-readonly", value);
		},

		// Override dijit.form.Button._setLabelAttr() since we don't even have a containerNode.
		// Normally users won't try to set label, except when CheckBox or RadioButton is the child of a dojox.layout.TabContainer
		_setLabelAttr: undefined,

		postMixInProperties: function(){
			if(this.value == ""){
				this.value = "on";
			}
			this.inherited(arguments);
		},

		reset: function(){
			this.inherited(arguments);
			// Handle unlikely event that the <input type=checkbox> value attribute has changed
			this._set("value", this.params.value || "on");
			domAttr.set(this.focusNode, 'value', this.value);
		},

		_onClick: function(/*Event*/ e){
			// summary:
			//		Internal function to handle click actions - need to check
			//		readOnly, since button no longer does that check.
			if(this.readOnly){
				event.stop(e);
				return false;
			}
			return this.inherited(arguments);
		}
	});
});

},
'dojox/mobile/Button':function(){
define("dojox/mobile/Button", [
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dijit/_WidgetBase",
	"dijit/form/_ButtonMixin",
	"dijit/form/_FormWidgetMixin"
],
	function(array, declare, domClass, domConstruct, WidgetBase, ButtonMixin, FormWidgetMixin){

	/*=====
		WidgetBase = dijit._WidgetBase;
		FormWidgetMixin = dijit.form._FormWidgetMixin;
		ButtonMixin = dijit.form._ButtonMixin;
	=====*/
	return declare("dojox.mobile.Button", [WidgetBase, FormWidgetMixin, ButtonMixin], {
		// summary:
		//	Non-templated BUTTON widget with a thin API wrapper for click events and setting the label
		//
		// description:
		//              Buttons can display a label, an icon, or both.
		//              A label should always be specified (through innerHTML) or the label
		//              attribute.  It can be hidden via showLabel=false.
		// example:
		// |    <button dojoType="dijit.form.Button" onClick="...">Hello world</button>

		baseClass: "mblButton",

		// Override automatic assigning type --> node, it causes exception on IE.
		// Instead, type must be specified as this.type when the node is created, as part of the original DOM
		_setTypeAttr: null,

		// duration: Number
		//	duration of selection, milliseconds or -1 for no post-click CSS styling
		duration: 1000,

		_onClick: function(e){
			var ret = this.inherited(arguments);
			if(ret && this.duration >= 0){ // if its not a button with a state, then emulate press styles
				var button = this.focusNode || this.domNode;
				var newStateClasses = (this.baseClass+' '+this["class"]).split(" ");
				newStateClasses = array.map(newStateClasses, function(c){ return c+"Selected"; });
				domClass.add(button, newStateClasses);
				setTimeout(function(){
					domClass.remove(button, newStateClasses);
				}, this.duration);
			}
			return ret;
		},

		isFocusable: function(){ return false; },

		buildRendering: function(){
			if(!this.srcNodeRef){
				this.srcNodeRef = domConstruct.create("button", {"type": this.type});
			}else if(this._cv){
				var n = this.srcNodeRef.firstChild;
				if(n && n.nodeType === 3){
					n.nodeValue = this._cv(n.nodeValue);
				}
			}
			this.inherited(arguments);
			this.focusNode = this.domNode;
		},

		postCreate: function(){
			this.inherited(arguments);
			this.connect(this.domNode, "onclick", "_onClick");
		},

		_setLabelAttr: function(/*String*/ content){
			this.inherited(arguments, [this._cv ? this._cv(content) : content]);
		}
	});

});

},
'dojo/query':function(){
define("dojo/query", ["./_base/kernel", "./has", "./dom", "./on", "./_base/array", "./_base/lang", "./selector/_loader", "./selector/_loader!default"],
	function(dojo, has, dom, on, array, lang, loader, defaultEngine){
"use strict";

	has.add("array-extensible", function(){
		// test to see if we can extend an array (not supported in old IE)
		return lang.delegate([], {length: 1}).length == 1 && !has("bug-for-in-skips-shadowed");
	});
	
	var ap = Array.prototype, aps = ap.slice, apc = ap.concat, forEach = array.forEach;

	var tnl = function(/*Array*/ a, /*dojo.NodeList?*/ parent, /*Function?*/ NodeListCtor){
		// summary:
		//		decorate an array to make it look like a `dojo.NodeList`.
		// a:
		//		Array of nodes to decorate.
		// parent:
		//		An optional parent NodeList that generated the current
		//		list of nodes. Used to call _stash() so the parent NodeList
		//		can be accessed via end() later.
		// NodeListCtor:
		//		An optional constructor function to use for any
		//		new NodeList calls. This allows a certain chain of
		//		NodeList calls to use a different object than dojo.NodeList.
		var nodeList = new (NodeListCtor || this._NodeListCtor || nl)(a);
		return parent ? nodeList._stash(parent) : nodeList;
	};

	var loopBody = function(f, a, o){
		a = [0].concat(aps.call(a, 0));
		o = o || dojo.global;
		return function(node){
			a[0] = node;
			return f.apply(o, a);
		};
	};

	// adapters

	var adaptAsForEach = function(f, o){
		// summary:
		//		adapts a single node function to be used in the forEach-type
		//		actions. The initial object is returned from the specialized
		//		function.
		// f: Function
		//		a function to adapt
		// o: Object?
		//		an optional context for f
		return function(){
			this.forEach(loopBody(f, arguments, o));
			return this;	// Object
		};
	};

	var adaptAsMap = function(f, o){
		// summary:
		//		adapts a single node function to be used in the map-type
		//		actions. The return is a new array of values, as via `dojo.map`
		// f: Function
		//		a function to adapt
		// o: Object?
		//		an optional context for f
		return function(){
			return this.map(loopBody(f, arguments, o));
		};
	};

	var adaptAsFilter = function(f, o){
		// summary:
		//		adapts a single node function to be used in the filter-type actions
		// f: Function
		//		a function to adapt
		// o: Object?
		//		an optional context for f
		return function(){
			return this.filter(loopBody(f, arguments, o));
		};
	};

	var adaptWithCondition = function(f, g, o){
		// summary:
		//		adapts a single node function to be used in the map-type
		//		actions, behaves like forEach() or map() depending on arguments
		// f: Function
		//		a function to adapt
		// g: Function
		//		a condition function, if true runs as map(), otherwise runs as forEach()
		// o: Object?
		//		an optional context for f and g
		return function(){
			var a = arguments, body = loopBody(f, a, o);
			if(g.call(o || dojo.global, a)){
				return this.map(body);	// self
			}
			this.forEach(body);
			return this;	// self
		};
	};

	var NodeList = function(array){
		// summary:
		//		dojo.NodeList is an of Array-like object which adds syntactic
		//		sugar for chaining, common iteration operations, animation, and
		//		node manipulation. NodeLists are most often returned as the
		//		result of dojo.query() calls.
		// description:
		//		dojo.NodeList instances provide many utilities that reflect
		//		core Dojo APIs for Array iteration and manipulation, DOM
		//		manipulation, and event handling. Instead of needing to dig up
		//		functions in the dojo.* namespace, NodeLists generally make the
		//		full power of Dojo available for DOM manipulation tasks in a
		//		simple, chainable way.
		// example:
		//		create a node list from a node
		//		|	new dojo.NodeList(dojo.byId("foo"));
		// example:
		//		get a NodeList from a CSS query and iterate on it
		//		|	var l = dojo.query(".thinger");
		//		|	l.forEach(function(node, index, nodeList){
		//		|		console.log(index, node.innerHTML);
		//		|	});
		// example:
		//		use native and Dojo-provided array methods to manipulate a
		//		NodeList without needing to use dojo.* functions explicitly:
		//		|	var l = dojo.query(".thinger");
		//		|	// since NodeLists are real arrays, they have a length
		//		|	// property that is both readable and writable and
		//		|	// push/pop/shift/unshift methods
		//		|	console.log(l.length);
		//		|	l.push(dojo.create("span"));
		//		|
		//		|	// dojo's normalized array methods work too:
		//		|	console.log( l.indexOf(dojo.byId("foo")) );
		//		|	// ...including the special "function as string" shorthand
		//		|	console.log( l.every("item.nodeType == 1") );
		//		|
		//		|	// NodeLists can be [..] indexed, or you can use the at()
		//		|	// function to get specific items wrapped in a new NodeList:
		//		|	var node = l[3]; // the 4th element
		//		|	var newList = l.at(1, 3); // the 2nd and 4th elements
		// example:
		//		the style functions you expect are all there too:
		//		|	// style() as a getter...
		//		|	var borders = dojo.query(".thinger").style("border");
		//		|	// ...and as a setter:
		//		|	dojo.query(".thinger").style("border", "1px solid black");
		//		|	// class manipulation
		//		|	dojo.query("li:nth-child(even)").addClass("even");
		//		|	// even getting the coordinates of all the items
		//		|	var coords = dojo.query(".thinger").coords();
		// example:
		//		DOM manipulation functions from the dojo.* namespace area also
		//		available:
		//		|	// remove all of the elements in the list from their
		//		|	// parents (akin to "deleting" them from the document)
		//		|	dojo.query(".thinger").orphan();
		//		|	// place all elements in the list at the front of #foo
		//		|	dojo.query(".thinger").place("foo", "first");
		// example:
		//		Event handling couldn't be easier. `dojo.connect` is mapped in,
		//		and shortcut handlers are provided for most DOM events:
		//		|	// like dojo.connect(), but with implicit scope
		//		|	dojo.query("li").connect("onclick", console, "log");
		//		|
		//		|	// many common event handlers are already available directly:
		//		|	dojo.query("li").onclick(console, "log");
		//		|	var toggleHovered = dojo.hitch(dojo, "toggleClass", "hovered");
		//		|	dojo.query("p")
		//		|		.onmouseenter(toggleHovered)
		//		|		.onmouseleave(toggleHovered);
		// example:
		//		chainability is a key advantage of NodeLists:
		//		|	dojo.query(".thinger")
		//		|		.onclick(function(e){ /* ... */ })
		//		|		.at(1, 3, 8) // get a subset
		//		|			.style("padding", "5px")
		//		|			.forEach(console.log);
		var isNew = this instanceof nl && has("array-extensible");
		if(typeof array == "number"){
			array = Array(array);
		}
		var nodeArray = (array && "length" in array) ? array : arguments;
		if(isNew || !nodeArray.sort){
			// make sure it's a real array before we pass it on to be wrapped 
			var target = isNew ? this : [],
				l = target.length = nodeArray.length;
			for(var i = 0; i < l; i++){
				target[i] = nodeArray[i];
			}
			if(isNew){
				// called with new operator, this means we are going to use this instance and push
				// the nodes on to it. This is usually much faster since the NodeList properties
				//	don't need to be copied (unless the list of nodes is extremely large).
				return target;
			}
			nodeArray = target;
		}
		// called without new operator, use a real array and copy prototype properties,
		// this is slower and exists for back-compat. Should be removed in 2.0.
		lang._mixin(nodeArray, nlp);
		nodeArray._NodeListCtor = function(array){
			// call without new operator to preserve back-compat behavior
			return nl(array);
		};
		return nodeArray;
	};
	
	var nl = NodeList, nlp = nl.prototype = 
		has("array-extensible") ? [] : {};// extend an array if it is extensible

	// expose adapters and the wrapper as private functions

	nl._wrap = nlp._wrap = tnl;
	nl._adaptAsMap = adaptAsMap;
	nl._adaptAsForEach = adaptAsForEach;
	nl._adaptAsFilter  = adaptAsFilter;
	nl._adaptWithCondition = adaptWithCondition;

	// mass assignment

	// add array redirectors
	forEach(["slice", "splice"], function(name){
		var f = ap[name];
		//Use a copy of the this array via this.slice() to allow .end() to work right in the splice case.
		// CANNOT apply ._stash()/end() to splice since it currently modifies
		// the existing this array -- it would break backward compatibility if we copy the array before
		// the splice so that we can use .end(). So only doing the stash option to this._wrap for slice.
		nlp[name] = function(){ return this._wrap(f.apply(this, arguments), name == "slice" ? this : null); };
	});
	// concat should be here but some browsers with native NodeList have problems with it

	// add array.js redirectors
	forEach(["indexOf", "lastIndexOf", "every", "some"], function(name){
		var f = array[name];
		nlp[name] = function(){ return f.apply(dojo, [this].concat(aps.call(arguments, 0))); };
	});

	/*===== var NodeList = dojo.NodeList; =====*/
	lang.extend(NodeList, {
		// copy the constructors
		constructor: nl,
		_NodeListCtor: nl,
		toString: function(){
			// Array.prototype.toString can't be applied to objects, so we use join
			return this.join(",");
		},
		_stash: function(parent){
			// summary:
			//		private function to hold to a parent NodeList. end() to return the parent NodeList.
			//
			// example:
			// How to make a `dojo.NodeList` method that only returns the third node in
			// the dojo.NodeList but allows access to the original NodeList by using this._stash:
			//	|	dojo.extend(dojo.NodeList, {
			//	|		third: function(){
			//	|			var newNodeList = dojo.NodeList(this[2]);
			//	|			return newNodeList._stash(this);
			//	|		}
			//	|	});
			//	|	// then see how _stash applies a sub-list, to be .end()'ed out of
			//	|	dojo.query(".foo")
			//	|		.third()
			//	|			.addClass("thirdFoo")
			//	|		.end()
			//	|		// access to the orig .foo list
			//	|		.removeClass("foo")
			//	|
			//
			this._parent = parent;
			return this; //dojo.NodeList
		},

		on: function(eventName, listener){
			// summary:
			//		Listen for events on the nodes in the NodeList. Basic usage is:
			//		| query(".my-class").on("click", listener);
			// 		This supports event delegation by using selectors as the first argument with the event names as
			//		pseudo selectors. For example:
			//		| dojo.query("#my-list").on("li:click", listener);
			//		This will listen for click events within <li> elements that are inside the #my-list element.
			//		Because on supports CSS selector syntax, we can use comma-delimited events as well:
			//		| dojo.query("#my-list").on("li button:mouseover, li:click", listener);
			var handles = this.map(function(node){
				return on(node, eventName, listener); // TODO: apply to the NodeList so the same selector engine is used for matches
			});
			handles.remove = function(){
				for(var i = 0; i < handles.length; i++){
					handles[i].remove();
				}
			};
			return handles;
		},

		end: function(){
			// summary:
			//		Ends use of the current `dojo.NodeList` by returning the previous dojo.NodeList
			//		that generated the current dojo.NodeList.
			// description:
			//		Returns the `dojo.NodeList` that generated the current `dojo.NodeList`. If there
			//		is no parent dojo.NodeList, an empty dojo.NodeList is returned.
			// example:
			//	|	dojo.query("a")
			//	|		.filter(".disabled")
			//	|			// operate on the anchors that only have a disabled class
			//	|			.style("color", "grey")
			//	|		.end()
			//	|		// jump back to the list of anchors
			//	|		.style(...)
			//
			if(this._parent){
				return this._parent;
			}else{
				//Just return empty list.
				return new this._NodeListCtor(0);
			}
		},

		// http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array#Methods

		// FIXME: handle return values for #3244
		//		http://trac.dojotoolkit.org/ticket/3244

		// FIXME:
		//		need to wrap or implement:
		//			join (perhaps w/ innerHTML/outerHTML overload for toString() of items?)
		//			reduce
		//			reduceRight

		/*=====
		slice: function(begin, end){
			// summary:
			//		Returns a new NodeList, maintaining this one in place
			// description:
			//		This method behaves exactly like the Array.slice method
			//		with the caveat that it returns a dojo.NodeList and not a
			//		raw Array. For more details, see Mozilla's (slice
			//		documentation)[http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:slice]
			// begin: Integer
			//		Can be a positive or negative integer, with positive
			//		integers noting the offset to begin at, and negative
			//		integers denoting an offset from the end (i.e., to the left
			//		of the end)
			// end: Integer?
			//		Optional parameter to describe what position relative to
			//		the NodeList's zero index to end the slice at. Like begin,
			//		can be positive or negative.
			return this._wrap(a.slice.apply(this, arguments));
		},

		splice: function(index, howmany, item){
			// summary:
			//		Returns a new NodeList, manipulating this NodeList based on
			//		the arguments passed, potentially splicing in new elements
			//		at an offset, optionally deleting elements
			// description:
			//		This method behaves exactly like the Array.splice method
			//		with the caveat that it returns a dojo.NodeList and not a
			//		raw Array. For more details, see Mozilla's (splice
			//		documentation)[http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:splice]
			//		For backwards compatibility, calling .end() on the spliced NodeList
			//		does not return the original NodeList -- splice alters the NodeList in place.
			// index: Integer
			//		begin can be a positive or negative integer, with positive
			//		integers noting the offset to begin at, and negative
			//		integers denoting an offset from the end (i.e., to the left
			//		of the end)
			// howmany: Integer?
			//		Optional parameter to describe what position relative to
			//		the NodeList's zero index to end the slice at. Like begin,
			//		can be positive or negative.
			// item: Object...?
			//		Any number of optional parameters may be passed in to be
			//		spliced into the NodeList
			// returns:
			//		dojo.NodeList
			return this._wrap(a.splice.apply(this, arguments));
		},

		indexOf: function(value, fromIndex){
			// summary:
			//		see dojo.indexOf(). The primary difference is that the acted-on
			//		array is implicitly this NodeList
			// value: Object:
			//		The value to search for.
			// fromIndex: Integer?:
			//		The location to start searching from. Optional. Defaults to 0.
			// description:
			//		For more details on the behavior of indexOf, see Mozilla's
			//		(indexOf
			//		docs)[http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:indexOf]
			// returns:
			//		Positive Integer or 0 for a match, -1 of not found.
			return d.indexOf(this, value, fromIndex); // Integer
		},

		lastIndexOf: function(value, fromIndex){
			// summary:
			//		see dojo.lastIndexOf(). The primary difference is that the
			//		acted-on array is implicitly this NodeList
			// description:
			//		For more details on the behavior of lastIndexOf, see
			//		Mozilla's (lastIndexOf
			//		docs)[http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:lastIndexOf]
			// value: Object
			//		The value to search for.
			// fromIndex: Integer?
			//		The location to start searching from. Optional. Defaults to 0.
			// returns:
			//		Positive Integer or 0 for a match, -1 of not found.
			return d.lastIndexOf(this, value, fromIndex); // Integer
		},

		every: function(callback, thisObject){
			// summary:
			//		see `dojo.every()` and the (Array.every
			//		docs)[http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:every].
			//		Takes the same structure of arguments and returns as
			//		dojo.every() with the caveat that the passed array is
			//		implicitly this NodeList
			// callback: Function: the callback
			// thisObject: Object?: the context
			return d.every(this, callback, thisObject); // Boolean
		},

		some: function(callback, thisObject){
			// summary:
			//		Takes the same structure of arguments and returns as
			//		`dojo.some()` with the caveat that the passed array is
			//		implicitly this NodeList.  See `dojo.some()` and Mozilla's
			//		(Array.some
			//		documentation)[http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:some].
			// callback: Function: the callback
			// thisObject: Object?: the context
			return d.some(this, callback, thisObject); // Boolean
		},
		=====*/

		concat: function(item){
			// summary:
			//		Returns a new NodeList comprised of items in this NodeList
			//		as well as items passed in as parameters
			// description:
			//		This method behaves exactly like the Array.concat method
			//		with the caveat that it returns a `dojo.NodeList` and not a
			//		raw Array. For more details, see the (Array.concat
			//		docs)[http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:concat]
			// item: Object?
			//		Any number of optional parameters may be passed in to be
			//		spliced into the NodeList
			// returns:
			//		dojo.NodeList

			//return this._wrap(apc.apply(this, arguments));
			// the line above won't work for the native NodeList :-(

			// implementation notes:
			// 1) Native NodeList is not an array, and cannot be used directly
			// in concat() --- the latter doesn't recognize it as an array, and
			// does not inline it, but append as a single entity.
			// 2) On some browsers (e.g., Safari) the "constructor" property is
			// read-only and cannot be changed. So we have to test for both
			// native NodeList and dojo.NodeList in this property to recognize
			// the node list.

			var t = lang.isArray(this) ? this : aps.call(this, 0),
				m = array.map(arguments, function(a){
					return a && !lang.isArray(a) &&
						(typeof NodeList != "undefined" && a.constructor === NodeList || a.constructor === this._NodeListCtor) ?
							aps.call(a, 0) : a;
				});
			return this._wrap(apc.apply(t, m), this);	// dojo.NodeList
		},

		map: function(/*Function*/ func, /*Function?*/ obj){
			// summary:
			//		see dojo.map(). The primary difference is that the acted-on
			//		array is implicitly this NodeList and the return is a
			//		dojo.NodeList (a subclass of Array)
			///return d.map(this, func, obj, d.NodeList); // dojo.NodeList
			return this._wrap(array.map(this, func, obj), this); // dojo.NodeList
		},

		forEach: function(callback, thisObj){
			// summary:
			//		see `dojo.forEach()`. The primary difference is that the acted-on
			//		array is implicitly this NodeList. If you want the option to break out
			//		of the forEach loop, use every() or some() instead.
			forEach(this, callback, thisObj);
			// non-standard return to allow easier chaining
			return this; // dojo.NodeList
		},
		filter: function(/*String|Function*/ filter){
			// summary:
			//		"masks" the built-in javascript filter() method (supported
			//		in Dojo via `dojo.filter`) to support passing a simple
			//		string filter in addition to supporting filtering function
			//		objects.
			// filter:
			//		If a string, a CSS rule like ".thinger" or "div > span".
			// example:
			//		"regular" JS filter syntax as exposed in dojo.filter:
			//		|	dojo.query("*").filter(function(item){
			//		|		// highlight every paragraph
			//		|		return (item.nodeName == "p");
			//		|	}).style("backgroundColor", "yellow");
			// example:
			//		the same filtering using a CSS selector
			//		|	dojo.query("*").filter("p").styles("backgroundColor", "yellow");

			var a = arguments, items = this, start = 0;
			if(typeof filter == "string"){ // inline'd type check
				items = query._filterResult(this, a[0]);
				if(a.length == 1){
					// if we only got a string query, pass back the filtered results
					return items._stash(this); // dojo.NodeList
				}
				// if we got a callback, run it over the filtered items
				start = 1;
			}
			return this._wrap(array.filter(items, a[start], a[start + 1]), this);	// dojo.NodeList
		},
		instantiate: function(/*String|Object*/ declaredClass, /*Object?*/ properties){
			// summary:
			//		Create a new instance of a specified class, using the
			//		specified properties and each node in the nodeList as a
			//		srcNodeRef.
			// example:
			//		Grabs all buttons in the page and converts them to diji.form.Buttons.
			//	|	var buttons = dojo.query("button").instantiate("dijit.form.Button", {showLabel: true});
			var c = lang.isFunction(declaredClass) ? declaredClass : lang.getObject(declaredClass);
			properties = properties || {};
			return this.forEach(function(node){
				new c(properties, node);
			});	// dojo.NodeList
		},
		at: function(/*===== index =====*/){
			// summary:
			//		Returns a new NodeList comprised of items in this NodeList
			//		at the given index or indices.
			//
			// index: Integer...
			//		One or more 0-based indices of items in the current
			//		NodeList. A negative index will start at the end of the
			//		list and go backwards.
			//
			// example:
			//	Shorten the list to the first, second, and third elements
			//	|	dojo.query("a").at(0, 1, 2).forEach(fn);
			//
			// example:
			//	Retrieve the first and last elements of a unordered list:
			//	|	dojo.query("ul > li").at(0, -1).forEach(cb);
			//
			// example:
			//	Do something for the first element only, but end() out back to
			//	the original list and continue chaining:
			//	|	dojo.query("a").at(0).onclick(fn).end().forEach(function(n){
			//	|		console.log(n); // all anchors on the page.
			//	|	})
			//
			// returns:
			//		dojo.NodeList
			var t = new this._NodeListCtor(0);
			forEach(arguments, function(i){
				if(i < 0){ i = this.length + i; }
				if(this[i]){ t.push(this[i]); }
			}, this);
			return t._stash(this); // dojo.NodeList
		}
	});


/*===== 
dojo.query = function(selector, context){
	// summary:
	//		This modules provides DOM querying functionality. The module export is a function
	//		that can be used to query for DOM nodes by CSS selector and returns a dojo.NodeList
	//		representing the matching nodes.
	//
	// selector: String
	//		A CSS selector to search for.
	// context: String|DomNode?
	//		An optional context to limit the searching scope. Only nodes under `context` will be 
	//		scanned. 
	// 
	//	example:
	//		add an onclick handler to every submit button in the document
	//		which causes the form to be sent via Ajax instead:
	//	|	define(["dojo/query"], function(query){
	// 	|	query("input[type='submit']").on("click", function(e){
	//	|		dojo.stopEvent(e); // prevent sending the form
	//	|		var btn = e.target;
	//	|		dojo.xhrPost({
	//	|			form: btn.form,
	//	|			load: function(data){
	//	|				// replace the form with the response
	//	|				var div = dojo.doc.createElement("div");
	//	|				dojo.place(div, btn.form, "after");
	//	|				div.innerHTML = data;
	//	|				dojo.style(btn.form, "display", "none");
	//	|			}
	//	|		});
	//	|	}); 
	//
	// description:
	//		dojo/query is responsible for loading the appropriate query engine and wrapping 
	//		its results with a `dojo.NodeList`. You can use dojo/query with a specific selector engine
	//		by using it as a plugin. For example, if you installed the sizzle package, you could
	//		use it as the selector engine with:
	//		|	define("dojo/query!sizzle", function(query){
	//		|		query("div")...
	//
	//		The id after the ! can be a module id of the selector engine or one of the following values:
	//		|	+ acme: This is the default engine used by Dojo base, and will ensure that the full
	//		|	Acme engine is always loaded. 
	//		|	
	//		|	+ css2: If the browser has a native selector engine, this will be used, otherwise a
	//		|	very minimal lightweight selector engine will be loaded that can do simple CSS2 selectors
	//		|	(by #id, .class, tag, and [name=value] attributes, with standard child or descendant (>)
	//		|	operators) and nothing more.
	//		|
	//		|	+ css2.1: If the browser has a native selector engine, this will be used, otherwise the
	//		|	full Acme engine will be loaded. 
	//		|	
	//		|	+ css3: If the browser has a native selector engine with support for CSS3 pseudo
	//		|	selectors (most modern browsers except IE8), this will be used, otherwise the
	//		|	full Acme engine will be loaded.
	//		|	
	//		|	+ Or the module id of a selector engine can be used to explicitly choose the selector engine
	//		
	//		For example, if you are using CSS3 pseudo selectors in module, you can specify that
	//		you will need support them with:
	//		|	define("dojo/query!css3", function(query){
	//		|		query('#t > h3:nth-child(odd)')...
	//
	//		You can also choose the selector engine/load configuration by setting the <FIXME:what is the configuration setting?>.
	//		For example:
	//		|	<script data-dojo-config="query-selector:'css3'" src="dojo.js"></script>
	//		
	return new dojo.NodeList(); // dojo.NodeList
};
=====*/

function queryForEngine(engine, NodeList){
	var query = function(/*String*/ query, /*String|DOMNode?*/ root){
		//	summary:
		//		Returns nodes which match the given CSS selector, searching the
		//		entire document by default but optionally taking a node to scope
		//		the search by. Returns an instance of dojo.NodeList.
		if(typeof root == "string"){
			root = dom.byId(root);
			if(!root){
				return new NodeList([]);
			}
		}
		var results = typeof query == "string" ? engine(query, root) : query.orphan ? query : [query];
		if(results.orphan){
			// already wrapped
			return results; 
		}
		return new NodeList(results);
	};
	query.matches = engine.match || function(node, selector, root){
		// summary:
		//		Test to see if a node matches a selector
		return query.filter([node], selector, root).length > 0;
	};
	// the engine provides a filtering function, use it to for matching
	query.filter = engine.filter || function(nodes, selector, root){
		// summary:
		//		Filters an array of nodes. Note that this does not guarantee to return a dojo.NodeList, just an array.
		return query(selector, root).filter(function(node){
			return array.indexOf(nodes, node) > -1;
		});
	};
	if(typeof engine != "function"){
		var search = engine.search;
		engine = function(selector, root){
			// Slick does it backwards (or everyone else does it backwards, probably the latter)
			return search(root || document, selector);
		};
	}
	return query;
}
var query = queryForEngine(defaultEngine, NodeList);
// the query that is returned from this module is slightly different than dojo.query,
// because dojo.query has to maintain backwards compatibility with returning a
// true array which has performance problems. The query returned from the module
// does not use true arrays, but rather inherits from Array, making it much faster to
// instantiate.
dojo.query = queryForEngine(defaultEngine, function(array){
	// call it without the new operator to invoke the back-compat behavior that returns a true array
	return NodeList(array);
});

query.load = /*===== dojo.query.load= ======*/ function(id, parentRequire, loaded, config){
	// summary: can be used as AMD plugin to conditionally load new query engine
	// example:
	//	|	define(["dojo/query!custom"], function(qsa){ 
	//	|		// loaded selector/custom.js as engine
	//	|		qsa("#foobar").forEach(...);
	//	|	});
	loader.load(id, parentRequire, function(engine){
		loaded(queryForEngine(engine, NodeList));
	});
};

dojo._filterQueryResult = query._filterResult = function(nodes, selector, root){
	return new NodeList(query.filter(nodes, selector, root));
};
dojo.NodeList = query.NodeList = NodeList;
return query;
});

},
'dojox/mobile/_ScrollableMixin':function(){
define("dojox/mobile/_ScrollableMixin", [
	"dojo/_base/kernel",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/dom",
	"dojo/dom-class",
	"dijit/registry",	// registry.byNode
	"./scrollable"
], function(dojo, declare, lang, win, dom, domClass, registry, Scrollable){
	// module:
	//		dojox/mobile/_ScrollableMixin
	// summary:
	//		Mixin for widgets to have a touch scrolling capability.

	var cls = declare("dojox.mobile._ScrollableMixin", null, {
		// summary:
		//		Mixin for widgets to have a touch scrolling capability.
		// description:
		//		Actual implementation is in scrollable.js.
		//		scrollable.js is not a dojo class, but just a collection
		//		of functions. This module makes scrollable.js a dojo class.

		// fixedHeader: String
		//		Id of the fixed header.
		fixedHeader: "",

		// fixedFooter: String
		//		Id of the fixed footer.
		fixedFooter: "",

		// scrollableParams: Object
		//		Parameters for dojox.mobile.scrollable.init().
		scrollableParams: null,

		// allowNestedScrolls: Boolean
		//		e.g. Allow ScrollableView in a SwapView.
		allowNestedScrolls: true,

		constructor: function(){
			this.scrollableParams = {};
		},

		destroy: function(){
			this.cleanup();
			this.inherited(arguments);
		},

		startup: function(){
			if(this._started){ return; }
			var node;
			var params = this.scrollableParams;
			if(this.fixedHeader){
				node = dom.byId(this.fixedHeader);
				if(node.parentNode == this.domNode){ // local footer
					this.isLocalHeader = true;
				}
				params.fixedHeaderHeight = node.offsetHeight;
			}
			if(this.fixedFooter){
				node = dom.byId(this.fixedFooter);
				if(node.parentNode == this.domNode){ // local footer
					this.isLocalFooter = true;
					node.style.bottom = "0px";
				}
				params.fixedFooterHeight = node.offsetHeight;
			}
			this.init(params);
			if(this.allowNestedScrolls){
				for(var p = this.getParent(); p; p = p.getParent()){
					if(p && p.scrollableParams){
						this.isNested = true;
						this.dirLock = true;
						p.dirLock = true;
						break;
					}
				}
			}
			this.inherited(arguments);
		},

		findAppBars: function(){
			// summary:
			//		Search for application-specific header or footer.
			var i, len, c;
			for(i = 0, len = win.body().childNodes.length; i < len; i++){
				c = win.body().childNodes[i];
				this.checkFixedBar(c, false);
			}
			if(this.domNode.parentNode){
				for(i = 0, len = this.domNode.parentNode.childNodes.length; i < len; i++){
					c = this.domNode.parentNode.childNodes[i];
					this.checkFixedBar(c, false);
				}
			}
			this.fixedFooterHeight = this.fixedFooter ? this.fixedFooter.offsetHeight : 0;
		},

		checkFixedBar: function(/*DomNode*/node, /*Boolean*/local){
			// summary:
			//		Checks if the given node is a fixed bar or not.
			if(node.nodeType === 1){
				var fixed = node.getAttribute("fixed")
					|| (registry.byNode(node) && registry.byNode(node).fixed);
				if(fixed === "top"){
					domClass.add(node, "mblFixedHeaderBar");
					if(local){
						node.style.top = "0px";
						this.fixedHeader = node;
					}
					return fixed;
				}else if(fixed === "bottom"){
					domClass.add(node, "mblFixedBottomBar");
					this.fixedFooter = node;
					return fixed;
				}
			}
			return null;
		}
	});
	lang.extend(cls, new Scrollable(dojo, dojox));
	return cls;
});

},
'dojox/mobile/Switch':function(){
define("dojox/mobile/Switch", [
	"dojo/_base/array",
	"dojo/_base/connect",
	"dojo/_base/declare",
	"dojo/_base/event",
	"dojo/_base/window",
	"dojo/dom-class",
	"dijit/_Contained",
	"dijit/_WidgetBase",
	"./sniff"
], function(array, connect, declare, event, win, domClass, Contained, WidgetBase, has){

/*=====
	Contained = dijit._Contained;
	WidgetBase = dijit._WidgetBase;
=====*/

	// module:
	//		dojox/mobile/Switch
	// summary:
	//		A toggle switch with a sliding knob.

	return declare("dojox.mobile.Switch", [WidgetBase, Contained],{
		// summary:
		//		A toggle switch with a sliding knob.
		// description:
		//		Switch is a toggle switch with a sliding knob. You can either
		//		tap or slide the knob to toggle the switch. The onStateChanged
		//		handler is called when the switch is manipulated.

		// value: String
		//		The initial state of the switch. "on" or "off". The default
		//		value is "on".
		value: "on",

		// name: String
		//		A name for a hidden input field, which holds the current value.
		name: "",

		// leftLabel: String
		//		The left-side label of the switch.
		leftLabel: "ON",

		// rightLabel: String
		//		The right-side label of the switch.
		rightLabel: "OFF",

		/* internal properties */	
		_width: 53,

		buildRendering: function(){
			this.domNode = win.doc.createElement("DIV");
			var c = (this.srcNodeRef && this.srcNodeRef.className) || this.className || this["class"];
			this._swClass = (c || "").replace(/ .*/,"");
			this.domNode.className = "mblSwitch";
			var nameAttr = this.name ? " name=\"" + this.name + "\"" : "";
			this.domNode.innerHTML =
				  '<div class="mblSwitchInner">'
				+	'<div class="mblSwitchBg mblSwitchBgLeft">'
				+		'<div class="mblSwitchText mblSwitchTextLeft"></div>'
				+	'</div>'
				+	'<div class="mblSwitchBg mblSwitchBgRight">'
				+		'<div class="mblSwitchText mblSwitchTextRight"></div>'
				+	'</div>'
				+	'<div class="mblSwitchKnob"></div>'
				+	'<input type="hidden"'+nameAttr+'></div>'
				+ '</div>';
			var n = this.inner = this.domNode.firstChild;
			this.left = n.childNodes[0];
			this.right = n.childNodes[1];
			this.knob = n.childNodes[2];
			this.input = n.childNodes[3];
		},

		postCreate: function(){
			this.connect(this.domNode, "onclick", "onClick");
			this.connect(this.domNode, has("touch") ? "touchstart" : "onmousedown", "onTouchStart");
			this._initialValue = this.value; // for reset()
		},

		_changeState: function(/*String*/state, /*Boolean*/anim){
			var on = (state === "on");
			this.left.style.display = "";
			this.right.style.display = "";
			this.inner.style.left = "";
			if(anim){
				domClass.add(this.domNode, "mblSwitchAnimation");
			}
			domClass.remove(this.domNode, on ? "mblSwitchOff" : "mblSwitchOn");
			domClass.add(this.domNode, on ? "mblSwitchOn" : "mblSwitchOff");
	
			var _this = this;
			setTimeout(function(){
				_this.left.style.display = on ? "" : "none";
				_this.right.style.display = !on ? "" : "none";
				domClass.remove(_this.domNode, "mblSwitchAnimation");
			}, anim ? 300 : 0);
		},

		startup: function(){
			if(this._swClass.indexOf("Round") != -1){
				var r = Math.round(this.domNode.offsetHeight / 2);
				this.createRoundMask(this._swClass, r, this.domNode.offsetWidth);
			}
		},
	
		createRoundMask: function(className, r, w){
			if(!has("webkit") || !className){ return; }
			if(!this._createdMasks){ this._createdMasks = []; }
			if(this._createdMasks[className]){ return; }
			this._createdMasks[className] = 1;
	
			var ctx = win.doc.getCSSCanvasContext("2d", className+"Mask", w, 100);
			ctx.fillStyle = "#000000";
			ctx.beginPath();
			ctx.moveTo(r, 0);
			ctx.arcTo(0, 0, 0, 2*r, r);
			ctx.arcTo(0, 2*r, r, 2*r, r);
			ctx.lineTo(w - r, 2*r);
			ctx.arcTo(w, 2*r, w, r, r);
			ctx.arcTo(w, 0, w - r, 0, r);
			ctx.closePath();
			ctx.fill();
		},
	
		onClick: function(e){
			if(this._moved){ return; }
			this.value = this.input.value = (this.value == "on") ? "off" : "on";
			this._changeState(this.value, true);
			this.onStateChanged(this.value);
		},
	
		onTouchStart: function(e){
			// summary:
			//		Internal function to handle touchStart events.
			this._moved = false;
			this.innerStartX = this.inner.offsetLeft;
			if(!this._conn){
				this._conn = [];
				this._conn.push(connect.connect(this.inner, has("touch") ? "touchmove" : "onmousemove", this, "onTouchMove"));
				this._conn.push(connect.connect(this.inner, has("touch") ? "touchend" : "onmouseup", this, "onTouchEnd"));
			}
			this.touchStartX = e.touches ? e.touches[0].pageX : e.clientX;
			this.left.style.display = "";
			this.right.style.display = "";
			event.stop(e);
		},
	
		onTouchMove: function(e){
			// summary:
			//		Internal function to handle touchMove events.
			e.preventDefault();
			var dx;
			if(e.targetTouches){
				if(e.targetTouches.length != 1){ return false; }
				dx = e.targetTouches[0].clientX - this.touchStartX;
			}else{
				dx = e.clientX - this.touchStartX;
			}
			var pos = this.innerStartX + dx;
			var d = 10;
			if(pos <= -(this._width-d)){ pos = -this._width; }
			if(pos >= -d){ pos = 0; }
			this.inner.style.left = pos + "px";
			if(Math.abs(dx) > d){
				this._moved = true;
			}
		},
	
		onTouchEnd: function(e){
			// summary:
			//		Internal function to handle touchEnd events.
			array.forEach(this._conn, connect.disconnect);
			this._conn = null;
			if(this.innerStartX == this.inner.offsetLeft){
				if(has("touch")){
					var ev = win.doc.createEvent("MouseEvents");
					ev.initEvent("click", true, true);
					this.inner.dispatchEvent(ev);
				}
				return;
			}
			var newState = (this.inner.offsetLeft < -(this._width/2)) ? "off" : "on";
			this._changeState(newState, true);
			if(newState != this.value){
				this.value = this.input.value = newState;
				this.onStateChanged(newState);
			}
		},
	
		onStateChanged: function(/*String*/newState){
			// summary:
			//		Stub function to connect to from your application.
			// description:
			//		Called when the state has been changed.
		},
	
		_setValueAttr: function(/*String*/value){
			this._changeState(value, false);
			if(this.value != value){
				this.onStateChanged(value);
			}
			this.value = this.input.value = value;
		},
	
		_setLeftLabelAttr: function(/*String*/label){
			this.leftLabel = label;
			this.left.firstChild.innerHTML = this._cv ? this._cv(label) : label;
		},
	
		_setRightLabelAttr: function(/*String*/label){
			this.rightLabel = label;
			this.right.firstChild.innerHTML = this._cv ? this._cv(label) : label;
		},

		reset: function(){
			// summary:
			//		Reset the widget's value to what it was at initialization time
			this.set("value", this._initialValue);
		}
	});
});

},
'dijit/form/_ToggleButtonMixin':function(){
define("dijit/form/_ToggleButtonMixin", [
	"dojo/_base/declare", // declare
	"dojo/dom-attr" // domAttr.set
], function(declare, domAttr){

// module:
//		dijit/form/_ToggleButtonMixin
// summary:
//		A mixin to provide functionality to allow a button that can be in two states (checked or not).

return declare("dijit.form._ToggleButtonMixin", null, {
	// summary:
	//		A mixin to provide functionality to allow a button that can be in two states (checked or not).

	// checked: Boolean
	//		Corresponds to the native HTML <input> element's attribute.
	//		In markup, specified as "checked='checked'" or just "checked".
	//		True if the button is depressed, or the checkbox is checked,
	//		or the radio button is selected, etc.
	checked: false,

	// aria-pressed for toggle buttons, and aria-checked for checkboxes
	_aria_attr: "aria-pressed",

	_onClick: function(/*Event*/ evt){
		var original = this.checked;
		this._set('checked', !original); // partially set the toggled value, assuming the toggle will work, so it can be overridden in the onclick handler
		var ret = this.inherited(arguments); // the user could reset the value here
		this.set('checked', ret ? this.checked : original); // officially set the toggled or user value, or reset it back
		return ret;
	},

	_setCheckedAttr: function(/*Boolean*/ value, /*Boolean?*/ priorityChange){
		this._set("checked", value);
		domAttr.set(this.focusNode || this.domNode, "checked", value);
		(this.focusNode || this.domNode).setAttribute(this._aria_attr, value ? "true" : "false"); // aria values should be strings
		this._handleOnChange(value, priorityChange);
	},

	reset: function(){
		// summary:
		//		Reset the widget's value to what it was at initialization time

		this._hasBeenBlurred = false;

		// set checked state to original setting
		this.set('checked', this.params.checked || false);
	}
});

});

},
'dojo/dom-class':function(){
define("dojo/dom-class", ["./_base/lang", "./_base/array", "./dom"], function(lang, array, dom){
	// module:
	//		dojo/dom-class
	// summary:
	//		This module defines the core dojo DOM class API.

	var className = "className";

	/* Part I of classList-based implementation is preserved here for posterity
	var classList = "classList";
	has.add("dom-classList", function(){
		return classList in document.createElement("p");
	});
	*/

	// =============================
	// (CSS) Class Functions
	// =============================

	/*=====
	dojo.hasClass = function(node, classStr){
		// summary:
		//		Returns whether or not the specified classes are a portion of the
		//		class list currently applied to the node.
		//
		// node: String|DOMNode
		//		String ID or DomNode reference to check the class for.
		//
		// classStr: String
		//		A string class name to look for.
		//
		// returns: Boolean
		//
		// example:
		//		Do something if a node with id="someNode" has class="aSillyClassName" present
		//	|	if(dojo.hasClass("someNode","aSillyClassName")){ ... }
	};
	=====*/

	/*=====
	dojo.addClass = function(node, classStr){
		// summary:
		//		Adds the specified classes to the end of the class list on the
		//		passed node. Will not re-apply duplicate classes.
		//
		// node: String|DOMNode
		//		String ID or DomNode reference to add a class string too
		//
		// classStr: String|Array
		//		A String class name to add, or several space-separated class names,
		//		or an array of class names.
		//
		// example:
		//		Add a class to some node:
		//	|	dojo.addClass("someNode", "anewClass");
		//
		// example:
		//		Add two classes at once:
		//	|	dojo.addClass("someNode", "firstClass secondClass");
		//
		// example:
		//		Add two classes at once (using array):
		//	|	dojo.addClass("someNode", ["firstClass", "secondClass"]);
		//
		// example:
		//		Available in `dojo.NodeList` for multiple additions
		//	|	dojo.query("ul > li").addClass("firstLevel");
	};
	=====*/

	/*=====
	dojo.removeClass = function(node, classStr){
		// summary:
		//		Removes the specified classes from node. No `dojo.hasClass`
		//		check is required.
		//
		// node: String|DOMNode
		//		String ID or DomNode reference to remove the class from.
		//
		// classStr: String|Array
		//		An optional String class name to remove, or several space-separated
		//		class names, or an array of class names. If omitted, all class names
		//		will be deleted.
		//
		// example:
		//		Remove a class from some node:
		//	|	dojo.removeClass("someNode", "firstClass");
		//
		// example:
		//		Remove two classes from some node:
		//	|	dojo.removeClass("someNode", "firstClass secondClass");
		//
		// example:
		//		Remove two classes from some node (using array):
		//	|	dojo.removeClass("someNode", ["firstClass", "secondClass"]);
		//
		// example:
		//		Remove all classes from some node:
		//	|	dojo.removeClass("someNode");
		//
		// example:
		//		Available in `dojo.NodeList()` for multiple removal
		//	|	dojo.query(".foo").removeClass("foo");
	};
	=====*/

	/*=====
	dojo.replaceClass = function(node, addClassStr, removeClassStr){
		// summary:
		//		Replaces one or more classes on a node if not present.
		//		Operates more quickly than calling dojo.removeClass and dojo.addClass
		//
		// node: String|DOMNode
		//		String ID or DomNode reference to remove the class from.
		//
		// addClassStr: String|Array
		//		A String class name to add, or several space-separated class names,
		//		or an array of class names.
		//
		// removeClassStr: String|Array?
		//		A String class name to remove, or several space-separated class names,
		//		or an array of class names.
		//
		// example:
		//	|	dojo.replaceClass("someNode", "add1 add2", "remove1 remove2");
		//
		// example:
		//	Replace all classes with addMe
		//	|	dojo.replaceClass("someNode", "addMe");
		//
		// example:
		//	Available in `dojo.NodeList()` for multiple toggles
		//	|	dojo.query(".findMe").replaceClass("addMe", "removeMe");
	};
	=====*/

	/*=====
	dojo.toggleClass = function(node, classStr, condition){
		// summary:
		//		Adds a class to node if not present, or removes if present.
		//		Pass a boolean condition if you want to explicitly add or remove.
		//      Returns the condition that was specified directly or indirectly.
		//
		// node: String|DOMNode
		//		String ID or DomNode reference to toggle a class string
		//
		// classStr: String|Array
		//		A String class name to toggle, or several space-separated class names,
		//		or an array of class names.
		//
		// condition:
		//		If passed, true means to add the class, false means to remove.
		//      Otherwise dojo.hasClass(node, classStr) is used to detect the class presence.
		//
		// example:
		//	|	dojo.toggleClass("someNode", "hovered");
		//
		// example:
		//		Forcefully add a class
		//	|	dojo.toggleClass("someNode", "hovered", true);
		//
		// example:
		//		Available in `dojo.NodeList()` for multiple toggles
		//	|	dojo.query(".toggleMe").toggleClass("toggleMe");
	};
	=====*/

	var cls, // exports object
		spaces = /\s+/, a1 = [""];

	function str2array(s){
		if(typeof s == "string" || s instanceof String){
			if(s && !spaces.test(s)){
				a1[0] = s;
				return a1;
			}
			var a = s.split(spaces);
			if(a.length && !a[0]){
				a.shift();
			}
			if(a.length && !a[a.length - 1]){
				a.pop();
			}
			return a;
		}
		// assumed to be an array
		if(!s){
			return [];
		}
		return array.filter(s, function(x){ return x; });
	}

	/* Part II of classList-based implementation is preserved here for posterity
	if(has("dom-classList")){
		// new classList version
		cls = {
			contains: function containsClass(node, classStr){
				var clslst = classStr && dom.byId(node)[classList];
				return clslst && clslst.contains(classStr); // Boolean
			},

			add: function addClass(node, classStr){
				node = dom.byId(node);
				classStr = str2array(classStr);
				for(var i = 0, len = classStr.length; i < len; ++i){
					node[classList].add(classStr[i]);
				}
			},

			remove: function removeClass(node, classStr){
				node = dom.byId(node);
				if(classStr === undefined){
					node[className] = "";
				}else{
					classStr = str2array(classStr);
					for(var i = 0, len = classStr.length; i < len; ++i){
						node[classList].remove(classStr[i]);
					}
				}
			},

			replace: function replaceClass(node, addClassStr, removeClassStr){
				node = dom.byId(node);
				if(removeClassStr === undefined){
					node[className] = "";
				}else{
					removeClassStr = str2array(removeClassStr);
					for(var i = 0, len = removeClassStr.length; i < len; ++i){
						node[classList].remove(removeClassStr[i]);
					}
				}
				addClassStr = str2array(addClassStr);
				for(i = 0, len = addClassStr.length; i < len; ++i){
					node[classList].add(addClassStr[i]);
				}
			},

			toggle: function toggleClass(node, classStr, condition){
				node = dom.byId(node);
				if(condition === undefined){
					classStr = str2array(classStr);
					for(var i = 0, len = classStr.length; i < len; ++i){
						node[classList].toggle(classStr[i]);
					}
				}else{
					cls[condition ? "add" : "remove"](node, classStr);
				}
				return condition;   // Boolean
			}
		}
	}
	*/

	// regular DOM version
	var fakeNode = {};  // for effective replacement
	cls = {
		contains: function containsClass(/*DomNode|String*/node, /*String*/classStr){
			return ((" " + dom.byId(node)[className] + " ").indexOf(" " + classStr + " ") >= 0); // Boolean
		},

		add: function addClass(/*DomNode|String*/node, /*String|Array*/classStr){
			node = dom.byId(node);
			classStr = str2array(classStr);
			var cls = node[className], oldLen;
			cls = cls ? " " + cls + " " : " ";
			oldLen = cls.length;
			for(var i = 0, len = classStr.length, c; i < len; ++i){
				c = classStr[i];
				if(c && cls.indexOf(" " + c + " ") < 0){
					cls += c + " ";
				}
			}
			if(oldLen < cls.length){
				node[className] = cls.substr(1, cls.length - 2);
			}
		},

		remove: function removeClass(/*DomNode|String*/node, /*String|Array?*/classStr){
			node = dom.byId(node);
			var cls;
			if(classStr !== undefined){
				classStr = str2array(classStr);
				cls = " " + node[className] + " ";
				for(var i = 0, len = classStr.length; i < len; ++i){
					cls = cls.replace(" " + classStr[i] + " ", " ");
				}
				cls = lang.trim(cls);
			}else{
				cls = "";
			}
			if(node[className] != cls){ node[className] = cls; }
		},

		replace: function replaceClass(/*DomNode|String*/node, /*String|Array*/addClassStr, /*String|Array?*/removeClassStr){
			node = dom.byId(node);
			fakeNode[className] = node[className];
			cls.remove(fakeNode, removeClassStr);
			cls.add(fakeNode, addClassStr);
			if(node[className] !== fakeNode[className]){
				node[className] = fakeNode[className];
			}
		},

		toggle: function toggleClass(/*DomNode|String*/node, /*String|Array*/classStr, /*Boolean?*/condition){
			node = dom.byId(node);
			if(condition === undefined){
				classStr = str2array(classStr);
				for(var i = 0, len = classStr.length, c; i < len; ++i){
					c = classStr[i];
					cls[cls.contains(node, c) ? "remove" : "add"](node, c);
				}
			}else{
				cls[condition ? "add" : "remove"](node, classStr);
			}
			return condition;   // Boolean
		}
	};

	return cls;
});

},
'dojo/dom-attr':function(){
define("dojo/dom-attr", ["exports", "./_base/sniff", "./_base/lang", "./dom", "./dom-style", "./dom-prop"],
		function(exports, has, lang, dom, style, prop){
	// module:
	//		dojo/dom-attr
	// summary:
	//		This module defines the core dojo DOM attributes API.

	// =============================
	// Element attribute Functions
	// =============================

	// This module will be obsolete soon. Use dojo.prop instead.

	// dojo.attr() should conform to http://www.w3.org/TR/DOM-Level-2-Core/

	// attribute-related functions (to be obsolete soon)

	/*=====
	dojo.hasAttr = function(node, name){
		// summary:
		//		Returns true if the requested attribute is specified on the
		//		given element, and false otherwise.
		// node: DOMNode|String
		//		id or reference to the element to check
		// name: String
		//		the name of the attribute
		// returns: Boolean
		//		true if the requested attribute is specified on the
		//		given element, and false otherwise
	};
	=====*/

	/*=====
	dojo.getAttr = function(node, name){
		// summary:
		//		Gets an attribute on an HTML element.
		// description:
		//		Handles normalized getting of attributes on DOM Nodes.
		// node: DOMNode|String
		//		id or reference to the element to get the attribute on
		// name: String
		//		the name of the attribute to get.
		// returns:
		//		the value of the requested attribute or null if that attribute does not have a specified or
		//		default value;
		//
		// example:
		//	|	// get the current value of the "foo" attribute on a node
		//	|	dojo.getAttr(dojo.byId("nodeId"), "foo");
		//	|	// or we can just pass the id:
		//	|	dojo.getAttr("nodeId", "foo");
	};
	=====*/

	/*=====
	dojo.setAttr = function(node, name, value){
		// summary:
		//		Sets an attribute on an HTML element.
		// description:
		//		Handles normalized setting of attributes on DOM Nodes.
		//
		//		When passing functions as values, note that they will not be
		//		directly assigned to slots on the node, but rather the default
		//		behavior will be removed and the new behavior will be added
		//		using `dojo.connect()`, meaning that event handler properties
		//		will be normalized and that some caveats with regards to
		//		non-standard behaviors for onsubmit apply. Namely that you
		//		should cancel form submission using `dojo.stopEvent()` on the
		//		passed event object instead of returning a boolean value from
		//		the handler itself.
		// node: DOMNode|String
		//		id or reference to the element to set the attribute on
		// name: String|Object
		//		the name of the attribute to set, or a hash of key-value pairs to set.
		// value: String?
		//		the value to set for the attribute, if the name is a string.
		// returns:
		//		the DOM node
		//
		// example:
		//	|	// use attr() to set the tab index
		//	|	dojo.setAttr("nodeId", "tabIndex", 3);
		//
		// example:
		//	Set multiple values at once, including event handlers:
		//	|	dojo.setAttr("formId", {
		//	|		"foo": "bar",
		//	|		"tabIndex": -1,
		//	|		"method": "POST",
		//	|		"onsubmit": function(e){
		//	|			// stop submitting the form. Note that the IE behavior
		//	|			// of returning true or false will have no effect here
		//	|			// since our handler is connect()ed to the built-in
		//	|			// onsubmit behavior and so we need to use
		//	|			// dojo.stopEvent() to ensure that the submission
		//	|			// doesn't proceed.
		//	|			dojo.stopEvent(e);
		//	|
		//	|			// submit the form with Ajax
		//	|			dojo.xhrPost({ form: "formId" });
		//	|		}
		//	|	});
		//
		// example:
		//	Style is s special case: Only set with an object hash of styles
		//	|	dojo.setAttr("someNode",{
		//	|		id:"bar",
		//	|		style:{
		//	|			width:"200px", height:"100px", color:"#000"
		//	|		}
		//	|	});
		//
		// example:
		//	Again, only set style as an object hash of styles:
		//	|	var obj = { color:"#fff", backgroundColor:"#000" };
		//	|	dojo.setAttr("someNode", "style", obj);
		//	|
		//	|	// though shorter to use `dojo.style()` in this case:
		//	|	dojo.setStyle("someNode", obj);
	};
	=====*/

	/*=====
	dojo.removeAttr = function(node, name){
		// summary:
		//		Removes an attribute from an HTML element.
		// node: DOMNode|String
		//		id or reference to the element to remove the attribute from
		// name: String
		//		the name of the attribute to remove
	};
	=====*/

	/*=====
	dojo.getNodeProp = function(node, name){
		// summary:
		//		Returns an effective value of a property or an attribute.
		// node: DOMNode|String
		//		id or reference to the element to remove the attribute from
		// name: String
		//		the name of the attribute
		// returns:
		//      the value of the attribute
	};
	=====*/

	var forcePropNames = {
			innerHTML:	1,
			className:	1,
			htmlFor:	0,
			value:		1
		},
		attrNames = {
			// original attribute names
			classname: "class",
			htmlfor: "for",
			// for IE
			tabindex: "tabIndex",
			readonly: "readOnly"
		};

	function _hasAttr(node, name){
		var attr = node.getAttributeNode && node.getAttributeNode(name);
		return attr && attr.specified; // Boolean
	}

	// There is a difference in the presence of certain properties and their default values
	// between browsers. For example, on IE "disabled" is present on all elements,
	// but it is value is "false"; "tabIndex" of <div> returns 0 by default on IE, yet other browsers
	// can return -1.

	exports.has = function hasAttr(/*DOMNode|String*/node, /*String*/name){
		var lc = name.toLowerCase();
		return forcePropNames[prop.names[lc] || name] || _hasAttr(dom.byId(node), attrNames[lc] || name);	// Boolean
	};

	exports.get = function getAttr(/*DOMNode|String*/node, /*String*/name){
		node = dom.byId(node);
		var lc = name.toLowerCase(),
			propName = prop.names[lc] || name,
			forceProp = forcePropNames[propName];
		// should we access this attribute via a property or via getAttribute()?
		value = node[propName];
		if(forceProp && typeof value != "undefined"){
			// node's property
			return value;	// Anything
		}
		if(propName != "href" && (typeof value == "boolean" || lang.isFunction(value))){
			// node's property
			return value;	// Anything
		}
		// node's attribute
		// we need _hasAttr() here to guard against IE returning a default value
		var attrName = attrNames[lc] || name;
		return _hasAttr(node, attrName) ? node.getAttribute(attrName) : null; // Anything
	};

	exports.set = function setAttr(/*DOMNode|String*/node, /*String|Object*/name, /*String?*/value){
		node = dom.byId(node);
		if(arguments.length == 2){ // inline'd type check
			// the object form of setter: the 2nd argument is a dictionary
			for(var x in name){
				exports.set(node, x, name[x]);
			}
			return node; // DomNode
		}
		var lc = name.toLowerCase(),
			propName = prop.names[lc] || name,
			forceProp = forcePropNames[propName];
		if(propName == "style" && typeof value != "string"){ // inline'd type check
			// special case: setting a style
			style.set(node, value);
			return node; // DomNode
		}
		if(forceProp || typeof value == "boolean" || lang.isFunction(value)){
			return prop.set(node, name, value)
		}
		// node's attribute
		node.setAttribute(attrNames[lc] || name, value);
		return node; // DomNode
	};

	exports.remove = function removeAttr(/*DOMNode|String*/ node, /*String*/ name){
		dom.byId(node).removeAttribute(attrNames[name.toLowerCase()] || name);
	};

	exports.getNodeProp = function getNodeProp(/*DomNode|String*/ node, /*String*/ name){
		node = dom.byId(node);
		var lc = name.toLowerCase(), propName = prop.names[lc] || name;
		if((propName in node) && propName != "href"){
			// node's property
			return node[propName];	// Anything
		}
		// node's attribute
		var attrName = attrNames[lc] || name;
		return _hasAttr(node, attrName) ? node.getAttribute(attrName) : null; // Anything
	};
});

},
'dojox/mobile/TabBar':function(){
define("dojox/mobile/TabBar", [
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-geometry",
	"dojo/dom-style",
	"dijit/_Contained",
	"dijit/_Container",
	"dijit/_WidgetBase",
	"./Heading",
	"./TabBarButton"
], function(array, declare, domClass, domConstruct, domGeometry, domStyle, Contained, Container, WidgetBase, Heading, TabBarButton){

/*=====
	var Contained = dijit._Contained;
	var Container = dijit._Container;
	var WidgetBase = dijit._WidgetBase;
=====*/

	// module:
	//		dojox/mobile/TabBar
	// summary:
	//		A bar widget that has buttons to control visibility of views.

	return declare("dojox.mobile.TabBar", [WidgetBase, Container, Contained],{
		// summary:
		//		A bar widget that has buttons to control visibility of views.
		// description:
		//		TabBar is a container widget that has typically multiple
		//		TabBarButtons which controls visibility of views. It can be used
		//		as a tab container.

		// iconBase: String
		//		The default icon path for child items.
		iconBase: "",

		// iconPos: String
		//		The default icon position for child items.
		iconPos: "",

		// barType: String
		//		"tabBar"(default) or "segmentedControl".
		barType: "tabBar",

		// inHeading: Boolean
		//		A flag that indicates whether this widget is in a Heading
		//		widget.
		inHeading: false,

		// tag: String
		//		A name of html tag to create as domNode.
		tag: "UL",

		/* internal properties */	
		_fixedButtonWidth: 76,
		_fixedButtonMargin: 17,
		_largeScreenWidth: 500,

		buildRendering: function(){
			this._clsName = this.barType == "segmentedControl" ? "mblTabButton" : "mblTabBarButton";
			this.domNode = this.containerNode = this.srcNodeRef || domConstruct.create(this.tag);
			this.domNode.className = this.barType == "segmentedControl" ? "mblTabPanelHeader" : "mblTabBar";
		},

		startup: function(){
			if(this._started){ return; }
			this.inherited(arguments);
			this.resize();
		},

		resize: function(size){
			var i,w;
			if(size && size.w){
				domGeometry.setMarginBox(this.domNode, size);
				w = size.w;
			}else{
				// Calculation of the bar width varies according to its "position" value.
				// When the widget is used as a fixed bar, its position would be "absolute".
				w = domStyle.get(this.domNode, "position") === "absolute" ?
					domGeometry.getContentBox(this.domNode).w : domGeometry.getMarginBox(this.domNode).w;
			}
			var bw = this._fixedButtonWidth;
			var bm = this._fixedButtonMargin;
	
			var children = this.containerNode.childNodes;
			var arr = [];
			for(i = 0; i < children.length; i++){
				var c = children[i];
				if(c.nodeType != 1){ continue; }
				if(domClass.contains(c, this._clsName)){
					arr.push(c);
				}
			}
	
			var margin;
			if(this.barType == "segmentedControl"){
				margin = w;
				var totalW = 0; // total width of all the buttons
				for(i = 0; i < arr.length; i++){
					margin -= domGeometry.getMarginBox(arr[i]).w;
					totalW += arr[i].offsetWidth;
				}
				margin = Math.floor(margin/2);
				var parent = this.getParent();
				var inHeading = this.inHeading || parent instanceof Heading;
				this.containerNode.style.padding = (inHeading ? 0 : 3) + "px 0px 0px " + (inHeading ? 0 : margin) + "px";
				if(inHeading){
					domStyle.set(this.domNode, {
						background: "none",
						border: "none",
						width: totalW + 2 + "px"
					});
				}
				domClass.add(this.domNode, "mblTabBar" + (inHeading ? "Head" : "Top"));
			}else{
				margin = Math.floor((w - (bw + bm * 2) * arr.length) / 2);
				if(w < this._largeScreenWidth || margin < 0){
					// If # of buttons is 4, for example, assign "25%" to each button.
					// More precisely, 1%(left margin) + 98%(bar width) + 1%(right margin)
					for(i = 0; i < arr.length; i++){
						arr[i].style.width = Math.round(98/arr.length) + "%";
						arr[i].style.margin = "0px";
					}
					this.containerNode.style.padding = "0px 0px 0px 1%";
				}else{
					// Fixed width buttons. Mainly for larger screen such as iPad.
					for(i = 0; i < arr.length; i++){
						arr[i].style.width = bw + "px";
						arr[i].style.margin = "0 " + bm + "px";
					}
					if(arr.length > 0){
						arr[0].style.marginLeft = margin + bm + "px";
					}
					this.containerNode.style.padding = "0px";
				}
			}

			if(!array.some(this.getChildren(), function(child){ return child.iconNode1; })){
				domClass.add(this.domNode, "mblTabBarNoIcons");
			}else{
				domClass.remove(this.domNode, "mblTabBarNoIcons");
			}

			if(!array.some(this.getChildren(), function(child){ return child.label; })){
				domClass.add(this.domNode, "mblTabBarNoText");
			}else{
				domClass.remove(this.domNode, "mblTabBarNoText");
			}
		}
	});

});

},
'app/views/TaskList':function(){
define("app/views/TaskList", ['dojo/_base/declare',
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
 		'dojox/gesture/tap'], 
 		function(declare, on, registry, RadioButton, Button, RoundRect, ListItem, domConstruct, dom, lang, xhr, Map, domAttr, domGeom, query, event, Deferred, tap) {

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
			//persist the task data
			this.activityData = activityData;
			
			this.taskList = registry.byId("taskList");
						
			localStorage.setItem("activityDetails_"+activityData.id, dojo.toJson(activityData));
			//this._setupEventHandlers(this.view);
			console.debug(activityData.tasks.length);
			var previousViewed = parseInt(localStorage.getItem("itemsViewed"));
			localStorage.setItem("itemsViewed",(previousViewed + activityData.tasks.length));
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
												alert("Task completed!");
												var listItem = registry.byId("" + task.id);
												this.setTaskDisplayToCompleted("Walk Completed", listItem);
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
			this.view.destroy();
			this.imageNode = null;
			this.titleNode = null;
			this.activityData = null;
		},
		
		_showMapView : function() {
			viewCache.mapView.populateData(this);
			viewCache.mapView.show();
		}
	});
});

},
'dojo/selector/lite':function(){
define("dojo/selector/lite", ["../has", "../_base/kernel"], function(has, dojo){
"use strict";
// summary:
//		A small lightweight query selector engine that implements CSS2.1 selectors 
// 		minus pseudo-classes and the sibling combinator, plus CSS3 attribute selectors
var testDiv = document.createElement("div");
var matchesSelector = testDiv.matchesSelector || testDiv.webkitMatchesSelector || testDiv.mozMatchesSelector || testDiv.msMatchesSelector || testDiv.oMatchesSelector; // IE9, WebKit, Firefox have this, but not Opera yet
var querySelectorAll = testDiv.querySelectorAll;
has.add("dom-matches-selector", !!matchesSelector);
has.add("dom-qsa", !!querySelectorAll); 

// this is a simple query engine. It has handles basic selectors, and for simple
// common selectors is extremely fast
var liteEngine = function(selector, root){
	if(combine && selector.indexOf(',') > -1){
		return combine(selector, root);
	}
	var match = (querySelectorAll ? 
		/^([\w]*)#([\w\-]+$)|^(\.)([\w\-\*]+$)|^(\w+$)/ : // this one only matches on simple queries where we can beat qSA with specific methods
		/^([\w]*)#([\w\-]+)(?:\s+(.*))?$|(?:^|(>|.+\s+))([\w\-\*]+)(\S*$)/) // this one matches parts of the query that we can use to speed up manual filtering
			.exec(selector);
	root = root || document;
	if(match){
		// fast path regardless of whether or not querySelectorAll exists
		if(match[2]){
			// an #id
			// use dojo.byId if available as it fixes the id retrieval in IE
			var found = dojo.byId ? dojo.byId(match[2]) : document.getElementById(match[2]);
			if(!found || (match[1] && match[1] != found.tagName.toLowerCase())){
				// if there is a tag qualifer and it doesn't match, no matches
				return [];
			}
			if(root != document){
				// there is a root element, make sure we are a child of it
				var parent = found;
				while(parent != root){
					parent = parent.parentNode;
					if(!parent){
						return [];
					}
				}
			}
			return match[3] ?
					liteEngine(match[3], found) 
					: [found];
		}
		if(match[3] && root.getElementsByClassName){
			// a .class
			return root.getElementsByClassName(match[4]);
		}
		var found;
		if(match[5]){
			// a tag
			found = root.getElementsByTagName(match[5]);
			if(match[4] || match[6]){
				selector = (match[4] || "") + match[6];
			}else{
				// that was the entirety of the query, return results
				return found;
			}
		}
	}
	if(querySelectorAll){
		// qSA works strangely on Element-rooted queries
		// We can work around this by specifying an extra ID on the root
		// and working up from there (Thanks to Andrew Dupont for the technique)
		// IE 8 doesn't work on object elements
		if (root.nodeType === 1 && root.nodeName.toLowerCase() !== "object"){				
			return useRoot(root, selector, root.querySelectorAll);
		}else{
			// we can use the native qSA
			return root.querySelectorAll(selector);
		}
	}else if(!found){
		// search all children and then filter
		found = root.getElementsByTagName("*");
	}
	// now we filter the nodes that were found using the matchesSelector
	var results = [];
	for(var i = 0, l = found.length; i < l; i++){
		var node = found[i];
		if(node.nodeType == 1 && jsMatchesSelector(node, selector, root)){
			// keep the nodes that match the selector
			results.push(node);
		}
	}
	return results;
};
var useRoot = function(context, query, method){
	// this function creates a temporary id so we can do rooted qSA queries, this is taken from sizzle
	var oldContext = context,
		old = context.getAttribute( "id" ),
		nid = old || "__dojo__",
		hasParent = context.parentNode,
		relativeHierarchySelector = /^\s*[+~]/.test( query );

	if(relativeHierarchySelector && !hasParent){
		return [];
	}
	if(!old){
		context.setAttribute("id", nid);
	}else{
		nid = nid.replace(/'/g, "\\$&");
	}
	if(relativeHierarchySelector && hasParent){
		context = context.parentNode;
	}

	try {
		return method.call(context, "[id='" + nid + "'] " + query );
	} finally {
		if ( !old ) {
			oldContext.removeAttribute( "id" );
		}
	}
};

if(!has("dom-matches-selector")){
	var jsMatchesSelector = (function(){
		// a JS implementation of CSS selector matching, first we start with the various handlers
		var caseFix = testDiv.tagName == "div" ? "toLowerCase" : "toUpperCase";
		function tag(tagName){
			tagName = tagName[caseFix]();
			return function(node){
				return node.tagName == tagName;
			}
		}
		function className(className){
			var classNameSpaced = ' ' + className + ' ';
			return function(node){
				return node.className.indexOf(className) > -1 && (' ' + node.className + ' ').indexOf(classNameSpaced) > -1;
			}
		}
		var attrComparators = {
			"^=": function(attrValue, value){
				return attrValue.indexOf(value) == 0;
			},
			"*=": function(attrValue, value){
				return attrValue.indexOf(value) > -1;
			},
			"$=": function(attrValue, value){
				return attrValue.substring(attrValue.length - value.length, attrValue.length) == value;
			},
			"~=": function(attrValue, value){
				return (' ' + attrValue + ' ').indexOf(' ' + value + ' ') > -1;
			},
			"|=": function(attrValue, value){
				return (attrValue + '-').indexOf(value + '-') == 0;
			},
			"=": function(attrValue, value){
				return attrValue == value;
			},
			"": function(attrValue, value){
				return true;
			}
		};
		function attr(name, value, type){
			if(value.match(/['"]/)){
				// it is quoted, do an eval to parse the string (CSS and JS parsing are close enough)
				value = eval(value);
			}
			var comparator = attrComparators[type || ""];
			return function(node){
				var attrValue = node.getAttribute(name);
				return attrValue && comparator(attrValue, value);
			}
		}
		function ancestor(matcher){
			return function(node, root){
				while((node = node.parentNode) != root){
					if(matcher(node, root)){
						return true;
					}
				}
			};
		}
		function parent(matcher){
			return function(node, root){
				node = node.parentNode;
				return matcher ? 
					node != root && matcher(node, root)
					: node == root;
			};
		}
		var cache = {};
		function and(matcher, next){
			return matcher ?
				function(node, root){
					return next(node) && matcher(node, root);
				}
				: next;
		}
		return function(node, selector, root){
			// this returns true or false based on if the node matches the selector (optionally within the given root)
			var matcher = cache[selector]; // check to see if we have created a matcher function for the given selector
			if(!matcher){
				// create a matcher function for the given selector
				// parse the selectors
				if(selector.replace(/(?:\s*([> ])\s*)|(\.)?([\w-]+)|\[([\w-]+)\s*(.?=)?\s*([^\]]*)\]/g, function(t, combinator, type, value, attrName, attrType, attrValue){
					if(value){
						if(type == "."){
							matcher = and(matcher, className(value));
						}
						else{
							matcher = and(matcher, tag(value));
						}
					}
					else if(combinator){
						matcher = (combinator == " " ? ancestor : parent)(matcher);
					}
					else if(attrName){
						matcher = and(matcher, attr(attrName, attrValue, attrType));
					}
					return "";
				})){
					throw new Error("Syntax error in query");
				}
				if(!matcher){
					return true;
				}
				cache[selector] = matcher;
			}
			// now run the matcher function on the node
			return matcher(node, root);
		};
	})();
}
if(!has("dom-qsa")){
	var combine = function(selector, root){
		// combined queries
		selector = selector.split(/\s*,\s*/);
		var indexed = [];
		// add all results and keep unique ones, this only runs in IE, so we take advantage 
		// of known IE features, particularly sourceIndex which is unique and allows us to 
		// order the results 
		for(var i = 0; i < selector.length; i++){
			var results = liteEngine(selector[i], root);
			for(var j = 0, l = results.length; j < l; j++){
				var node = results[j];
				indexed[node.sourceIndex] = node;
			}
		}
		// now convert from a sparse array to a dense array
		var totalResults = [];
		for(i in indexed){
			totalResults.push(indexed[i]);
		}
		return totalResults;
	};
}

liteEngine.match = matchesSelector ? function(node, selector, root){
	if(root){
		// doesn't support three args, use rooted id trick
		return useRoot(root, selector, function(query){
			return matchesSelector.call(node, query);
		});
	}
	// we have a native matchesSelector, use that
	return matchesSelector.call(node, selector);
} : jsMatchesSelector; // otherwise use the JS matches impl

return liteEngine;
});

},
'dojox/mobile/RoundRect':function(){
define("dojox/mobile/RoundRect", [
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/_base/window",
	"dijit/_Contained",
	"dijit/_Container",
	"dijit/_WidgetBase"
], function(array, declare, win, Contained, Container, WidgetBase){

/*=====
	var Contained = dijit._Contained;
	var Container = dijit._Container;
	var WidgetBase = dijit._WidgetBase;
=====*/

	// module:
	//		dojox/mobile/RoundRect
	// summary:
	//		A simple round rectangle container.

	return declare("dojox.mobile.RoundRect", [WidgetBase, Container, Contained], {
		// summary:
		//		A simple round rectangle container.
		// description:
		//		RoundRect is a simple round rectangle container for any HTML
		//		and/or widgets. You can achieve the same appearance by just
		//		applying the -webkit-border-radius style to a div tag. However,
		//		if you use RoundRect, you can get a round rectangle even on
		//		non-CSS3 browsers such as (older) IE.

		// shadow: Boolean
		//		If true, adds a shadow effect to the container element.
		shadow: false,

		buildRendering: function(){
			this.domNode = this.containerNode = this.srcNodeRef || win.doc.createElement("DIV");
			this.domNode.className = this.shadow ? "mblRoundRect mblShadow" : "mblRoundRect";
		},

		resize: function(){
			// summary:
			//		Calls resize() of each child widget.
			array.forEach(this.getChildren(), function(child){
				if(child.resize){ child.resize(); }
			});
		}
	});
});

},
'dojox/mobile/TabBarButton':function(){
define("dojox/mobile/TabBarButton", [
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dijit/registry",	// registry.byNode
	"./common",
	"./_ItemBase"
], function(declare, lang, win, domClass, domConstruct, registry, common, ItemBase){

/*=====
	var ItemBase = dojox.mobile._ItemBase;
=====*/

	// module:
	//		dojox/mobile/TabBarButton
	// summary:
	//		A button widget that is placed in the TabBar widget.

	return declare("dojox.mobile.TabBarButton", ItemBase,{
		// summary:
		//		A button widget that is placed in the TabBar widget.
		// description:
		//		TabBarButton is a button that is placed in the TabBar widget. It
		//		is a subclass of dojox.mobile._ItemBase just like ListItem or
		//		IconItem. So, unlike Button, it has similar capability as
		//		ListItem or IconItem, such as icon support, transition, etc.

		// icon1: String
		//		A path for the unselected (typically dark) icon. If icon is not
		//		specified, the iconBase parameter of the parent widget is used.
		icon1: "",

		// icon2: String
		//		A path for the selected (typically highlight) icon. If icon is
		//		not specified, the iconBase parameter of the parent widget or
		//		icon1 is used.
		icon2: "",

		// iconPos1: String
		//		The position of an aggregated unselected (typically dark)
		//		icon. IconPos1 is comma separated values like
		//		top,left,width,height (ex. "0,0,29,29"). If iconPos1 is not
		//		specified, the iconPos parameter of the parent widget is used.
		iconPos1: "",

		// iconPos2: String
		//		The position of an aggregated selected (typically highlight)
		//		icon. IconPos2 is comma separated values like
		//		top,left,width,height (ex. "0,0,29,29"). If iconPos2 is not
		//		specified, the iconPos parameter of the parent widget or
		//		iconPos1 is used.
		iconPos2: "",

		// selected: Boolean
		//		If true, the button is in the selected status.
		selected: false,

		// transition: String
		//		A type of animated transition effect.
		transition: "none",

		// tag: String
		//		A name of html tag to create as domNode.
		tag: "LI",

		/* internal properties */	
		selectOne: true,

	
		inheritParams: function(){
			// summary:
			//		Overrides dojox.mobile._ItemBase.inheritParams().
			if(this.icon && !this.icon1){ this.icon1 = this.icon; }
			var parent = this.getParent();
			if(parent){
				if(!this.transition){ this.transition = parent.transition; }
				if(this.icon1 && parent.iconBase &&
					parent.iconBase.charAt(parent.iconBase.length - 1) === '/'){
					this.icon1 = parent.iconBase + this.icon1;
				}
				if(!this.icon1){ this.icon1 = parent.iconBase; }
				if(!this.iconPos1){ this.iconPos1 = parent.iconPos; }
				if(this.icon2 && parent.iconBase &&
					parent.iconBase.charAt(parent.iconBase.length - 1) === '/'){
					this.icon2 = parent.iconBase + this.icon2;
				}
				if(!this.icon2){ this.icon2 = parent.iconBase || this.icon1; }
				if(!this.iconPos2){ this.iconPos2 = parent.iconPos || this.iconPos1; }
			}
		},
	
		buildRendering: function(){
			var a = this.anchorNode = domConstruct.create("A", {className:"mblTabBarButtonAnchor"});
			this.connect(a, "onclick", "onClick");
	
			this.box = domConstruct.create("DIV", {className:"mblTabBarButtonTextBox"}, a);
			var box = this.box;
			var label = "";
			var r = this.srcNodeRef;
			if(r){
				for(var i = 0, len = r.childNodes.length; i < len; i++){
					var n = r.firstChild;
					if(n.nodeType === 3){
						label += lang.trim(n.nodeValue);
					}
					box.appendChild(n);
				}
			}
			if(!this.label){
				this.label = label;
			}
	
			this.domNode = this.srcNodeRef || domConstruct.create(this.tag);
			this.containerNode = this.domNode;
			this.domNode.appendChild(a);
			if(this.domNode.className.indexOf("mblDomButton") != -1){
				// deprecated. TODO: remove this code in 1.8
				var domBtn = domConstruct.create("DIV", null, a);
				common.createDomButton(this.domNode, null, domBtn);
				domClass.add(this.domNode, "mblTabButtonDomButton");
				domClass.add(domBtn, "mblTabButtonDomButtonClass");
			}
			if((this.icon1 || this.icon).indexOf("mblDomButton") != -1){
				domClass.add(this.domNode, "mblTabButtonDomButton");
			}
		},
	
		startup: function(){
			if(this._started){ return; }
			this.inheritParams();
			var parent = this.getParent();
	
			var _clsName = parent ? parent._clsName : "mblTabBarButton";
			domClass.add(this.domNode, _clsName + (this.selected ? " mblTabButtonSelected" : ""));
	
			if(parent && parent.barType == "segmentedControl"){
				// proper className may not be set when created dynamically
				domClass.remove(this.domNode, "mblTabBarButton");
				domClass.add(this.domNode, parent._clsName);
				this.box.className = "";
			}
			this.set({icon1:this.icon1, icon2:this.icon2});
			this.inherited(arguments);
		},
	
		select: function(){
			// summary:
			//		Makes this widget in the selected state.
			if(arguments[0]){ // deselect
				this.selected = false;
				domClass.remove(this.domNode, "mblTabButtonSelected");
			}else{ // select
				this.selected = true;
				domClass.add(this.domNode, "mblTabButtonSelected");
				for(var i = 0, c = this.domNode.parentNode.childNodes; i < c.length; i++){
					if(c[i].nodeType != 1){ continue; }
					var w = registry.byNode(c[i]); // sibling widget
					if(w && w != this){
						w.deselect();
					}
				}
			}
			if(this.iconNode1){
				this.iconNode1.style.visibility = this.selected ? "hidden" : "";
			}
			if(this.iconNode2){
				this.iconNode2.style.visibility = this.selected ? "" : "hidden";
			}
		},
		
		deselect: function(){
			// summary:
			//		Makes this widget in the deselected state.
			this.select(true);
		},
	
		onClick: function(e){
			this.defaultClickAction();
		},
	
		_setIcon: function(icon, pos, num, sel){
			var i = "icon" + num, n = "iconNode" + num, p = "iconPos" + num;
			if(icon){ this[i] = icon; }
			if(pos){
				if(this[p] === pos){ return; }
				this[p] = pos;
			}
			if(icon && icon !== "none"){
				if(!this.iconDivNode){
					this.iconDivNode = domConstruct.create("DIV", {className:"mblTabBarButtonDiv"}, this.anchorNode, "first");
				}
				if(!this[n]){
					this[n] = domConstruct.create("div", {className:"mblTabBarButtonIcon"}, this.iconDivNode);
				}else{
					domConstruct.empty(this[n]);
				}
				common.createIcon(icon, this[p], null, this.alt, this[n]);
				if(this[p]){
					domClass.add(this[n].firstChild, "mblTabBarButtonSpriteIcon");
				}
				domClass.remove(this.iconDivNode, "mblTabBarButtonNoIcon");
				this[n].style.visibility = sel ? "hidden" : "";
			}else if(this.iconDivNode){
				domClass.add(this.iconDivNode, "mblTabBarButtonNoIcon");
			}
		},
	
		_setIcon1Attr: function(icon){
			this._setIcon(icon, null, 1, this.selected);
		},
	
		_setIcon2Attr: function(icon){
			this._setIcon(icon, null, 2, !this.selected);
		},
	
		_setIconPos1Attr: function(pos){
			this._setIcon(null, pos, 1, this.selected);
		},
	
		_setIconPos2Attr: function(pos){
			this._setIcon(null, pos, 2, !this.selected);
		},

		_setLabelAttr: function(/*String*/text){
			this.label = text;
			this.box.innerHTML = this._cv ? this._cv(text) : text;
		}
	});
});

},
'dojox/mobile/CheckBox':function(){
define("dojox/mobile/CheckBox", [
	"dojo/_base/declare",
	"dojo/dom-construct",
	"dijit/form/_CheckBoxMixin",
	"./ToggleButton"
],
	function(declare, domConstruct, CheckBoxMixin, ToggleButton){

	/*=====
		ToggleButton = dojox.mobile.ToggleButton;
		CheckBoxMixin = dijit.form._CheckBoxMixin;
	=====*/
	return declare("dojox.mobile.CheckBox", [ToggleButton, CheckBoxMixin], {
		// summary:
		//		A non-templated checkbox widget that can be in two states (checked or not).

		baseClass: "mblCheckBox",

		_setTypeAttr: function(){}, // cannot be changed: IE complains w/o this

		buildRendering: function(){
			if(!this.srcNodeRef){
				// The following doesn't work on IE < 8 if the default state is checked.
				// You have to use "<input checked>" instead but it's not worth the bytes here.
				this.srcNodeRef = domConstruct.create("input", {type: this.type});
			}
			this.inherited(arguments);
			this.focusNode = this.domNode;
		},
		
		_getValueAttr: function(){
			return (this.checked ? this.value : false);
		}
	});
});

},
'dijit/form/_ButtonMixin':function(){
define("dijit/form/_ButtonMixin", [
	"dojo/_base/declare", // declare
	"dojo/dom", // dom.setSelectable
	"dojo/_base/event", // event.stop
	"../registry"		// registry.byNode
], function(declare, dom, event, registry){

// module:
//		dijit/form/_ButtonMixin
// summary:
//		A mixin to add a thin standard API wrapper to a normal HTML button

return declare("dijit.form._ButtonMixin", null, {
	// summary:
	//		A mixin to add a thin standard API wrapper to a normal HTML button
	// description:
	//		A label should always be specified (through innerHTML) or the label attribute.
	//		Attach points:
	//			focusNode (required): this node receives focus
	//			valueNode (optional): this node's value gets submitted with FORM elements
	//			containerNode (optional): this node gets the innerHTML assignment for label
	// example:
	// |	<button data-dojo-type="dijit.form.Button" onClick="...">Hello world</button>
	//
	// example:
	// |	var button1 = new dijit.form.Button({label: "hello world", onClick: foo});
	// |	dojo.body().appendChild(button1.domNode);

	// label: HTML String
	//		Content to display in button.
	label: "",

	// type: [const] String
	//		Type of button (submit, reset, button, checkbox, radio)
	type: "button",

	_onClick: function(/*Event*/ e){
		// summary:
		//		Internal function to handle click actions
		if(this.disabled){
			event.stop(e);
			return false;
		}
		var preventDefault = this.onClick(e) === false; // user click actions
		if(!preventDefault && this.type == "submit" && !(this.valueNode||this.focusNode).form){ // see if a non-form widget needs to be signalled
			for(var node=this.domNode; node.parentNode; node=node.parentNode){
				var widget=registry.byNode(node);
				if(widget && typeof widget._onSubmit == "function"){
					widget._onSubmit(e);
					preventDefault = true;
					break;
				}
			}
		}
		if(preventDefault){
			e.preventDefault();
		}
		return !preventDefault;
	},

	postCreate: function(){
		this.inherited(arguments);
		dom.setSelectable(this.focusNode, false);
	},

	onClick: function(/*Event*/ /*===== e =====*/){
		// summary:
		//		Callback for when button is clicked.
		//		If type="submit", return true to perform submit, or false to cancel it.
		// type:
		//		callback
		return true;		// Boolean
	},

	_setLabelAttr: function(/*String*/ content){
		// summary:
		//		Hook for set('label', ...) to work.
		// description:
		//		Set the label (text) of the button; takes an HTML string.
		this._set("label", content);
		(this.containerNode||this.focusNode).innerHTML = content;
	}
});

});

},
'dojox/mobile/RoundRectCategory':function(){
define("dojox/mobile/RoundRectCategory", [
	"dojo/_base/declare",
	"dojo/_base/window",
	"dijit/_Contained",
	"dijit/_WidgetBase"
], function(declare, win, Contained, WidgetBase){

/*=====
	var Contained = dijit._Contained;
	var WidgetBase = dijit._WidgetBase;
=====*/

	// module:
	//		dojox/mobile/RoundRectCategory
	// summary:
	//		A category header for a rounded rectangle list.

	return declare("dojox.mobile.RoundRectCategory", [WidgetBase, Contained],{
		// summary:
		//		A category header for a rounded rectangle list.

		// label: String
		//		A label text for the widget.
		label: "",

		buildRendering: function(){
			this.domNode = this.containerNode = this.srcNodeRef || win.doc.createElement("H2");
			this.domNode.className = "mblRoundRectCategory";
			if(!this.label){
				this.label = this.domNode.innerHTML;
			}
		},

		_setLabelAttr: function(/*String*/label){
			this.label = label;
			this.domNode.innerHTML = this._cv ? this._cv(label) : label;
		}
	});

});

},
'dojox/mobile/transition':function(){
define("dojox/mobile/transition", [
	"dojo/_base/Deferred",
	"dojo/_base/config"
], function(Deferred, config){
	/* summary: this is the wrapper module which load
	 * dojox/css3/transit conditionally. If mblCSS3Transition
	 * is set to 'dojox/css3/transit', it will be loaded as
	 * the module to conduct the view transition.
	 */
	if(config['mblCSS3Transition']){
		//require dojox/css3/transit and resolve it as the result of transitDeferred.
		var transitDeferred = new Deferred();
		require([config['mblCSS3Transition']], function(transit){
			transitDeferred.resolve(transit);
		});
		return transitDeferred;
	}
	return null;
});

},
'dojox/mobile/ToggleButton':function(){
define("dojox/mobile/ToggleButton", [
	"dojo/_base/declare",
	"dojo/dom-class",
	"dijit/form/_ToggleButtonMixin",
	"./Button"
], function(declare, domClass, ToggleButtonMixin, Button){

	/*=====
		Button = dojox.mobile.Button;
		ToggleButtonMixin = dijit.form._ToggleButtonMixin;
	=====*/
	return declare("dojox.mobile.ToggleButton", [Button, ToggleButtonMixin], {
		// summary:
		//		A non-templated button widget that can be in two states (checked or not).
		//		Can be base class for things like tabs or checkbox or radio buttons

		baseClass: "mblToggleButton",

		_setCheckedAttr: function(){
			this.inherited(arguments);
			var newStateClasses = (this.baseClass+' '+this["class"]).replace(/(\S+)\s*/g, "$1Checked ").split(" ");
			domClass[this.checked ? "add" : "remove"](this.focusNode || this.domNode, newStateClasses);
		}
	});
});

},
'dojo/window':function(){
define("dojo/window", ["./_base/kernel", "./_base/lang", "./_base/sniff", "./_base/window", "./dom", "./dom-geometry", "./dom-style"], function(dojo, lang, has, baseWindow, dom, geom, style) {
	// module:
	//		dojo/window
	// summary:
	//		TODOC

lang.getObject("window", true, dojo);

dojo.window.getBox = function(){
	// summary:
	//		Returns the dimensions and scroll position of the viewable area of a browser window

	var scrollRoot = (baseWindow.doc.compatMode == 'BackCompat') ? baseWindow.body() : baseWindow.doc.documentElement;

	// get scroll position
	var scroll = geom.docScroll(); // scrollRoot.scrollTop/Left should work

	var uiWindow = baseWindow.doc.parentWindow || baseWindow.doc.defaultView;   // use UI window, not dojo.global window
	// dojo.global.innerWidth||dojo.global.innerHeight is for mobile
	return {
		l: scroll.x,
		t: scroll.y,
		w: uiWindow.innerWidth || scrollRoot.clientWidth,
		h: uiWindow.innerHeight || scrollRoot.clientHeight
	};
};

dojo.window.get = function(doc){
	// summary:
	// 		Get window object associated with document doc

	// In some IE versions (at least 6.0), document.parentWindow does not return a
	// reference to the real window object (maybe a copy), so we must fix it as well
	// We use IE specific execScript to attach the real window reference to
	// document._parentWindow for later use
	if(0 && window !== document.parentWindow){
		/*
		In IE 6, only the variable "window" can be used to connect events (others
		may be only copies).
		*/
		doc.parentWindow.execScript("document._parentWindow = window;", "Javascript");
		//to prevent memory leak, unset it after use
		//another possibility is to add an onUnload handler which seems overkill to me (liucougar)
		var win = doc._parentWindow;
		doc._parentWindow = null;
		return win;	//	Window
	}

	return doc.parentWindow || doc.defaultView;	//	Window
};

dojo.window.scrollIntoView = function(/*DomNode*/ node, /*Object?*/ pos){
	// summary:
	//		Scroll the passed node into view, if it is not already.

	// don't rely on node.scrollIntoView working just because the function is there

	try{ // catch unexpected/unrecreatable errors (#7808) since we can recover using a semi-acceptable native method
		node = dom.byId(node);
		var doc = node.ownerDocument || baseWindow.doc,
			body = doc.body || baseWindow.body(),
			html = doc.documentElement || body.parentNode,
			isIE = 0, isWK = has("webkit");
		// if an untested browser, then use the native method
		if((!(has("mozilla") || isIE || isWK || has("opera")) || node == body || node == html) && (typeof node.scrollIntoView != "undefined")){
			node.scrollIntoView(false); // short-circuit to native if possible
			return;
		}
		var backCompat = doc.compatMode == 'BackCompat',
			clientAreaRoot = (isIE >= 9 && node.ownerDocument.parentWindow.frameElement)
				? ((html.clientHeight > 0 && html.clientWidth > 0 && (body.clientHeight == 0 || body.clientWidth == 0 || body.clientHeight > html.clientHeight || body.clientWidth > html.clientWidth)) ? html : body)
				: (backCompat ? body : html),
			scrollRoot = isWK ? body : clientAreaRoot,
			rootWidth = clientAreaRoot.clientWidth,
			rootHeight = clientAreaRoot.clientHeight,
			rtl = !geom.isBodyLtr(),
			nodePos = pos || geom.position(node),
			el = node.parentNode,
			isFixed = function(el){
				return ((isIE <= 6 || (isIE && backCompat))? false : (style.get(el, 'position').toLowerCase() == "fixed"));
			};
		if(isFixed(node)){ return; } // nothing to do

		while(el){
			if(el == body){ el = scrollRoot; }
			var elPos = geom.position(el),
				fixedPos = isFixed(el);

			if(el == scrollRoot){
				elPos.w = rootWidth; elPos.h = rootHeight;
				if(scrollRoot == html && isIE && rtl){ elPos.x += scrollRoot.offsetWidth-elPos.w; } // IE workaround where scrollbar causes negative x
				if(elPos.x < 0 || !isIE){ elPos.x = 0; } // IE can have values > 0
				if(elPos.y < 0 || !isIE){ elPos.y = 0; }
			}else{
				var pb = geom.getPadBorderExtents(el);
				elPos.w -= pb.w; elPos.h -= pb.h; elPos.x += pb.l; elPos.y += pb.t;
				var clientSize = el.clientWidth,
					scrollBarSize = elPos.w - clientSize;
				if(clientSize > 0 && scrollBarSize > 0){
					elPos.w = clientSize;
					elPos.x += (rtl && (isIE || el.clientLeft > pb.l/*Chrome*/)) ? scrollBarSize : 0;
				}
				clientSize = el.clientHeight;
				scrollBarSize = elPos.h - clientSize;
				if(clientSize > 0 && scrollBarSize > 0){
					elPos.h = clientSize;
				}
			}
			if(fixedPos){ // bounded by viewport, not parents
				if(elPos.y < 0){
					elPos.h += elPos.y; elPos.y = 0;
				}
				if(elPos.x < 0){
					elPos.w += elPos.x; elPos.x = 0;
				}
				if(elPos.y + elPos.h > rootHeight){
					elPos.h = rootHeight - elPos.y;
				}
				if(elPos.x + elPos.w > rootWidth){
					elPos.w = rootWidth - elPos.x;
				}
			}
			// calculate overflow in all 4 directions
			var l = nodePos.x - elPos.x, // beyond left: < 0
				t = nodePos.y - Math.max(elPos.y, 0), // beyond top: < 0
				r = l + nodePos.w - elPos.w, // beyond right: > 0
				bot = t + nodePos.h - elPos.h; // beyond bottom: > 0
			if(r * l > 0){
				var s = Math[l < 0? "max" : "min"](l, r);
				if(rtl && ((isIE == 8 && !backCompat) || isIE >= 9)){ s = -s; }
				nodePos.x += el.scrollLeft;
				el.scrollLeft += s;
				nodePos.x -= el.scrollLeft;
			}
			if(bot * t > 0){
				nodePos.y += el.scrollTop;
				el.scrollTop += Math[t < 0? "max" : "min"](t, bot);
				nodePos.y -= el.scrollTop;
			}
			el = (el != scrollRoot) && !fixedPos && el.parentNode;
		}
	}catch(error){
		console.error('scrollIntoView: ' + error);
		node.scrollIntoView(false);
	}
};

return dojo.window;
});

},
'dojox/mobile/Tooltip':function(){
define("dojox/mobile/Tooltip", [
	"dojo/_base/array", // array.forEach
	"dijit/registry",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-geometry",
	"dojo/dom-style",
	"dijit/place",
	"dijit/_WidgetBase"
], function(array, registry, declare, lang, domClass, domConstruct, domGeometry, domStyle, place, WidgetBase){

	/*=====
		WidgetBase = dijit._WidgetBase;
	=====*/
	return declare("dojox.mobile.Tooltip", WidgetBase, {
		// summary:
		//		A non-templated popup bubble widget
		//

		baseClass: "mblTooltip mblTooltipHidden",

		buildRendering: function(){
			// create the helper nodes here in case the user overwrote domNode.innerHTML
			this.inherited(arguments);
			this.anchor = domConstruct.create("div", {"class":"mblTooltipAnchor"}, this.domNode, "first");
			this.arrow = domConstruct.create("div", {"class":"mblTooltipArrow"}, this.anchor);
			this.innerArrow = domConstruct.create("div", {"class":"mblTooltipInnerArrow"}, this.anchor);
		},

		show: function(/*DomNode*/ aroundNode, positions){
			// summary:
			//		Pop up the tooltip and point to aroundNode using the best position
			// positions:
			//		Ordered list of positions to try matching up.
			//			* before: places drop down before the aroundNode
			//			* after: places drop down after the aroundNode
			//			* above-centered: drop down goes above aroundNode
			//			* below-centered: drop down goes below aroundNode
			var domNode = this.domNode;
			var connectorClasses = {
				"MRM": "mblTooltipAfter",
				"MLM": "mblTooltipBefore",
				"BMT": "mblTooltipBelow",
				"TMB": "mblTooltipAbove",
				"BLT": "mblTooltipBelow",
				"TLB": "mblTooltipAbove",
				"BRT": "mblTooltipBelow",
				"TRB": "mblTooltipAbove",
				"TLT": "mblTooltipBefore",
				"TRT": "mblTooltipAfter",
				"BRB": "mblTooltipAfter",
				"BLB": "mblTooltipBefore"
			};
			domClass.remove(domNode, ["mblTooltipAfter","mblTooltipBefore","mblTooltipBelow","mblTooltipAbove"]);
			array.forEach(registry.findWidgets(domNode), function(widget){
				if(widget.height == "auto" && typeof widget.resize == "function"){
					if(!widget.fixedFooterHeight){
						widget.fixedFooterHeight = domGeometry.getPadBorderExtents(domNode).b;
					}
					widget.resize();
				}
			});
			var best = place.around(domNode, aroundNode, positions || ['below-centered', 'above-centered', 'after', 'before'], this.isLeftToRight());
			var connectorClass = connectorClasses[best.corner + best.aroundCorner.charAt(0)] || '';
			domClass.add(domNode, connectorClass);
			var pos = domGeometry.position(aroundNode, true);
			domStyle.set(this.anchor, (connectorClass == "mblTooltipAbove" || connectorClass == "mblTooltipBelow")
				? { top: "", left: Math.max(0, pos.x - best.x + (pos.w >> 1) - (this.arrow.offsetWidth >> 1)) + "px" }
				: { left: "", top: Math.max(0, pos.y - best.y + (pos.h >> 1) - (this.arrow.offsetHeight >> 1)) + "px" }
			);
			domClass.replace(domNode, "mblTooltipVisible", "mblTooltipHidden");
			this.resize = lang.hitch(this, "show", aroundNode, positions); // orientation changes
			return best;
		},

		hide: function(){
			// summary:
			//		Pop down the tooltip
			this.resize = undefined;
			domClass.replace(this.domNode, "mblTooltipHidden", "mblTooltipVisible");
		},

		onBlur: function(/*Event*/e){
			return true; // touching outside the overlay area does call hide() by default
		},

		destroy: function(){
			if(this.anchor){
				this.anchor.removeChild(this.innerArrow);
				this.anchor.removeChild(this.arrow);
				this.domNode.removeChild(this.anchor);
				this.anchor = this.arrow = this.innerArrow = undefined;
			}
			this.inherited(arguments);
		}
	});
});

},
'dojox/mobile/EdgeToEdgeList':function(){
define("dojox/mobile/EdgeToEdgeList", [
	"dojo/_base/declare",
	"./RoundRectList"
], function(declare, RoundRectList){

/*=====
	var RoundRectList = dojox.mobile.RoundRectList;
=====*/

	// module:
	//		dojox/mobile/EdgeToEdgeCategory
	// summary:
	//		An edge-to-edge layout list.

	return declare("dojox.mobile.EdgeToEdgeList", RoundRectList, {
		// summary:
		//		An edge-to-edge layout list.
		// description:
		//		EdgeToEdgeList is an edge-to-edge layout list, which displays
		//		all items in equally sized rows. Each item must be
		//		dojox.mobile.ListItem.

		buildRendering: function(){
			this.inherited(arguments);
			this.domNode.className = "mblEdgeToEdgeList";
		}
	});
});

},
'dojox/mobile/uacss':function(){
define("dojox/mobile/uacss", [
	"dojo/_base/kernel",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojox/mobile/sniff"
], function(dojo, lang, win, has){
	win.doc.documentElement.className += lang.trim([
		has("bb") ? "dj_bb" : "",
		has("android") ? "dj_android" : "",
		has("iphone") ? "dj_iphone" : "",
		has("ipod") ? "dj_ipod" : "",
		has("ipad") ? "dj_ipad" : ""
	].join(" ").replace(/ +/g," "));
	return dojo;
});

},
'dijit/form/_RadioButtonMixin':function(){
define("dijit/form/_RadioButtonMixin", [
	"dojo/_base/array", // array.forEach
	"dojo/_base/declare", // declare
	"dojo/dom-attr", // domAttr.set
	"dojo/_base/event", // event.stop
	"dojo/_base/lang", // lang.hitch
	"dojo/query", // query
	"dojo/_base/window", // win.doc
	"../registry"	// registry.getEnclosingWidget
], function(array, declare, domAttr, event, lang, query, win, registry){

	// module:
	//		dijit/form/_RadioButtonMixin
	// summary:
	// 		Mixin to provide widget functionality for an HTML radio button

	return declare("dijit.form._RadioButtonMixin", null, {
		// summary:
		// 		Mixin to provide widget functionality for an HTML radio button

		// type: [private] String
		//		type attribute on <input> node.
		//		Users should not change this value.
		type: "radio",

		_getRelatedWidgets: function(){
			// Private function needed to help iterate over all radio buttons in a group.
			var ary = [];
			query("input[type=radio]", this.focusNode.form || win.doc).forEach( // can't use name= since query doesn't support [] in the name
				lang.hitch(this, function(inputNode){
					if(inputNode.name == this.name && inputNode.form == this.focusNode.form){
						var widget = registry.getEnclosingWidget(inputNode);
						if(widget){
							ary.push(widget);
						}
					}
				})
			);
			return ary;
		},

		_setCheckedAttr: function(/*Boolean*/ value){
			// If I am being checked then have to deselect currently checked radio button
			this.inherited(arguments);
			if(!this._created){ return; }
			if(value){
				array.forEach(this._getRelatedWidgets(), lang.hitch(this, function(widget){
					if(widget != this && widget.checked){
						widget.set('checked', false);
					}
				}));
			}
		},

		_onClick: function(/*Event*/ e){
			if(this.checked || this.disabled){ // nothing to do
				event.stop(e);
				return false;
			}
			if(this.readOnly){ // ignored by some browsers so we have to resync the DOM elements with widget values
				event.stop(e);
				array.forEach(this._getRelatedWidgets(), lang.hitch(this, function(widget){
					domAttr.set(this.focusNode || this.domNode, 'checked', widget.checked);
				}));
				return false;
			}
			return this.inherited(arguments);
		}
	});
});

},
'dijit/_WidgetBase':function(){
define("dijit/_WidgetBase", [
	"require",			// require.toUrl
	"dojo/_base/array", // array.forEach array.map
	"dojo/aspect",
	"dojo/_base/config", // config.blankGif
	"dojo/_base/connect", // connect.connect
	"dojo/_base/declare", // declare
	"dojo/dom", // dom.byId
	"dojo/dom-attr", // domAttr.set domAttr.remove
	"dojo/dom-class", // domClass.add domClass.replace
	"dojo/dom-construct", // domConstruct.create domConstruct.destroy domConstruct.place
	"dojo/dom-geometry",	// isBodyLtr
	"dojo/dom-style", // domStyle.set, domStyle.get
	"dojo/_base/kernel",
	"dojo/_base/lang", // mixin(), isArray(), etc.
	"dojo/on",
	"dojo/ready",
	"dojo/Stateful", // Stateful
	"dojo/topic",
	"dojo/_base/window", // win.doc.createTextNode
	"./registry"	// registry.getUniqueId(), registry.findWidgets()
], function(require, array, aspect, config, connect, declare,
			dom, domAttr, domClass, domConstruct, domGeometry, domStyle, kernel,
			lang, on, ready, Stateful, topic, win, registry){

/*=====
var Stateful = dojo.Stateful;
=====*/

// module:
//		dijit/_WidgetBase
// summary:
//		Future base class for all Dijit widgets.

// For back-compat, remove in 2.0.
if(!kernel.isAsync){
	ready(0, function(){
		var requires = ["dijit/_base/manager"];
		require(requires);	// use indirection so modules not rolled into a build
	});
}

// Nested hash listing attributes for each tag, all strings in lowercase.
// ex: {"div": {"style": true, "tabindex" true}, "form": { ...
var tagAttrs = {};
function getAttrs(obj){
	var ret = {};
	for(var attr in obj){
		ret[attr.toLowerCase()] = true;
	}
	return ret;
}

function nonEmptyAttrToDom(attr){
	// summary:
	//		Returns a setter function that copies the attribute to this.domNode,
	//		or removes the attribute from this.domNode, depending on whether the
	//		value is defined or not.
	return function(val){
		domAttr[val ? "set" : "remove"](this.domNode, attr, val);
		this._set(attr, val);
	};
}

return declare("dijit._WidgetBase", Stateful, {
	// summary:
	//		Future base class for all Dijit widgets.
	// description:
	//		Future base class for all Dijit widgets.
	//		_Widget extends this class adding support for various features needed by desktop.
	//
	//		Provides stubs for widget lifecycle methods for subclasses to extend, like postMixInProperties(), buildRendering(),
	//		postCreate(), startup(), and destroy(), and also public API methods like set(), get(), and watch().
	//
	//		Widgets can provide custom setters/getters for widget attributes, which are called automatically by set(name, value).
	//		For an attribute XXX, define methods _setXXXAttr() and/or _getXXXAttr().
	//
	//		_setXXXAttr can also be a string/hash/array mapping from a widget attribute XXX to the widget's DOMNodes:
	//
	//		- DOM node attribute
	// |		_setFocusAttr: {node: "focusNode", type: "attribute"}
	// |		_setFocusAttr: "focusNode"	(shorthand)
	// |		_setFocusAttr: ""		(shorthand, maps to this.domNode)
	// 		Maps this.focus to this.focusNode.focus, or (last example) this.domNode.focus
	//
	//		- DOM node innerHTML
	//	|		_setTitleAttr: { node: "titleNode", type: "innerHTML" }
	//		Maps this.title to this.titleNode.innerHTML
	//
	//		- DOM node innerText
	//	|		_setTitleAttr: { node: "titleNode", type: "innerText" }
	//		Maps this.title to this.titleNode.innerText
	//
	//		- DOM node CSS class
	// |		_setMyClassAttr: { node: "domNode", type: "class" }
	//		Maps this.myClass to this.domNode.className
	//
	//		If the value of _setXXXAttr is an array, then each element in the array matches one of the
	//		formats of the above list.
	//
	//		If the custom setter is null, no action is performed other than saving the new value
	//		in the widget (in this).
	//
	//		If no custom setter is defined for an attribute, then it will be copied
	//		to this.focusNode (if the widget defines a focusNode), or this.domNode otherwise.
	//		That's only done though for attributes that match DOMNode attributes (title,
	//		alt, aria-labelledby, etc.)

	// id: [const] String
	//		A unique, opaque ID string that can be assigned by users or by the
	//		system. If the developer passes an ID which is known not to be
	//		unique, the specified ID is ignored and the system-generated ID is
	//		used instead.
	id: "",
	_setIdAttr: "domNode",	// to copy to this.domNode even for auto-generated id's

	// lang: [const] String
	//		Rarely used.  Overrides the default Dojo locale used to render this widget,
	//		as defined by the [HTML LANG](http://www.w3.org/TR/html401/struct/dirlang.html#adef-lang) attribute.
	//		Value must be among the list of locales specified during by the Dojo bootstrap,
	//		formatted according to [RFC 3066](http://www.ietf.org/rfc/rfc3066.txt) (like en-us).
	lang: "",
	// set on domNode even when there's a focus node.   but don't set lang="", since that's invalid.
	_setLangAttr: nonEmptyAttrToDom("lang"),

	// dir: [const] String
	//		Bi-directional support, as defined by the [HTML DIR](http://www.w3.org/TR/html401/struct/dirlang.html#adef-dir)
	//		attribute. Either left-to-right "ltr" or right-to-left "rtl".  If undefined, widgets renders in page's
	//		default direction.
	dir: "",
	// set on domNode even when there's a focus node.   but don't set dir="", since that's invalid.
	_setDirAttr: nonEmptyAttrToDom("dir"),	// to set on domNode even when there's a focus node

	// textDir: String
	//		Bi-directional support,	the main variable which is responsible for the direction of the text.
	//		The text direction can be different than the GUI direction by using this parameter in creation
	//		of a widget.
	// 		Allowed values:
	//			1. "ltr"
	//			2. "rtl"
	//			3. "auto" - contextual the direction of a text defined by first strong letter.
	//		By default is as the page direction.
	textDir: "",

	// class: String
	//		HTML class attribute
	"class": "",
	_setClassAttr: { node: "domNode", type: "class" },

	// style: String||Object
	//		HTML style attributes as cssText string or name/value hash
	style: "",

	// title: String
	//		HTML title attribute.
	//
	//		For form widgets this specifies a tooltip to display when hovering over
	//		the widget (just like the native HTML title attribute).
	//
	//		For TitlePane or for when this widget is a child of a TabContainer, AccordionContainer,
	//		etc., it's used to specify the tab label, accordion pane title, etc.
	title: "",

	// tooltip: String
	//		When this widget's title attribute is used to for a tab label, accordion pane title, etc.,
	//		this specifies the tooltip to appear when the mouse is hovered over that text.
	tooltip: "",

	// baseClass: [protected] String
	//		Root CSS class of the widget (ex: dijitTextBox), used to construct CSS classes to indicate
	//		widget state.
	baseClass: "",

	// srcNodeRef: [readonly] DomNode
	//		pointer to original DOM node
	srcNodeRef: null,

	// domNode: [readonly] DomNode
	//		This is our visible representation of the widget! Other DOM
	//		Nodes may by assigned to other properties, usually through the
	//		template system's data-dojo-attach-point syntax, but the domNode
	//		property is the canonical "top level" node in widget UI.
	domNode: null,

	// containerNode: [readonly] DomNode
	//		Designates where children of the source DOM node will be placed.
	//		"Children" in this case refers to both DOM nodes and widgets.
	//		For example, for myWidget:
	//
	//		|	<div data-dojo-type=myWidget>
	//		|		<b> here's a plain DOM node
	//		|		<span data-dojo-type=subWidget>and a widget</span>
	//		|		<i> and another plain DOM node </i>
	//		|	</div>
	//
	//		containerNode would point to:
	//
	//		|		<b> here's a plain DOM node
	//		|		<span data-dojo-type=subWidget>and a widget</span>
	//		|		<i> and another plain DOM node </i>
	//
	//		In templated widgets, "containerNode" is set via a
	//		data-dojo-attach-point assignment.
	//
	//		containerNode must be defined for any widget that accepts innerHTML
	//		(like ContentPane or BorderContainer or even Button), and conversely
	//		is null for widgets that don't, like TextBox.
	containerNode: null,

/*=====
	// _started: Boolean
	//		startup() has completed.
	_started: false,
=====*/

	// attributeMap: [protected] Object
	//		Deprecated.   Instead of attributeMap, widget should have a _setXXXAttr attribute
	//		for each XXX attribute to be mapped to the DOM.
	//
	//		attributeMap sets up a "binding" between attributes (aka properties)
	//		of the widget and the widget's DOM.
	//		Changes to widget attributes listed in attributeMap will be
	//		reflected into the DOM.
	//
	//		For example, calling set('title', 'hello')
	//		on a TitlePane will automatically cause the TitlePane's DOM to update
	//		with the new title.
	//
	//		attributeMap is a hash where the key is an attribute of the widget,
	//		and the value reflects a binding to a:
	//
	//		- DOM node attribute
	// |		focus: {node: "focusNode", type: "attribute"}
	// 		Maps this.focus to this.focusNode.focus
	//
	//		- DOM node innerHTML
	//	|		title: { node: "titleNode", type: "innerHTML" }
	//		Maps this.title to this.titleNode.innerHTML
	//
	//		- DOM node innerText
	//	|		title: { node: "titleNode", type: "innerText" }
	//		Maps this.title to this.titleNode.innerText
	//
	//		- DOM node CSS class
	// |		myClass: { node: "domNode", type: "class" }
	//		Maps this.myClass to this.domNode.className
	//
	//		If the value is an array, then each element in the array matches one of the
	//		formats of the above list.
	//
	//		There are also some shorthands for backwards compatibility:
	//		- string --> { node: string, type: "attribute" }, for example:
	//	|	"focusNode" ---> { node: "focusNode", type: "attribute" }
	//		- "" --> { node: "domNode", type: "attribute" }
	attributeMap: {},

	// _blankGif: [protected] String
	//		Path to a blank 1x1 image.
	//		Used by <img> nodes in templates that really get their image via CSS background-image.
	_blankGif: config.blankGif || require.toUrl("dojo/resources/blank.gif"),

	//////////// INITIALIZATION METHODS ///////////////////////////////////////

	postscript: function(/*Object?*/params, /*DomNode|String*/srcNodeRef){
		// summary:
		//		Kicks off widget instantiation.  See create() for details.
		// tags:
		//		private
		this.create(params, srcNodeRef);
	},

	create: function(/*Object?*/params, /*DomNode|String?*/srcNodeRef){
		// summary:
		//		Kick off the life-cycle of a widget
		// params:
		//		Hash of initialization parameters for widget, including
		//		scalar values (like title, duration etc.) and functions,
		//		typically callbacks like onClick.
		// srcNodeRef:
		//		If a srcNodeRef (DOM node) is specified:
		//			- use srcNodeRef.innerHTML as my contents
		//			- if this is a behavioral widget then apply behavior
		//			  to that srcNodeRef
		//			- otherwise, replace srcNodeRef with my generated DOM
		//			  tree
		// description:
		//		Create calls a number of widget methods (postMixInProperties, buildRendering, postCreate,
		//		etc.), some of which of you'll want to override. See http://dojotoolkit.org/reference-guide/dijit/_WidgetBase.html
		//		for a discussion of the widget creation lifecycle.
		//
		//		Of course, adventurous developers could override create entirely, but this should
		//		only be done as a last resort.
		// tags:
		//		private

		// store pointer to original DOM tree
		this.srcNodeRef = dom.byId(srcNodeRef);

		// For garbage collection.  An array of listener handles returned by this.connect() / this.subscribe()
		this._connects = [];

		// For widgets internal to this widget, invisible to calling code
		this._supportingWidgets = [];

		// this is here for back-compat, remove in 2.0 (but check NodeList-instantiate.html test)
		if(this.srcNodeRef && (typeof this.srcNodeRef.id == "string")){ this.id = this.srcNodeRef.id; }

		// mix in our passed parameters
		if(params){
			this.params = params;
			lang.mixin(this, params);
		}
		this.postMixInProperties();

		// generate an id for the widget if one wasn't specified
		// (be sure to do this before buildRendering() because that function might
		// expect the id to be there.)
		if(!this.id){
			this.id = registry.getUniqueId(this.declaredClass.replace(/\./g,"_"));
		}
		registry.add(this);

		this.buildRendering();

		if(this.domNode){
			// Copy attributes listed in attributeMap into the [newly created] DOM for the widget.
			// Also calls custom setters for all attributes with custom setters.
			this._applyAttributes();

			// If srcNodeRef was specified, then swap out original srcNode for this widget's DOM tree.
			// For 2.0, move this after postCreate().  postCreate() shouldn't depend on the
			// widget being attached to the DOM since it isn't when a widget is created programmatically like
			// new MyWidget({}).   See #11635.
			var source = this.srcNodeRef;
			if(source && source.parentNode && this.domNode !== source){
				source.parentNode.replaceChild(this.domNode, source);
			}
		}

		if(this.domNode){
			// Note: for 2.0 may want to rename widgetId to dojo._scopeName + "_widgetId",
			// assuming that dojo._scopeName even exists in 2.0
			this.domNode.setAttribute("widgetId", this.id);
		}
		this.postCreate();

		// If srcNodeRef has been processed and removed from the DOM (e.g. TemplatedWidget) then delete it to allow GC.
		if(this.srcNodeRef && !this.srcNodeRef.parentNode){
			delete this.srcNodeRef;
		}

		this._created = true;
	},

	_applyAttributes: function(){
		// summary:
		//		Step during widget creation to copy  widget attributes to the
		//		DOM according to attributeMap and _setXXXAttr objects, and also to call
		//		custom _setXXXAttr() methods.
		//
		//		Skips over blank/false attribute values, unless they were explicitly specified
		//		as parameters to the widget, since those are the default anyway,
		//		and setting tabIndex="" is different than not setting tabIndex at all.
		//
		//		For backwards-compatibility reasons attributeMap overrides _setXXXAttr when
		//		_setXXXAttr is a hash/string/array, but _setXXXAttr as a functions override attributeMap.
		// tags:
		//		private

		// Get list of attributes where this.set(name, value) will do something beyond
		// setting this[name] = value.  Specifically, attributes that have:
		//		- associated _setXXXAttr() method/hash/string/array
		//		- entries in attributeMap.
		var ctor = this.constructor,
			list = ctor._setterAttrs;
		if(!list){
			list = (ctor._setterAttrs = []);
			for(var attr in this.attributeMap){
				list.push(attr);
			}

			var proto = ctor.prototype;
			for(var fxName in proto){
				if(fxName in this.attributeMap){ continue; }
				var setterName = "_set" + fxName.replace(/^[a-z]|-[a-zA-Z]/g, function(c){ return c.charAt(c.length-1).toUpperCase(); }) + "Attr";
				if(setterName in proto){
					list.push(fxName);
				}
			}
		}

		// Call this.set() for each attribute that was either specified as parameter to constructor,
		// or was found above and has a default non-null value.   For correlated attributes like value and displayedValue, the one
		// specified as a parameter should take precedence, so apply attributes in this.params last.
		// Particularly important for new DateTextBox({displayedValue: ...}) since DateTextBox's default value is
		// NaN and thus is not ignored like a default value of "".
		array.forEach(list, function(attr){
			if(this.params && attr in this.params){
				// skip this one, do it below
			}else if(this[attr]){
				this.set(attr, this[attr]);
			}
		}, this);
		for(var param in this.params){
			this.set(param, this[param]);
		}
	},

	postMixInProperties: function(){
		// summary:
		//		Called after the parameters to the widget have been read-in,
		//		but before the widget template is instantiated. Especially
		//		useful to set properties that are referenced in the widget
		//		template.
		// tags:
		//		protected
	},

	buildRendering: function(){
		// summary:
		//		Construct the UI for this widget, setting this.domNode.
		//		Most widgets will mixin `dijit._TemplatedMixin`, which implements this method.
		// tags:
		//		protected

		if(!this.domNode){
			// Create root node if it wasn't created by _Templated
			this.domNode = this.srcNodeRef || domConstruct.create('div');
		}

		// baseClass is a single class name or occasionally a space-separated list of names.
		// Add those classes to the DOMNode.  If RTL mode then also add with Rtl suffix.
		// TODO: make baseClass custom setter
		if(this.baseClass){
			var classes = this.baseClass.split(" ");
			if(!this.isLeftToRight()){
				classes = classes.concat( array.map(classes, function(name){ return name+"Rtl"; }));
			}
			domClass.add(this.domNode, classes);
		}
	},

	postCreate: function(){
		// summary:
		//		Processing after the DOM fragment is created
		// description:
		//		Called after the DOM fragment has been created, but not necessarily
		//		added to the document.  Do not include any operations which rely on
		//		node dimensions or placement.
		// tags:
		//		protected
	},

	startup: function(){
		// summary:
		//		Processing after the DOM fragment is added to the document
		// description:
		//		Called after a widget and its children have been created and added to the page,
		//		and all related widgets have finished their create() cycle, up through postCreate().
		//		This is useful for composite widgets that need to control or layout sub-widgets.
		//		Many layout widgets can use this as a wiring phase.
		if(this._started){ return; }
		this._started = true;
		array.forEach(this.getChildren(), function(obj){
			if(!obj._started && !obj._destroyed && lang.isFunction(obj.startup)){
				obj.startup();
				obj._started = true;
			}
		});
	},

	//////////// DESTROY FUNCTIONS ////////////////////////////////

	destroyRecursive: function(/*Boolean?*/ preserveDom){
		// summary:
		// 		Destroy this widget and its descendants
		// description:
		//		This is the generic "destructor" function that all widget users
		// 		should call to cleanly discard with a widget. Once a widget is
		// 		destroyed, it is removed from the manager object.
		// preserveDom:
		//		If true, this method will leave the original DOM structure
		//		alone of descendant Widgets. Note: This will NOT work with
		//		dijit._Templated widgets.

		this._beingDestroyed = true;
		this.destroyDescendants(preserveDom);
		this.destroy(preserveDom);
	},

	destroy: function(/*Boolean*/ preserveDom){
		// summary:
		// 		Destroy this widget, but not its descendants.
		//		This method will, however, destroy internal widgets such as those used within a template.
		// preserveDom: Boolean
		//		If true, this method will leave the original DOM structure alone.
		//		Note: This will not yet work with _Templated widgets

		this._beingDestroyed = true;
		this.uninitialize();

		// remove this.connect() and this.subscribe() listeners
		var c;
		while(c = this._connects.pop()){
			c.remove();
		}

		// destroy widgets created as part of template, etc.
		var w;
		while(w = this._supportingWidgets.pop()){
			if(w.destroyRecursive){
				w.destroyRecursive();
			}else if(w.destroy){
				w.destroy();
			}
		}

		this.destroyRendering(preserveDom);
		registry.remove(this.id);
		this._destroyed = true;
	},

	destroyRendering: function(/*Boolean?*/ preserveDom){
		// summary:
		//		Destroys the DOM nodes associated with this widget
		// preserveDom:
		//		If true, this method will leave the original DOM structure alone
		//		during tear-down. Note: this will not work with _Templated
		//		widgets yet.
		// tags:
		//		protected

		if(this.bgIframe){
			this.bgIframe.destroy(preserveDom);
			delete this.bgIframe;
		}

		if(this.domNode){
			if(preserveDom){
				domAttr.remove(this.domNode, "widgetId");
			}else{
				domConstruct.destroy(this.domNode);
			}
			delete this.domNode;
		}

		if(this.srcNodeRef){
			if(!preserveDom){
				domConstruct.destroy(this.srcNodeRef);
			}
			delete this.srcNodeRef;
		}
	},

	destroyDescendants: function(/*Boolean?*/ preserveDom){
		// summary:
		//		Recursively destroy the children of this widget and their
		//		descendants.
		// preserveDom:
		//		If true, the preserveDom attribute is passed to all descendant
		//		widget's .destroy() method. Not for use with _Templated
		//		widgets.

		// get all direct descendants and destroy them recursively
		array.forEach(this.getChildren(), function(widget){
			if(widget.destroyRecursive){
				widget.destroyRecursive(preserveDom);
			}
		});
	},

	uninitialize: function(){
		// summary:
		//		Stub function. Override to implement custom widget tear-down
		//		behavior.
		// tags:
		//		protected
		return false;
	},

	////////////////// GET/SET, CUSTOM SETTERS, ETC. ///////////////////

	_setStyleAttr: function(/*String||Object*/ value){
		// summary:
		//		Sets the style attribute of the widget according to value,
		//		which is either a hash like {height: "5px", width: "3px"}
		//		or a plain string
		// description:
		//		Determines which node to set the style on based on style setting
		//		in attributeMap.
		// tags:
		//		protected

		var mapNode = this.domNode;

		// Note: technically we should revert any style setting made in a previous call
		// to his method, but that's difficult to keep track of.

		if(lang.isObject(value)){
			domStyle.set(mapNode, value);
		}else{
			if(mapNode.style.cssText){
				mapNode.style.cssText += "; " + value;
			}else{
				mapNode.style.cssText = value;
			}
		}

		this._set("style", value);
	},

	_attrToDom: function(/*String*/ attr, /*String*/ value, /*Object?*/ commands){
		// summary:
		//		Reflect a widget attribute (title, tabIndex, duration etc.) to
		//		the widget DOM, as specified by commands parameter.
		//		If commands isn't specified then it's looked up from attributeMap.
		//		Note some attributes like "type"
		//		cannot be processed this way as they are not mutable.
		//
		// tags:
		//		private

		commands = arguments.length >= 3 ? commands : this.attributeMap[attr];

		array.forEach(lang.isArray(commands) ? commands : [commands], function(command){

			// Get target node and what we are doing to that node
			var mapNode = this[command.node || command || "domNode"];	// DOM node
			var type = command.type || "attribute";	// class, innerHTML, innerText, or attribute

			switch(type){
				case "attribute":
					if(lang.isFunction(value)){ // functions execute in the context of the widget
						value = lang.hitch(this, value);
					}

					// Get the name of the DOM node attribute; usually it's the same
					// as the name of the attribute in the widget (attr), but can be overridden.
					// Also maps handler names to lowercase, like onSubmit --> onsubmit
					var attrName = command.attribute ? command.attribute :
						(/^on[A-Z][a-zA-Z]*$/.test(attr) ? attr.toLowerCase() : attr);

					domAttr.set(mapNode, attrName, value);
					break;
				case "innerText":
					mapNode.innerHTML = "";
					mapNode.appendChild(win.doc.createTextNode(value));
					break;
				case "innerHTML":
					mapNode.innerHTML = value;
					break;
				case "class":
					domClass.replace(mapNode, value, this[attr]);
					break;
			}
		}, this);
	},

	get: function(name){
		// summary:
		//		Get a property from a widget.
		//	name:
		//		The property to get.
		// description:
		//		Get a named property from a widget. The property may
		//		potentially be retrieved via a getter method. If no getter is defined, this
		// 		just retrieves the object's property.
		//
		// 		For example, if the widget has properties `foo` and `bar`
		//		and a method named `_getFooAttr()`, calling:
		//		`myWidget.get("foo")` would be equivalent to calling
		//		`widget._getFooAttr()` and `myWidget.get("bar")`
		//		would be equivalent to the expression
		//		`widget.bar2`
		var names = this._getAttrNames(name);
		return this[names.g] ? this[names.g]() : this[name];
	},

	set: function(name, value){
		// summary:
		//		Set a property on a widget
		//	name:
		//		The property to set.
		//	value:
		//		The value to set in the property.
		// description:
		//		Sets named properties on a widget which may potentially be handled by a
		// 		setter in the widget.
		//
		// 		For example, if the widget has properties `foo` and `bar`
		//		and a method named `_setFooAttr()`, calling
		//		`myWidget.set("foo", "Howdy!")` would be equivalent to calling
		//		`widget._setFooAttr("Howdy!")` and `myWidget.set("bar", 3)`
		//		would be equivalent to the statement `widget.bar = 3;`
		//
		//		set() may also be called with a hash of name/value pairs, ex:
		//
		//	|	myWidget.set({
		//	|		foo: "Howdy",
		//	|		bar: 3
		//	|	});
		//
		//	This is equivalent to calling `set(foo, "Howdy")` and `set(bar, 3)`

		if(typeof name === "object"){
			for(var x in name){
				this.set(x, name[x]);
			}
			return this;
		}
		var names = this._getAttrNames(name),
			setter = this[names.s];
		if(lang.isFunction(setter)){
			// use the explicit setter
			var result = setter.apply(this, Array.prototype.slice.call(arguments, 1));
		}else{
			// Mapping from widget attribute to DOMNode attribute/value/etc.
			// Map according to:
			//		1. attributeMap setting, if one exists (TODO: attributeMap deprecated, remove in 2.0)
			//		2. _setFooAttr: {...} type attribute in the widget (if one exists)
			//		3. apply to focusNode or domNode if standard attribute name, excluding funcs like onClick.
			// Checks if an attribute is a "standard attribute" by whether the DOMNode JS object has a similar
			// attribute name (ex: accept-charset attribute matches jsObject.acceptCharset).
			// Note also that Tree.focusNode() is a function not a DOMNode, so test for that.
			var defaultNode = this.focusNode && !lang.isFunction(this.focusNode) ? "focusNode" : "domNode",
				tag = this[defaultNode].tagName,
				attrsForTag = tagAttrs[tag] || (tagAttrs[tag] = getAttrs(this[defaultNode])),
				map =	name in this.attributeMap ? this.attributeMap[name] :
						names.s in this ? this[names.s] :
						((names.l in attrsForTag && typeof value != "function") ||
							/^aria-|^data-|^role$/.test(name)) ? defaultNode : null;
			if(map != null){
				this._attrToDom(name, value, map);
			}
			this._set(name, value);
		}
		return result || this;
	},

	_attrPairNames: {},		// shared between all widgets
	_getAttrNames: function(name){
		// summary:
		//		Helper function for get() and set().
		//		Caches attribute name values so we don't do the string ops every time.
		// tags:
		//		private

		var apn = this._attrPairNames;
		if(apn[name]){ return apn[name]; }
		var uc = name.replace(/^[a-z]|-[a-zA-Z]/g, function(c){ return c.charAt(c.length-1).toUpperCase(); });
		return (apn[name] = {
			n: name+"Node",
			s: "_set"+uc+"Attr",	// converts dashes to camel case, ex: accept-charset --> _setAcceptCharsetAttr
			g: "_get"+uc+"Attr",
			l: uc.toLowerCase()		// lowercase name w/out dashes, ex: acceptcharset
		});
	},

	_set: function(/*String*/ name, /*anything*/ value){
		// summary:
		//		Helper function to set new value for specified attribute, and call handlers
		//		registered with watch() if the value has changed.
		var oldValue = this[name];
		this[name] = value;
		if(this._watchCallbacks && this._created && value !== oldValue){
			this._watchCallbacks(name, oldValue, value);
		}
	},

	on: function(/*String*/ type, /*Function*/ func){
		// summary:
		//		Call specified function when event occurs, ex: myWidget.on("click", function(){ ... }).
		// description:
		//		Call specified function when event `type` occurs, ex: `myWidget.on("click", function(){ ... })`.
		//		Note that the function is not run in any particular scope, so if (for example) you want it to run in the
		//		widget's scope you must do `myWidget.on("click", lang.hitch(myWidget, func))`.

		return aspect.after(this, this._onMap(type), func, true);
	},

	_onMap: function(/*String*/ type){
		// summary:
		//		Maps on() type parameter (ex: "mousemove") to method name (ex: "onMouseMove")
		var ctor = this.constructor, map = ctor._onMap;
		if(!map){
			map = (ctor._onMap = {});
			for(var attr in ctor.prototype){
				if(/^on/.test(attr)){
					map[attr.replace(/^on/, "").toLowerCase()] = attr;
				}
			}
		}
		return map[type.toLowerCase()];	// String
	},

	toString: function(){
		// summary:
		//		Returns a string that represents the widget
		// description:
		//		When a widget is cast to a string, this method will be used to generate the
		//		output. Currently, it does not implement any sort of reversible
		//		serialization.
		return '[Widget ' + this.declaredClass + ', ' + (this.id || 'NO ID') + ']'; // String
	},

	getChildren: function(){
		// summary:
		//		Returns all the widgets contained by this, i.e., all widgets underneath this.containerNode.
		//		Does not return nested widgets, nor widgets that are part of this widget's template.
		return this.containerNode ? registry.findWidgets(this.containerNode) : []; // dijit._Widget[]
	},

	getParent: function(){
		// summary:
		//		Returns the parent widget of this widget
		return registry.getEnclosingWidget(this.domNode.parentNode);
	},

	connect: function(
			/*Object|null*/ obj,
			/*String|Function*/ event,
			/*String|Function*/ method){
		// summary:
		//		Connects specified obj/event to specified method of this object
		//		and registers for disconnect() on widget destroy.
		// description:
		//		Provide widget-specific analog to dojo.connect, except with the
		//		implicit use of this widget as the target object.
		//		Events connected with `this.connect` are disconnected upon
		//		destruction.
		// returns:
		//		A handle that can be passed to `disconnect` in order to disconnect before
		//		the widget is destroyed.
		// example:
		//	|	var btn = new dijit.form.Button();
		//	|	// when foo.bar() is called, call the listener we're going to
		//	|	// provide in the scope of btn
		//	|	btn.connect(foo, "bar", function(){
		//	|		console.debug(this.toString());
		//	|	});
		// tags:
		//		protected

		var handle = connect.connect(obj, event, this, method);
		this._connects.push(handle);
		return handle;		// _Widget.Handle
	},

	disconnect: function(handle){
		// summary:
		//		Disconnects handle created by `connect`.
		//		Also removes handle from this widget's list of connects.
		// tags:
		//		protected
		var i = array.indexOf(this._connects, handle);
		if(i != -1){
			handle.remove();
			this._connects.splice(i, 1);
		}
	},

	subscribe: function(t, method){
		// summary:
		//		Subscribes to the specified topic and calls the specified method
		//		of this object and registers for unsubscribe() on widget destroy.
		// description:
		//		Provide widget-specific analog to dojo.subscribe, except with the
		//		implicit use of this widget as the target object.
		// t: String
		//		The topic
		// method: Function
		//		The callback
		// example:
		//	|	var btn = new dijit.form.Button();
		//	|	// when /my/topic is published, this button changes its label to
		//	|   // be the parameter of the topic.
		//	|	btn.subscribe("/my/topic", function(v){
		//	|		this.set("label", v);
		//	|	});
		// tags:
		//		protected
		var handle = topic.subscribe(t, lang.hitch(this, method));
		this._connects.push(handle);
		return handle;		// _Widget.Handle
	},

	unsubscribe: function(/*Object*/ handle){
		// summary:
		//		Unsubscribes handle created by this.subscribe.
		//		Also removes handle from this widget's list of subscriptions
		// tags:
		//		protected
		this.disconnect(handle);
	},

	isLeftToRight: function(){
		// summary:
		//		Return this widget's explicit or implicit orientation (true for LTR, false for RTL)
		// tags:
		//		protected
		return this.dir ? (this.dir == "ltr") : domGeometry.isBodyLtr(); //Boolean
	},

	isFocusable: function(){
		// summary:
		//		Return true if this widget can currently be focused
		//		and false if not
		return this.focus && (domStyle.get(this.domNode, "display") != "none");
	},

	placeAt: function(/* String|DomNode|_Widget */reference, /* String?|Int? */position){
		// summary:
		//		Place this widget's domNode reference somewhere in the DOM based
		//		on standard domConstruct.place conventions, or passing a Widget reference that
		//		contains and addChild member.
		//
		// description:
		//		A convenience function provided in all _Widgets, providing a simple
		//		shorthand mechanism to put an existing (or newly created) Widget
		//		somewhere in the dom, and allow chaining.
		//
		// reference:
		//		The String id of a domNode, a domNode reference, or a reference to a Widget possessing
		//		an addChild method.
		//
		// position:
		//		If passed a string or domNode reference, the position argument
		//		accepts a string just as domConstruct.place does, one of: "first", "last",
		//		"before", or "after".
		//
		//		If passed a _Widget reference, and that widget reference has an ".addChild" method,
		//		it will be called passing this widget instance into that method, supplying the optional
		//		position index passed.
		//
		// returns:
		//		dijit._Widget
		//		Provides a useful return of the newly created dijit._Widget instance so you
		//		can "chain" this function by instantiating, placing, then saving the return value
		//		to a variable.
		//
		// example:
		// | 	// create a Button with no srcNodeRef, and place it in the body:
		// | 	var button = new dijit.form.Button({ label:"click" }).placeAt(win.body());
		// | 	// now, 'button' is still the widget reference to the newly created button
		// | 	button.on("click", function(e){ console.log('click'); }));
		//
		// example:
		// |	// create a button out of a node with id="src" and append it to id="wrapper":
		// | 	var button = new dijit.form.Button({},"src").placeAt("wrapper");
		//
		// example:
		// |	// place a new button as the first element of some div
		// |	var button = new dijit.form.Button({ label:"click" }).placeAt("wrapper","first");
		//
		// example:
		// |	// create a contentpane and add it to a TabContainer
		// |	var tc = dijit.byId("myTabs");
		// |	new dijit.layout.ContentPane({ href:"foo.html", title:"Wow!" }).placeAt(tc)

		if(reference.declaredClass && reference.addChild){
			reference.addChild(this, position);
		}else{
			domConstruct.place(this.domNode, reference, position);
		}
		return this;
	},

	getTextDir: function(/*String*/ text,/*String*/ originalDir){
		// summary:
		//		Return direction of the text.
		//		The function overridden in the _BidiSupport module,
		//		its main purpose is to calculate the direction of the
		//		text, if was defined by the programmer through textDir.
		//	tags:
		//		protected.
		return originalDir;
	},

	applyTextDir: function(/*===== element, text =====*/){
		// summary:
		//		The function overridden in the _BidiSupport module,
		//		originally used for setting element.dir according to this.textDir.
		//		In this case does nothing.
		// element: DOMNode
		// text: String
		// tags:
		//		protected.
	}
});

});

}}});

define("app/main", [], 1);
