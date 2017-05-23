var es = require('event-stream');
var gulp = require('gulp');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var templateCache = require('gulp-angular-templatecache');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var fs = require('fs');
var _ = require('lodash');
var rimraf = require('gulp-rimraf');



var scripts = require('./app.scripts.json');

var source = {
    js: {
        main: 'symphony.web/client/app/main.js',
        src: [
            // application config
            'symphony.web/client/app.config.js',

            // application bootstrap file
            'symphony.web/client/app/main.js',

            // main module
            'symphony.web/client/app/app.js',

            // module files
            'symphony.web/client/app/**/module.js',

            // other js files [controllers, services, etc.]
            'symphony.web/client/app/**/!(module)*.js',

        ],
        tpl: 'symphony.web/client/app/**/*.tpl.html'
    }
};

var destinations = {
    js: 'Symphony.WebAPI/build'
};


gulp.task('build', function(){
    return es.merge(gulp.src(source.js.src) , getTemplateStream())
         .pipe(ngAnnotate())
         .pipe(uglify())
        .pipe(concat('app.js'))
        .pipe(gulp.dest(destinations.js));
});

gulp.task('js', function(){
    return es.merge(gulp.src(source.js.src) , getTemplateStream())
        .pipe(concat('app.js'))
        .pipe(gulp.dest(destinations.js));
});

gulp.task('watch', function(){
    gulp.watch(source.js.src, ['js']);
    gulp.watch(source.js.tpl, ['js']);
    gulp.watch("Symphony.Web/client/**/*.html", ["html"]);
});

gulp.task('connect', function() {
    connect.server({
        port: 8888
    });
});

gulp.task('vendor', function(){
    _.forIn(scripts.chunks, function(chunkScripts, chunkName){
        var paths = [];
        chunkScripts.forEach(function(script){
            var scriptFileName = scripts.paths[script];

            if (!fs.existsSync(__dirname + '/' + scriptFileName)) {

                throw console.error('Required path doesn\'t exist: ' + __dirname + '/' + scriptFileName, script)
            }
            paths.push(scriptFileName);
        });
        gulp.src(paths)
            .pipe(concat(chunkName + '.js'))
            //.on('error', swallowError)
            .pipe(gulp.dest(destinations.js))
    })

});

gulp.task('prod', ['vendor', 'build']);
gulp.task('dev', ['vendor', 'js', 'watch', 'connect']);
gulp.task('default', ['vendor', 'build', 'plugin', 'styles', 'html', 'json', 'sound']);

gulp.task('build_all', ['clean_all'], function () {
    console.log("Starring default build");
    return gulp.start('default');
});

gulp.task('plugin', ['clean_plugin'], function () {
    return gulp.src(["Symphony.Web/client/plugin/**/*.*"])
               .pipe(gulp.dest("Symphony.WebAPI/plugin"));
});

gulp.task('html', function () {
    return gulp.src(["Symphony.Web/client/**/*.html", ])
               .pipe(gulp.dest("Symphony.WebAPI/"));
});

gulp.task('json', ['api'], function () {
    return gulp.src(["Symphony.Web/client/app.scripts.json"])
                .pipe(gulp.dest("Symphony.WebAPI"));
});

gulp.task('api', function () {
    return gulp.src(["Symphony.Web/client/api/**/!(package)*.json"])
                .pipe(gulp.dest("Symphony.WebAPI/client/api"));
});


gulp.task('sound', function () {
    return gulp.src(["Symphony.Web/client/sound/**/*.*"])
               .pipe(gulp.dest("Symphony.WebAPI/sound"));
});

gulp.task('styles', function () {
    return gulp.src(["Symphony.Web/client/styles/**/*.*"])
               .pipe(gulp.dest("Symphony.WebAPI/styles"));
});


//--- Clean up tasks

gulp.task('clean_all', ['clean_build', 'clean_html', 'clean_json', 'clean_sound', 'clean_styles']);

gulp.task('clean_build', function () {
    return gulp.src('Symphony.WebAPI/build', { read: false }) // much faster
                .pipe(rimraf());
});

gulp.task('clean_html', function () {
    return gulp.src(['Symphony.WebAPI/app'], { read: false }) // much faster
                 .pipe(rimraf());
});

gulp.task('clean_plugin', function () {
    return gulp.src('Symphony.WebAPI/plugin', { read: false }) // much faster
            .pipe(rimraf())
            .on('error', swallowError);
});

gulp.task('clean_json', function () {
    return gulp.src(['Symphony.WebAPI/client/api', 'Symphony.WebAPI/app.scripts.json'], { read: false }) // much faster
                .pipe(rimraf());
});

gulp.task('clean_sound', function () {
    return gulp.src('Symphony.WebAPI/sound', { read: false }) // much faster
                .pipe(rimraf());
});

gulp.task('clean_styles', function () {
    return gulp.src('Symphony.WebAPI/styles', { read: false }) // much faster
                .pipe(rimraf());
});


var swallowError = function(error){
    console.log(error.toString());
    this.emit('end')
};

var getTemplateStream = function () {
    return gulp.src(source.js.tpl)
        .pipe(templateCache({
            root: 'symphony.web/client/app/',
            module: 'app'
        }))
};