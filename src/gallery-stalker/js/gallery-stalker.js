/**
* <p>Stalker plugin will allow you to keep elements at a fixed position "floating" but at 
* the same time, keeping those elements embeded to the layout of the page. The general idea 
* is that an element can control it's own position within the layout in order to keep its 
* area within the viewport boundaries.
* 
* <p>To use the Stalker Plugin, simply pass a reference to the plugin to a 
* Node instance's <code>plug</code> method.</p>
* 
* <p>
* <code>
* &#60;script type="text/javascript"&#62; <br>
* <br>
*		//	Call the "use" method, passing in "gallery-stalker".	 This will <br>
*		//	load the script for the Stalker Plugin and all of <br>
*		//	the required dependencies. <br>
* <br>
*		YUI().use("gallery-stalker", function(Y) { <br>
* <br>
*			Y.one('#mytarget').plug(Y.Plugin.Stalker); <br>
* <br>
*		}); <br>
* <br>	
*	&#60;/script&#62; <br>
* </code>
* </p>
* @module gallery-stalker
*/


//	Util shortcuts
var UA = Y.UA,
getClassName = Y.ClassNameManager.getClassName,

//	Frequently used strings
STALKER = "stalker",
HOST = "host",
PX = 'px',

//	CSS class names
CLASS_STALKER = getClassName(STALKER);

//	Utility functions
/**
	* The NodeStalker class is a plugin for a Node instance.The class is used via  
	* the <a href="Node.html#method_plug"><code>plug</code></a> method of Node and 
	* should not be instantiated directly.
	* @namespace Y.Plugin
	* @class NodeStalker
	*/
Y.namespace('Plugin').NodeStalker = Y.Base.create("NodeStalker", Y.Plugin.Base, [], {

	// Prototype Properties for NodeStalker

	/** 
	* @property _root
	* @description Node instance representing the target node to follow.
	* @default null
	* @protected
	* @type Node
	*/
	_root: null,
	_eventHandlers: [],

	//	Public methods
	initializer: function(config) {
		var fn = Y.bind(this.refresh, this);
		if ((this._root = this.get(HOST))) {

			this._root.addClass(CLASS_STALKER);

			// Wire up all event handlers
			this._eventHandlers.push(Y.on('scroll', fn));
			this._eventHandlers.push(Y.on('windowresize', fn));
			
		}
	},

	destructor: function() {
		if (this._root) {
			this._root.removeClass(CLASS_STALKER);
		}
		Y.Array.each(this._eventHandlers,
		function(handle) {
			handle.detach();
		});
	},

	/**
	* @method refresh
	* @description Refreshing the position of the element in every scroll/resize event
	* @public
	*/
	refresh: function() {
		Y.log ('Refreshing the target', 'info', STALKER);
		
		var top = Y.DOM.docScrollY(),
			left = Y.DOM.docScrollX(),
			n = this._root,
			r = n.get('parentNode').getXY(),
			c = ["marginTop", "marginLeft", "borderLeftWidth", "borderTopWidth"];

		// viewport computations
		r[1] = Math.max(0, r[1] - top);
		r[0] = r[0] - left;
		// node size computation
		Y.Array.each(c,
		function(v) {
			r[v] = parseInt(n.getStyle(v), 10) || 0;
		});
		n.setStyles({
			top: r[1] - r.borderTopWidth - r.marginTop,
			left: r[0] - r.borderLeftWidth - r.marginLeft,
			position: 'fixed'
		});
	},

	//	Protected methods
	/**
	* @method _IE6Fix
	* @description Adding a CSS expression to workaround the lack of "position:fixed" in IE6
	* @protected
	* @return {boolean} whether or not is this fix needed
	*/
	_IE6Fix: function() {
		var targetID,
		parentID,
		css;
		if (UA.ie == 6) {
			Y.log('Appliying IE6 fix for static position.', 'info', STALKER);
			targetID = this._root.get('id');
			parentID = this._root.get('parentNode').get('id');
			css = "#" + targetID + " {top:expression((ignore = document.documentElement.scrollTop>document.getElementById('" + parentID + "').offsetTop) ? document.documentElement.scrollTop : document.getElementById('" + parentID + "').offsetTop + 'px' );}";
			// adding CSS to the page
			Y.on('domready',
			function(e) {
				Y.log('Inserting IE6 fix in the page: ' + css, 'info', STALKER);
				// TODO
			});
			return true;
		}
	}
	
}, {

	// Static Properties for NodeStalker
	
	NS: STALKER,
	
	/**
	 * @property NodeStalker.ATTRS
	 * @type Object
	 * @static
	 */
	ATTRS: {}
	
});



