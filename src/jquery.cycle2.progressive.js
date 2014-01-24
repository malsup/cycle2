/*! progressive loader plugin for Cycle2;  version: 20130315 */
(function($) {
"use strict";

$.extend($.fn.cycle.defaults, {
    progressive: false
});

$(document).on( 'cycle-pre-initialize', function( e, opts ) {
    if ( !opts.progressive )
        return;

    var API = opts.API;
    var prepareTxFn = API.prepareTx;
    var pageFn = API.page;
    var type = $.type( opts.progressive );
    var slides, scriptEl, nodeName;
    var progressive = API.progressive = {};

    if ( type == 'array' ) {
        slides = opts.progressive;
    }
    else if ($.isFunction( opts.progressive ) ) {
        slides = opts.progressive( opts );
    }
    else if ( type == 'string' ) {
        scriptEl = $( opts.progressive );
        slides = $.trim( scriptEl.html() );
        if ( !slides )
            return;
        // is it json array?
        if ( /^(\[)/.test( slides ) ) {
            try {
                slides = $.parseJSON( slides );
            }
            catch(err) {
                API.log( 'error parsing progressive slides', err );
                return;
            }
        }
        else {
            // plain text, split on delimeter
            slides = slides.split( new RegExp( scriptEl.data('cycle-split') || '\n') );

            // #95; look for empty slide
            if ( ! slides[ slides.length - 1 ] )
                slides.pop();
        }
    }

    progressive.buildSlide = function( markup, nodeName ) {
        nodeName = nodeName || "IMG";

        return $( "<" + nodeName + " />" )
            .data( "cycle.progressive", $.trim(markup) )
            .addClass( 'cycle-progressive-slide' );
    };

    if ( opts.pager ) {
        nodeName = opts.slides.length ? opts.slides[0].nodeName : "";
        $.each( slides, function( index, slide ) {
            opts.API.add( progressive.buildSlide(slide, nodeName) );
        });
    }

    if ( prepareTxFn ) {
        API.prepareTx = function( manual, fwd ) {
            var opts = this.opts(),
                index = fwd ? opts.currSlide + 1 : opts.currSlide - 1,
                $slide = $( opts.slides[index] );

            progressive.navigate( $slide, function( api, args ) {
                return function() {
                    prepareTxFn.apply( api, args );
                };
            }(opts.API, [ manual, fwd ]) );
        };
    }

    if ( pageFn ) {
        API.page = function( pager, target ) {
            var opts = this.opts(),
                index = $( target ).index(),
                $slide = $( opts.slides[index] );

            progressive.navigate( $slide, function( index ) {
                return function() {
                    opts.API.jump( index );
                };
            }(index) );
        };
    }

    progressive.hydrate = function( $slide, opts ) {
        var count = opts.container.find( ".cycle-slide" ).length,
            index = $slide.index( ".cycle-slide" ) - 1,
            $hydrated = $( $slide.data("cycle.progressive") ).addClass( "cycle-slide" ),
            slideOpts = $slide.data( "cycle.opts" ), $images;

        $hydrated.data( "cycle.opts", slideOpts ).hide();
        progressive.replaceSlide( $hydrated[0], index, opts );
        opts.container.data( "cycle.opts", opts );
        opts.container.find( ".cycle-slide" ).eq( index + 1 ).replaceWith( $hydrated );
        $images = $hydrated.find( "img" ).andSelf().filter( "img" );
        if ( $images.length ) {
            $images.load(function() {
                opts.API.trigger( "cycle-slide-hydrated", [opts, slideOpts, $hydrated] );
            });
        } else {
            opts.API.trigger( "cycle-slide-hydrated", [opts, slideOpts, $hydrated] );
        }

        return $hydrated;
    };

    progressive.navigate = function( $slide, proceed ) {
        if ( $slide.hasClass("cycle-progressive-slide") ) {
            opts.container.one( "cycle-slide-hydrated", function( e, opts ) {
                if ( proceed ) { proceed(); }
                opts.container.removeClass( "cycle-loading" );
            });
            opts.container.addClass( "cycle-loading" );
            progressive.hydrate( $slide, opts );
        } else {
            if ( proceed ) { proceed(); }
        }
    };

    progressive.replaceSlide = function( newSlide, index, opts ) {
        var newSlides = [];
        $.each( opts.slides, function(i, slide) {
            newSlides.push( i === index ? newSlide : slide );
        });
        opts.slides = $( newSlides );
    };
});

})(jQuery);
