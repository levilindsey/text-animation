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

  /**
   * These functions set the style of the given span according to the given progress value and
   * this animation function's custom animation curve functionality.
   *
   * @param {HTMLElement} span
   * @param {number} progress Between 0 and 1.
   */
  config.textAnimations = [
    {
      name: 'Plain',
      totalDuration: 2000,
      characterDuration: 100,
      fn: function (span, progress) {
        span.style.opacity = 1;
      }
    },
    {
      name: 'Fade In Fast',
      totalDuration: 2000,
      characterDuration: 1200,
      fn: function (span, progress) {
        span.style.opacity = progress;
      }
    },
    {
      name: 'Fade In Slow',
      totalDuration: 4000,
      characterDuration: 200,
      fn: function (span, progress) {
        span.style.opacity = progress;
      }
    },
    {
      name: 'Slide Down',
      totalDuration: 3200,
      characterDuration: 300,
      fn: function (span, progress) {
        var topProgress, startTop, endTop, top;

        topProgress = easingFunctions.easeOutQuint(progress);

        startTop = 80;
        endTop = 0;
        top = startTop * (1 - topProgress) + endTop * topProgress;

        span.style.opacity = 1;
        span.style.bottom = top + 'px';
      }
    },
    {
      name: 'Slide Up',
      totalDuration: 3200,
      characterDuration: 300,
      fn: function (span, progress) {
        var topProgress, startTop, endTop, top;

        topProgress = easingFunctions.easeOutQuint(progress);

        startTop = -80;
        endTop = 0;
        top = startTop * (1 - topProgress) + endTop * topProgress;

        span.style.opacity = 1;
        span.style.bottom = top + 'px';
      }
    },
    {
      name: 'Slide Right',
      totalDuration: 3200,
      characterDuration: 300,
      fn: function (span, progress) {
        var leftProgress, startLeft, endLeft, left;

        leftProgress = easingFunctions.easeOutQuint(progress);

        startLeft = -80;
        endLeft = 0;
        left = startLeft * (1 - leftProgress) + endLeft * leftProgress;

        span.style.opacity = 1;
        span.style.left = left + 'px';
      }
    },
    {
      name: 'Slide Left',
      totalDuration: 3200,
      characterDuration: 300,
      fn: function (span, progress) {
        var leftProgress, startLeft, endLeft, left;

        leftProgress = easingFunctions.easeOutQuint(progress);

        startLeft = 80;
        endLeft = 0;
        left = startLeft * (1 - leftProgress) + endLeft * leftProgress;

        span.style.opacity = 1;
        span.style.left = left + 'px';
      }
    },
    {
      name: 'Bounce Up',
      totalDuration: 4000,
      characterDuration: 400,
      fn: function (span, progress) {
        var controlPoints, slideProgress, pos;

        controlPoints = [
          { x: 0, y: 0 },
          { x: 0, y: -160 },
          { x: 0, y: 80 },
          { x: 0, y: 0 }
        ];

        slideProgress = easingFunctions.easeOutQuad(progress);

        pos = util.getXYFromPercentWithBezier(slideProgress, controlPoints);

        span.style.opacity = 1;
        span.style.top = pos.y + 'px';
        span.style.left = pos.x + 'px';
      }
    },
    {
      name: 'Bounce Down',
      totalDuration: 4000,
      characterDuration: 400,
      fn: function (span, progress) {
        var controlPoints, slideProgress, pos;

        controlPoints = [
          { x: 0, y: 0 },
          { x: 0, y: 160 },
          { x: 0, y: -80 },
          { x: 0, y: 0 }
        ];

        slideProgress = easingFunctions.easeOutQuad(progress);

        pos = util.getXYFromPercentWithBezier(slideProgress, controlPoints);

        span.style.opacity = 1;
        span.style.top = pos.y + 'px';
        span.style.left = pos.x + 'px';
      }
    },
    {
      name: 'Slide Around 1',
      totalDuration: 4000,
      characterDuration: 400,
      fn: function (span, progress) {
        var controlPoints, opacityProgress, slideProgress, pos;

        controlPoints = [
          { x: -50, y: 50 },
          { x: 20, y: 100 },
          { x: 80, y: -80 },
          { x: 0, y: 0 }
        ];

        opacityProgress = easingFunctions.easeOutCubic(progress);

        slideProgress = easingFunctions.easeOutQuad(progress);

        pos = util.getXYFromPercentWithBezier(slideProgress, controlPoints);

        span.style.opacity = opacityProgress;
        span.style.top = pos.y + 'px';
        span.style.left = pos.x + 'px';
      }
    },
    {
      name: 'Slide Around 2',
      totalDuration: 4000,
      characterDuration: 400,
      fn: function (span, progress) {
        var controlPoints, opacityProgress, slideProgress, pos;

        controlPoints = [
          { x: 0, y: 0 },
          { x: 0, y: 160 },
          { x: 160, y: 0 },
          { x: 0, y: 0 }
        ];

        opacityProgress = easingFunctions.easeOutCubic(progress);

        slideProgress = easingFunctions.easeOutQuad(progress);

        pos = util.getXYFromPercentWithBezier(slideProgress, controlPoints);

        span.style.opacity = opacityProgress;
        span.style.top = pos.y + 'px';
        span.style.left = pos.x + 'px';
      }
    },
    {
      name: 'Slide Around 3',
      totalDuration: 4000,
      characterDuration: 400,
      fn: function (span, progress) {
        var controlPoints, opacityProgress, slideProgress, pos;

        controlPoints = [
          { x: 0, y: 0 },
          { x: 0, y: -200 },
          { x: -200, y: 0 },
          { x: 0, y: 0 }
        ];

        opacityProgress = easingFunctions.easeOutCubic(progress);

        slideProgress = easingFunctions.easeOutQuad(progress);

        pos = util.getXYFromPercentWithBezier(slideProgress, controlPoints);

        span.style.opacity = opacityProgress;
        span.style.top = pos.y + 'px';
        span.style.left = pos.x + 'px';
      }
    },
    {
      name: 'Font Size Down',
      totalDuration: 3000,
      characterDuration: 200,
      fn: function (span, progress) {
        var fontSizeProgress, endFontSize, startFontSize, fontSize;

        fontSizeProgress = easingFunctions.easeOutQuad(progress);

        startFontSize = 300;
        endFontSize = 100;
        fontSize = startFontSize * (1 - fontSizeProgress) + endFontSize * fontSizeProgress;

        span.style.opacity = 1;
        span.style.fontSize = fontSize + '%';
      }
    },
    {
      name: 'Font Size Up',
      totalDuration: 2000,
      characterDuration: 400,
      fn: function (span, progress) {
        var fontSizeProgress, endFontSize, startFontSize, fontSize;

        fontSizeProgress = easingFunctions.easeOutQuad(progress);

        startFontSize = 5;
        endFontSize = 100;
        fontSize = startFontSize * (1 - fontSizeProgress) + endFontSize * fontSizeProgress;

        span.style.opacity = 1;
        span.style.fontSize = fontSize + '%';
      }
    },
    {
      name: 'Rotate Left',
      totalDuration: 2000,
      characterDuration: 400,
      fn: function (span, progress) {
        var rotationProgress, endRotation, startRotation, rotation;

        rotationProgress = easingFunctions.easeOutQuad(progress);

        startRotation = 0;
        endRotation = 360;
        rotation = startRotation * (1 - rotationProgress) + endRotation * rotationProgress;

        span.style.opacity = 1;
        util.applyTransform(span, 'rotate(' + rotation + 'deg)');// TODO: fix this
      }
    },
    {
      name: 'Rotate Right',
      totalDuration: 2000,
      characterDuration: 400,
      fn: function (span, progress) {
        var rotationProgress, endRotation, startRotation, rotation;

        rotationProgress = easingFunctions.easeOutQuad(progress);

        startRotation = 0;
        endRotation = -360;
        rotation = startRotation * (1 - rotationProgress) + endRotation * rotationProgress;

        span.style.opacity = 1;
        util.applyTransform(span, 'rotate(' + rotation + 'deg)');// TODO: fix this
      }
    },
    {
      name: 'Color Slow',
      totalDuration: 2000,
      characterDuration: 1200,
      fn: function (span, progress) {
        var colorProgress, endSaturation, startSaturation, saturation, endLightness,
            startLightness, lightness, endHue, startHue, hue;

        colorProgress = progress

        startHue = 80;
        endHue = 440;
        hue = startHue * (1 - colorProgress) + endHue * colorProgress;

        startSaturation = 42;
        endSaturation = 3.05;
        saturation = startSaturation * (1 - colorProgress) + endSaturation * colorProgress;

        startLightness = 10;
        endLightness = 77.25;
        lightness = startLightness * (1 - colorProgress) + endLightness * colorProgress;

        span.style.opacity = 1;
        span.style.color = 'hsl(' + hue + ',' + saturation + '%,' + lightness + '%)'
      }
    },
    {
      name: 'Color Fast',
      totalDuration: 4000,
      characterDuration: 200,
      fn: function (span, progress) {
        var colorProgress, endSaturation, startSaturation, saturation, endLightness,
            startLightness, lightness, endHue, startHue, hue;

        colorProgress = progress;

        startHue = 80;
        endHue = 440;
        hue = startHue * (1 - colorProgress) + endHue * colorProgress;

        startSaturation = 42;
        endSaturation = 3.05;
        saturation = startSaturation * (1 - colorProgress) + endSaturation * colorProgress;

        startLightness = 10;
        endLightness = 77.25;
        lightness = startLightness * (1 - colorProgress) + endLightness * colorProgress;

        span.style.opacity = 1;
        span.style.color = 'hsl(' + hue + ',' + saturation + '%,' + lightness + '%)'
      }
    }

    // TODO: add other animations
    // - (stuff from email)
    // -
    // -
    // -
    // -
    // -
    // -
    // -
    // -
    // -
    // -
    // -
  ];

  // --- Expose this module --- //

  config.init = function () {
    util = app.util;
  };

  if (!window.app) window.app = {};
  window.app.config = config;

  console.log('config module loaded');
})();