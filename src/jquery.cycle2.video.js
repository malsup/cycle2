/*! youtube plugin for Cycle2;  version: 20130708 */
(function($) {
"use strict";

var template = '<div class=cycle-youtube>' + 
	'<iframe id="{{divid}}" width="640" height="360" src="{{url}}" frameborder="0" type="text/html" allowfullscreen="{{allowFullScreen}}" allowscriptaccess="always"></iframe>' + 
'</div>';

$.extend($.fn.cycle.defaults, {
    youtubeAllowFullScreen: true,
    youtubeAutostart: false,
    youtubeAutostop:  true
});    

$(document).on( 'cycle-bootstrap', function( e, opts ) {
    if ( ! opts.youtube )
        return;

    // don't hide inactive slides; hiding video causes reload when it's shown again
    opts.hideNonActive = false; 

    opts.container.find( opts.slides ).each(function(i) {
        // convert anchors to template markup
        if ( $(this).attr('href') === undefined )
            return;
        var markup, slide = $(this), url = slide.attr( 'href' );
        var fs = opts.youtubeAllowFullScreen ? 'true' : 'false';
        url += ( /\?/.test( url ) ? '&' : '?') + 'enablejsapi=1&rel=0';
        if ( opts.youtubeAutostart && opts.startingSlide === i )
            url += '&autoplay=1';
        markup = opts.API.tmpl( template, { url: url, allowFullScreen: fs, divid: "divid" + i });
        slide.replaceWith( markup );
    });
    opts.slides = opts.slides.replace(/(\b>?a\b)/,'div.cycle-youtube');

    if ( opts.youtubeAutostart ) {
        opts.container.on( 'cycle-initialized cycle-after', function( e, opts ) {
            var index = e.type == 'cycle-initialized' ? opts.currSlide : opts.nextSlide;
            callPlayer(opts.slides[ index ].firstChild.id, 'playVideo');
        });
    }

    if ( opts.youtubeAutostop ) {
        opts.container.on( 'cycle-before', function( e, opts ) {
            callPlayer(opts.slides[ opts.currSlide ].firstChild.id, 'stopVideo');
        });
    }
});

})(jQuery);
