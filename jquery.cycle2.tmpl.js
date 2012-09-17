/*! tmpl plugin for Cycle2;  version: BETA-20120910 */
(function($) {
"use strict";

$.extend($.fn.cycle.API, {
    tmpl: function( str, opts, extra ) {
        if (str && opts) {
            return str.replace(/\{\{((\.)?.*?)\}\}/g, function(_, str) {
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
