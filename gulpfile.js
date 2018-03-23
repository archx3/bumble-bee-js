var gulp = require('gulp');
var concat = require('gulp-concat');
var closureCompiler = require('gulp-closure-compiler');
var jsdoc = require('gulp-jsdoc3');


gulp.task('concat-base-js', function () {
   return gulp.src(['src/core/base/Utils.js',
                    'src/core/base/Observable.js',
                    'src/core/base/Array.js',
                    'src/core/base/Object.js',
                    'src/core/base/string/escape.js',
                    'src/core/base/string/unicode.js',
                    'src/core/base/string/String.js',
                    'src/core/base/Math.js',
                    'src/core/base/Timer.js'])/*, 'assets/src/module*.src'*/
              .pipe(concat('base.js'))
              .pipe(gulp.dest('build'));

});

gulp.task('concat-event-js', function () {
   return gulp.src(['src/ui/events/Event.js',
                    'src/ui/events/EventsManager.js'])
              .pipe(concat('event.js'))
              .pipe(gulp.dest('build'));

});

gulp.task('minify-base-js', function () {
   return gulp.src(['build/base.js'])
              .pipe(closureCompiler({
                                       compilerPath: '/home/arch/Downloads/Apps/closure-compiler-v20170626.jar',
                                       fileName: 'base.min.js'
                                    }))
              .pipe(gulp.dest('dist'));

});



gulp.task('doc', function (cb) {
   var config = require('./jsdoc.json');
   gulp.src(['README.md', './src/**/*.js'], {read: false})
       .pipe(jsdoc(config, cb));
});

gulp.task('default', ['concat-js'/*, 'pack-css'*/]);