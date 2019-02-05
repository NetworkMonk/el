(function() {
    'use strict';

    function handlers(obj) {
        obj.fadeIn = function(duration) {
            obj.removeEvent('transitionend', obj.fadeInComplete).removeEvent('transitionend', obj.fadeOutComplete)
            .css('transitionDuration', '').css('display', '').css('opacity', '0').css('transitionProperty', 'opacity');
            setTimeout(function() {
                obj.css('transitionDuration', duration + 'ms').css('opacity', '1')
                .addEvent('transitionend', obj.fadeInComplete);
            }, 16);
            return obj;
        };
        obj.fadeInComplete = function() {
            return obj.removeEvent('transitionend', obj.fadeInComplete)
            .css('transitionDuration', '').css('display', '').css('opacity', '').css('transitionProperty', '');
        };
        obj.fadeOut = function(duration) {
            obj.removeEvent('transitionend', obj.fadeInComplete).removeEvent('transitionend', obj.fadeOutComplete)
            .css('transitionDuration', '').css('display', '').css('opacity', '1').css('transitionProperty', 'opacity');
            setTimeout(function() {
                obj.css('transitionDuration', duration + 'ms').css('opacity', '0')
                .addEvent('transitionend', obj.fadeOutComplete);
            }, 16);
            return obj;
        };
        obj.fadeOutComplete = function() {
            return obj.removeEvent('transitionend', obj.fadeOutComplete)
            .css('transitionDuration', '').css('display', 'none').css('opacity', '0').css('transitionProperty', '');
        };
        obj.slideDown = function(duration, includeFade) {
            obj.removeEvent('transitionend', obj.slideDownComplete).removeEvent('transitionend', obj.slideUpComplete)
            .css('transitionDuration', '').css('display', '').css('maxHeight', '0px').css('transitionProperty', 'all')
            .css('overflowY', 'hidden').css('marginTop', '0px').css('marginBottom', '0px').css('paddingTop', '0px').css('paddingBottom', '0px')
            .each(function(element) {
                element.style.maxHeight = '';
                element.dataset.slideHeight = element.clientHeight;
                element.style.maxHeight = '0px';
            });
            if ((typeof(includeFade) === 'boolean') && (includeFade === true)) {
                obj.css('opacity', '0');
            }
            setTimeout(function() {
                obj.css('transitionDuration', duration + 'ms').each(function(element) {
                    if (element.dataset.slideHeight === 0) {
                        el(element).slideDownComplete();
                    } else {
                        element.style.maxHeight = element.dataset.slideHeight + 'px';
                    }
                }).addEvent('transitionend', obj.slideDownComplete);
                if ((typeof(includeFade) === 'boolean') && (includeFade === true)) {
                    obj.css('opacity', '1');
                }
            }, 16);
            return obj;
        };
        obj.slideDownComplete = function() {
            return obj.removeEvent('transitionend', obj.slideDownComplete)
            .css('transitionDuration', '').css('display', '').css('opacity', '').css('maxHeight', '').css('transitionProperty', '')
            .css('overflowY', '').css('marginTop', '').css('marginBottom', '').css('paddingTop', '').css('paddingBottom', '');
        };
        obj.slideUp = function(duration, includeFade) {
            obj.removeEvent('transitionend', obj.slideDownComplete).removeEvent('transitionend', obj.slideUpComplete)
            .css('transitionDuration', '').css('display', '').css('transitionProperty', 'all')
            .css('overflowY', 'hidden')
            .each(function(element) {
                element.style.maxHeight = element.clientHeight + 'px';
            });
            if ((typeof(includeFade) === 'boolean') && (includeFade === true)) {
                obj.css('opacity', '1');
            }
            setTimeout(function() {
                obj.css('transitionDuration', duration + 'ms').css('maxHeight', '0px').css('marginTop', '0px').css('marginBottom', '0px')
                .css('paddingTop', '0px').css('paddingBottom', '0px').addEvent('transitionend', obj.slideUpComplete);
                if ((typeof(includeFade) === 'boolean') && (includeFade === true)) {
                    obj.css('opacity', '0');
                }
            }, 16);
            return obj;
        };
        obj.slideUpComplete = function() {
            return obj.removeEvent('transitionend', obj.slideUpComplete)
            .css('transitionDuration', '').css('display', 'none').css('opacity', '').css('maxHeight', '').css('transitionProperty', '')
            .css('overflowY', '').css('marginTop', '').css('marginBottom', '').css('paddingTop', '').css('paddingBottom', '');
        };
        return obj;
    }

    elHandlers.push(handlers);
}());