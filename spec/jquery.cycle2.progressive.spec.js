(function( $, undefined ) {

describe( "Progressive", function() {
  var fixtures = jasmine.getFixtures(),
    $slideshow, opts, $progressiveSlides, progressive, api;

  fixtures.fixturesPath = "/spec/fixtures";

  beforeEach(function() {
    fixtures.load( "progressive-pager.html" );
    $slideshow = $( ".cycle-slideshow" ).cycle();
    opts = $slideshow.data( "cycle.opts" );
    api = opts.API;
    progressive = api.progressive;
    $progressiveSlides = $slideshow.find( ".cycle-progressive-slide" );
  });

  describe( "Methods", function() {
    describe( "buildSlide", function() {
      var markup = "<a href='#'><img src='#' /></a>", $slide;

      beforeEach(function() {
        $slide = progressive.buildSlide( markup );
      });

      it( "should create a placeholder element based on the same type", function() {
        expect( $slide[0].nodeName ).toBe( "IMG" );
      });

      it( "should create a placeholder element with intended markup stored in data", function() {
        expect( $slide.data("cycle.progressive") ).toBe( markup );
      });

      it( "should create a placeholder element marked with a progressive class", function() {
        expect( $slide.hasClass("cycle-progressive-slide") ).toBe( true );
      });
    });

    describe( "hydrate", function() {
      var markup = "<a href=\"#\" style=\"display: none;\" class=\"\"><img src=\"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7\"></a>", $slide, $hydrated;

      beforeEach(function() {
        $slide = progressive.buildSlide( markup ).data( "cycle.opts", { success: true } );
        spyOn( progressive, "replaceSlide" );
      });

      it( "should pull out markup from data to make hydrated slide", function() {
        var hydratedMarkup;

        $hydrated = progressive.hydrate( $slide, opts );
        hydratedMarkup = $( "<div>" ).append( $hydrated.removeClass("cycle-slide").clone() ).html();
        expect( hydratedMarkup ).toBe( markup );
      });

      it( "should transfer the options from the placeholder to the hydrated slide", function() {
        $hydrated = progressive.hydrate( $slide, opts );
        expect( $hydrated.data("cycle.opts").success ).toBe( true );
      });

      it( "should replace the placeholder slide with the hydrated slide", function() {
        $hydrated = progressive.hydrate( $slide, opts );
        expect( progressive.replaceSlide ).toHaveBeenCalled();
        expect( progressive.replaceSlide.calls.count() ).toBe( 1 );
      });

      it( "should wait until any images have loaded before triggering hydrated", function(done) {
        opts.API.add( $slide );
        $hydrated = progressive.hydrate( $slide, opts );
        opts.container.one( "cycle-slide-hydrated", function() {
          expect( true ).toBeTruthy();
          done();
        });
      });
    });

    describe( "navigate", function() {
      var markup = "<a href=\"#\" class=\"\"><img src=\"#\"></a>", $slide;

      beforeEach(function() {
        $slide = progressive.buildSlide( markup );
      });

      it( "should hydrate the slide if the placeholder exists", function() {
        spyOn( progressive, "hydrate" );
        progressive.navigate( $slide, function() {} );
        expect( progressive.hydrate ).toHaveBeenCalled();
      });

      it( "should wait until the placeholder is hydrated until it proceeds", function() {
        var proceed = jasmine.createSpy( "proceed" );

        progressive.navigate( $slide, proceed );
        opts.container.trigger( "cycle-slide-hydrated", [ opts ] );
        expect( proceed ).toHaveBeenCalled();
      });

      it( "should mark the container as loading when the hydration is taking place", function() {
        var proceed = jasmine.createSpy( "proceed" );

        progressive.navigate( $slide, proceed );
        expect( opts.container.hasClass("cycle-loading") ).toBeTruthy();
      });

      it( "should proceed if the slide is already hydrated", function() {
        var proceed = jasmine.createSpy( "proceed" );

        spyOn( progressive, "hydrate" );
        $slide.removeClass( "cycle-progressive-slide" );
        progressive.navigate( $slide, proceed );
        expect( progressive.hydrate ).not.toHaveBeenCalled();
        expect( proceed ).toHaveBeenCalled();
      });
    });

    describe( "replaceSlide", function() {
      it( "should replace the slide at the provided index", function() {
        var $newSlide = $( "<a href=\"\">TEST</a>" );
        progressive.replaceSlide( $newSlide, 2, opts );
        expect( $newSlide ).toBe( opts.slides[2] );
      });
    });
  });

  describe( "Integration", function() {
    describe( "Fixture", function() {
      it( "should load the appropriate fixture", function() {
        expect( $("#progressive-pager").length ).toBe( 1 );
      });
    });

    describe( "Pager", function() {
      it( "should create pager items for all slides (static & progressive)", function() {
        expect( $slideshow.find(".cycle-pager span").length ).toBe( 5 );
      });
    });

    describe( "Placeholders", function() {
      it( "should create placeholder items for progressive slides", function() {
        expect( $slideshow.find( ".cycle-progressive-slide" ).length ).toBe( 4 );
      });

      it( "should not render images from the progressive slides before shown", function() {
        expect( $progressiveSlides.find("img").length ).toBe( 0 );
      });

      it( "should have the hydrated markup stored inside the placeholder slide", function() {
        $progressiveSlides.each(function(index, slide) {
          expect( $(slide).data("cycle.progressive") ).toBeTruthy();
        });
      });
    });

    describe( "Navigation", function() {
      it( "should hydrate a progressive slide on next", function() {
        spyOn( progressive, "hydrate" );
        api.next();
        expect( progressive.hydrate ).toHaveBeenCalled();
      });

      it( "should hydrate a progressive slide on jump", function() {
        spyOn( progressive, "hydrate" );
        api.jump( 4 );
        expect( progressive.hydrate ).toHaveBeenCalled();
      });

      it( "should hydrate a progressive slide on prev", function() {
        spyOn( progressive, "hydrate" );
        api.jump( 4 );
        api.prev();
        expect( progressive.hydrate ).toHaveBeenCalled();
      });
    });
  });
});

}( jQuery ));
