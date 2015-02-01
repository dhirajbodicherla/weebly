module.exports = function(grunt) {

  // 1. All configuration goes here 
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['scripts/dev/jquery.min.js', 'scripts/dev/ghosttyper.js', 'scripts/dev/script.js'],
        dest: 'scripts/prod/build.js',
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
          src: ['scripts/dev/ghosttyper.js', 'scripts/dev/script.js']
        },
      }
    },

    uglify: {
      build: {
        src: 'scripts/prod/build.js',
        dest: 'scripts/prod/build.min.js'
      }
    },

    less: {
      compile: {
        files: {
          'css/prod/styles.css': 'css/dev/styles.less'
        }
      }
    },

  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');

  // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
  grunt.registerTask('default', ['concat', 'jshint', 'uglify', 'less']);

};