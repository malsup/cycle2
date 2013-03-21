/*! youtube plugin for Cycle2;  version: 20121120 */
(function($) {
"use strict";

var template = '<div><iframe width="640" height="360" src="{{url}}" frameborder="0" allowscriptaccess="always" allowfullscreen="{{allowFullScreen}}"></iframe></div>';

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
        var markup, slide = $(this), url = slide.attr( 'href' );
        // convert various youtube URL formats to embed format
        url = convertURL(url);
        var fs = opts.youtubeAllowFullScreen ? 'true' : 'false';
        url += ( /\?/.test( url ) ? '&' : '?') + 'enablejsapi=1';
        if ( opts.youtubeAutostart && opts.startingSlide === i )
            url += '&autoplay=1';
        markup = opts.API.tmpl( template, { url: url, allowFullScreen: fs });
        slide.replaceWith( markup );
    });
    opts.slides = '>div';

    if ( opts.youtubeAutostart ) {
        opts.container.on( 'cycle-initialized cycle-after', function( e, opts ) {
            var index = e.type == 'cycle-initialized' ? opts.currSlide : opts.nextSlide;
            $( opts.slides[ index ] ).find('object,embed').each( play );
        });
    }

    if ( opts.youtubeAutostop ) {
        opts.container.on( 'cycle-before', function( e, opts ) {
            $( opts.slides[ opts.currSlide ] ).find('object,embed').each( pause );
        });
    }
});

function play() {
    /*jshint validthis:true */
    try {
        this.playVideo();
    }
    catch( ignore ) {}
}
function pause() {
    /*jshint validthis:true */
    try {
        this.pauseVideo();
    }
    catch( ignore ) {}
}
function convertURL(url) {
    // this regex needs to stay up-to-date
    var pattern = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
    var videoID = url.match(pattern);
    // if video ID successfully extracted, change the URL format
    if(videoID[1])
        url = 'http://www.youtube.com/embed/'+videoID[1];
    return url;
}

})(jQuery);
