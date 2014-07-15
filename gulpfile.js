var gulp = require('gulp');

gulp.task('default', function () {

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