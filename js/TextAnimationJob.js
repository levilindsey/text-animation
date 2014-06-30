/**
 * This module defines a constructor for TextAnimationJob objects.
 *
 * @module TextAnimationJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var EPSILON = 0.001,
      ELEMENT_NODE = 1,
      TEXT_NODE = 3;

  var config, util, log, ElementNode, CharacterAnimation;

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
  function parseJobElement() {
    var job = this;

    job.rootElementNode = parseElement(job.element);
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
    job.characterStartTimeOffset = (totalDuration - characterDuration) / job.rootElementNode.characterCount;
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

    **;// TODO: check if this was the last CharacterAnimation for the given parent element, and if so, call setAnimatingClassOnElement with 'done-animating'
    // - this check can't just check whether there are any currently active animations on the parent. it MUST check that this character was indeed the final character in the parent.
    // TODO: give CharacterAnimations a reference to their ElementNode and their index?
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
        job.rootElementNode.characterCount < characterAnimationsToHaveStartedCount ?
          job.rootElementNode.characterCount : characterAnimationsToHaveStartedCount;

    while (characterAnimationsToHaveStartedCount > job.characterAnimationsStartedCount) {
      startNextCharacterAnimation.call(job);
    }
  }

  /**
   * Starts a new active CharacterAnimation according to our current position in the overall
   * animation sequence.
   */
  function startNextCharacterAnimation() {
    var job, elementNode, elementNodeIndex, stringIndex;

    job = this;

    elementNode = job.currentElementNode;
    elementNodeIndex = job.currentElementNodeIndex;
    stringIndex = job.currentStringIndex;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //

    // TODO: check whether elementNode.childNodes[elementNodeIndex] is in bounds
    // - then, continue checking things outward, until I can put this into recursion or a while loop
    if () {
      // Check whether the old ElementNode and ElementNode child index point to a text node
      if (typeof elementNode.childNodes[elementNodeIndex] === 'string') {
        // Does the next string index still point to a valid position in the old string
        if () {
          // Use this next string index with the old ElementNode and ElementNode child index
          stringIndex++;
        } else {
          // Iterate to the next ElementNode child index in the old ElementNode
          elementNodeIndex++;
        }
      } else {
        // Iterate down into the current child ElementNode
        elementNode = elementNode.childNodes[elementNodeIndex];
      }
    }

    //
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Find the elementNode, elementNodeIndex, and stringIndex that point to the next character in
    // the DOM
    while () {

      // TODO:
    }

    // TODO: call setAnimatingClassOnElement with 'is-animating' when getting to a new parent element

    startCharacterAnimationAtPosition.call(job, elementNode, elementNodeIndex, stringIndex);
  }

  /**
   * Starts a new active CharacterAnimation according to the given position parameters.
   *
   * The given indices should point to a valid character position.
   *
   * This recycles an inactive CharacterAnimation object.
   *
   * @param {ElementNode} elementNode
   * @param {number} elementNodeIndex
   * @param {number} stringIndex
   */
  function startCharacterAnimationAtPosition(elementNode, elementNodeIndex, stringIndex) {
    var job, character, startTime, characterAnimation;

    job = this;

    character = elementNode.childNodes[elementNodeIndex][stringIndex];
    startTime = job.characterAnimationsStartedCount * job.startTime;

    // Recycle a pre-existing CharacterAnimation object
    characterAnimation = job.inactiveCharacterAnimations.pop();
    job.activeCharacterAnimations.push(characterAnimation);
    characterAnimation.reset(elementNode, character, startTime, job.characterDuration);

    job.currentElementNode = elementNode;
    job.currentElementNodeIndex = elementNodeIndex;
    job.currentStringIndex = stringIndex;
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
   */
  function setAnimatingClassOnElement(element, animatingClass) {
    util.removeClass(element, 'waiting-to-animate');
    util.removeClass(element, 'is-animating');
    util.removeClass(element, 'done-animating');
    util.addClass(element, animatingClass);
  }

  /**
   * - Recursive helper function for parseJobElement.
   * - Walks through the content of the given element.
   * - Saves a representation of the DOM structure and textual content to use later for animating
   *   text in order.
   * - Counts the total number of characters in each element.
   * - Fixes the dimensions of block elements.
   * - Clears out the text from each element.
   *
   * @param {HTMLElement} element
   * @returns {ElementNode}
   */
  function parseElement(element) {
    var i, count, childNodes, characterCount, node, elementNode;

    childNodes = [];
    characterCount = 0;
    elementNode = new ElementNode(element);

    for (i = 0, count = element.childNodes.length; i < count; i+=1) {
      node = element.childNodes[i];

      // Check whether this child node is a text node or an element node
      if (node.nodeType === TEXT_NODE) {
        // Base case: text node
        childNodes[i] = node.textContent;
        characterCount += childNodes[i].length;
        node.textContent = '';
      } else if (node.nodeType === ELEMENT_NODE) {
        // Recursive case: ElementNode
        //if (getComputedStyle(node).display !== 'inline') {// TODO: add this condition back in? (it might have a performance impact)
          node.width = node.offsetWidth;
          node.height = node.offsetHeight;
        //}
        setAnimatingClassOnElement(node, 'waiting-to-animate');
        childNodes[i] = parseElement(node);
        characterCount += childNodes[i].characterCount;
        childNodes[i].parentNode = elementNode;
      } else {
        // Ignore other types of DOM nodes
      }
    }

    elementNode.childNodes = childNodes;
    elementNode.characterCount = characterCount;

    return elementNode;
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
    job.currentElementNode = job.rootElementNode;
    job.currentElementNodeIndex = 0;
    job.currentStringIndex = -1;
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
    ElementNode = app.ElementNode;
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
    job.rootElementNode = null;
    job.startTime = 0;
    job.totalCharacterCount = 0;
    job.characterDuration = 0;
    job.characterStartTimeOffset = 0;
    job.characterAnimationsStartedCount = 0;
    job.activeCharacterAnimations = [];
    job.inactiveCharacterAnimations = [];
    job.isComplete = false;
    job.currentElementNode = null;
    job.currentElementNodeIndex = 0;
    job.currentStringIndex = 0;

    job.start = start;
    job.update = update;
    job.onComplete = onComplete;

    parseJobElement.call(job);
    calculateDurationValues.call(job, totalDuration, characterDuration);
    createCharacterAnimationObjects.call(job, animationConfig);
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.TextAnimationJob = TextAnimationJob;
  TextAnimationJob.initStaticFields = initStaticFields;

  console.log('TextAnimationJob module loaded');
})();
