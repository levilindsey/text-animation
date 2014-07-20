
var srcPath = 'src',
    distPath = 'dist',

    gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify');

gulp.task('scripts', function () {
  return gulp.src(srcPath + '/**/*.js')
      .pipe(jshint('.jshintrc'))
      .pipe(jshint.reporter('default'))
      .pipe(concat('text-animation.js'))
      .pipe(gulp.dest(distPath))
      .pipe(rename({ suffix: '.min' }))
      .pipe(uglify())
      .pipe(gulp.dest(distPath))
      .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('clean', function () {
  return gulp.src([distPath], {read: false})
      .pipe(clean());
});

gulp.task('default', ['clean'], function () {
  gulp.start('scripts');
});

gulp.task('watch', function () {
  gulp.watch(srcPath + '/**/*.js', ['scripts']);
});
