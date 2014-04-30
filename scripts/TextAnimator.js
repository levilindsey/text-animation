/**
 * This module defines a constructor for TextAnimator objects.
 * @module TextAnimator
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var params, util, log;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * @function TextAnimator~setUpElements
   */
  function setUpElements() {
    var textAnimator = this;

    textAnimator.styleSheet = document.getElementById(params.STYLESHEET_ID);

    textAnimator.shownText = util.createElement('span', textAnimator.container, null, ['shown-text']);
    textAnimator.hiddenText = util.createElement('span', textAnimator.container, null, ['hidden-text']);
    textAnimator.animatingCharacters = [];
  }

  /**
   * @function TextAnimator~animationLoop
   */
  function animationLoop() {
    var textAnimator, currentTime;

    textAnimator = this;
    textAnimator.isLooping = true;
    currentTime = Date.now();

    // TODO:
    // - FIRST:
    //   - make it work with just one element of only text--no children or anything
    //   - simply animate with colors or something
    // - THEN:
    //   - animate with children elements
    // - THEN:
    //   - add complicated additional animation options

    if () {// TODO:

    } else {
      textAnimator.isLooping = false;
    }

    textAnimator.previousTime = currentTime;
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * @function TextAnimator#setTotalAnimationDuration
   * @param {String} innerHtml
   */
  function setInnerHtml(innerHtml) {
    var textAnimator;

    textAnimator = this;

    // TODO:
  }

  /**
   * @function TextAnimator#setTotalAnimationDuration
   * @param {Number} duration
   */
  function setTotalAnimationDuration(duration) {
    var textAnimator;

    textAnimator = this;

    textAnimator.totalDuration = duration;
  }

  /**
   * @function TextAnimator#setCharacterAnimationDuration
   * @param {Number} duration
   */
  function setCharacterAnimationDuration(duration) {
    var textAnimator;

    textAnimator = this;

    textAnimator.characterDuration = duration;
  }

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Initializes some static state for this module.
   * @function TextAnimator.initStaticFields
   */
  function initStaticFields() {
    params = app.params;
    util = app.util;
    log = new app.Log('TextAnimator');
    log.d('initStaticFields', 'Module initialized');
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {HTMLElement} container
   * @param {Number} totalDuration In milliseconds.
   * @param {Number} characterDuration In milliseconds.
   */
  function TextAnimator(container, totalDuration, characterDuration) {
    var textAnimator = this;

    textAnimator.container = container;
    textAnimator.totalDuration = totalDuration;
    textAnimator.characterDuration = characterDuration;
    textAnimator.styleSheet = null;
    textAnimator.shownText = null;
    textAnimator.hiddenText = null;
    textAnimator.animatingCharacters = null;

    textAnimator.setTotalAnimationDuration = setTotalAnimationDuration;
    textAnimator.setCharacterAnimationDuration = setCharacterAnimationDuration;

    setUpElements.call(textAnimator);
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.TextAnimator = TextAnimator;
  TextAnimator.initStaticFields = initStaticFields;

  console.log('TextAnimator module loaded');
})();
