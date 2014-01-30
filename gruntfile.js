module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat:{
			"options" : { "seperator" : ";" },
			"js": {
				"src":['src/jsonp.js','src/main.js'],
				"dest":"js/app.js"
			},
			"css":{
				"src":['src/styles.css'],
				"dest":'css/styles.css'
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
	grunt.loadNpmTasks('grunt-embed');
	grunt.registerTask('default',['concat', 'uglify', 'cssmin','embed']);
};
