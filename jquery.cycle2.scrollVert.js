/*! scrollVert transition plugin for Cycle2;  version: 20131028 */
(function($) {
"use strict";

$.fn.cycle.transitions.scrollDown = {
    before: function( opts, curr, next, fwd ) {
        opts.API.stackSlides( opts, curr, next, fwd );
        var height = opts.container.css('overflow','hidden').height();
        opts.cssBefore = { top: fwd ? -height : height, left: 0, opacity: 1, display: 'block' };
        opts.animIn = { top: 0 };
        opts.animOut = { top: fwd ? height : -height };
    }
};

$.fn.cycle.transitions.scrollUp = {
    before: function( opts, curr, next, fwd ) {
        opts.API.stackSlides( opts, curr, next, fwd );
        var height = opts.container.css('overflow','hidden').height();
        opts.cssBefore = { top: 0, left: 0, opacity: 1, display: 'block' };
        opts.animIn = { top: 0 };
        opts.animOut = { top: fwd ? -height : height };
    }
};

$.fn.cycle.transitions.scrollVert = $.fn.cycle.transitions.scrollDown;

})(jQuery);
