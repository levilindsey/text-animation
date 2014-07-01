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

  var config, util, log, AnimationElementNode, AnimationTextNode, CharacterAnimation;

  // TODO: add the ability to shuffle the animation order!!
  // - this will require:
  //   - splitting the pre-parsed nodes at arbitrary indices
  //   - storing the contents of a node as a mixed array of strings and CharacterAnimations
  //   - having all characters remain in the DOM inside 'visibility: hidden' spans
  //   - and then splitting these spans and adding additional when needing to animate one of the characters

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Uses an iterative approach (not recursive) to walk through the DOM structure of this job's
   * root element, and creates a textual
   *
   * - Saves a representation of the text nodes and their textual content to use later for
   *   animating text in order.
   * - Counts the total number of characters.
   * - Fixes the dimensions of block elements.
   * - Clears out the text from each element.
   * - Marks each element as 'waiting-to-animate'.
   */
  function parseJobElement() {
    var job, element, childNode, elementStack, indexStack, stackIndex, childNodeIndex,
        childNodeCount, animationTextNodesIndex, animationElementNode;

    job = this;

    job.animationTextNodes = [];
    job.totalCharacterCount = 0;
    animationTextNodesIndex = 0;

    animationElementNode = new AnimationElementNode(job.element, null);
    elementStack = [animationElementNode];
    indexStack = [0];
    stackIndex = 0;

    // Keep traversing the DOM structure until we have removed our starting, root element
    while (stackIndex >= 0) {
      // Retrieve the variables from the top of the stack
      animationElementNode = elementStack[stackIndex];
      childNodeIndex = indexStack[stackIndex];
      element = animationElementNode.element;
      childNode = null;

      // Parse any text nodes
      for (childNodeCount = element.childNodes.length;
           childNodeIndex < childNodeCount &&
               element.childNodes[childNodeIndex].nodeType !== ELEMENT_NODE;
           childNodeIndex += 1) {
        childNode = element.childNodes[childNodeIndex];

        // Check whether this child node is a text node
        if (childNode.nodeType === TEXT_NODE) {
          // Base case: text node
          job.animationTextNodes[animationTextNodesIndex++] =
              new AnimationTextNode(animationElementNode, childNode.textContent.trim());
          job.totalCharacterCount += childNode.textContent.length;
          childNode.textContent = '';
        }

        // Ignore other types of DOM nodes
      }

      // Check whether we will continue iterating down into one of the current element's child
      // elements, or up into the current element's sibling nodes
      if (childNode && childNode.nodeType === ELEMENT_NODE) {
        // "Recursive" case: ElementNode
        // We found a child element; so we will push the child element on to the stack and iterate
        // through its child nodes

        stackIndex++;
        elementStack[stackIndex] = new AnimationElementNode(childNode, animationElementNode);
        indexStack[stackIndex] = childNodeIndex;

        //if (getComputedStyle(node).display !== 'inline') {// TODO: add this condition back in? (it might have a performance impact)
        childNode.width = childNode.offsetWidth;
        childNode.height = childNode.offsetHeight;
        //}

        setAnimatingClassOnElement(childNode, 'waiting-to-animate');
      } else {
        // We iterated through all of the current element's child nodes, and we found no more
        // elements; so we will pop this element off of the stack and continue iterating through
        // its siblings

        stackIndex--;

        // Remove all descendant nodes from the DOM
        element.innerHTML = '';
      }
    }

    logStructureForDebugging.call(job);
  }

  function logStructureForDebugging() {
    var job = this;

    log.d('logStructureForDebugging', '--- START TEXT NODES ---');

    job.animationTextNodes.forEach(function (node) {
      var animationElementNode, prefix;

      animationElementNode = node.parentAnimationElementNode;
      prefix = '    ';

      log.d('', '=-- BASE TEXT NODE: ' + node.text);

      while (animationElementNode) {
        log.d('', prefix + '\\-- PARENT ELEMENT NODE: ' + animationElementNode.element.tagName);
        animationElementNode = animationElementNode.parentAnimationElementNode;
        prefix += '    ';
      }
    });

    log.d('logStructureForDebugging', '--- END TEXT NODES ---');
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
      job.inactiveCharacterAnimations[i] = new CharacterAnimation(animationConfig);
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
        i--;
        count--;
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
    job.inactiveCharacterAnimations.push(job.activeCharacterAnimations[index]);
    job.activeCharacterAnimations.splice(index, 1);

    // TODO: check if this was the last CharacterAnimation for the given parent element, and if so, call setAnimatingClassOnElement with 'done-animating'??
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
        parseInt((currentTime - job.startTime) / job.characterStartTimeOffset);

    // Make sure we don't try to create more CharacterAnimations than the total number of
    // characters
    characterAnimationsToHaveStartedCount =
            job.totalCharacterCount < characterAnimationsToHaveStartedCount ?
        job.totalCharacterCount : characterAnimationsToHaveStartedCount;

    while (characterAnimationsToHaveStartedCount > job.characterAnimationsStartedCount) {
      startNextCharacterAnimation.call(job);
    }
  }

  /**
   * Starts a new active CharacterAnimation according to our current position in the overall
   * animation sequence.
   */
  function startNextCharacterAnimation() {
    var job = this;

    // Check whether there are any remaining text nodes to animate
    if (job.currentTextNodeIndex < job.animationTextNodes.length) {
      job.currentStringIndex++;

      // Check whether there are any remaining characters to animate within the current text node
      if (job.currentStringIndex < job.animationTextNodes[job.currentTextNodeIndex].text.length) {
        startCharacterAnimationAtCurrentPosition.call(job);
      } else {
        job.currentTextNodeIndex++;
        job.currentStringIndex = -1;

        // Check whether there is another text node to animate
        if (job.currentTextNodeIndex < job.animationTextNodes.length) {
          // Mark this text node's parent element as 'is-animating'
          setAnimatingClassOnElement(
              job.animationTextNodes[job.currentTextNodeIndex].parentAnimationElementNode.element, 'is-animating');

          startNextCharacterAnimation.call(job);
        }
      }
    }
  }

  /**
   * Starts a new active CharacterAnimation according to the job's current position parameters.
   *
   * The job's current indices should point to a valid character position.
   *
   * This recycles an inactive CharacterAnimation object.
   */
  function startCharacterAnimationAtCurrentPosition() {
    var job, textNode, character, startTime, characterAnimation;

    job = this;

    textNode = job.animationTextNodes[job.currentTextNodeIndex];
    character = textNode.text[job.currentStringIndex];
    startTime = job.characterAnimationsStartedCount * job.startTime;

    // Recycle a pre-existing CharacterAnimation object
    characterAnimation = job.inactiveCharacterAnimations.pop();
    job.activeCharacterAnimations.push(characterAnimation);
    characterAnimation.reset(textNode, character, startTime, job.characterDuration);

    job.characterAnimationsStartedCount++;
  }

  /**
   * Checks whether this job is complete. If so, a flag is set and a callback is called.
   */
  function checkForComplete() {
    var job = this;

    if (job.characterAnimationsStartedCount === job.totalCharacterCount &&
        job.activeCharacterAnimations.length === 0) {
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
    // TODO: re-work this style logic??
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
    job.currentTextNodeIndex = 0;
    job.currentStringIndex = -1;

    log.i('start');
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
    AnimationElementNode = app.AnimationElementNode;
    AnimationTextNode = app.AnimationTextNode;
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
    job.animationTextNodes = null;
    job.startTime = 0;
    job.totalCharacterCount = 0;
    job.characterDuration = 0;
    job.characterStartTimeOffset = 0;
    job.characterAnimationsStartedCount = 0;
    job.activeCharacterAnimations = [];
    job.inactiveCharacterAnimations = [];
    job.isComplete = false;
    job.currentTextNodeIndex = 0;
    job.currentStringIndex = 0;

    job.start = start;
    job.update = update;
    job.onComplete = onComplete;

    parseJobElement.call(job);
    calculateDurationValues.call(job, totalDuration, characterDuration);
    createCharacterAnimationObjects.call(job, animationConfig);

    log.i('constructor', 'Job parsed and ready');
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.TextAnimationJob = TextAnimationJob;
  TextAnimationJob.initStaticFields = initStaticFields;

  console.log('TextAnimationJob module loaded');
})();
