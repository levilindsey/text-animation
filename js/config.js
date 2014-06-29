/**
 * This module defines a collection of parameters used throughout this app.
 *
 * @module config
 */
(function () {
  var config, moduleParams;

  config = {};

  config.BASE_DIR = '/..';

  // --- General app parameters --- //

  moduleParams = {};
  config.APP = moduleParams;

  moduleParams.TITLE = 'Text Animator';
  moduleParams.VERSION = '??.??.??';
  moduleParams.LICENSE =
      'The MIT License (MIT). Copyright (c) 2014 Levi Lindsey <levi@jackieandlevi.com>.';

  // --- Log parameters --- //

  moduleParams = {};
  config.LOG = moduleParams;

  moduleParams.RECENT_ENTRIES_LIMIT = 80;
  moduleParams.DEBUG = true;
  moduleParams.VERBOSE = true;

  // --- Localization parameters --- //

  config.L18N = {};

  moduleParams = {};
  config.L18N.EN = moduleParams;

  moduleParams.BAD_BROWSER_MESSAGE =
      ':( Sorry, but some of the fancy features of this app may not work on your browser. You should really upgrade to a newer version.';

  // --- Miscellaneous parameters --- //

  config.SMALL_SCREEN_WIDTH_THRESHOLD = 900;
  config.SMALL_SCREEN_HEIGHT_THRESHOLD = 675;

  config.STYLESHEET_ID = 'stylesheet';

  // --- Expose this module --- //

  if (!window.app) window.app = {};
  window.app.config = config;

  console.log('config module loaded');
})();