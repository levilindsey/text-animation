/**
 * This module defines a collection of parameters used throughout this app.
 *
 * @module config
 */
(function () {
  var config = {};

  // --- Text animation parameters --- //

  config.startingAnimationDelay = 400;

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

        topProgress = ta.util.easingFunctions.easeOutQuint(progress);

        startTop = 80;
        endTop = 0;
        top = startTop * (1 - topProgress) + endTop * topProgress;

        span.style.bottom = top + 'px';
      }
    },
    {
      name: 'Slide Up',
      totalDuration: 3200,
      characterDuration: 300,
      fn: function (span, progress) {
        var topProgress, startTop, endTop, top;

        topProgress = ta.util.easingFunctions.easeOutQuint(progress);

        startTop = -80;
        endTop = 0;
        top = startTop * (1 - topProgress) + endTop * topProgress;

        span.style.bottom = top + 'px';
      }
    },
    {
      name: 'Slide Right',
      totalDuration: 3200,
      characterDuration: 300,
      fn: function (span, progress) {
        var leftProgress, startLeft, endLeft, left;

        leftProgress = ta.util.easingFunctions.easeOutQuint(progress);

        startLeft = -80;
        endLeft = 0;
        left = startLeft * (1 - leftProgress) + endLeft * leftProgress;

        span.style.left = left + 'px';
      }
    },
    {
      name: 'Slide Left',
      totalDuration: 3200,
      characterDuration: 300,
      fn: function (span, progress) {
        var leftProgress, startLeft, endLeft, left;

        leftProgress = ta.util.easingFunctions.easeOutQuint(progress);

        startLeft = 80;
        endLeft = 0;
        left = startLeft * (1 - leftProgress) + endLeft * leftProgress;

        span.style.left = left + 'px';
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
          { x: 0, y: -160 },
          { x: 0, y: 80 },
          { x: 0, y: 0 }
        ];

        slideProgress = ta.util.easingFunctions.easeOutQuad(progress);

        pos = ta.util.getXYFromPercentWithBezier(slideProgress, controlPoints);

        span.style.top = pos.y + 'px';
        span.style.left = pos.x + 'px';
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
          { x: 0, y: 160 },
          { x: 0, y: -80 },
          { x: 0, y: 0 }
        ];

        slideProgress = ta.util.easingFunctions.easeOutQuad(progress);

        pos = ta.util.getXYFromPercentWithBezier(slideProgress, controlPoints);

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

        opacityProgress = ta.util.easingFunctions.easeOutCubic(progress);

        slideProgress = ta.util.easingFunctions.easeOutQuad(progress);

        pos = ta.util.getXYFromPercentWithBezier(slideProgress, controlPoints);

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

        opacityProgress = ta.util.easingFunctions.easeOutCubic(progress);

        slideProgress = ta.util.easingFunctions.easeOutQuad(progress);

        pos = ta.util.getXYFromPercentWithBezier(slideProgress, controlPoints);

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

        opacityProgress = ta.util.easingFunctions.easeOutCubic(progress);

        slideProgress = ta.util.easingFunctions.easeOutQuad(progress);

        pos = ta.util.getXYFromPercentWithBezier(slideProgress, controlPoints);

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

        fontSizeProgress = ta.util.easingFunctions.easeOutQuad(progress);

        startFontSize = 300;
        endFontSize = 100;
        fontSize = startFontSize * (1 - fontSizeProgress) + endFontSize * fontSizeProgress;

        span.style.fontSize = fontSize + '%';
      }
    },
    {
      name: 'Font Size Up',
      totalDuration: 2000,
      characterDuration: 400,
      fn: function (span, progress) {
        var fontSizeProgress, endFontSize, startFontSize, fontSize;

        fontSizeProgress = ta.util.easingFunctions.easeOutQuad(progress);

        startFontSize = 5;
        endFontSize = 100;
        fontSize = startFontSize * (1 - fontSizeProgress) + endFontSize * fontSizeProgress;

        span.style.fontSize = fontSize + '%';
      }
    },
    {
      name: 'Rotate Z Left',
      totalDuration: 4000,
      characterDuration: 400,
      fn: function (span, progress) {
        var rotationProgress, endRotation, startRotation, rotation;

        rotationProgress = ta.util.easingFunctions.easeOutQuad(progress);

        startRotation = 0;
        endRotation = 360;
        rotation = startRotation * (1 - rotationProgress) + endRotation * rotationProgress;

        ta.util.applyTransform(span, 'rotate(' + rotation + 'deg)');
      }
    },
    {
      name: 'Rotate Z Right',
      totalDuration: 4000,
      characterDuration: 400,
      fn: function (span, progress) {
        var rotationProgress, endRotation, startRotation, rotation;

        rotationProgress = ta.util.easingFunctions.easeOutQuad(progress);

        startRotation = 0;
        endRotation = -360;
        rotation = startRotation * (1 - rotationProgress) + endRotation * rotationProgress;

        ta.util.applyTransform(span, 'rotate(' + rotation + 'deg)');
      }
    },
    {
      name: 'Rotate X',
      totalDuration: 4000,
      characterDuration: 700,
      fn: function (span, progress) {
        var rotationProgress, endRotation, startRotation, rotation;

        rotationProgress = ta.util.easingFunctions.easeOutQuad(progress);

        startRotation = 0;
        endRotation = -360;
        rotation = startRotation * (1 - rotationProgress) + endRotation * rotationProgress;

        ta.util.applyTransform(span, 'rotateX(' + rotation + 'deg)');
      }
    },
    {
      name: 'Rotate Y',
      totalDuration: 4000,
      characterDuration: 700,
      fn: function (span, progress) {
        var rotationProgress, endRotation, startRotation, rotation;

        rotationProgress = ta.util.easingFunctions.easeOutQuad(progress);

        startRotation = 0;
        endRotation = -360;
        rotation = startRotation * (1 - rotationProgress) + endRotation * rotationProgress;

        ta.util.applyTransform(span, 'rotateY(' + rotation + 'deg)');
      }
    },
    {
      name: 'Rotate 3D',
      totalDuration: 8000,
      characterDuration: 1600,
      fn: function (span, progress) {
        var rotationProgress, endRotation, startRotation, rotation;

        rotationProgress = ta.util.easingFunctions.easeOutQuad(progress);

        startRotation = 0;
        endRotation = -360;
        rotation = startRotation * (1 - rotationProgress) + endRotation * rotationProgress;

        ta.util.applyTransform(span, 'rotate3D(1,1,1,' + rotation + 'deg)');
      }
    },
    {
      name: 'Scale Y',
      totalDuration: 4000,
      characterDuration: 400,
      fn: function (span, progress) {
        var controlPoints, scaleProgress, scale;

        controlPoints = [
          { x: 0, y: 0 },
          { x: 0, y: 4 },
          { x: 0, y: 4 },
          { x: 0, y: 0 }
        ];

        scaleProgress = progress;

        scale = ta.util.getXYFromPercentWithBezier(scaleProgress, controlPoints).y;

        ta.util.applyTransform(span, 'scaleY(' + scale + ')');
      }
    },
    {
      name: 'Skew',
      totalDuration: 4000,
      characterDuration: 400,
      fn: function (span, progress) {
        var controlPoints, skewProgress, skew;

        controlPoints = [
          { x: 0, y: 0 },
          { x: 0, y: -80 },
          { x: 0, y: -80 },
          { x: 0, y: 0 }
        ];

        skewProgress = progress;

        skew = ta.util.getXYFromPercentWithBezier(skewProgress, controlPoints).y;

        ta.util.applyTransform(span, 'skew(' + skew + 'deg,0deg)');
      }
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
      }
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
      }
    },
    {
      name: 'Shadow 1',
      isStartingAnimation: true,
      totalDuration: 3000,
      characterDuration: 300,
      fn: function (span, progress) {
        var shadowBlurProgress, controlPoints, pos, shadowBlurRatio, shadowOffsetRatio,
            fontSizeRatio, shadowBlur, shadowOffset, fontSize;

        shadowBlurProgress = progress;

        controlPoints = [
          { x: 0, y: 0 },
          { x: 0, y: 3 },
          { x: 0, y: 3 },
          { x: 0, y: 0 }
        ];

        shadowBlurRatio = 6;
        shadowOffsetRatio = 3;
        fontSizeRatio = 8;

        pos = ta.util.getXYFromPercentWithBezier(shadowBlurProgress, controlPoints);

        shadowBlur = shadowBlurRatio * pos.y;
        shadowOffset = shadowOffsetRatio * pos.y;
        fontSize = 100 + fontSizeRatio * pos.y;

        span.style.left = -shadowOffset + 'px';
        span.style.top = -shadowOffset + 'px';
        span.style.fontSize = fontSize + '%';
        span.style.textShadow = shadowOffset + 'px ' + shadowOffset + 'px ' + shadowBlur + 'px #000000';
      }
    },
    {
      name: 'Shadow 2',
      totalDuration: 4000,
      characterDuration: 100,
      fn: function (span, progress) {
        var borderThicknessProgress, controlPoints, borderThickness;

        borderThicknessProgress = progress;

        controlPoints = [
          { x: 0, y: 0 },
          { x: 0, y: 4 },
          { x: 0, y: 4 },
          { x: 0, y: 0 }
        ];

        borderThickness = ta.util.getXYFromPercentWithBezier(borderThicknessProgress, controlPoints).y;

        span.style.textShadow =
            borderThickness + 'px ' + borderThickness + 'px 2px #d4d5d3,' +
            -borderThickness + 'px ' + borderThickness + 'px 2px #d4d5d3,' +
            borderThickness + 'px ' + -borderThickness + 'px 2px #d4d5d3,' +
            -borderThickness + 'px ' + -borderThickness + 'px 2px #d4d5d3';
      }
    },
    {
      name: 'Background',
      totalDuration: 4000,
      characterDuration: 300,
      fn: function (span, progress) {
        var backgroundOpacityProgress, controlPoints, backgroundOpacity;

        backgroundOpacityProgress = progress;

        controlPoints = [
          { x: 0, y: 0 },
          { x: 0, y: 1.1 },
          { x: 0, y: 1.1 },
          { x: 0, y: 0 }
        ];

        backgroundOpacity = ta.util.getXYFromPercentWithBezier(backgroundOpacityProgress, controlPoints).y;

        span.style.backgroundColor = 'rgba(130,240,12,' + backgroundOpacity +')';
      }
    }
  ];

  // --- Expose this module --- //

  if (!window.app) window.app = {};
  window.app.config = config;

  console.log('config module loaded');
})();
