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

  // TODO: add the ability to shuffle the animation order!!
  // - this will require:
  //   - splitting the pre-parsed nodes at arbitrary indices
  //   - then storing the contents of a node as a mixed array of strings and CharacterAnimations

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * - Walks through the content of this job's element.
   * - Saves a representation of the DOM structure and textual content to use later for animating
   *   text in order.
   * - Counts the total number of characters.
   */
  function parseDOM() {
    var job = this;

    // TODO: what I need to do here is:
    // - walk the DOM of the element
    // - save each text node and each element node in this JavaScript file somehow
    //   - [[log this structure for sanity's sake]]
    //   - will need to save innerHTML values (so that ALL relevant element info is preserved (e.g., attrs, classes, etc.))
    //   - will need to be able to loop distinctly over inner text nodes and inner HTML elements
    // - then, set the innerHTML of the original, parent element to ''
    // - also, count the total number of characters
    // - also, calculate the max number of characters that will animate at once, create that many CharacterAnimation objects, and add them to job.inactiveCharacterAnimations
    // - also, call setAnimatingClassOnElement with 'waiting-to-animate' for each element



    job.totalCharacterCount = ;
  }

  /**
   * - Saves the various time parameters for this animation job.
   * - Makes sure that character duration is less that total duration.
   * - Calculates the character start-time offset.
   *
   * This should be called after the DOM has been parsed.
   *
   * @param {number} totalDuration In milliseconds.
   * @param {number} characterDuration In milliseconds.
   */
  function calculateDurationValues(totalDuration, characterDuration) {
    var job = this;

    // Make sure that the character duration is not longer than the total duration
    if (characterDuration > totalDuration - EPSILON) {
      characterDuration = totalDuration - EPSILON;
    }

    job.characterDuration = characterDuration;
    job.characterStartTimeOffset = (totalDuration - characterDuration) / job.totalCharacterCount;
  }

  /**
   * - Creates the maximum number of CharacterAnimation objects that will be needed simultaneously
   *   for animating the text of this job.
   * - These are stored in the job.inactiveCharacterAnimations array.
   *
   * @param {Object} animationConfig
   */
  function createCharacterAnimationObjects(animationConfig) {
    var job, i, count;

    job = this;

    count = parseInt(job.characterDuration / job.characterStartTimeOffset) + 1;

    for (i = 0; i < count; i+=1) {
      job.inactiveCharacterAnimations.push(new CharacterAnimation(animationConfig));
    }
  }

  /**
   * Updates all of the currently active CharacterAnimations.
   *
   * @param {number} currentTime
   */
  function updateActiveCharacterAnimations(currentTime) {
    var job, i, count;

    job = this;

    // Update all active CharacterAnimations
    for (i = 0, count = job.activeCharacterAnimations.length; i < count; i+=1) {
      job.activeCharacterAnimations[i].update(currentTime);

      // Remove any active CharacterAnimations that have completed
      if (job.activeCharacterAnimations[i].isComplete) {
        removeCharacterAnimation.call(job, i);
      }
    }
  }

  /**
   * Removes the CharacterAnimation at the given index within the activeCharacterAnimations
   * collection.
   *
   * @param {number} index
   */
  function removeCharacterAnimation(index) {
    var job = this;

    // Remove it from the DOM
    job.activeCharacterAnimations[index].remove();

    // Transfer the CharacterAnimation object between active and inactive arrays, so that we can
    // recycle it for a future character
    job.inactiveCharacterAnimations[index].push(job.activeCharacterAnimations[index]);
    job.activeCharacterAnimations.splice(index, 1);

    // TODO: check if this was the last CharacterAnimation for the given parent element, and if so, call setAnimatingClassOnElement with 'done-animating'
    // - this check can't just check whether there are any currently active animations on the parent. it MUST check that this character was indeed the final character in the parent.
  }

  /**
   * Starts any new CharacterAnimations that are needed to catch up to the current time.
   *
   * @param {number} currentTime
   */
  function startNewCharacterAnimations(currentTime) {
    var job, characterAnimationsToHaveStartedCount;

    job = this;

    characterAnimationsToHaveStartedCount =
        parseInt((currentTime - job.startTime) / job.characterStartTimeOffset) + 1;

    // Make sure we don't try to create more CharacterAnimations than the total number of
    // characters
    characterAnimationsToHaveStartedCount =
        job.totalCharacterCount < characterAnimationsToHaveStartedCount ?
          job.totalCharacterCount : characterAnimationsToHaveStartedCount;

    while (characterAnimationsToHaveStartedCount > job.characterAnimationsStartedCount) {
      startCharacterAnimation.call(job);
    }
  }

  /**
   * Starts a new active CharacterAnimation according to our current position in the overall
   * animation sequence.
   */
  function startCharacterAnimation() {
    var job, characterAnimation, index, parent, character, characterStartTime;

    job = this;

    // TODO:
    // Calculate parameters of this CharacterAnimation
    index = job.characterAnimationsStartedCount;
    parent = ;
    character = ;
    characterStartTime = index * job.startTime;
    // TODO: call setAnimatingClassOnElement with 'is-animating' when getting to a new parent element

    // Recycle a pre-existing CharacterAnimation object
    characterAnimation = job.inactiveCharacterAnimations.pop();
    job.activeCharacterAnimations.push(characterAnimation);
    characterAnimation.reset(parent, character, characterStartTime, job.characterStartTimeOffset);

    job.characterAnimationsStartedCount++;
  }

  /**
   * Checks whether this job is complete. If so, a flag is set and a callback is called.
   */
  function checkForComplete() {
    var job = this;

    if (job.activeCharacterAnimations.length === 0) {
      job.isComplete = true;
      job.onComplete();
    }
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
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;
  }

  /**
   * Updates the animation progress of this TextAnimationJob to match the given time.
   *
   * This should be called from the overall animation loop.
   */
  function update(currentTime) {
    var job = this;

    updateActiveCharacterAnimations.call(job, currentTime);
    startNewCharacterAnimations.call(job, currentTime);
    checkForComplete.call(job);
  }

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Initializes some static state for this module.
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
   * @param {number} totalDuration In milliseconds.
   * @param {number} characterDuration In milliseconds.
   * @param {Object} animationConfig
   * @param {Function} onComplete
   */
  function TextAnimationJob(element, totalDuration, characterDuration, animationConfig, onComplete) {
    var job = this;

    job.element = element;
    job.startTime = 0;
    job.totalCharacterCount = 0;
    job.characterDuration = 0;
    job.characterStartTimeOffset = 0;
    job.characterAnimationsStartedCount = 0;
    job.activeCharacterAnimations = [];
    job.inactiveCharacterAnimations = [];
    job.isComplete = false;

    job.start = start;
    job.update = update;
    job.onComplete = onComplete;

    parseDOM.call(job);
    calculateDurationValues.call(job, totalDuration, characterDuration);
    createCharacterAnimationObjects.call(job, animationConfig);
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.TextAnimationJob = TextAnimationJob;
  TextAnimationJob.initStaticFields = initStaticFields;

  console.log('TextAnimationJob module loaded');
})();
