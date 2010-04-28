/**
* <p>The Dispatcher satisfies a very common need of developers using the 
* YUI library: dynamic execution of Ajax response content. Typical strategies to 
* fulfill this need, like executing the innerHTML property or referencing remote 
* scripts, are unreliable due to browser incompatibilities. The Dispatcher normalize 
* this behavior across all a-grade browsers.
* 
* <p>To use the Dispatcher Module, simply create a new object based on Y.Dispatcher
* and pass a reference to a node that should be handled.</p>
* 
* <p>
* <code>
* &#60;script type="text/javascript"&#62; <br>
* <br>
* 		//	Call the "use" method, passing in "gallery-dispatcher".  This will <br>
* 		//	load the script for the Dispatcher Module and all of <br>
* 		//	the required dependencies. <br>
* <br>
* 		YUI().use("gallery-dispatcher", function(Y) { <br>
* <br>
*			(new Y.Dispatcher ({<br>
*			    node: '#demoajax',<br>
*				 content: 'Please wait... (Injecting fragment.html)'<br>
*			})).set('uri', 'fragment.html');<br>
* <br>
* <br>		
* 	&#60;/script&#62; <br>
* </code>
* </p>
*
* <p>The Dispatcher has several configuration properties that can be 
* set via an object literal that is passed as a first argument during the
* initialization, or using "set" method.
* </p>
*
* @module gallery-dispatcher
*/

//	Util shortcuts
var UA = Y.UA,
	getClassName = Y.ClassNameManager.getClassName,

	//	Frequently used strings
	DISPATCHER = "dispatcher",
	PERIOD = ".",
	SC = "script",
	DISPATCHER_START = 'start',
    DISPATCHER_PURGE = 'purge',
    DISPATCHER_CHANGE = 'change',
    DISPATCHER_LOAD = 'load',
    
	//	Attribute keys
	ATTR_URI 		 = 'uri',
	ATTR_CONTENT 	 = 'content',
	ATTR_AUTOPURGE 	 = 'autopurge',
	ATTR_LOADING     = 'loading',
	ATTRS			 = [ATTR_AUTOPURGE, ATTR_LOADING, ATTR_CONTENT, ATTR_URI],
	
	//	CSS class names
	CLASS_DISPATCHER 			 = getClassName(DISPATCHER),
	CLASS_DISPATCHER_LOADING 	 = getClassName(DISPATCHER, 'loading'),
   	
	//	CSS selectors
	SELECTOR_DISPATCHER = PERIOD + CLASS_DISPATCHER,       
	
	// shorthands
    L = Y.Lang,
    isBoolean= L.isBoolean,
    isString = L.isString,
    isObject = L.isObject,	
    
	/**
	* The Dispatcher class represents an object that can manage Node Elements to
	* inject HTML content as the content of the Node..
	* @namespace plugin
	* @class Dispatcher
	*/
Dispatcher = function() {
	Dispatcher.superclass.constructor.apply(this, arguments);
};

//	Utility functions
function _parseContent(content) {
	var fragment = Y.Node.create('<div></div>'),
		o = {};
	
	fragment.setContent (content);
	   
	o.js = fragment.all(SC).each(function (n) {
		fragment.removeChild (n);
	});
	o.content = fragment.get('innerHTML');
	return o;
}

