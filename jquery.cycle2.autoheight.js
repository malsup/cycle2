/*! Cycle2 autoheight plugin; Copyright (c) M.Alsup, 2012; version: 20130123 */
(function($) {
"use strict";

$.extend($.fn.cycle.defaults, {
    autoHeight: 0 // setting this option to -1 disables autoHeight logic
});    

$(document).on( 'cycle-initialized', function( e, opts ) {
    var autoHeight = opts.autoHeight;
    var max = -1;
    var clone, ratio;
    if ( autoHeight === 'calc' || ( $.type( autoHeight ) == 'number' && autoHeight >= 0 ) ) {
        if ( autoHeight === 'calc' ) {
            // calculate tallest slide index
            opts.slides.each(function(i) {
                var h = $(this).height();
                if ( h > max ) {
                    max = h;
                    autoHeight = i;
                }
            });
        }
        else if ( autoHeight >= opts.slides.length ) {
            autoHeight = 0;
        }

        // clone existing slide as sentinel
        clone = $( opts.slides[ autoHeight ] ).clone();
        
        // #50; remove special attributes from cloned content
        clone.removeAttr( 'id name rel' ).find( '[id],[name],[rel]' ).removeAttr( 'id name rel' );

        clone.css({
            position: 'static',
            visibility: 'hidden',
            display: 'block'
        }).prependTo( opts.container ).removeClass().addClass('cycle-sentinel cycle-slide');
        clone.find( '*' ).css( 'visibility', 'hidden' );

        opts._sentinel = clone;
    }
    else if ( $.type( autoHeight ) == 'string' && /\d+\:\d+/.test( autoHeight ) ) { 
        // use ratio
        ratio = autoHeight.match(/(\d+)\:(\d+)/);
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
