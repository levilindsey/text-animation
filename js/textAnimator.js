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
  // Private static functions

  /**
   * This is the animation loop that drives all of the text animation.
   */
  function animationLoop() {
    var textAnimator, currentTime;

    textAnimator = this;
    textAnimator.isLooping = true;
    currentTime = Date.now();

    if (!textAnimator.isPaused) {
      updateJobs(currentTime);
      requestAnimationFrame(animationLoop);
    } else {
      textAnimator.isLooping = false;
    }

    textAnimator.previousTime = currentTime;
  }

  /**
   * Updates all of the active TextAnimationJobs.
   *
   * @param {number} currentTime
   */
  function updateJobs(currentTime) {
    var i, count;

    for (i = 0, count = textAnimator.jobs.length; i < count; i += 1) {
      textAnimator.jobs[i].update(currentTime);

      // Remove jobs from the list after they are complete
      if (textAnimator.jobs[i].isComplete) {
        textAnimator.jobs.splice(i, 1);
        i--;
        count--;

        // Stop the animation loop when there are no more jobs to animate
        if (textAnimator.jobs.length === 0) {
          textAnimator.isPaused = true;
        }
      }
    }
  }

  /**
   * A cross-browser compatible requestAnimationFrame. From
   * https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
   * @type {Function}
   */
  var requestAnimationFrame =
    window.requestAnimationFrame || // the standard
    window.webkitRequestAnimationFrame || // chrome/safari
    window.mozRequestAnimationFrame || // firefox
    window.oRequestAnimationFrame || // opera
    window.msRequestAnimationFrame || // ie
    function (callback) { // default
      window.setTimeout(callback, 16); // 60fps
    };

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Initializes some static state for this module.
   */
  function initStaticFields() {
    config = app.config;
    util = app.util;
    log = new app.Log('textAnimator');
    TextAnimationJob = app.TextAnimationJob;
    log.d('initStaticFields', 'Module initialized');
  }

  /**
   * Creates a new TextAnimationJob, which can animate all of the text within the given element
   * according to the given parameters.
   *
   * @param {HTMLElement} element
   * @param {number} totalDuration In milliseconds.
   * @param {number} characterDuration In milliseconds.
   * @param {Object} animationConfig
   * @param {Function} onComplete
   * @returns {TextAnimationJob}
   */
  function createJob(element, totalDuration, characterDuration, animationConfig, onComplete) {
    return new TextAnimationJob(element, totalDuration, characterDuration, animationConfig,
        onComplete);
  }

  /**
   * Starts the given TextAnimationJob.
   *
   * @param {TextAnimationJob} job
   */
  function startJob(job) {
    job.start();
    textAnimator.jobs.push(job);

    // Start the animation loop if it were not already running
    textAnimator.isPaused = false;
    if (!textAnimator.isLooping) {
      animationLoop();
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this singleton

  textAnimator = {};
  textAnimator.jobs = [];
  textAnimator.initStaticFields = initStaticFields;
  textAnimator.createJob = createJob;
  textAnimator.startJob = startJob;
  textAnimator.isPaused = true;

  // Expose this module
  if (!window.app) window.app = {};
  window.app.textAnimator = textAnimator;

  console.log('textAnimator module loaded');
})();
