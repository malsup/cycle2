/*global module*/
module.exports = function(grunt) {

"use strict";

require( "matchdep" ).filterDev( "grunt-*" )
    .forEach(grunt.loadNpmTasks);

grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
        options: {
            separator: '\n',
            banner: '/*!\n* jQuery Cycle2; version: <%=pkg.version %> build: <%= grunt.template.today("yyyymmdd") %>\n' +
              '* http://jquery.malsup.com/cycle2/\n' +
              '* Copyright (c) <%= grunt.template.today("yyyy") %> M. Alsup; Dual licensed: MIT/GPL\n*/\n\n'
        },
        dist: {
        src: [
            'src/jquery.cycle2.core.js',
            'src/jquery.cycle2.autoheight.js',
            'src/jquery.cycle2.caption.js',
            'src/jquery.cycle2.command.js',
            'src/jquery.cycle2.hash.js',
            'src/jquery.cycle2.loader.js',
            'src/jquery.cycle2.pager.js',
            'src/jquery.cycle2.prevnext.js',
            'src/jquery.cycle2.progressive.js',
            'src/jquery.cycle2.tmpl.js'
        ],
        dest: 'build/jquery.cycle2.js'
      }
    },

    jshint: {
        files: [ 'src/*.js' ],
        options: {
            browser: true,
            curly:   false,
            devel:   false,
            latedef: false,
            globals: {
                jQuery: true
            }
        }
    },

    uglify: {
        main: {
            options: {
                preserveComments : 'some',
                sourceMap: 'build/jquery.cycle2.js.map',
                sourceMappingURL: 'jquery.cycle2.js.map',
                sourceMapRoot: 'http://malsup.github.io/'
            },
            files: {
                'build/jquery.cycle2.min.js': [ 'build/jquery.cycle2.js' ]
            }
        },

        core: {
            options: {
                banner: '/*!\n* jQuery Cycle2; version: <%=pkg.version %> build: <%= grunt.template.today("yyyymmdd") %>\n' +
                    '* http://jquery.malsup.com/cycle2/\n' +
                    '* Copyright (c) <%= grunt.template.today("yyyy") %> M. Alsup; Dual licensed: MIT/GPL\n*/\n'
            },
            files: {
                'build/core/jquery.cycle2.core.min.js': [ 'src/jquery.cycle2.core.js' ]
            }
        },

        plugins: {
            options: {
                banner: '/* Plugin for Cycle2; Copyright (c) 2012 M. Alsup; v<%= grunt.template.today("yyyymmdd") %> */\n'
            },
            files: {
                'build/core/jquery.cycle2.autoheight.min.js':  [ 'src/jquery.cycle2.autoheight.js' ],
                'build/core/jquery.cycle2.caption.min.js':     [ 'src/jquery.cycle2.caption.js' ],
                'build/core/jquery.cycle2.command.min.js':     [ 'src/jquery.cycle2.command.js' ],
                'build/core/jquery.cycle2.hash.min.js':        [ 'src/jquery.cycle2.hash.js' ],
                'build/core/jquery.cycle2.loader.min.js':      [ 'src/jquery.cycle2.loader.js' ],
                'build/core/jquery.cycle2.pager.min.js':       [ 'src/jquery.cycle2.pager.js' ],
                'build/core/jquery.cycle2.prevnext.min.js':    [ 'src/jquery.cycle2.prevnext.js' ],
                'build/core/jquery.cycle2.progressive.min.js': [ 'src/jquery.cycle2.progressive.js' ],
                'build/core/jquery.cycle2.tmpl.min.js':        [ 'src/jquery.cycle2.tmpl.js' ],

                'build/plugin/jquery.cycle2.caption2.min.js':    [ 'src/jquery.cycle2.caption2.js' ],
                'build/plugin/jquery.cycle2.carousel.min.js':    [ 'src/jquery.cycle2.carousel.js' ],
                'build/plugin/jquery.cycle2.center.min.js':      [ 'src/jquery.cycle2.center.js' ],
                'build/plugin/jquery.cycle2.flip.min.js':        [ 'src/jquery.cycle2.flip.js' ],
                'build/plugin/jquery.cycle2.ie-fade.min.js':     [ 'src/jquery.cycle2.ie-fade.js' ],
                'build/plugin/jquery.cycle2.scrollVert.min.js':  [ 'src/jquery.cycle2.scrollVert.js' ],
                'build/plugin/jquery.cycle2.shuffle.min.js':     [ 'src/jquery.cycle2.shuffle.js' ],
                'build/plugin/jquery.cycle2.swipe.min.js':       [ 'src/jquery.cycle2.swipe.js' ],
                'build/plugin/jquery.cycle2.tile.min.js':        [ 'src/jquery.cycle2.tile.js' ],
                'build/plugin/jquery.cycle2.video.min.js':       [ 'src/jquery.cycle2.video.js' ]
            }
        },

        tcycle: {
            options: {
                banner: '/* tCycle; (c) 2012 M. Alsup; MIT/GPL; v<%= grunt.template.today("yyyymmdd") %> */\n'
            },
            files: {
                'build/tcycle/jquery.tcycle.min.js': [ 'src/jquery.tcycle.js' ]
            }
        }
    },

    copy: {
        main: {
            src: "build/jquery.cycle2.js",
            dest: "../dr-root/vendor/assets/javascripts/",
            flatten: true,
            expand: true
        }
    },

    jasmine: {
      pivotal: {
        src: "build/jquery.cycle2.js",
        options: {
          specs: "spec/**/*.spec.js",
          vendor: [
            "bower_components/jquery/jquery.js"
          ],
          template: "spec/index.tmpl"
        }
      }
    },

    connect: {
      server: {
        options: {
          port: 9001,
          livereload: true,
          keepalive: true
        }
      }
    },

    watch: {
        files: 'src/*.js',
        tasks: ['jshint', 'concat', 'uglify', 'copy']
    }

});

grunt.registerTask('default', [ 'jshint', 'concat', 'uglify', 'jasmine' ]);

};
