var gulp = require('gulp');
var concat = require('gulp-concat');
var closureCompiler = require('gulp-closure-compiler');

gulp.task('concat-base-js', function () {
   return gulp.src(['src/core/base/Bee.Utils.js',
                    'src/core/base/Observable.js',
                    'src/core/base/Array.js',
                    'src/core/base/Object.js',
                    'src/core/base/String.js',
                    'src/core/base/Math.js',
                    'src/core/base/Timer.js'/*, 'assets/src/module*.src'*/])
              .pipe(concat('base.js'))
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

gulp.task('default', ['concat-js'/*, 'pack-css'*/]);