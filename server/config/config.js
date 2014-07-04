/**
 * @module config
 *
 * Holds server-side configuration data for the app.
 */

var config, appRoot;

// Translates the relative root path to an absolute path
appRoot = require('path').resolve(__dirname + '/../..');

config = {};

config.app = {};

config.app.port = 3031;
config.app.url = 'http://localhost:' + config.app.port;

// The locations of some important files
config.publicPath = appRoot + '/public';
config.faviconPath = config.publicPath + '/img/favicon.ico';
config.viewsPath = appRoot + '/server/views';

module.exports = config;