// Dispatcher definition
Y.mix(Dispatcher, {

    /**
     * The identity of the component.
     *
     * @property Dispatcher.NAME
     * @type String
     * @static
     */
    NAME : DISPATCHER,

    /**
     * @property Dispatcher._hashtable
     * @type Array
     * @static
     */
    _hashtable : [],

    /**
     * Static property used to define the default attribute configuration of
     * the component.
     *
     * @property Dispatcher.ATTRS
     * @Type Object
     * @static
     */
    ATTRS : {

 		/**
 		* If dispatcher should purge the DOM elements before replacing the content
 		* @attribute autopurge
 		* @default true
 		* @type boolean
 		*/	
 		autopurge: {
 			value: true,
 			writeOnce: true,
 			validator : isBoolean
 		},
 		/**
 		* URL that should be injected within the host
 		* @attribute uri
 		* @default null
 		* @type string
 		*/	
 		uri: {
 			value: null,
 			setter : function (v) {
 				Y.log ('dispatching a new url','info',DISPATCHER);
 				this.stop ();
 				this._io = this._fetch(v);
				return v;
			},
 			validator: function (v) {
 	            return (v && isString(v) && (v!==''));
 	        }
 		},
 		/**
 		* default content for the dynamic area
 		* @attribute content
 		* @default null
 		* @type string
 		*/	
 		content: {
 			value: '',
 			setter : function (v) {
 				Y.log ('dispatching a new content','info',DISPATCHER);
 				this.stop();
 				this._dispatch(v); // discarding the file name
	            return v;
			},
 			validator : isString
 		},
	    /**
		* Boolean indicating that a process is undergoing.
		* 
		* @attribute loading
		* @default false
		* @readonly
		* @type {boolean}
		*/
		loading: {
			value: false,
			validator: isBoolean,
			readOnly: true,
			setter: function(v) {
				Y.log('setting status to ' + v, 'info', DISPATCHER);
				if (v) {
					this.fire(DISPATCHER_FETCH);
					this.get(ATTR_NODE).addClass(CLASS_DISPATCHER_LOADING);
				} else {
					this.fire(DISPATCHER_LOAD);
					this.get(ATTR_NODE).removeClass(CLASS_DISPATCHER_LOADING);
				}
				return v;
			}
		}
	}
});

