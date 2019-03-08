var el = false;

(function() {
    'use strict';

    /**
     * Tests for browser support.
     */

    var innerHTMLBug = false;
    var bugTestDiv;
    if (typeof document !== 'undefined') {
        bugTestDiv = document.createElement('div');
        // Setup
        bugTestDiv.innerHTML = '  <link/><table></table><a href="/a">a</a><input type="checkbox"/>';
        // Make sure that link elements get serialized correctly by innerHTML
        // This requires a wrapper element in IE
        innerHTMLBug = !bugTestDiv.getElementsByTagName('link').length;
        bugTestDiv = undefined;
    }

    /**
     * Wrap map from jquery.
     */

    var map = {
        legend: [1, '<fieldset>', '</fieldset>'],
        tr: [2, '<table><tbody>', '</tbody></table>'],
        col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
        // for script/link/style tags to work in IE6-8, you have to wrap
        // in a div with a non-whitespace character in front, ha!
        _default: innerHTMLBug ? [1, 'X<div>', '</div>'] : [0, '', '']
    };

    map.td =
    map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

    map.option =
    map.optgroup = [1, '<select multiple="multiple">', '</select>'];

    map.thead =
    map.tbody =
    map.colgroup =
    map.caption =
    map.tfoot = [1, '<table>', '</table>'];

    map.polyline =
    map.ellipse =
    map.polygon =
    map.circle =
    map.text =
    map.line =
    map.path =
    map.rect =
    map.g = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">','</svg>'];

    /**
     * Parse `html` and return a DOM Node instance, which could be a TextNode,
     * HTML DOM Node of some kind (<div> for example), or a DocumentFragment
     * instance, depending on the contents of the `html` string.
     *
     * @param {String} html - HTML string to "domify"
     * @param {Document} doc - The `document` instance to create the Node for
     * @return {DOMNode} the TextNode, DOM Node, or DocumentFragment instance
     * @api private
     */

    function parse(html, doc) {
        if ('string' != typeof html) throw new TypeError('String expected');

        // default to the global `document` object
        if (!doc) doc = document;

        // tag name
        var m = /<([\w:]+)/.exec(html);
        if (!m) return doc.createTextNode(html);

        html = html.replace(/^\s+|\s+$/g, ''); // Remove leading/trailing whitespace

        var tag = m[1];

        // body support
        if (tag == 'body') {
            var el = doc.createElement('html');
            el.innerHTML = html;
            return el.removeChild(el.lastChild);
        }

        // wrap map
        var wrap = map[tag] || map._default;
        var depth = wrap[0];
        var prefix = wrap[1];
        var suffix = wrap[2];
        var element = doc.createElement('div');
        element.innerHTML = prefix + html + suffix;
        while (depth--) element = element.lastChild;

        // one element
        if (element.firstChild == element.lastChild) {
            return element.removeChild(element.firstChild);
        }

        // several elements
        var fragment = doc.createDocumentFragment();
        while (element.firstChild) {
            fragment.appendChild(element.removeChild(element.firstChild));
        }

        return fragment;
    }

    function createElement(tag) {
        var result = {};
        result.element = convertStringToElement(tag);
        return elementHandlers(result);
    }

    function convertStringToElement(element) {
        var result = [];
        var i=0;
        if ((typeof(element) === 'object') && (element instanceof HTMLElement)) {
            result.push(element);
        } else if ((typeof(element) === 'object') && (Array.isArray(element))) {
            for (i = 0; i < element.length; i++) {
                result = result.concat(Array.from(convertStringToElement(element[i])));
            }
        } else if ((typeof(jQuery) !== 'undefined') && (element instanceof jQuery)) {
            for (i = 0; i < element.length; i++) {
                result = result.concat(Array.from(convertStringToElement(element[i])));
            }
        } else if (typeof(element) === 'string') {
            var matches = [];
            try {
                matches = document.querySelectorAll(element);
            }
            catch(err) {
                result[0] = parse(element);
            }
            if (matches.length > 0) {
                result = matches;
            }
        }
        return result;
    }

    function elementHandlers(obj) {
        obj.each = function(action) {
            var i = 0;
            while (1) {
                if (typeof(obj.element[i]) === 'undefined') {
                    break;
                }
                action(obj.element[i]);
                i++;
            }
            return obj;
        };
        obj.add = function(element) {
            obj.element = obj.element.concat(convertStringToElement(element));
            return obj;
        };
        obj.css = function(name, val) {
            if (typeof(name) === 'string') {
                if (typeof(val) === 'undefined') {
                    return obj.element[0].style[name];
                } else {
                    obj.each(function(element) {
                        element.style[name] = val;
                    });
                }
            }
            return obj;
        };
        obj.attr = function(name, val) {
            if (typeof(name) === 'string') {
                if (typeof(val) === 'undefined') {
                    return obj.element[0].getAttribute(name);
                } else if (val === '') {
                    obj.each(function(element) {
                        element.removeAttribute(name);
                    });
                } else {
                    obj.each(function(element) {
                        element.setAttribute(name, val);
                    });
                }
            }
            return obj;
        };
        obj.text = function(val) {
            if (typeof(val) === 'undefined') {
                var result = '';
                obj.each(function(element) {
                    result += element.innerText;
                });
                return result;
            } else if (typeof(val) === 'string') {
                obj.each(function(element) {
                    element.innerText = val;
                });
            }
            return obj;
        };
        obj.html = function(val) {
            if (typeof(val) === 'undefined') {
                var result = '';
                obj.each(function(element) {
                    result += element.innerHTML;
                });
                return result;
            } else if (typeof(val) === 'string') {
                obj.each(function(element) {
                    element.innerHTML = val;
                });
            }
            return obj;
        };
        obj.append = function(child) {
            var i, n;
            if ((typeof(child) === 'object') && (child instanceof HTMLElement)) {
                if (obj.element.length > 0) {
                    obj.element[0].appendChild(child);
                }
                if (obj.element.length > 1) {
                    for (n = 1; n < obj.element.length; n++) {
                        obj.element[n].appendChild(child.cloneNode(true));
                    }
                }
            } else if ((typeof(child) === 'object') && (typeof(child.element) === 'object') && (child.element instanceof HTMLElement)) {
                if (obj.element.length > 0) {
                    obj.element[0].appendChild(child.element);
                }
                if (obj.element.length > 1) {
                    for (n = 1; n < obj.element.length; n++) {
                        obj.element[n].appendChild(child.element.cloneNode(true));
                    }
                }
            } else if ((typeof(child) === 'object') && (typeof(child.element) === 'object') && (Array.isArray(child.element))) {
                for (i = 0; i < child.element.length; i++) {
                    obj.append(child.element[i]);
                }
            } else if ((typeof(jQuery) !== 'undefined') && (child instanceof jQuery)) {
                for (i = 0; i < child.length; i++) {
                    obj.append(child[i]);
                }
            } else if ((typeof(child) === 'object') && (Array.isArray(child))) {
                for (i = 0; i < child.length; i++) {
                    obj.append(child[i]);
                }
            } else if (typeof(child) === 'string') {
                for (n = 0; n < obj.element.length; n++) {
                    obj.element[n].appendChild(document.createTextNode(child));
                }
            }
            return obj;
        };
        obj.out = function() {
            return obj.element;
        };
        obj.id = function(val) {
            if (typeof(val) === 'undefined') {
                return obj.element[0].id;
            } else {
                obj.element[0].id = val;
            }
            return obj;
        };
        obj.addClass = function(name) {
            if (typeof(name) === 'string') {
                var parts = name.split(' ');
                for (var i = 0; i < parts.length; i++) {
                    (function(_parts, _i, _obj) {
                        _obj.each(function(element) {
                            element.classList.add(_parts[_i]);
                        });
                    })(parts, i, obj);
                }
            }
            return obj;
        };
        obj.removeClass = function(name) {
            if (typeof(name) === 'string') {
                var parts = name.split(' ');
                for (var i = 0; i < parts.length; i++) {
                    (function(_parts, _i, _obj) {
                        _obj.each(function(element) {
                            element.classList.remove(_parts[_i]);
                        });
                    })(parts, i, obj);
                }
            }
            return obj;
        };
        obj.hasClass = function(name) {
            if (typeof(name) === 'string') {
                var result = false;
                obj.each(function(element) {
                    if (element.classList.contains(name) === true) {
                        result = true;
                    }
                });
                return result;
            }
            return false;
        };
        obj.val = function(val) {
            if (typeof(val) === 'undefined') {
                return obj.element[0].value;
            } else {
                obj.each(function(element) {
                    element.value = val;
                });
            }
            return obj;
        };
        obj.addEvent = function(eventName, eventAction, options) {
            obj.each(function(element) {
                if (typeof(element.addEventListener) === 'function') {
                    element.addEventListener(eventName, eventAction, options);
                }
            });
            return obj;
        };
        obj.removeEvent = function(eventName, eventAction) {
            obj.each(function(element) {
                if (typeof(element.removeEventListener) === 'function') {
                    element.removeEventListener(eventName, eventAction);
                }
            });
            return obj;
        };
        obj.data = function(name, val) {
            if (typeof(val) === 'undefined') {
                if (obj.element.length > 0) {
                    if (typeof(obj.element[0].dataset[name]) !== 'undefined') {
                        return obj.element[0].dataset[name];
                    }
                }
                return false;
            }
            obj.each(function(element) {
                element.dataset[name] = val;
            });
            return obj;
        };
        obj.find = function(selector) {
            var result = [];

            obj.each(function(element) {
                var matches = [];
                try {
                    matches = element.querySelectorAll(selector);
                }
                catch(err) {
                }
                if (matches.length > 0) {
                    result = result.concat(Array.from(matches));
                }    
            });

            return el(result);
        };
        obj.remove = function() {
            obj.each(function(element) {
                element.parentNode.removeChild(element);
            });
            return obj;
        };
        obj.stop = function() {
            obj.removeEvent('transitionend');
            delete obj.animationCallback;

            var props = obj.css('transationProperty');
            if (props !== 'undefined') {
                props = String(props).split(',');

                // Set the values for each element to be the current computed value
                obj.each(function(element) {
                    var style = window.getComputedStyle(element);

                    for (var i = 0; i < props.length; i++) {
                        element.style[props[i]] = style[props[i]];
                    }
                });
            }
            obj.css('transitionDuration', '').css('transitionProperty', '');

            return obj;
        };
        obj.ani = function(props, duration, cb) {
            // Stop any current animations
            obj.stop();

            var propList = [];
            for (var key in props) { 
                if (!props.hasOwnProperty(key)) {
                    continue;
                }
                propList.push(key);
            }

            // Set the starting values for the transition
            obj.each(function(element) {
                var style = window.getComputedStyle(element);

                for (var key in props) { 
                    if (!props.hasOwnProperty(key)) {
                        continue;
                    }

                    if ((typeof(props[key]) !== 'object') || (typeof(props[key].begin) === 'undefined')) {
                        // Calc the current value of this property
                        element.style[key] = style[key];
                    } else {
                        element.style[key] = props[key].begin;
                    }
                }
            });

            obj.css('transationProperty', propList.join(','));

            obj.animationCallback = cb;

            setTimeout(function() {
                obj.addEvent('transitionend', obj.animateComplete, {once: true});
                if (typeof(duration) === 'number') {
                    obj.css('transitionDuration', duration + 'ms');
                } else {
                    obj.css('transationDuration', '200ms');
                }

                // Set the target animation values
                obj.each(function(element) {
                    for (var key in props) { 
                        if (!props.hasOwnProperty(key)) {
                            continue;
                        }

                        if ((typeof(props[key]) === 'string') || (typeof(props[key]) === 'number')) {
                            element.style[key] = props[key];
                        } else if ((typeof(props[key]) === 'object') && (typeof(props[key].end) !== 'undefined')) {
                            element.style[key] = props[key].end;
                        }
                    }
                });
            }, 16);

            return obj;
        };
        obj.animateComplete = function(e) {
            e.stopPropagation();
            if (typeof(obj.animationCallback) === 'function') {
                obj.animationCallback(obj);
            }
            return obj;
        };

        return obj;
    }

    el = function(param1) {
        return createElement(param1);
    };
}());
