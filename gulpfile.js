var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('pack-js', function () {
   return gulp.src(['src/core/base/Barge.Utils.js',
                    'src/core/base/Barge.Observable.js',
                    'src/core/base/Barge.Array.js',
                    'src/core/base/Barge.Object.js',
                    'src/core/base/Barge.String.js',
                    'src/core/base/Barge.Math.js',
                    'src/core/base/Barge.Timer.js'/*, 'assets/src/module*.src'*/])
              .pipe(concat('base.js'))
              .pipe(gulp.dest('build'));
});

//gulp.task('pack-css', function () {
//   return gulp.src(['assets/css/main.css', 'assets/css/custom.css'])
//              .pipe(concat('stylesheet.css'))
//              .pipe(gulp.dest('public/build/css'));
//});

gulp.task('default', ['pack-js'/*, 'pack-css'*/]);