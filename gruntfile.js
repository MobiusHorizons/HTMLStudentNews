module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat:{
			"options" : { "seperator" : ";" },
			build: {
				files:{
					'js/app.js':['src/jsonp.js','src/tools.js','src/ui.js','src/Touch.js','src/main.js'],
					'css/styles.css':['src/styles.css']
				}
			},
			test: {
				files:{
					'js/app.min.js':['src/jsonp.js','src/tools.js','src/ui.js','src/Touch.js','src/main.js'],
					'css/styles.min.css':['src/styles.css']
				}
			}
		},
		uglify: {
			options: {
				mangle: true,
				compress:{
					drop_console:true,
					dead_code:true,
					unsafe:true,
					if_return:true
				},
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
				report: 'gzip'
			},
			build:{
				files: {
					'js/app.min.js':[ 'js/app.js' ]
				}
			}
		},
		imageEmbed:{
			build:{
				files: {
					'css/styles.css': ['css/styles.css']
				}
			}
		},
		cssmin: {
			options:{
				report: 'gzip',
				keepSpecialComments: 0,
			},
			build: {
				files: {
					'css/styles.min.css': ['css/styles.css']
				}
			}
		},
		embed: {
			options:{
				threshold: '100KB'
			},
			StudentNews: {
				files:{
				'StudentNews.html' : 'src/input.html'
				}
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks("grunt-image-embed");
	grunt.loadNpmTasks('grunt-embed');
	grunt.registerTask('default',['concat:build', 'uglify','imageEmbed', 'cssmin','embed']);
	grunt.registerTask('test',['concat:test','imageEmbed','embed'])
};
