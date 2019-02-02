var el = false;
var elHandlers = [];

(function() {
    'use strict';

    function createElement(tag) {
        var result = {};
        result.element = convertStringToElement(tag);
        return elementHandlers(result);
    }

    function convertStringToElement(element) {
        var result = [];
        if ((typeof(element) === 'object') && (element instanceof HTMLElement)) {
            result.push(element);
        } else if ((typeof(element) === 'object') && (Array.isArray(element))) {
            for (var i = 0; i < element.length; i++) {
                result = result.concat(convertStringToElement(element[i]));
            }
        } else if ((typeof(element) === 'string') && (element.indexOf('#') === 0) && (document.getElementById(element.replace('#', '')))) {
            // # is the first character, we can assume this is an ID string of an existing element
            result.push(document.getElementById(element.replace('#', '')));
        } else if ((typeof(element) === 'string') && (element.indexOf('.') === 0) && (document.getElementsByClassName(element.replace('.', '')))) {
            // . is the first character, we can assume this is a class selector of an existing element
            result.push(document.getElementsByClassName(element.replace('.', '')));
        } else if (typeof(element) === 'string') {
            result.push(document.createElement(element));
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
        };
        obj.add = function(element) {
            obj.element.push(convertStringToElement(element));
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
            var i;
            if ((typeof(child) === 'object') && (child instanceof HTMLElement)) {
                obj.element[0].append(child);
            } else if ((typeof(child) === 'object') && (typeof(child.element) === 'object') && (child.element instanceof HTMLElement)) {
                obj.element[0].append(child.element);
            } else if ((typeof(child) === 'object') && (typeof(child.element) === 'object') && (Array.isArray(child.element))) {
                for (i = 0; i < child.element.length; i++) {
                    obj.append(child.element[i]);
                }
            } else if ((typeof(child) === 'object') && (Array.isArray(child))) {
                for (i = 0; i < child.length; i++) {
                    obj.append(child[i]);
                }
            } else if (typeof(child) === 'string') {
                obj.element[0].append(document.createTextNode(child));
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
        obj.addEvent = function(eventName, eventAction) {
            obj.each(function(element) {
                element.addEventListener(eventName, eventAction);
            });
        };
        obj.removeEvent = function(eventName, eventAction) {
            obj.each(function(element) {
                element.removeEventListener(eventName, eventAction);
            });
        };

        var i = 0;
        while (1) {
            if (typeof(elHandlers[i]) === 'undefined') {
                break;
            }
            var func = elHandlers[i];
            obj = func(obj);
            i++;
        }

        return obj;
    }

    el = function(param1) {
        return createElement(param1);
    };
}());
