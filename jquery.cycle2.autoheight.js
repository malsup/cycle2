/*! Cycle2 autoheight plugin; Copyright (c) M.Alsup, 2012; version: BETA-20120910 */
(function($) {
"use strict";

$.extend($.fn.cycle.defaults, {
    autoHeight: 0
});    

$(document).on( 'cycle-initialized', function( e, opts ) {
    var ratio;
    if ( $.type( opts.autoHeight ) == 'number' && opts.autoHeight >= 0 ) {
        // use existing slide
        opts._sentinel = $( opts.slides[opts.autoHeight] ).clone().css({
            position: 'static',
            visibility: 'hidden',
            display: 'block'
        }).prependTo( opts.container ).removeClass().addClass('cycle-sentinel cycle-slide');
    }
    else if ( $.type( opts.autoHeight ) == 'string' && /\d+\:\d+/.test( opts.autoHeight ) ) { 
        // use ratio
        ratio = opts.autoHeight.match(/(\d+)\:(\d+)/);
        ratio = ratio[1] / ratio[2];
        $(window).on( 'resize', onResize );
        opts._autoHeightOnResize = onResize;
        setTimeout(function() {
            $(window).triggerHandler('resize');
        },15);
    }

    function onResize() {
        opts.container.height( opts.container.width() / ratio );
    }
});

$(document).on( 'cycle-destroyed', function( e, opts ) {
    if ( opts._sentinel )
        opts._sentinel.remove();
    if ( opts._autoHeightOnResize )
        $(window).off( 'resize', opts._autoHeightOnResize );
});

})(jQuery);
