module.exports = function( grunt )
{
	'use strict';

	grunt.initConfig(
	{
		pkg: grunt.file.readJSON('package.json'),

		clean:
		{
			default:
			{
				options:
				{
					nowrite:true
				},
				src: ['dist']
			}
		},

		express:
		{
			default:
			{
				options:
				{
					script: 'server.js',
					node_env: 'development'
				}
			}
		},

		copy:
		{
			dist:
			{
				files:
				[
					{ cwd: 'dev/', expand:true, src:['public/**'], dest:'dist/' },
					{ cwd: 'dev/', expand:true, src:['data/**'], dest:'dist/' },
					{ cwd: 'dev/', expand:true, src:['views/**'], dest:'dist/' },
					{ cwd: 'dev/', expand:true, src:['js/libs/**'], dest:'dist/public/' }
				]
			},
			doNothing:
			{
				//juste histoire de reloader livereload
				expand:true,
				cwd:'dev',
				src:['chibidi.bidi'],
				dest:'dist'
			}
		},

		sass:
		{
			dist: {
				options: { style:'compressed' },
				files: [
					{ expand: true, ext: '.css', cwd: 'dev/scss', src: ['*.scss'], dest: 'dist/public/css' },
					{ expand: true, ext: '.css', cwd: 'dev/scss/critical', src: ['*.scss'], dest: 'dist/views/includes' }
				]
			},
			dev: {
				files: [
					{ expand: true, ext: '.css', cwd: 'dev/scss', src: ['*.scss'], dest: 'dev/public/css' },
					{ expand: true, ext: '.css', cwd: 'dev/scss/critical', src: ['*.scss'], dest: 'dev/views/includes' }
				]
			}
		},

		autoprefixer:
		{
			dist: {
				files: [
					{ expand: true, cwd: 'dist', src: ['public/css/*.css'], dest: 'dist' },
					{ expand: true, cwd: 'dist', src: ['views/includes/*.css'], dest: 'dist' }
				]
			},
			dev: {
				files: [
					{ expand: true, cwd: 'dev', src: ['public/css/*.css'], dest: 'dev' },
					{ expand: true, cwd: 'dev', src: ['views/includes/*.css'], dest: 'dev' }
				]
			}
		},

		jshint:
		{
			default:
			{
				options:
				{
					curly: true,
					eqeqeq: true,
					immed: true,
					latedef: true,
					newcap: true,
					noarg: true,
					sub: true,
					undef: true,
					boss: true,
					eqnull: true,
					browser: true,
					esnext: true,
					globals: {performance:false, console:false, define:false, require:false, requirejs:false, $:false, Promise: false},
					quotmark: true,
					smarttabs: true,
					trailing: true,
					//unused: true,
					camelcase: true,
					//forin: true,
					indent: 4,
					strict:false,
					noempty: true,
					nonew: true,
					plusplus: true,
					white:true,
					debug: true
				},

				src:['dev/js/**/*.js', '!dev/js/libs/**/*.js', '!dev/js/order.js']
			}
		},

		requirejs:
		{
			default:
			{
				options:
				{
					baseUrl: 'dev/js/',
					mainConfigFile: 'dev/js/main.js',
					name: 'main',
					out: 'dist/public/js/main.js',
					paths: {
						jquery: 'empty:'
					},
					uglify:
					{
						nc:true
					}
				}
			}
		},

		watch:
		{
			serverWatch:
			{
				options: { 
					livereload: true,
					spawn: false
				},
				files: ['server.js'],
				tasks: ['express']
			},
			CSSWatch:
			{
				options:{livereload:true},
				files: ['dev/scss/**/*.scss'],
				tasks: ['build_css']
			},
			JSWatch:
			{
				options:{livereload:true},
				files: ['dev/js/**/*.js'],
				tasks: ['build_js']
			},
			normalWatch:
			{
				options:{livereload:true},
				files: ['dev/data/**/*.*', 'dev/public/**/*.*', 'dev/views/**/*.*', '!dev/js/**/*.js','!dev/scss/**/*.scss', '!dev/public/css/main.css', '!dev/tmp/**/*.*'],
				tasks: ['build_normal']
			}
		}

	});

	// Load plugins here
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-express-server');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-autoprefixer');
	// grunt.loadNpmTasks('grunt-es6-module-transpiler');

	// Define your tasks here
	grunt.registerTask('build_css', ['sass:dev', 'autoprefixer:dev']);
	grunt.registerTask('build_js', ['jshint:default']);
	grunt.registerTask('build_normal', 'copy:doNothing');
	//grunt.registerTask('build_dist', ['clean', 'sass:dist', 'copy:dist', 'jshint', 'requirejs']);
	grunt.registerTask('build_dist', ['clean', 'copy:dist', 'sass:dist', 'autoprefixer:dist', 'jshint', 'requirejs']);
	grunt.registerTask('default_watch', ['watch:CSSWatch','watch:JSWatch']);
	grunt.registerTask('server', ['express', 'watch']);

};