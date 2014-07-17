
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload');

gulp.task('styles', function() {
  return gulp.src('src/styles/main.scss')
      .pipe(sass({style: 'expanded'}))
      .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
      .pipe(gulp.dest('dist/assets/css'))
      .pipe(rename({suffix: '.min'}))
      .pipe(minifycss())
      .pipe(gulp.dest('dist/assets/css'))
      .pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('scripts', function() {
  return gulp.src('src/scripts/**/*.js')
      .pipe(jshint('.jshintrc'))
      .pipe(jshint.reporter('default'))
      .pipe(concat('main.js'))
      .pipe(gulp.dest('dist/assets/js'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest('dist/assets/js'))
      .pipe(notify({ message: 'Scripts task complete' }));
});


//gulp.task('server', ['watch'], function(callback) {
//  var devApp, devServer, devAddress, devHost, url, log=gutil.log, colors=gutil.colors;
//
//  devApp = connect()
//      .use(connect.logger('dev'))
//      .use(connect.static('build'));
//
//  // change port and hostname to something static if you prefer
//  devServer = http.createServer(devApp).listen(0 /*, hostname*/);
//
//  devServer.on('error', function(error) {
//    log(colors.underline(colors.red('ERROR'))+' Unable to start server!');
//    callback(error); // we couldn't start the server, so report it and quit gulp
//  });
//
//  devServer.on('listening', function() {
//    devAddress = devServer.address();
//    devHost = devAddress.address === '0.0.0.0' ? 'localhost' : devAddress.address;
//    url = 'http://' + devHost + ':' + devAddress.port + '/index.html');
//
//    log('');
//    log('Started dev server at '+colors.magenta(url));
//    if(gutil.env.open) {
//      log('Opening dev server URL in browser');
//      open(url);
//    } else {
//      log(colors.gray('(Run with --open to automatically open URL on startup)'));
//    }
//    log('');
//    callback(); // we're done with this task for now
//  });
//});