Y.extend(Dispatcher, Y.Base, {

	//	Protected properties
	_queue: null,
	_io: null,

	//	Public methods
	initializer: function(config) {
		config = config || {};
		Y.log('Initializer', 'info', DISPATCHER);
		this._queue = new Y.AsyncQueue();

    initializer: function (config) {
		var that = this;
		config = config || {};
		Y.log ('Initializer','info',DISPATCHER);
		this._queue = new Y.AsyncQueue ();
		if (!isObject(config) || !config.node || !(this._node = Y.one(config.node))) {
			Y.log ('Dispatcher requires a NODE to be instantiated','info',DISPATCHER);
			// how can we stop the initialization?
			return;
		}
		
		Y.Array.each (ATTRS, function (v) {
			if (config[v]) {
				that.set (v, config[v]);
			}
    	});

	},

	destructor: function() {
		this.stop();
		this._queue = null;
		this._io = null;
	},
	/**
	 * @method stop
	 * @description Cancel the current loading and execution process immediately
	 * @public
	 * @return	{object} reference for chaining
	 */
	stop: function() {
		this._queue.stop();
		if (this._io) {
			this._io.abort();
		}
		return this;
	},
	/**
	 * Publishes Dispatcher's events
	 *
	 * @method _initEvents
	 * @protected
	 */
	_initEvents: function() {

		/**
		 * Signals when dispatcher starts loading a new remote content (Y.io->start).
		 *
		 * @event fetch
		 * @param event {Event.Facade} An Event Facade object
		 */
		this.publish(DISPATCHER_FETCH);

		/**
		 * Signals the moment when a node become ready, right after the 
		 * html injecting and the execution of the scripts.
		 *
		 * @event ready
		 * @param event {Event.Facade} An Event Facade object
		 */
		this.publish(DISPATCHER_READY);

		/**
		 * Signals the old content has been clean up (Purge), and it's 
		 * ready to get the new content.
		 *
		 * @event purge
		 * @param event {Event.Facade} An Event Facade object
		 */
		this.publish(DISPATCHER_PURGE);

		/**
		 * Signals rigth after injecting the new content but before executing the script tags.
		 *
		 * @event beforeExecute
		 * @param event {Event.Facade} An Event Facade object
		 */
		this.publish(DISPATCHER_BEFOREEXECUTE);

		/**
		 * Signals when the remote content gets ready to be injected in the page (Y.io->success)
		 *
		 * @event load
		 * @param event {Event.Facade} An Event Facade object
		 */
		this.publish(DISPATCHER_LOAD);

	},
	/**
	 * @method _dispatch
	 * @description Dispatch a content into the code, parsing out the scripts, 
	 * injecting the code into the DOM, then executing the scripts.
	 * @protected
	 * @param {string} content html content that should be injected in the page
	 * @return null
	 */
	_dispatch: function(content) {
    	var o = _parseContent (content),
    		q = this._queue,
    		n = this._node;
    	// autopurging children collection
    	if (this.get ('autopurge')) {
    		q.add ({
    			fn: function () {
    				Y.log ('purging children collection','info',DISPATCHER);
	        		n.get ('children').each(function(c) {
	        			c.purge (true);
	        		});
	        	}
    		});
		}

		Y.log('dispatching a new content', 'info', DISPATCHER);

		// autopurging children collection
		if (this.get(ATTR_AUTOPURGE)) {
			q.add({
				fn: function() {
					Y.log('purging children collection', 'info', DISPATCHER);
					n.get('children').each(function(c) {
						c.purge(true);
					});
					that.fire(DISPATCHER_PURGE, n);
				}
			});
		}
		// injecting new content
		q.add({
			fn: function() {
				Y.log('setting new content: ' + o.content, 'info', DISPATCHER);
				n.setContent(o.content);
				that.fire(DISPATCHER_BEFOREEXECUTE, n);
			}
		});
		// executing JS blocks before the injection
		o.js.each(function(jsNode) {
			if (jsNode && jsNode.get('src')) {
				q.add({
					fn: function() {
						Y.log('external script tag: ' + jsNode.get('src'), 'info', DISPATCHER);
						//q.next();
						Y.Get.script(jsNode.get('src'), {
							onFailure: function(o) {
								Y.log('external script tag fail to load: ' + jsNode.get('src'), 'error', DISPATCHER);
							},
							onEnd: function(o) {
								o.purge();
								//removes the script node immediately after executing it
								q.run();
							}
						});
					},
					autoContinue: false
				});
			} else {
				q.add({
					fn: function() {
						// inject js;
						Y.log('inline script tag: ' + jsNode.get('innerHTML'), 'info', DISPATCHER);
						var d = jsNode.get('ownerDocument'),
							h = d.one('head') || d.get ('documentElement'),
							newScript = Y.Node.create('<'+SC+'></'+SC+'>');
						h.replaceChild(jsNode, h.appendChild(newScript));
						if (jsNode._node.text) {
							newScript._node.text = jsNode._node.text;
						}
						jsNode.remove();
						//removes the script node immediately after executing it
					}
				});
			}
		});
		q.add({
			fn: function() {
				that.fire(DISPATCHER_READY);
			}
		});
		// executing the queue
		this._queue.run();
	},
	/**
	* @description Fetching a remote file using Y.io. The response will be dispatched thru _dispatch method...
	* @method _fetch
	* @protected
	* @param {string} uri uri that should be loaded using Y.io
	* @param {object} cfg configuration object that will be used as base configuration for Y.io 
	* (http://developer.yahoo.com/yui/3/io/#configuration)
	* @return object  Reference to the connection handler
	*/
	_fetch: function ( uri, cfg ){
		if (!uri) {
			return false;
		}
		cfg = cfg || {
			method: 'GET'
		};
		cfg.on = {
			start: function () {
		   		Y.log ('Start','info',DISPATCHER);
	   		},
			success: function (tid, o) {
		   		Y.log ('Success: '+o.responseText,'info',DISPATCHER);
		   		this.set(ATTR_CONTENT, o.responseText);
	   		},
	   		failure: function (tid, o) {
	   			Y.log ('Failure: '+uri,'warn',DISPATCHER);
		   	},
			end: function () {
		   		Y.log ('End','info',DISPATCHER);
	   		}
		};
		cfg.context = this;
		return (this._io = Y.io(uri, cfg));
	}
});

Y.Dispatcher = Dispatcher;
