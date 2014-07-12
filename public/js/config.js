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
        // Do nothing
      },
      isInlineBlock: false
    },
    {
      name: 'Fade In Fast',
      totalDuration: 2000,
      characterDuration: 1200,
      fn: function (span, progress) {
        span.style.opacity = progress;
      },
      isInlineBlock: false
    },
    {
      name: 'Fade In Slow',
      totalDuration: 4000,
      characterDuration: 200,
      fn: function (span, progress) {
        span.style.opacity = progress;
      },
      isInlineBlock: false
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

        span.style.bottom = top + 'px';
      },
      isInlineBlock: false
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

        span.style.bottom = top + 'px';
      },
      isInlineBlock: false
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

        span.style.left = left + 'px';
      },
      isInlineBlock: false
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

        span.style.left = left + 'px';
      },
      isInlineBlock: false
    },
    {
      name: 'Bounce Down',
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

        span.style.top = pos.y + 'px';
        span.style.left = pos.x + 'px';
      },
      isInlineBlock: false
    },
    {
      name: 'Bounce Up',
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

        span.style.top = pos.y + 'px';
        span.style.left = pos.x + 'px';
      },
      isInlineBlock: false
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
      },
      isInlineBlock: false
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
      },
      isInlineBlock: false
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
      },
      isInlineBlock: false
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

        span.style.fontSize = fontSize + '%';
      },
      isInlineBlock: false
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

        span.style.fontSize = fontSize + '%';
      },
      isInlineBlock: false
    },
    {
      name: 'Rotate Left',
      totalDuration: 2800,
      characterDuration: 300,
      fn: function (span, progress) {
        var rotationProgress, endRotation, startRotation, rotation;

        rotationProgress = easingFunctions.easeOutQuad(progress);

        startRotation = 0;
        endRotation = 360;
        rotation = startRotation * (1 - rotationProgress) + endRotation * rotationProgress;

        util.applyTransform(span, 'rotate(' + rotation + 'deg)');
      },
      isInlineBlock: true
    },
    {
      name: 'Rotate Right',
      totalDuration: 2800,
      characterDuration: 300,
      fn: function (span, progress) {
        var rotationProgress, endRotation, startRotation, rotation;

        rotationProgress = easingFunctions.easeOutQuad(progress);

        startRotation = 0;
        endRotation = -360;
        rotation = startRotation * (1 - rotationProgress) + endRotation * rotationProgress;

        util.applyTransform(span, 'rotate(' + rotation + 'deg)');
      },
      isInlineBlock: true
    },
    {
      name: 'Color Slow',
      totalDuration: 2000,
      characterDuration: 1200,
      fn: function (span, progress) {
        var colorProgress, endSaturation, startSaturation, saturation, endLightness,
            startLightness, lightness, endHue, startHue, hue;

        colorProgress = progress;

        startHue = 90;
        endHue = 450;
        hue = startHue * (1 - colorProgress) + endHue * colorProgress;

        startSaturation = 42;
        endSaturation = 2;
        saturation = startSaturation * (1 - colorProgress) + endSaturation * colorProgress;

        startLightness = 10;
        endLightness = 83;
        lightness = startLightness * (1 - colorProgress) + endLightness * colorProgress;

        span.style.color = 'hsl(' + hue + ',' + saturation + '%,' + lightness + '%)'
      },
      isInlineBlock: false
    },
    {
      name: 'Color Fast',
      totalDuration: 4000,
      characterDuration: 200,
      fn: function (span, progress) {
        var colorProgress, endSaturation, startSaturation, saturation, endLightness,
            startLightness, lightness, endHue, startHue, hue;

        colorProgress = progress;

        startHue = 90;
        endHue = 450;
        hue = startHue * (1 - colorProgress) + endHue * colorProgress;

        startSaturation = 42;
        endSaturation = 2;
        saturation = startSaturation * (1 - colorProgress) + endSaturation * colorProgress;

        startLightness = 10;
        endLightness = 83;
        lightness = startLightness * (1 - colorProgress) + endLightness * colorProgress;

        span.style.color = 'hsl(' + hue + ',' + saturation + '%,' + lightness + '%)'
      },
      isInlineBlock: false
    },
    {
      name: 'Color Subtle',
      totalDuration: 2400,
      characterDuration: 200,
      fn: function (span, progress) {
        var colorProgress, endSaturation, startSaturation, saturation, endLightness,
            startLightness, lightness, endHue, startHue, hue;

        colorProgress = progress;

        startHue = 10;
        endHue = 80;
        hue = startHue * (1 - colorProgress) + endHue * colorProgress;

        startSaturation = 24;
        endSaturation = 3.05;
        saturation = startSaturation * (1 - colorProgress) + endSaturation * colorProgress;

        startLightness = 20;
        endLightness = 77.25;
        lightness = startLightness * (1 - colorProgress) + endLightness * colorProgress;

        span.style.color = 'hsl(' + hue + ',' + saturation + '%,' + lightness + '%)'
      },
      isInlineBlock: false
    }

    // TODO: add other animations
    // - add overall number-of-characters-to-have-started easing logic
    //
    // - add some animation functions whose start/end values actually transition as well (so that one character's animation might be bigger than another's)
    //
    // - text-shadow: h-shadow v-shadow blur color|none|initial|inherit;
    // - -webkit-/-moz-/-ms-/transform: rotateX/Y/Z(130deg); // 2D
    // - -webkit-/-moz-/-ms-/transform: scaleX/Y/Z(1.5); // 3D
    // - -webkit-/-moz-/-ms-/transform: rotate(130deg); // 2D
    // - -webkit-/-moz-/-ms-/transform: skew(30deg,20deg); // 30deg around the x-axis, 20deg around the y-axis
  ];

  // --- Expose this module --- //

  config.init = function () {
    util = app.util;
  };

  if (!window.app) window.app = {};
  window.app.config = config;

  console.log('config module loaded');
})();
