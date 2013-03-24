/*! Cycle2 autoheight plugin; Copyright (c) M.Alsup, 2012; version: 20130324 */
(function($) {
"use strict";

$.extend($.fn.cycle.defaults, {
    autoHeight: 0 // setting this option to -1 disables autoHeight logic
});    

$(document).on( 'cycle-initialized cycle-slide-added cycle-slide-removed', initAutoHeight );
$(document).on( 'cycle-destroyed', cleanup );

function initAutoHeight(e, opts) {
    var autoHeight = opts.autoHeight;
    var clone, ratio, timeout;

    cleanup( e, opts );

    $(window).on( 'resize orientationchange', onResize );
    opts._autoHeightOnResize = onResize;

    if ( autoHeight == 'container' ) {
        opts.container.on( 'cycle-before', onBefore );
        opts._autoHeightOnBefore = onBefore;

        var h = $( opts.slides[ opts.currSlide || opts.startingSlide ] ).outerHeight();
        opts.container.height( h );
    }
    else if ( autoHeight === 'calc' || ( $.type( autoHeight ) == 'number' && autoHeight >= 0 ) ) {
        if ( autoHeight === 'calc' ) {
            autoHeight = calcSentinelIndex( opts );
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
        }).prependTo( opts.container ).addClass('cycle-sentinel cycle-slide');
        clone.find( '*' ).css( 'visibility', 'hidden' );

        opts._sentinel = clone;
    }
    else if ( $.type( autoHeight ) == 'string' && /\d+\:\d+/.test( autoHeight ) ) { 
        // use ratio
        ratio = autoHeight.match(/(\d+)\:(\d+)/);
        ratio = ratio[1] / ratio[2];
        opts._autoHeightRatio = ratio;
        setTimeout(function() {
            $(window).triggerHandler('resize');
        },15);
    }

    function onResize() {
        if ( opts._autoHeightRatio ) {
            opts.container.height( opts.container.width() / ratio );
        }
        else {
            clearTimeout( timeout );
            timeout = setTimeout(function() {
                initAutoHeight(e, opts);
            }, 50);
        }
    }

    function onBefore( e, opts, outgoing, incoming, forward ) {
        var h = $(incoming).outerHeight();
        var duration = opts.sync ? opts.speed / 2 : opts.speed;
        opts.container.animate( { height: h }, duration );
    }
}    

function cleanup( e, opts ) {
    if ( opts._sentinel ) {
        opts._sentinel.remove();
        opts._sentinel = null;
    }
    if ( opts._autoHeightOnResize ) {
        $(window).off( 'resize orientationchange', opts._autoHeightOnResize );
        opts._autoHeightOnResize = null;
    }
    if ( opts._autoHeightOnBefore ) {
        opts.container.off( 'cycle-before', opts._autoHeightOnBefore );
    }
}

function calcSentinelIndex( opts ) {
    var index = 0, max = -1;

    // calculate tallest slide index
    opts.slides.each(function(i) {
        var h = $(this).height();
        if ( h > max ) {
            max = h;
            index = i;
        }
    });
    return index;
}

})(jQuery);
