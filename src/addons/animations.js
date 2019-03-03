(function() {
    'use strict';

    function handlers(obj) {
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

    elHandlers.push(handlers);
}());