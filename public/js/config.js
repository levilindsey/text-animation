/**
 * This module defines a collection of parameters used throughout this app.
 *
 * @module config
 */
(function () {
  var config, moduleParams, util;

  // ---  --- //

  var easingFunctions = {
    linear: function (t) {
      return t;
    },
    easeInQuad: function (t) {
      return t * t;
    },
    easeOutQuad: function (t) {
      return t * (2 - t);
    },
    easeInOutQuad: function (t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    easeInCubic: function (t) {
      return t * t * t;
    },
    easeOutCubic: function (t) {
      return 1 + --t * t * t;
    },
    easeInOutCubic: function (t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    easeInQuart: function (t) {
      return t * t * t * t;
    },
    easeOutQuart: function (t) {
      return 1 - --t * t * t * t;
    },
    easeInOutQuart: function (t) {
      return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
    },
    easeInQuint: function (t) {
      return t * t * t * t * t;
    },
    easeOutQuint: function (t) {
      return 1 + --t * t * t * t * t;
    },
    easeInOutQuint: function (t) {
      return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
    }
  };

  // ---  --- //

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
  moduleParams.characterDuration = 400;

  /**
   * These set the style of the given span according to the given progress value and this
   * animation function's custom animation curve functionality.
   *
   * @param {HTMLElement} span
   * @param {number} progress Between 0 and 1.
   */
  moduleParams.animationFunctions = [
    {
      name: 'Slide Up',
      fn: function (span, progress) {
        var opacityProgress, bottomProgress, startBottom, endBottom, bottom;

        opacityProgress = easingFunctions.easeOutCubic(progress);

        bottomProgress = easingFunctions.easeOutQuint(progress);

        startBottom = -80;
        endBottom = 0;
        bottom = startBottom * (1 - bottomProgress) + endBottom * bottomProgress + 'px';

        span.style.opacity = opacityProgress;
        span.style.bottom = bottom;
      }
    },
    {
      name: 'Slide Around',
      fn: function (span, progress) {
        var controlPoints, opacityProgress, slideProgress, pos;

        controlPoints = [
          { x: -50, y: 50 },
          { x: 20, y: 100 },
          { x: 30, y: -25 },
          { x: 0.001, y: 0.001 }
        ];

        opacityProgress = easingFunctions.easeOutCubic(progress);

        slideProgress = easingFunctions.easeOutQuad(progress);

        pos = util.getXYFromPercentWithBezier(slideProgress, controlPoints);
        console.log('pos=' + pos.x + ', ' + pos.y);///// TODO /////
        span.style.opacity = opacityProgress;
        span.style.top = pos.y + 'px';
        span.style.left = pos.x + 'px';
      }
    }
    // TODO: add other animations
  ];

  // --- Expose this module --- //

  config.init = function () {
    util = app.util;
  };

  if (!window.app) window.app = {};
  window.app.config = config;

  console.log('config module loaded');
})();
