module.exports = function(grunt) {
    // load all grunt tasks matching the `grunt-*` pattern
    require('load-grunt-tasks')(grunt);

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            options: {
                livereload: true,
                spawn: false,
            },
            css: {
                files: ['css/*.css'],
            },
            html: {
                files: ['*.html', '*.php'],
            },
            js: {
                files: ['js/*.js'],
            }
        }
    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    // this is now done automatically with load-grunt-tasks - see top of file



    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    // basically a rebuild
    grunt.registerTask('default', ['watch']);

};