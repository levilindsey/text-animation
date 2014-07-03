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

  // --- Text animation parameters --- //

  moduleParams = {};
  config.textAnimation = moduleParams;

  moduleParams.totalDuration = 4000;
  moduleParams.characterDuration = 300;

  /**
   * Sets the style of the given span according to the given progress value and this animation
   * function's custom animation curve functionality.
   *
   * @param {HTMLElement} span
   * @param {number} progress Between 0 and 1.
   */
  moduleParams.animationFunction = function (span, progress) {
    var startBottom, endBottom;

    startBottom = -80;
    endBottom = 0;

    span.style.opacity = progress;
    span.style.bottom = startBottom * (1 - progress) + endBottom * progress + 'px';

    // TODO:
    // - apply easing in here
    // - add other animations
  };

  // --- Expose this module --- //

  if (!window.app) window.app = {};
  window.app.config = config;

  console.log('config module loaded');
})();
