(function() {
    'use strict';

    function handlers(obj) {
        obj.fadeIn = function(duration) {
            obj.css('transitionDuration', '').addClass('el-hidden').addClass('el-fade').css('display', '').css('transitionDuration', duration + 'ms');
            setTimeout(function() {
                obj.removeClass('el-hidden');
            }, 16);
            return obj;
        };
        obj.fadeOut = function(duration) {
            obj.css('transitionDuration', '').removeClass('el-hidden').addClass('el-fade').css('transitionDuration', duration + 'ms');
            obj.element.addEventListener('animationend', obj.fadeOutComplete);
            setTimeout(function() {
                obj.addClass('el-hidden');
            }, 16);
            return obj;
        };
        obj.fadeOutComplete = function() {
            obj.css('display', 'none');
            obj.element.removeEventListener(obj.fadeOutComplete);
            return obj;
        };
        obj.slideDown = function(duration) {
            obj.css('transitionDuration', '').addClass('el-hidden').addClass('el-slide').css('transitionDuration', duration + 'ms').removeClass('el-hidden');
            return obj;
        };
        obj.slideUp = function(duration) {
            obj.css('transitionDuration', '').removeClass('el-hidden').addClass('el-slide').css('transitionDuration', duration + 'ms').addClass('el-hidden');
            return obj;
        };
        return obj;
    }

    elHandlers.push(handlers);
}());