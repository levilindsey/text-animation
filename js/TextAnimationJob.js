/**
 * This module defines a constructor for TextAnimationJob objects.
 *
 * @module TextAnimationJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var EPSILON = 0.001;

  var config, util, log, CharacterAnimation;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * @function TextAnimationJob~setUpElements
   */
  function setUpElements() {
    var job = this;

    // TODO: not sure what I was doing before with this following code
    // TODO: what I DO need to do here is:
    // - walk the DOM of the element
    // - save each text node and each element node in this JavaScript file somehow
    //   - [[log this structure for sanity's sake]]
    //   - will need to save innerHTML values (so that ALL relevant element info is preserved (e.g., attrs, classes, etc.))
    //   - will need to be able to loop distinctly over inner text nodes and inner HTML elements
    // - then, set the innerHTML of the original, parent element to ''
    // - also, count the total number of characters
    // - also, calculate the max number of characters that will animate at once, create that many CharacterAnimation objects, and add them to job.inactiveCharacterAnimations

    job.styleSheet = document.getElementById(config.STYLESHEET_ID);

    job.shownText = util.createElement('span', job.element, null, ['shown-text']);
    job.hiddenText = util.createElement('span', job.element, null, ['hidden-text']);
    job.activeCharacterAnimations = [];
    job.inactiveCharacterAnimations = [];

    job.characterCount = ;
  }

  /**
   * - Saves the various time parameters for this animation job.
   * - Makes sure that character duration is less that total duration.
   * - Calculates the character start-time offset.
   *
   * @param {Number} totalDuration In milliseconds.
   * @param {Number} characterDuration In milliseconds.
   */
  function calculateDurationValues(totalDuration, characterDuration) {
    var job = this;

    // Make sure that the character duration is not longer than the total duration
    if (characterDuration > totalDuration - EPSILON) {
      characterDuration = totalDuration - EPSILON;
    }

    job.characterDuration = characterDuration;

    job.characterStartTimeOffset = (totalDuration - characterDuration) / job.characterCount;
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * Sets the given class on the given element. The class describes an animation state:
   * waiting-to-animate, is-animating, done-animating
   *
   * @param {HTMLElement} element
   * @param {'waiting-to-animate'|'is-animating'|'done-animating'} animatingClass
   */// TODO: call this at the three appropriate times
  function setAnimatingClassOnElement(element, animatingClass) {
    util.removeClass(element, 'waiting-to-animate');
    util.removeClass(element, 'is-animating');
    util.removeClass(element, 'done-animating');
    util.addClass(element, animatingClass);
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this TextAnimationJob as started.
   */
  function start(startTime) {
    var job = this;

    job.startTime = startTime;
  }

  /**
   * 
   */
  function update() {
    // TODO: called from the overall animation loop; updates this ...
  }

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Initializes some static state for this module.
   *
   * @function TextAnimationJob.initStaticFields
   */
  function initStaticFields() {
    config = app.config;
    util = app.util;
    log = new app.Log('TextAnimationJob');
    CharacterAnimation = app.CharacterAnimation;
    log.d('initStaticFields', 'Module initialized');
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {HTMLElement} element
   * @param {Number} totalDuration In milliseconds.
   * @param {Number} characterDuration In milliseconds.
   */
  function TextAnimationJob(element, totalDuration, characterDuration) {
    var job = this;

    job.element = element;
    job.startTime = 0;
    job.characterCount = 0;
    job.characterDuration = 0;
    job.characterStartTimeOffset = 0;
    job.styleSheet = null;
    job.shownText = null;
    job.hiddenText = null;
    job.activeCharacterAnimations = [];
    job.inactiveCharacterAnimations = [];

    job.start = start;
    job.update = update;

    setUpElements.call(job);
    calculateDurationValues.call(job, totalDuration, characterDuration);
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.TextAnimationJob = TextAnimationJob;
  TextAnimationJob.initStaticFields = initStaticFields;

  console.log('TextAnimationJob module loaded');
})();
