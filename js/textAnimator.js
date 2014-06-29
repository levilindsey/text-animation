/**
 * This module defines a singleton for animating text.
 *
 * @module textAnimator
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config, util, log, TextAnimationJob, textAnimator;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * @function textAnimator~animationLoop
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
   *
   * @param {HTMLElement} element
   * @param {Number} totalDuration In milliseconds.
   * @param {Number} characterDuration In milliseconds.
   */
  function animateText(element, totalDuration, characterDuration) {
    var job;

    job = new TextAnimationJob(element, totalDuration, characterDuration);

    textAnimator.jobs.push(job);
  }

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Initializes some static state for this module.
   * @function textAnimator.initStaticFields
   */
  function initStaticFields() {
    config = app.config;
    util = app.util;
    log = new app.Log('textAnimator');
    TextAnimationJob = app.TextAnimationJob;
    log.d('initStaticFields', 'Module initialized');
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this singleton

  textAnimator = {};
  textAnimator.jobs = [];
  textAnimator.initStaticFields = initStaticFields;
  textAnimator.animateText = animateText;

  // Expose this module
  if (!window.app) window.app = {};
  window.app.textAnimator = textAnimator;

  console.log('textAnimator module loaded');
})();
