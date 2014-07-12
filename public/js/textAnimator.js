/**
 * This module defines a singleton for animating text.
 *
 * @module textAnimator
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config, util, log, TextAnimationJob, textAnimator;

  // TODO: there is a bug on mobile devices where zooming or rotating will kill the current animation, then no later animation can run

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * This is the animation loop that drives all of the text animation.
   */
  function animationLoop() {
    var currentTime = Date.now();
    textAnimator.isLooping = true;

    if (!textAnimator.isPaused) {
      updateJobs(currentTime);
      util.requestAnimationFrame.call(window, animationLoop);
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
        removeJob(textAnimator.jobs[i], i);
        i--;
        count--;
      }
    }
  }

  /**
   * Removes the given job from the collection of active, animating jobs.
   *
   * @param {TextAnimationJob} job
   * @param {number} [index]
   */
  function removeJob(job, index) {
    var count;

    if (typeof index === 'number') {
      textAnimator.jobs.splice(index, 1);
    } else {
      for (index = 0, count = textAnimator.jobs.length; index < count; index += 1) {
        if (textAnimator.jobs[index] === job) {
          textAnimator.jobs.splice(index, 1);
          break;
        }
      }
    }

    // Stop the animation loop when there are no more jobs to animate
    if (textAnimator.jobs.length === 0) {
      textAnimator.isPaused = true;
    }
  }

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
   * @param {Function} animationFunction
   * @param {Function} onComplete
   * @returns {TextAnimationJob}
   */
  function createJob(element, totalDuration, characterDuration, animationFunction, onComplete) {
    // Just make sure that any state that should be completed from a previous animation is ready
    animationLoop();

    return new TextAnimationJob(element, totalDuration, characterDuration, 'easeInOutQuad',
        animationFunction, onComplete);
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

  /**
   * Cancels the given TextAnimationJob.
   *
   * @param {TextAnimationJob} job
   */
  function cancelJob(job) {
    job.cancel();
    removeJob(job);
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this singleton

  textAnimator = {};
  textAnimator.jobs = [];
  textAnimator.initStaticFields = initStaticFields;
  textAnimator.createJob = createJob;
  textAnimator.startJob = startJob;
  textAnimator.cancelJob = cancelJob;
  textAnimator.isPaused = true;

  // Expose this module
  if (!window.app) window.app = {};
  window.app.textAnimator = textAnimator;

  console.log('textAnimator module loaded');
})();