YUI.add('stalker-plugin', function(Y) {
2
3/**
4* <p>Stalker plugin will allow you to keep elements at a fixed position "floating" but at
5* the same time, keeping those elements embeded to the layout of the page. The general idea
6* is that an element can control it's own position within the layout in order to keep its
7* area within the viewport boundaries.
8*
9* <p>To use the Stalker Plugin, simply pass a reference to the plugin to a
10* Node instance's <code>plug</code> method.</p>
11*
12* <p>
13* <code>
14* &#60;script type="text/javascript"&#62; <br>
15* <br>
16* // Call the "use" method, passing in "gallery-stalker". This will <br>
17* // load the script for the Stalker Plugin and all of <br>
18* // the required dependencies. <br>
19* <br>
20* YUI().use("gallery-stalker", function(Y) { <br>
21* <br>
22* Y.one('#mytarget').plug(Y.Plugin.NodeStalker); <br>
23* <br>
24* }); <br>
25* <br>
26* &#60;/script&#62; <br>
27* </code>
28* </p>
29* @module gallery-stalker
30*/
31
32
33// Util shortcuts
34var UA = Y.UA,
35 getClassName = Y.ClassNameManager.getClassName,
36
37// Frequently used strings
38 STALKER = "stalker",
39 HOST = "host",
40 PX = 'px',
41
42// CSS class names
43 CLASS_STALKER = getClassName(STALKER);
44
45// Utility functions
46/**
47* The NodeStalker class is a plugin for a Node instance.The class is used via
48* the <a href="Node.html#method_plug"><code>plug</code></a> method of Node and
49* should not be instantiated directly.
50* @namespace Y.Plugin
51* @class NodeStalker
52*/
53Y.namespace('Plugin').NodeStalker2 = Y.Base.create("nodeStalker2", Y.Plugin.Base, [], {
54 // Protected properties
55 /**
56 * @property _root
57 * @description Node instance representing the target node to follow.
58 * @default null
59 * @protected
60 * @type Node
61 */
62 _root: null,
63 _eventHandlers: [],
64 _startPos: null,
65
66 // Public methods
67 initializer: function(config) {
68 var fn = Y.bind(this.refresh, this);
69 if ((this._root = this.get(HOST))) {
70
71 this._root.addClass(CLASS_STALKER);
72
73 // Wire up all event handlers
74 this._eventHandlers.push(Y.on('scroll', fn), Y.on('windowresize', fn));
75
76 //Set the width explicitly so it doesn't become too large
77 this._root.setStyle("width", this._root.getStyle("width"));
78
79 this._startPos = this._root.getXY();
80 }
81 },
82
83 destructor: function() {
84 if (this._root) {
85 this._root.removeClass(CLASS_STALKER);
86 }
87 Y.Array.each(this._eventHandlers,
88 function(handle) {
89 handle.detach();
90 });
91 },
92
93 /**
94 * @method refresh
95 * @description Refreshing the position of the element in every scroll/resize event
96 * @public
97 */
98 refresh: function() {
99
100 var top = Y.DOM.docScrollY(),
101 left = Y.DOM.docScrollX(),
102 n = this._root,
103 r = this._startPos.slice(0),
104 c = ["marginTop", "marginLeft", "borderLeftWidth", "borderTopWidth"],
105 pos, i, l;
106
107 if(top < this._startPos[1]) {
108 pos = "static";
109 } else {
110 pos = "fixed";
111
112 // viewport computations
113 r[1] = Math.max(0, r[1] - top);
114 r[0] = r[0] - left;
115
116 // node size computation
117 for(i = 0, l = c.length; i < l; i++) {
118 r[c[i]] = parseInt(n.getStyle(c[i]), 10) || 0;
119 }
120
121 r = [ r[0] - r.borderLeftWidth - r.marginLeft, r[1] - r.borderTopWidth - r.marginTop ];
122 }
123
124 n.setStyles({
125 top: r[1],
126 left: r[0],
127 position: pos
128 });
129 },
130
131 // Protected methods
132 /**
133 * @method _IE6Fix
134 * @description Adding a CSS expression to workaround the lack of "position:fixed" in IE6
135 * @protected
136 * @return {boolean} whether or not is this fix needed
137 */
138 _IE6Fix: function() {
139 var targetID,
140 parentID,
141 css;
142
143 if (UA.ie == 6) {
144 targetID = this._root.get('id');
145 parentID = this._root.get('parentNode').get('id');
146 css = "#" + targetID + " {top:expression((ignore = document.documentElement.scrollTop>document.getElementById('" + parentID + "').offsetTop) ? document.documentElement.scrollTop : document.getElementById('" + parentID + "').offsetTop + 'px' );}";
147 // adding CSS to the page
148 Y.on('domready',
149 function(e) {
150 // TODO
151 });
152 return true;
153 }
154 }
155}, {
156 NAME : "NodeStalker",
157 NS : STALKER,
158 ATTRS : {}
159});
160
161}, 'gallery-2010.04.02-17-26' ,{requires:['base', 'plugin', 'node-base', 'event-resize', 'event-base', 'dom-screen', 'classnamemanager']});
