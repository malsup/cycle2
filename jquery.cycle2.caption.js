/*! caption plugin for Cycle2;  version: BETA-20120910 */
(function($) {
"use strict";

$.extend($.fn.cycle.defaults, {
    caption:          '> .cycle-caption',
    captionTemplate:  '{{slideNum}} / {{slideCount}}',
    overlay:          '> .cycle-overlay',
    overlayTemplate:  '<div>{{title}}</div><div>{{desc}}</div>'
});    

$(document).on( 'cycle-update-view', function( e, opts, slideOpts, currSlide ) {
    var el;
    $.each(['caption','overlay'], function() {
        var name = this, template = slideOpts[name+'Template'];
        if( opts[name] && template ) {
            el = opts.API.getComponent( name );
            el.html( opts.API.tmpl( template, slideOpts, currSlide ) );
        }
    });
});

$(document).on( 'cycle-destroyed', function( e, opts ) {
    var el;
    $.each(['caption','overlay'], function() {
        var name = this, template = opts[name+'Template'];
        if ( opts[name] && template ) {
            el = opts.API.getComponent( 'caption' );
            el.empty();
        }
    });
});

})(jQuery);
