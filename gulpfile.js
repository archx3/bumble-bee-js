var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('pack-js', function () {
   return gulp.src(['src/core/base/Bee.Utils.js',
                    'src/core/base/Bee.Observable.js',
                    'src/core/base/Bee.Array.js',
                    'src/core/base/Bee.Object.js',
                    'src/core/base/Bee.String.js',
                    'src/core/base/Bee.Math.js',
                    'src/core/base/Bee.Timer.js'/*, 'assets/src/module*.src'*/])
              .pipe(concat('base.js'))
              .pipe(gulp.dest('build'));
});

//gulp.task('pack-css', function () {
//   return gulp.src(['assets/css/main.css', 'assets/css/custom.css'])
//              .pipe(concat('stylesheet.css'))
//              .pipe(gulp.dest('public/build/css'));
//});

gulp.task('default', ['pack-js'/*, 'pack-css'*/]);