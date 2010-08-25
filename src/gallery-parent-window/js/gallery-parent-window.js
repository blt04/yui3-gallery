/**
 * Creates a wrapper around an iY.ParentWindow. It loads the content either from a local
 * file or from script and creates a local YUI instance bound to that new window and document.
 * @module ParentWindow
 */     
/**
 * Creates a wrapper around an iY.ParentWindow. It loads the content either from a local
 * file or from script and creates a local YUI instance bound to that new window and document.
 * @class ParentWindow
 * @for ParentWindow
 * @extends Base
 * @constructor
 */

var res = {};
try {
	res.doc = (res.win = window.parent).document;
} catch (e) {
	Y.log('Error trying to access to the parentWindow property, check the cross domain policy details', 'error', 'gallery-parent-window');
	return;
}

Y.log('Creating new parentWindow instance with a single module (yui)', 'info', 'gallery-parent-window');
Y.ParentWindow = YUI({
    debug: true,
    bootstrap: false,
    win: res.win,
    doc: res.doc
}).use ('yui', function(P) {
	// backing up the P.use
	var USE = P.use,
		SLICE = Array.prototype.slice;

	//Dump the instance logs to the parent instance because it's hard to debug the iframe directly
	Y.log = P.log;
	
	// customizing the "use" method to load modules from the iframe, then inject them into the ParentWindow instance.
	P.use = function() {
		var args     = SLICE.call(arguments, 0),
			bk		 = SLICE.call(arguments, 0),
	        callback = args[args.length - 1],
			fn = function() {
				Y.log('Propagating new modules to ParentWindow instance', 'info', 'gallery-parent-window');
				USE.apply (P, bk);
			};
			
		// The last argument supplied to use can be a load complete callback
        if (typeof callback === 'function') {
            args.pop();
		} else {
			callback = null;
		}
		// propagating the callback call to the ParentWindow instance
		args.push(fn);

		// loading modules in the iframe doc
		Y.log('Adding new modules to iframe instance', 'info', 'gallery-parent-window');
		Y.use.apply(Y, args);
		// chaining 
		return P;
	};

});