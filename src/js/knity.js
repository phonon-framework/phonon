/* ========================================================================
* Knity.js v0.0.1
* Knity.js is developed by Quarkdev
* ========================================================================
* Licensed under MIT
* ======================================================================== */

'use strict';

;(function(window) {


	var noGlobal = typeof window.document;

	/*
	 * @api: public API
	*/
	var api = {};

	/*
	 * @models: stored observables
	*/
	var models = [];

	/*
	 * @templates: templates are stored for the foreach binding
	 * template scripts are not required
	*/
	var templates = [];

	/**
	 * Defines an observable variable
	 * Observable variables can be all types (array, primitives, ...)
	 * @param {String} initialValue
	*/
	api.observable = function (initialValue) {

		/*
		 * @keyName
		*/
		var keyName;

		/*
		 * @latestValue
		*/
		var latestValue = initialValue;

		/*
		 * This callback is useful if we want to be notify
		 * when the observable's data has changed
		*/
		var onUpdateFunction;

		var observable = function (value) {
			if(arguments.length === 0) {

				// Getter
				return latestValue;

			} else {

				// Setter

				var oldValue = latestValue;

				if(oldValue instanceof Array) {
					if(value instanceof Array) {
						// Replace current array
						latestValue = value;
					} else {
						latestValue.push(value);
					}
				} else {
					latestValue = value;
				}

				if(!keyName) {

					// Finds the keyName in key-value storage

					var j = models.length - 1;

					for (; j >= 0; j--) {
						var kv = models[j];
						if(kv.observable() === latestValue) {
							keyName = kv.key;
							break;
						}
					}
				}

				// Document object is not available on NodeJS
				if(noGlobal !== typeof undefined) {

					var binders = document.querySelectorAll('*[data-knity]');

					if(binders) {
						var i = binders.length - 1;
						for (; i >= 0; i--) {
							var binder = binders[i];
							if(binder.getAttribute('data-knity').indexOf(keyName) !== -1) {
								updateElement(binder, latestValue);
							}
						}
					}
				}

				if(typeof onUpdateFunction === 'function') {
					onUpdateFunction(keyName, latestValue);
				}

				return {
					onUpdate: _onUpdate
				};
			}
		};

		var _onUpdate = function (callback) {
			if(typeof callback !== 'function') {
				throw new Error('callback must be a function');
			}
			onUpdateFunction = callback;
		};

		return observable;
	};

	/*
	 * Setup the viewModel with its DOM element
	 * @param {Object} viewModel
	 * @param {DOMElement} el
	 * @param {String} scope: used in the function itself if necessary
	*/
	api.attach = function (viewModel, el, scope) {
		if(typeof viewModel !== 'object') {
			throw new Error('The view model must be an object');
		}
		if(!isElement(el)) {
			throw new Error('The View-Model must be attached to a DOM element. ' + typeof el + ' given');
		}

		var key;

		for(key in viewModel) {
			if(typeof viewModel[key] === 'function') {
				var fn = viewModel[key];
				if(fn.toString() === api.observable().toString()) {

					if(scope) {
						models.push({key: scope + '.' + key, value: fn(), observable: fn});
					} else {
						models.push({key: key, value: fn(), observable: fn});
					}
				}
			} else if(typeof viewModel[key] === 'object') {

				// Objects can contain observables
				if(scope) {
					scope += '.' + key;
				} else {
					scope = key;
				}

				api.attach(viewModel[key], el, scope);
				scope = '';
			}
		}

		var elements = el.querySelectorAll('[data-knity]'), l = elements.length, i = l - 1;
		for (; i >= 0; i--) {
			bindElement(elements[i], viewModel);
		}
	};

	/**
	 * Adds the 'keyup' event on the input
	 * @param {DOMElement} el
	 * @param {Observable} observable
	*/
	var addInputListener = function (el, observable) {
		el.addEventListener('keyup', function (evt) {
			var target = evt.target, value = target.value;
			if(observable() === value) {
				evt.preventDefault();
				return;
			}
			observable(value);
		});
	};

	/**
	 * Binds a DOM element with its observable
	 * @param {DOMElement} el
	 * @private
	*/
	var bindElement = function (el) {
        var attr = el.getAttribute('data-knity').trim();
        var r = /(?:\s|^)(\w+):\s*(.*?)(?=\s+\w+:|$)/g, m;

        while ((m = r.exec(attr))) {

            var binding = m[1].trim();
            var variable = m[2].trim().replace(',', '');

			var obs = findObservable(variable);

			if(obs) {

				updateElement(el, obs(), el.parentNode);

				if (binding === 'value') {
					addInputListener(el, obs);
				}
            }
        }
	};

	/**
	 * Updates the DOM element with new data
	 * @param {DOMElement} el
	 * @param {String} nodeValue
	 * @private
	*/
	var updateElement = function (el, nodeValue) {

        var data = el.getAttribute('data-knity').trim();
        var r = /(?:\s|^)(\w+):\s*(.*?)(?=\s+\w+:|$)/g, m;

        while ((m = r.exec(data))) {

            var binding = m[1].trim();

            if (binding === 'text') {
                setText(el, nodeValue);
            } else if (binding === 'value') {
                setValue(el, nodeValue);
            } else if (binding === 'placeholder') {
                setPlaceholder(el, nodeValue);
            } else if (binding === 'class') {
            	setClass(el, nodeValue);
            } else if (binding === 'foreach') {
            	foreach(el, nodeValue);
            } else {
                throw new Error('The property: ' + binding + ' is unknown');
            }
        }
	};

	/**
	 * Retrieves the observable object of the given variable
	 * @param {String} varName
	 * @return {Observable}
	 * @private
	*/
	var findObservable = function (varName) {

		var i = models.length - 1;
		for (; i >= 0; i--) {
			var kv = models[i];

			if(kv.key === varName) {
				return kv.observable;
			}
		}
		return false;
	};

	/*
	 * The foreach binding
	 * @param {DOMElement} el
	 * @param {Array} array
	 * @private
	*/
	var foreach = function (el, array) {
		if(!(array instanceof Array)) {
			throw new Error('The foreach binding only works with arrays, be sure that you correctly instanciated the observable with a valid array. ' + typeof array + ' is given');
		}

		var templateExists = -1;

		for (var i = templates.length - 1; i >= 0; i--) {
			var obj = templates[i];
			if(obj.el.getAttribute('data-knity') === el.getAttribute('data-knity')) {
				templateExists = i;
				break;
			}
		}

		var template = '';

		if(templateExists === -1) {
			var _el = el.cloneNode(true);
			templates.push({el: el, tpl: _el.innerHTML});

			template = _el.innerHTML;
		} else {
			el = templates[templateExists].el;
			template = templates[templateExists].tpl;
		}

		var m = template.match(/\{{2}[ \t]*(.[a-zA-Z0-9_]+)[ \t]*\}{2}/g);

		var res = [];
		var computed = '';

		if(m !== null) {

			var j = 0, size = array.length;

			for (; j < size; j++) {

				computed = template;

				var objA = array[j];

				for (i = m.length - 1; i >= 0; i--) {

					var bracket = m[i];
					var varName = bracket.replace('{{', '').replace('}}', '').trim();

					if(varName[0] === '#') {

						varName = varName.substr(1);

						if(typeof objA[varName] !== 'undefined') {


							if(objA[varName] === true) {
								
								computed = computed.replace(new RegExp('\\{{2}\\#'+varName+'\\}{2}([\\s\\S]*?)\\{{2}\\/'+varName+'\\}{2}', 'g'), '$1');

								// Remove else statement completely
								computed = computed.replace(new RegExp('\\{{2}[ \\t]*(\\^'+varName+')[ \\t]*\\}{2}([\\s\\S]*?)\\{{2}[ \\t]*(\\/'+varName+')[ \\t]*\\}{2}', 'g'), '');

							} else {
								
								computed = computed.replace(new RegExp('\\{{2}\\^'+varName+'\\}{2}([\\s\\S]*?)\\{{2}\\/'+varName+'\\}{2}', 'g'), '$1');

								// Remove if statement completely
								computed = computed.replace(new RegExp('\\{{2}[ \\t]*(\\#'+varName+')[ \\t]*\\}{2}([\\s\\S]*?)\\{{2}[ \\t]*(\\/'+varName+')[ \\t]*\\}{2}', 'g'), '');
							}
						} else {
							throw new Error('The variable: ' + varName + ' is not found');
						}

					} else if(varName[0] !== '/' && varName[0] !== '^') {

						var value;

						if(typeof objA[varName] !== 'undefined') {
							value = objA[varName];
						} else {

							// the varName can be $index and $value, the '$' symbol must be parsed

							if(varName === '$index') {
								varName = '\\' + varName;
								value = j;
							} else if(varName === '$value') {
								varName = '\\' + varName;
								value = objA;
							}
						}

						if(typeof value === 'string') {
							value = value.replace(/<[^>]*>/g, '');
						}

						computed = computed.replace(new RegExp('\\{{2}[ \\t]*('+varName+')[ \\t]*\\}{2}','g'), value);
					}
				}

				res.push(computed);
			}
		}
		
		el.innerHTML = '';

		var n = 0, length = res.length;

		for (; n < length; n++) {
			el.innerHTML += res[n];
		}
	};

    /**
     * The class binding
     * @private
    */
    var setClass = function (el, cssClass) {
    	el.setAttribute('class', cssClass);
    	return el;
    };

    /**
     * The text binding
     * @param {DOMObject} el
     * @param {String} text
     * @private
    */
    var setText = function (el, text) {
        if(!('textContent' in el)) {
            el.innerText = text;
        } else {
            el.textContent = text;
        }
        return el;
    };

    /**
     * The value binding
     * @param {DOMObject} el
     * @param {String} text
     * @private
    */
    var setValue = function (el, text) {
        el.value = text;
    };

    /**
     * The placeholder binding
     * @param {DOMObject} el
     * @param {String} text
     * @private
    */
    var setPlaceholder = function (el, text) {
        el.setAttribute('placeholder', text);
    };

    /**
     * Checks if the given argument is a DOM element
     * @param {DOMObject} o the argument to test
     * @return true if the object is a DOM element, false otherwise
     * @private
    */
    var isElement = function (o) {
        return (typeof Node === 'object' ? o instanceof Node : o && typeof o === 'object' && typeof o.nodeType === 'number' && typeof o.nodeName === 'string');
    };

    if (noGlobal !== typeof undefined) {
    	window.Knity = api;
    }

    if (typeof define === 'function' && define.amd) {
        define('knity', [], function () {
            return api;
        });
    }

    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }

    return api;

}(typeof window !== 'undefined' ? window : this));