/*! Cycle2 autoheight plugin; Copyright (c) M.Alsup, 2012; version: 20130309 */
(function($) {
    "use strict";

    $.extend($.fn.cycle.defaults, {
        autoHeight: 0 // setting this option to -1 disables autoHeight logic
    });

$(document).on( 'cycle-initialized cycle-slide-added cycle-slide-removed', initAutoHeight);
$(document).on( 'cycle-before', updateSentinelSlide);
$(document).on( 'cycle-destroyed', cleanup);

    function initAutoHeight(e, opts) {
        var autoHeight = opts.autoHeight;
        var clone, ratio, timeout;

    cleanup( e, opts );

    $(window).on( 'resize orientationchange', onResize );
        opts._autoHeightOnResize = onResize;

    if ( autoHeight === 'calc' || ( $.type( autoHeight ) == 'number' && autoHeight >= 0 ) ) {
        if ( autoHeight === 'calc' ) {
            autoHeight = calcSentinelIndex( opts );
            }
        else if ( autoHeight >= opts.slides.length ) {
                autoHeight = 0;
            }

            // clone existing slide as sentinel
        clone = $( opts.slides[ autoHeight ] ).clone();

            // #50; remove special attributes from cloned content
            clone.removeAttr('name rel').find('[name],[rel]').removeAttr('name rel');

            clone.css({
                position: 'static',
                visibility: 'hidden',
                display: 'block'
        }).prependTo( opts.container ).removeClass().addClass('cycle-sentinel cycle-slide');
        clone.find( '*' ).css( 'visibility', 'hidden' );

            opts._sentinel = clone;
        }
    else if(autoHeight==='currentSlide'){
        clone = $( opts.slides[ opts.startingSlide ] ).clone();        
        // I will leave ID attribute because some CSS ar correlated to ID , which make different size than the original 
        clone.removeAttr( 'name rel' ).find( '[name],[rel]' ).removeAttr( 'name rel' );

            clone.css({
                position: 'static',
                visibility: 'hidden',
                display: 'block'
        }).prependTo( opts.container ).removeClass().addClass('cycle-sentinel cycle-slide');
        // No need to make all elements hidden , the parent element is enough
        //clone.find( '*' ).css( 'visibility', 'hidden' );

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
                if (opts.autoHeight != "currentSlide") {
                    clearTimeout(timeout);
                    timeout = setTimeout(function () {
                        initAutoHeight(e, opts);
                    }, 50);
                }
            }
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
    }
    function updateSentinelSlide(event, optionHash, outgoingSlideEl, incomingSlideEl, forwardFlag) {
        //console.log(optionHash._sentinel);
        var autoHeight = optionHash.autoHeight;
        if (autoHeight === 'currentSlide') {
            var clone = $(incomingSlideEl).clone();
            // I will leave ID attribute because some CSS ar correlated to ID , which make different size than the original 
            clone.removeAttr('name rel').find('[name],[rel]').removeAttr('name rel');

            $('.cycle-sentinel',$(incomingSlideEl).parent()).html(clone.html());
        }
    }
function calcSentinelIndex( opts ) {
        var index = 0, max = -1;
        console.log($(opts));
        if ($(opts.slideActiveClass, opts.container).index() == -1)
            return 0;
        else
            return $(opts.slideActiveClass, opts.container).index()
    }
    function calcSentinelIndex(opts) {
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