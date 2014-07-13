/**
 * This module defines a constructor for TextAnimationJob objects.
 *
 * @module TextAnimationJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var EPSILON = 1,
      ELEMENT_NODE = 1,
      TEXT_NODE = 3;

  // TODO: add the ability to shuffle the animation order!!
  // - this will require:
  //   - splitting the pre-parsed nodes at arbitrary indices
  //   - storing the contents of a node as a mixed array of strings and CharacterAnimations
  //   - having all characters remain in the DOM inside 'visibility: hidden' spans
  //   - and then splitting these spans and adding additional when needing to animate one of the characters
  // - actually, this is probably too computationally expensive due to the large number of elements present in the DOM simultaneously

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
        childNodeCount, animationTextNodesIndex, animationElementNode, text;

    job = this;

    job.animationTextNodes = [];
    job.totalCharacterCount = 0;
    animationTextNodesIndex = 0;

    animationElementNode = new ta.AnimationElementNode(job.element, null);
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
           childNodeIndex < childNodeCount;
           childNodeIndex += 1) {
        childNode = element.childNodes[childNodeIndex];

        // Check whether this child node is a text node
        if (childNode.nodeType === TEXT_NODE) {
          // Base case: text node
          text = partialTrim(childNode.textContent);

          // Ignore empty text nodes
          if (text.length > 0) {
            job.animationTextNodes[animationTextNodesIndex++] = new ta.AnimationTextNode(
                animationElementNode, childNode, element.childNodes[childNodeIndex + 1], text);
            job.totalCharacterCount += text.length;
            childNode.textContent = '';
          }
        } else if (childNode.nodeType === ELEMENT_NODE) {
          break;
        }

        // Ignore other types of DOM nodes
      }

      // Check whether we will continue iterating down into one of the current element's child
      // elements, or up into the current element's sibling nodes
      if (childNode && childNode.nodeType === ELEMENT_NODE) {
        // "Recursive" case: ElementNode
        // We found a child element; so we will push the child element on to the stack and iterate
        // through its child nodes

        indexStack[stackIndex] = childNodeIndex + 1;

        stackIndex++;

        elementStack[stackIndex] = new ta.AnimationElementNode(childNode, animationElementNode);
        indexStack[stackIndex] = 0;

        // Fix the dimensions of all elements to their original values
        childNode.width = childNode.offsetWidth;
        childNode.height = childNode.offsetHeight;

        setAnimatingClassOnElement(childNode, 'waiting-to-animate');
      } else {
        // We iterated through all of the current element's child nodes, and we found no more
        // elements; so we will pop this element off of the stack and continue iterating through
        // its siblings

        stackIndex--;
      }
    }

    //logStructureForDebugging.call(job);
  }

  /**
   * For debugging purposes, it is very useful to see the actual elements parsed.
   */
  function logStructureForDebugging() {
    var job = this;

    console.log('--- START TEXT NODES ---');

    job.animationTextNodes.forEach(function (node) {
      var animationElementNode, prefix, name;

      animationElementNode = node.parentAnimationElementNode;
      prefix = '   ';

      console.log('=-- BASE TEXT NODE: ' + node.text);

      while (animationElementNode) {
        name = animationElementNode.element.tagName +
          (animationElementNode.element.id ? '#' + animationElementNode.element.id : '');
        console.log(prefix + '\\-- PARENT ELEMENT NODE: ' + name);
        animationElementNode = animationElementNode.parentAnimationElementNode;
        prefix += '   ';
      }
    });

    console.log('--- END TEXT NODES ---');
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

    // Make sure that the given total duration is not too small
    if (totalDuration <= EPSILON) {
      totalDuration = EPSILON + EPSILON;
    }

    // Make sure that the character duration is not longer than the total duration
    if (characterDuration > totalDuration - EPSILON) {
      characterDuration = totalDuration - EPSILON;
    }

    job.characterDuration = characterDuration;
    job.durationUntilLastCharacterStart = totalDuration - characterDuration;
    job.characterStartTimeOffset = (totalDuration - characterDuration) / job.totalCharacterCount;
  }

  /**
   * - Creates the maximum number of CharacterAnimation objects that will be needed simultaneously
   *   for animating the text of this job.
   * - These are stored in the job.inactiveCharacterAnimations array.
   */
  function createCharacterAnimationObjects() {
    var job, i, count;

    job = this;

    count = parseInt(job.characterDuration / job.characterStartTimeOffset) + 1;

    for (i = 0; i < count; i+=1) {
      job.inactiveCharacterAnimations[i] = new ta.CharacterAnimation(job.animationFunction);
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
   * Cancels all of the currently active CharacterAnimations.
   */
  function cancelActiveCharacterAnimations() {
    var job = this;

    // Cancel all active CharacterAnimations
    while (job.activeCharacterAnimations.length) {
      removeCharacterAnimation.call(job, 0);
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
    var job, currentDuration, timeProgress, characterProgress, characterAnimationsToHaveStartedCount, startTime;

    job = this;

    // Apply easing for the overall number of characters being animated
    currentDuration = currentTime - job.startTime;
    timeProgress = currentDuration / job.durationUntilLastCharacterStart;
    characterProgress = job.easingFunction(timeProgress);

    characterAnimationsToHaveStartedCount = parseInt(characterProgress * job.totalCharacterCount);

    // Make sure we don't try to create more CharacterAnimations than the total number of
    // characters
    characterAnimationsToHaveStartedCount =
            timeProgress > 1 ? job.totalCharacterCount : characterAnimationsToHaveStartedCount;

    while (characterAnimationsToHaveStartedCount > job.characterAnimationsStartedCount) {
      // Calculate the eased time at which this next character was supposed to have started
      characterProgress = job.characterAnimationsStartedCount / job.totalCharacterCount;
      timeProgress = job.inverseEasingFunction(characterProgress);
      startTime = job.startTime + timeProgress * job.durationUntilLastCharacterStart;

      startNextCharacterAnimation.call(job, startTime);
    }
  }

  /**
   * Starts a new active CharacterAnimation according to our current position in the overall
   * animation sequence.
   *
   * @param {number} startTime
   */
  function startNextCharacterAnimation(startTime) {
    var job = this;

    // Check whether there are any remaining text nodes to animate
    if (job.currentTextNodeIndex < job.animationTextNodes.length) {
      job.currentStringIndex++;

      // Check whether there are any remaining characters to animate within the current text node
      if (job.currentStringIndex < job.animationTextNodes[job.currentTextNodeIndex].text.length) {
        startCharacterAnimationAtCurrentPosition.call(job, startTime);
      } else {
        job.currentTextNodeIndex++;
        job.currentStringIndex = -1;

        // Check whether there is another text node to animate
        if (job.currentTextNodeIndex < job.animationTextNodes.length) {
          startAnimatingElementNode.call(job,
            job.animationTextNodes[job.currentTextNodeIndex].parentAnimationElementNode);

          startNextCharacterAnimation.call(job, startTime);
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
   *
   * @param {number} startTime
   */
  function startCharacterAnimationAtCurrentPosition(startTime) {
    var job, textNode, character, characterAnimation;

    job = this;

    // Determine the parameters of the next character animation
    textNode = job.animationTextNodes[job.currentTextNodeIndex];
    character = textNode.text[job.currentStringIndex];

    // Because we now have easing for the overall number of characters being animated, it is
    // harder to pre-calculate how many will be animating at any given time, so we may need to
    // create a new CharacterAnimation object here
    if (job.inactiveCharacterAnimations.length <= 0) {
      job.inactiveCharacterAnimations[0] = new ta.CharacterAnimation(job.animationFunction);
    }

    // Recycle a pre-existing CharacterAnimation object
    characterAnimation = job.inactiveCharacterAnimations.pop();
    job.activeCharacterAnimations.push(characterAnimation);
    characterAnimation.reset(textNode, character, job.characterAnimationsStartedCount, startTime,
        job.characterDuration);

    job.characterAnimationsStartedCount++;
  }

  /**
   * Resets all of the text in the root element to its original content.
   */
  function resetAllContainerText() {
    var job, i, count;

    job = this;

    for (i = 0, count = job.animationTextNodes.length; i < count; i += 1) {
      job.animationTextNodes[i].domTextNode.textContent = job.animationTextNodes[i].text;
      setAnimatingClassOnElementAndAncestors.call(job,
          job.animationTextNodes[i].parentAnimationElementNode, 'waiting-to-animate');
    }
  }

  /**
   * Checks whether this job is complete. If so, a flag is set and a callback is called.
   */
  function checkForComplete() {
    var job = this;

    if (job.characterAnimationsStartedCount === job.totalCharacterCount &&
        job.activeCharacterAnimations.length === 0) {
      console.log('Job completed');

      job.isComplete = true;
      job.onComplete(true);
    }
  }

  /**
   * Appends the element to its parent element. Sets the element with the 'is-animating' class.
   *
   * @params {AnimationElementNode} animationElementNode
   */
  function startAnimatingElementNode(animationElementNode) {
    var job = this;

    // Mark this text node's parent element as 'is-animating'
    setAnimatingClassOnElementAndAncestors.call(job, animationElementNode, 'is-animating');
  }

  /**
   * Sets the 'is-animating' class on the given element and on all of its ancestor elements up to
   * the root animation element.
   *
   * @param {AnimationElementNode} animationElementNode
   * @param {'waiting-to-animate'|'is-animating'|'done-animating'} animatingClass
   */
  function setAnimatingClassOnElementAndAncestors(animationElementNode, animatingClass) {
    var job = this;

    do {
      setAnimatingClassOnElement(animationElementNode.element, animatingClass);
      animationElementNode = animationElementNode.parentAnimationElementNode;
    } while (animationElementNode !== job.rootAnimationElementNode);
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
    ta.util.removeClass(element, 'waiting-to-animate');
    ta.util.removeClass(element, 'is-animating');
    ta.util.removeClass(element, 'done-animating');
    ta.util.addClass(element, animatingClass);
  }

  /**
   * Removes all leading and trailing whitespace from the given string, EXCEPT for a single space
   * on either end if a single space exists on that end.
   *
   * @param {string} text
   */
  function partialTrim(text) {
    var trimmedText, index;

    trimmedText = text.trim();

    index = text.indexOf(trimmedText);
    if (text[index - 1] === ' ') {
      trimmedText = ' ' + trimmedText;
    }

    index = text.indexOf(trimmedText);
    if (text[index + trimmedText.length] === ' ') {
      trimmedText += ' ';
    }

    return trimmedText;
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this TextAnimationJob as started.
   */
  function start() {
    var job = this;

    console.log('Job starting');

    job.startTime = Date.now();
    job.isComplete = false;
    job.currentTextNodeIndex = 0;
    job.currentStringIndex = -1;

    startAnimatingElementNode.call(job,
      job.animationTextNodes[job.currentTextNodeIndex].parentAnimationElementNode);
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

  /**
   * Stops this TextAnimationJob, and returns all of the text to its original form.
   */
  function cancel() {
    var job = this;

    console.log('Job cancelling');

    cancelActiveCharacterAnimations.call(job);
    resetAllContainerText.call(job);
    job.onComplete(false);

    job.isComplete = true;
    job.characterAnimationsStartedCount = job.totalCharacterCount;
    job.activeCharacterAnimations = [];
    job.inactiveCharacterAnimations = [];
    job.rootAnimationElementNode = null;
    job.animationTextNodes = null;
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {HTMLElement} element
   * @param {number} totalDuration In milliseconds.
   * @param {number} characterDuration In milliseconds.
   * @param {string} easingFunctionName
   * @param {Function} animationFunction
   * @param {Function} onComplete
   */
  function TextAnimationJob(element, totalDuration, characterDuration, easingFunctionName,
                            animationFunction, onComplete) {
    var job = this;

    job.element = element;
    job.animationFunction = animationFunction;
    job.rootAnimationElementNode = null;
    job.animationTextNodes = null;
    job.startTime = 0;
    job.totalCharacterCount = 0;
    job.characterDuration = 0;
    job.durationUntilLastCharacterStart = 0;
    job.characterStartTimeOffset = 0;
    job.characterAnimationsStartedCount = 0;
    job.activeCharacterAnimations = [];
    job.inactiveCharacterAnimations = [];
    job.isComplete = false;
    job.currentTextNodeIndex = 0;
    job.currentStringIndex = 0;

    job.easingFunction = ta.util.easingFunctions[easingFunctionName];
    job.inverseEasingFunction = ta.util.inverseEasingFunctions[easingFunctionName];
    job.start = start;
    job.update = update;
    job.cancel = cancel;
    job.onComplete = onComplete;

    parseJobElement.call(job);
    calculateDurationValues.call(job, totalDuration, characterDuration);
    createCharacterAnimationObjects.call(job);

    console.log('Job created');
  }

  // Expose this module
  if (!window.ta) window.ta = {};
  window.ta.TextAnimationJob = TextAnimationJob;

  console.log('TextAnimationJob module loaded');
})();
