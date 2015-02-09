module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    react: {
      single_file_output: {
        files: {
          'js/application.js': 'js/application.jsx'
        }
      }
    },

    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['js/libs/jquery-latest.min/index.js',
              'js/libs/jquery-ui.min/index.js',
              'js/libs/react/react.js',
              'js/application.js'],
        dest: 'dist/js/build.js',
      },
    },

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        },
      },
      with_overrides: {
        options: {
          curly: false,
          undef: true,
        },
        files: {
          src: ['js/application.js']
        },
      }
    },

    uglify: {
      build: {
        src: 'dist/js/build.js',
        dest: 'dist/js/build.min.js'
      }
    },

    less: {
      dist:{
        options: {
          compress: false,
          yuicompress: false,
          optimization: 2,
          modifyVars: {
            assetsLocation: '"/"'
          }
        },
        files: {
          'dist/css/home.css': 'css/home.less'
        }
      }
    },

    sprite:{
      all: {
        src: 'img/*.png',
        dest: 'dist/img/spritesheet.png',
        destCss: 'css/sprites.css'
      }
    },

    watch: {
      files: ['css/home.less'],
      tasks: ["less"]
    },

    processhtml: {
      dev: {
        options: {
          data: {
            message: 'This is development environment'
          }
        },
        files: {
          'index.html': ['tpl/dev.index.html']
        }
      },
      dist: {
        options: {
          process: true,
          data: {
            title: 'My app',
            message: 'This is production distribution'
          }
        },
        files: {
          'index.html': ['tpl/dist.index.html']
        }
      }
    },

  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-spritesmith');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-react');

  grunt.registerTask('default', ['concat', 'uglify', 'sprite', 'less', 'processhtml']);
  grunt.registerTask('dev', ['processhtml:dev']);
  grunt.registerTask('dist', ['react', 'concat', 'uglify', 'sprite', 'less:dist', 'processhtml:dist']);

};