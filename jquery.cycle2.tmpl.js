/*! tmpl plugin for Cycle2;  version: BETA-20121029 */
(function($) {
"use strict";

$.extend($.fn.cycle.defaults, {
    tmplRegex: '{{((.)?.*?)}}'
});

$.extend($.fn.cycle.API, {
    tmpl: function( str, opts, extra ) {
        var regex = new RegExp( opts.tmplRegex, 'g' );
        if (str && opts) {
            return str.replace(regex, function(_, str) {
                var i, prop, obj = opts, names = str.split('.');
                if (names.length > 1) {
                   prop = opts;
                   for (i=0; i < names.length; i++) {
                      obj = prop;
                      prop = prop[ names[i] ] || str;
                   }
                } else {
                    prop = opts[str];
                }

                if ($.isFunction(prop))
                   return prop.call(obj, opts);
                if (prop !== undefined && prop !== null)
                    return prop;
                if (extra && extra[ str ] !== undefined)
                    return extra[ str ];
                return str;
            });
        }
    }
});    

})(jQuery);
