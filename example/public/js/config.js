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
  config.textAnimations = {};

  config.textAnimations.simple = [
    {
      name: 'Plain',
      totalDuration: 2000,
      characterDuration: 100,
      easingFunctionName: 'easeInOutQuad',
      fn: function (span, progress, characterIndex) {
        // Do nothing
      }
    },
    {
      name: 'Fade In Fast',
      totalDuration: 2000,
      characterDuration: 1200,
      easingFunctionName: 'easeInOutQuad',
      fn: function (span, progress, characterIndex) {
        span.style.opacity = progress;
      }
    },
    {
      name: 'Fade In Slow',
      totalDuration: 4000,
      characterDuration: 200,
      easingFunctionName: 'easeInOutQuad',
      fn: function (span, progress, characterIndex) {
        span.style.opacity = progress;
      }
    },
    {
      name: 'Slide Down',
      totalDuration: 3200,
      characterDuration: 300,
      easingFunctionName: 'easeInOutQuad',
      fn: function (span, progress, characterIndex) {
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
      easingFunctionName: 'easeInOutQuad',
      fn: function (span, progress, characterIndex) {
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
      easingFunctionName: 'easeInOutQuad',
      fn: function (span, progress, characterIndex) {
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
      easingFunctionName: 'easeInOutQuad',
      fn: function (span, progress, characterIndex) {
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
      easingFunctionName: 'easeInOutQuad',
      fn: function (span, progress, characterIndex) {
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
      }
    },
    {
      name: 'Bounce Up',
      totalDuration: 4000,
      characterDuration: 400,
      easingFunctionName: 'easeInOutQuad',
      fn: function (span, progress, characterIndex) {
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
      }
    },
    {
      name: 'Slide Around 1',
      totalDuration: 4000,
      characterDuration: 400,
      easingFunctionName: 'easeInOutQuad',
      fn: function (span, progress, characterIndex) {
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
      name: 'Slide Around 2',
      totalDuration: 4000,
      characterDuration: 400,
      easingFunctionName: 'easeInOutQuad',
      fn: function (span, progress, characterIndex) {
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
      easingFunctionName: 'linear',
      fn: function (span, progress, characterIndex) {
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
      easingFunctionName: 'linear',
      fn: function (span, progress, characterIndex) {
        var fontSizeProgress, endFontSize, startFontSize, fontSize;

        fontSizeProgress = ta.util.easingFunctions.easeOutQuad(progress);

        startFontSize = 5;
        endFontSize = 100;
        fontSize = startFontSize * (1 - fontSizeProgress) + endFontSize * fontSizeProgress;

        span.style.fontSize = fontSize + '%';
      }
    },
    {
      name: 'Rotate X',
      totalDuration: 4000,
      characterDuration: 700,
      easingFunctionName: 'easeInOutQuad',
      fn: function (span, progress, characterIndex) {
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
      easingFunctionName: 'easeInOutQuad',
      fn: function (span, progress, characterIndex) {
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
      easingFunctionName: 'easeInOutQuad',
      fn: function (span, progress, characterIndex) {
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
      easingFunctionName: 'easeInOutQuad',
      fn: function (span, progress, characterIndex) {
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
      easingFunctionName: 'easeInOutQuad',
      fn: function (span, progress, characterIndex) {
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
      name: 'Counter Skew',
      totalDuration: 4000,
      characterDuration: 400,
      easingFunctionName: 'easeInOutQuad',
      fn: function (span, progress, characterIndex) {
        var controlPoints, skewProgress, skew;

        controlPoints = [
          { x: 0, y: 0 },
          { x: 0, y: -80 },
          { x: 0, y: -80 },
          { x: 0, y: 0 }
        ];

        skewProgress = progress;

        skew = ta.util.getXYFromPercentWithBezier(skewProgress, controlPoints).y;
        skew = characterIndex % 2 === 0 ? skew : -skew;

        ta.util.applyTransform(span, 'skew(' + skew + 'deg,0deg)');
      }
    },
    {
      name: 'Color Slow',
      totalDuration: 2000,
      characterDuration: 1200,
      easingFunctionName: 'linear',
      fn: function (span, progress, characterIndex) {
        var colorProgress, endSaturation, startSaturation, saturation, endLightness,
            startLightness, lightness, endHue, startHue, hue;

        colorProgress = progress;

        startHue = 90;
        endHue = 450;
        hue = startHue * (1 - colorProgress) + endHue * colorProgress;

        startSaturation = 95;
        endSaturation = 0;
        saturation = startSaturation * (1 - colorProgress) + endSaturation * colorProgress;

        startLightness = 80;
        endLightness = 20;
        lightness = startLightness * (1 - colorProgress) + endLightness * colorProgress;

        span.style.color = 'hsl(' + hue + ',' + saturation + '%,' + lightness + '%)'
      }
    },
    {
      name: 'Color Fast',
      totalDuration: 4000,
      characterDuration: 200,
      easingFunctionName: 'easeInOutQuad',
      fn: function (span, progress, characterIndex) {
        var colorProgress, endSaturation, startSaturation, saturation, endLightness,
            startLightness, lightness, endHue, startHue, hue;

        colorProgress = progress;

        startHue = 90;
        endHue = 450;
        hue = startHue * (1 - colorProgress) + endHue * colorProgress;

        startSaturation = 95;
        endSaturation = 0;
        saturation = startSaturation * (1 - colorProgress) + endSaturation * colorProgress;

        startLightness = 80;
        endLightness = 20;
        lightness = startLightness * (1 - colorProgress) + endLightness * colorProgress;

        span.style.color = 'hsl(' + hue + ',' + saturation + '%,' + lightness + '%)'
      }
    },
    {
      name: 'Color Subtle',
      totalDuration: 2400,
      characterDuration: 200,
      easingFunctionName: 'easeInOutQuad',
      fn: function (span, progress, characterIndex) {
        var colorProgress, endSaturation, startSaturation, saturation, endLightness,
            startLightness, lightness, endHue, startHue, hue;

        colorProgress = progress;

        startHue = 10;
        endHue = 80;
        hue = startHue * (1 - colorProgress) + endHue * colorProgress;

        startSaturation = 40;
        endSaturation = 0;
        saturation = startSaturation * (1 - colorProgress) + endSaturation * colorProgress;

        startLightness = 90;
        endLightness = 20;
        lightness = startLightness * (1 - colorProgress) + endLightness * colorProgress;

        span.style.color = 'hsl(' + hue + ',' + saturation + '%,' + lightness + '%)'
      }
    },
    {
      name: 'Shadow 1',
      totalDuration: 4000,
      characterDuration: 100,
      easingFunctionName: 'easeInOutQuad',
      fn: function (span, progress, characterIndex) {
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
      easingFunctionName: 'easeInOutQuad',
      fn: function (span, progress, characterIndex) {
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

  config.textAnimations.fancy = [
    {
      name: 'Shadow 2',
      isStartingAnimation: true,
      totalDuration: 3000,
      characterDuration: 300,
      easingFunctionName: 'easeInOutQuad',
      fn: function (span, progress, characterIndex) {
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
      name: 'Slide Around 3',
      totalDuration: 4000,
      characterDuration: 400,
      easingFunctionName: 'easeInOutQuad',
      fn: function (span, progress, characterIndex) {
        var controlPointsCollection, controlPoints,
            opacityProgress, slideProgress, pos;

        controlPointsCollection = [
          [
            { x: 0, y: -200 },
            { x: 230, y: -200 },
            { x: 230, y: 0 },
            { x: 0, y: 0 }
          ],
          [
            { x: 200, y: 0 },
            { x: 200, y: 230 },
            { x: 0, y: 230 },
            { x: 0, y: 0 }
          ],
          [
            { x: 0, y: 200 },
            { x: -230, y: 200 },
            { x: -230, y: 0 },
            { x: 0, y: 0 }
          ],
          [
            { x: -200, y: 0 },
            { x: -200, y: -230 },
            { x: 0, y: -230 },
            { x: 0, y: 0 }
          ]
        ];

        controlPoints = controlPointsCollection[characterIndex % 4];

        opacityProgress = ta.util.easingFunctions.easeOutCubic(progress);

        slideProgress = ta.util.easingFunctions.easeOutQuad(progress);

        pos = ta.util.getXYFromPercentWithBezier(slideProgress, controlPoints);

        span.style.opacity = opacityProgress;
        span.style.top = pos.y + 'px';
        span.style.left = pos.x + 'px';
      }
    },
    {
      name: 'Zoom Big',
      totalDuration: 4000,
      characterDuration: 400,
      easingFunctionName: 'linear',
      fn: function (span, progress, characterIndex) {
        var bounceProgressThreshold, maxSkew, bounceSkew, bounceLeft, skewControlPoints,
            leftControlPoints, zoomProgress, skew, left, startLeft;

        bounceProgressThreshold = 0.5;
        maxSkew = -70;
        bounceSkew = 50;
        bounceLeft = -12;

        if (progress < bounceProgressThreshold) {
          zoomProgress = progress + 1 - bounceProgressThreshold;

          skew = maxSkew;

          startLeft = 1800;
          left = startLeft * (1 - zoomProgress);

          ta.util.applyTransform(span, 'skew(' + skew + 'deg,0deg)');
          span.style.left = left + 'px';
        } else {
          skewControlPoints = [
            { x: 0, y: maxSkew },
            { x: 0, y: bounceSkew },
            { x: 0, y: bounceSkew },
            { x: 0, y: 0 }
          ];
          leftControlPoints = [
            { x: 0, y: 0 },
            { x: 0, y: bounceLeft },
            { x: 0, y: bounceLeft },
            { x: 0, y: 0 }
          ];

          zoomProgress = (progress - bounceProgressThreshold) / (1 - bounceProgressThreshold);

          skew = ta.util.getXYFromPercentWithBezier(zoomProgress, skewControlPoints).y;

          left = ta.util.getXYFromPercentWithBezier(zoomProgress, leftControlPoints).y;

          ta.util.applyTransform(span, 'skew(' + skew + 'deg,0deg)');
          span.style.left = left + 'px';
        }
      }
    },
    {
      name: 'Zoom Small',
      totalDuration: 6000,
      characterDuration: 700,
      easingFunctionName: 'linear',
      fn: function (span, progress, characterIndex) {
        var bounceProgressThreshold, maxSkew, bounceSkew, bounceLeft, skewControlPoints,
            leftControlPoints, zoomProgress, skew, left, startLeft, opacityProgress;

        bounceProgressThreshold = 0.8;
        maxSkew = -70;
        bounceSkew = 50;
        bounceLeft = -12;

        if (progress < bounceProgressThreshold) {
          zoomProgress = ta.util.easingFunctions.easeInQuint(progress + 1 - bounceProgressThreshold);

          skew = maxSkew * zoomProgress;

          startLeft = 220;
          left = startLeft * (1 - zoomProgress);

          opacityProgress = ta.util.easingFunctions.easeOutCubic(progress);

          ta.util.applyTransform(span, 'skew(' + skew + 'deg,0deg)');

          span.style.opacity = opacityProgress;
          span.style.left = left + 'px';
        } else {
          skewControlPoints = [
            { x: 0, y: maxSkew },
            { x: 0, y: bounceSkew },
            { x: 0, y: bounceSkew },
            { x: 0, y: 0 }
          ];
          leftControlPoints = [
            { x: 0, y: 0 },
            { x: 0, y: bounceLeft },
            { x: 0, y: bounceLeft },
            { x: 0, y: 0 }
          ];

          zoomProgress = (progress - bounceProgressThreshold) / (1 - bounceProgressThreshold);

          skew = ta.util.getXYFromPercentWithBezier(zoomProgress, skewControlPoints).y;

          left = ta.util.getXYFromPercentWithBezier(zoomProgress, leftControlPoints).y;

          ta.util.applyTransform(span, 'skew(' + skew + 'deg,0deg)');

          span.style.opacity = 1;
          span.style.left = left + 'px';
        }
      }
    },
    {
      name: 'Jitter',
      totalDuration: 4000,
      characterDuration: 500,
      easingFunctionName: 'easeInOutQuad',
      fn: function (span, progress, characterIndex) {
        var opacityProgress, left, top;

        opacityProgress = ta.util.easingFunctions.easeOutCubic(progress);
        span.style.opacity = opacityProgress;

        if ((characterIndex % 2 === 0) === (parseInt((Date.now() / 40 ) % 2) === 0)) {
          left = Math.random() * 4;
          top = Math.random() * 4;

          span.style.left = left + 'px';
          span.style.top = top + 'px';
        }
      }
    },
    {
      name: 'Bounce U/D Small',
      totalDuration: 4000,
      characterDuration: 400,
      easingFunctionName: 'easeInOutQuad',
      fn: function (span, progress, characterIndex) {
        var controlPoints, opacityProgress, slideProgress, top;

        controlPoints = [
          { x: 0, y: 0 },
          { x: 0, y: 220 },
          { x: 0, y: -80 },
          { x: 0, y: 0 }
        ];

        opacityProgress = ta.util.easingFunctions.easeOutCubic(progress);

        slideProgress = ta.util.easingFunctions.easeOutQuad(progress);

        top = ta.util.getXYFromPercentWithBezier(slideProgress, controlPoints).y;
        top = characterIndex % 2 === 0 ? -top : top;

        span.style.opacity = opacityProgress;
        span.style.top = top + 'px';
      }
    },
    {
      name: 'Bounce U/D Big',
      totalDuration: 4000,
      characterDuration: 400,
      easingFunctionName: 'easeInOutQuad',
      fn: function (span, progress, characterIndex) {
        var controlPoints, slideProgress, top;

        controlPoints = [
          { x: 0, y: 0 },
          { x: 0, y: 2200 },
          { x: 0, y: -80 },
          { x: 0, y: 0 }
        ];

        slideProgress = ta.util.easingFunctions.easeOutQuad(progress);

        top = ta.util.getXYFromPercentWithBezier(slideProgress, controlPoints).y;
        top = characterIndex % 2 === 0 ? -top : top;

        span.style.top = top + 'px';
      }
    },
    {
      name: 'Bounce L/R',
      totalDuration: 4000,
      characterDuration: 400,
      easingFunctionName: 'easeInOutQuad',
      fn: function (span, progress, characterIndex) {
        var controlPoints, opacityProgress, slideProgress, left;

        controlPoints = [
          { x: 0, y: 0 },
          { x: 0, y: 220 },
          { x: 0, y: -80 },
          { x: 0, y: 0 }
        ];

        opacityProgress = ta.util.easingFunctions.easeOutCubic(progress);

        slideProgress = ta.util.easingFunctions.easeOutQuad(progress);

        left = ta.util.getXYFromPercentWithBezier(slideProgress, controlPoints).y;
        left = characterIndex % 2 === 0 ? -left : left;

        span.style.opacity = opacityProgress;
        span.style.left = left + 'px';
      }
    },
    {
      name: 'Bounce All',
      totalDuration: 4400,
      characterDuration: 440,
      easingFunctionName: 'easeInOutQuad',
      fn: function (span, progress, characterIndex) {
        var controlPoints, slideProgress, offset;

        controlPoints = [
          { x: 0, y: 2000 },
          { x: 0, y: -80 },
          { x: 0, y: -80 },
          { x: 0, y: 0 }
        ];

        slideProgress = ta.util.easingFunctions.easeOutQuad(progress);

        offset = ta.util.getXYFromPercentWithBezier(slideProgress, controlPoints).y;

        switch (characterIndex % 4) {
          case 0:
            span.style.top = -offset + 'px';
            break;
          case 1:
            span.style.left = offset + 'px';
            break;
          case 2:
            span.style.top = offset + 'px';
            break;
          case 3:
            span.style.left = -offset + 'px';
            break;
        }
      }
    },
    {
      name: 'Roll Left',
      totalDuration: 6000,
      characterDuration: 700,
      easingFunctionName: 'linear',
      fn: function (span, progress, characterIndex) {
        var rotationProgress, endRotation, startRotation, rotation, endOffset, startOffset, offset;

        rotationProgress = ta.util.easingFunctions.easeInOutQuad(progress);

        startRotation = 540;
        endRotation = 0;
        rotation = startRotation * (1 - rotationProgress) + endRotation * rotationProgress;

        startOffset = 120;
        endOffset = 0;
        offset = startOffset * (1 - rotationProgress) + endOffset * rotationProgress;

        ta.util.applyTransform(span, 'rotate(' + rotation + 'deg)');
        span.style.left = offset + 'px';
      }
    },
    {
      name: 'Roll Right',
      totalDuration: 4000,
      characterDuration: 400,
      easingFunctionName: 'linear',
      fn: function (span, progress, characterIndex) {
        var rotationProgress, endRotation, startRotation, rotation, endOffset, startOffset, offset;

        rotationProgress = ta.util.easingFunctions.easeInOutQuad(progress);

        startRotation = -540;
        endRotation = 0;
        rotation = startRotation * (1 - rotationProgress) + endRotation * rotationProgress;

        startOffset = -120;
        endOffset = 0;
        offset = startOffset * (1 - rotationProgress) + endOffset * rotationProgress;

        ta.util.applyTransform(span, 'rotate(' + rotation + 'deg)');
        span.style.left = offset + 'px';
      }
    },
    {
      name: 'Rainbow',
      totalDuration: 3000,
      characterDuration: 500,
      easingFunctionName: 'easeInOutQuad',
      fn: function (span, progress, characterIndex) {
        var colorCount, colorProgress, hueProgress, endSaturation, startSaturation, saturation, endLightness,
            startLightness, lightness, endHue, startHue, hue;

        hueProgress = progress;
        colorProgress = ta.util.easingFunctions.easeInQuint(progress);

        colorCount = 36;

        startHue = characterIndex % colorCount * (360 / colorCount);
        endHue = 80;
        hue = startHue * (1 - hueProgress) + endHue * hueProgress;

        startSaturation = 70;
        endSaturation = 0;
        saturation = startSaturation * (1 - colorProgress) + endSaturation * colorProgress;

        startLightness = 70;
        endLightness = 20;
        lightness = startLightness * (1 - colorProgress) + endLightness * colorProgress;

        span.style.color = 'hsl(' + hue + ',' + saturation + '%,' + lightness + '%)'
      }
    }
  ];

  // --- Expose this module --- //

  if (!window.app) window.app = {};
  window.app.config = config;

  console.log('config module loaded');
})();
