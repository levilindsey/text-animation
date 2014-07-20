'use strict';

/**
 * This module defines a singleton for animating text.
 *
 * @module textAnimator
 */
(function () {
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
      ta.util.requestAnimationFrame.call(window, animationLoop);
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
   * Creates a new TextAnimationJob, which can animate all of the text within the given element
   * according to the given parameters.
   *
   * @param {HTMLElement} element
   * @param {number} totalDuration In milliseconds.
   * @param {number} characterDuration In milliseconds.
   * @param {string} easingFunctionName
   * @param {Function} animationFunction
   * @param {Function} onComplete
   * @returns {Window.ta.TextAnimationJob}
   */
  function createJob(element, totalDuration, characterDuration, easingFunctionName,
                     animationFunction, onComplete) {
    // Just make sure that any state that should be completed from a previous animation is ready
    animationLoop();

    return new ta.TextAnimationJob(element, totalDuration, characterDuration, easingFunctionName,
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

  var textAnimator = {};
  textAnimator.jobs = [];
  textAnimator.createJob = createJob;
  textAnimator.startJob = startJob;
  textAnimator.cancelJob = cancelJob;
  textAnimator.isPaused = true;

  // Expose this module
  if (!window.ta) window.ta = {};
  window.ta.textAnimator = textAnimator;

  console.log('textAnimator module loaded');
})();

'use strict';

/**
 * This module defines a collection of static general utility functions.
 *
 * @module util
 */
(function () {
  /**
   * Adds the given class to the given element.
   *
   * @param {HTMLElement} element The element to add the class to.
   * @param {string} className The class to add.
   */
  function addClass(element, className) {
    element.className += ' ' + className;
  }

  /**
   * Removes the given class from the given element.
   *
   * @param {HTMLElement} element The element to remove the class from.
   * @param {string} className The class to remove.
   */
  function removeClass(element, className) {
    element.className = element.className.split(' ').filter(function (value) {
      return value !== className;
    }).join(' ');
  }

  /**
   * Sets the CSS transition-timing-function style of the given element with the given cubic-
   * bezier points.
   *
   * @param {HTMLElement} element The element.
   * @param {{p1x: Number, p1y: Number, p2x: Number, p2y: Number}} bezierPts The cubic-bezier
   * points to use for this timing function.
   */
  function setTransitionCubicBezierTimingFunction(element, bezierPts) {
    var value = 'cubic-bezier(' + bezierPts.p1x + ',' + bezierPts.p1y + ',' + bezierPts.p2x + ',' +
        bezierPts.p2y + ')';
    element.style.transitionTimingFunction = value;
    element.style.WebkitTransitionTimingFunction = value;
    element.style.MozTransitionTimingFunction = value;
    element.style.msTransitionTimingFunction = value;
    element.style.OTransitionTimingFunction = value;
  }

  // A collection of different types of easing functions.
  var easingFunctions = {
    linear: function (t) {
      return t;
    },
    easeInQuad: function (t) {
      return t * t;
    },
    easeOutQuad: function (t) {
      return t * (2 - t);
    },
    easeInOutQuad: function (t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    easeInCubic: function (t) {
      return t * t * t;
    },
    easeOutCubic: function (t) {
      return 1 + --t * t * t;
    },
    easeInOutCubic: function (t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    easeInQuart: function (t) {
      return t * t * t * t;
    },
    easeOutQuart: function (t) {
      return 1 - --t * t * t * t;
    },
    easeInOutQuart: function (t) {
      return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
    },
    easeInQuint: function (t) {
      return t * t * t * t * t;
    },
    easeOutQuint: function (t) {
      return 1 + --t * t * t * t * t;
    },
    easeInOutQuint: function (t) {
      return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
    }
  };

  // A collection of the inverses of different types of easing functions.
  var inverseEasingFunctions = {
    linear: function (t) {
      return t;
    },
    easeInQuad: function (t) {
      return Math.sqrt(t);
    },
    easeOutQuad: function (t) {
      return 1 - Math.sqrt(1 - t);
    },
    easeInOutQuad: function (t) {
      return t < 0.5 ? Math.sqrt(t * 0.5) : 1 - 0.70710678 * Math.sqrt(1 - t);
    }
  };

  /**
   * Removes any children elements from the given parent that have the given class.
   *
   * @param {HTMLElement} parent The parent to remove children from.
   * @param {string} className The class to match.
   */
  function removeChildrenWithClass(parent, className) {
    var matchingChildren, i, count;

    matchingChildren = parent.querySelectorAll('.' + className);

    for (i = 0, count = matchingChildren.length; i < count; i++) {
      parent.removeChild(matchingChildren[i]);
    }
  }

  /**
   * A cross-browser compatible requestAnimationFrame. From
   * https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
   *
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

  /**
   * Calculates the x and y coordinates represented by the given Bezier curve at the given
   * percentage.
   *
   * @param {number} percent Expressed as a number between 0 and 1.
   * @param {Array.<{x: number, y: number}>} controlPoints
   * @returns {{x: number, y: number}}
   */
  function getXYFromPercentWithBezier(percent, controlPoints) {
    var x, y, oneMinusPercent, tmp1, tmp2, tmp3, tmp4;

    oneMinusPercent = 1 - percent;
    tmp1 = oneMinusPercent * oneMinusPercent * oneMinusPercent;
    tmp2 = 3 * percent * oneMinusPercent * oneMinusPercent;
    tmp3 = 3 * percent * percent * oneMinusPercent;
    tmp4 = percent * percent * percent;

    x = controlPoints[0].x * tmp1 +
        controlPoints[1].x * tmp2 +
        controlPoints[2].x * tmp3 +
        controlPoints[3].x * tmp4;
    y = controlPoints[0].y * tmp1 +
        controlPoints[1].y * tmp2 +
        controlPoints[2].y * tmp3 +
        controlPoints[3].y * tmp4;

    return {x: x, y: y};
  }

  /**
   * Calculates the y coordinate of the given Bezier curve at the given x coordinate.
   *
   * This is helpful as an easing function for determining the value at a given time.
   *
   * @param {number} x
   * @param {Array.<{x: number, y: number}>} controlPoints
   * @returns {number}
   */
  function getYFromXWithBezier(x, controlPoints) {
    // TODO: use this bucket algorithm; this will require adding a bucket setup function in util, calling it for each of the easing functions in config, and storing these buckets with the config objects

//  From: http://gamedev.stackexchange.com/questions/71845/cubic-bezier-for-easing
//
//    Other method:
//
//        Calculate the Y and X values for a 1000 values of t (in advance). Put the results into
// buckets in an array of length N. x is between [0 1] so place all results between M/N and
// (M + 1)/N in the list in index M in the bucket array. You can later use a (fast) lookup to find
// the x,y pair you want (by radix/range). Binary search (and Newton Raphson) are you friends when
// you want to quickly answer complex mathematical questions with the use of a computer. You can
// still use the binary search to increase precision after the look up by searching between the
// two closest values.
//
//        A quick recap: you store the x,y pairs in linked-lists within an array of buckets by
// creating lists of x,y pairs where the values of x(s) that are between [m/n (m+1)/n] are all
// stored in the mth index (i.e. in listarray[m]).
  }

  /**
   * Applies the given transform to the given element as a CSS style in a cross-browser compatible
   * manner.
   *
   * @param {HTMLElement} element
   * @param {string} transform
   */
  function applyTransform(element, transform) {
    element.style.webkitTransform = transform;
    element.style.MozTransform = transform;
    element.style.msTransform = transform;
    element.style.OTransform = transform;
    element.style.transform = transform;
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module

  /**
   * Exposes the static util functions.
   *
   * @global
   */
  var util = {
    addClass: addClass,
    removeClass: removeClass,
    setTransitionCubicBezierTimingFunction: setTransitionCubicBezierTimingFunction,
    easingFunctions: easingFunctions,
    inverseEasingFunctions: inverseEasingFunctions,
    removeChildrenWithClass: removeChildrenWithClass,
    requestAnimationFrame: requestAnimationFrame,
    getXYFromPercentWithBezier: getXYFromPercentWithBezier,
    getYFromXWithBezier: getYFromXWithBezier,
    applyTransform: applyTransform
  };

  // Expose this module
  if (!window.ta) window.ta = {};
  window.ta.util = util;

  console.log('util module loaded');
})();

'use strict';

/**
 * This module defines a constructor for AnimationElementNode objects.
 *
 * @module AnimationElementNode
 */
(function () {
  /**
   * @constructor
   * @global
   * @param {HTMLElement} element
   * @param {AnimationElementNode} parentAnimationElementNode
   */
  function AnimationElementNode(element, parentAnimationElementNode) {
    var animationElementNode = this;

    animationElementNode.element = element;
    animationElementNode.parentAnimationElementNode = parentAnimationElementNode;
    animationElementNode.isInsertedInDOM = false;

    animationElementNode.fontSize = getComputedStyle(element).getPropertyValue('font-size');
  }

  // Expose this module
  if (!window.ta) window.ta = {};
  window.ta.AnimationElementNode = AnimationElementNode;

  console.log('AnimationElementNode module loaded');
})();

'use strict';

/**
 * This module defines a constructor for AnimationTextNode objects.
 *
 * @module AnimationTextNode
 */
(function () {
  /**
   * @constructor
   * @global
   * @param {AnimationElementNode} parentAnimationElementNode
   * @param {Node} domTextNode
   * @param {?Node} nextSiblingNode
   * @param {string} text
   */
  function AnimationTextNode(parentAnimationElementNode, domTextNode, nextSiblingNode, text) {
    var animationTextNode = this;

    animationTextNode.parentAnimationElementNode = parentAnimationElementNode;
    animationTextNode.domTextNode = domTextNode;
    animationTextNode.nextSiblingNode = nextSiblingNode;
    animationTextNode.text = text;
  }

  // Expose this module
  if (!window.ta) window.ta = {};
  window.ta.AnimationTextNode = AnimationTextNode;

  console.log('AnimationTextNode module loaded');
})();

'use strict';

/**
 * This module defines a constructor for CharacterAnimation objects.
 *
 * @module CharacterAnimation
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Creates a span to hold this character.
   */
  function createSpan() {
    var characterAnimation, span;

    characterAnimation = this;

    span = document.createElement('span');

    span.className += ' character-animation';

    span.style.display = 'inline-block';
    span.style.position = 'relative';
    span.style.whiteSpace = 'pre';
    ta.util.applyTransform(span, 'translate3d(0,0,0)');

    characterAnimation.span = span;
  }

  /**
   * - Appends this span to its parent element.
   * - Calculates the dimensions of the character in its default style, and forces the span to
   *   maintain those dimensions.
   */
  function addToParent() {
    var characterAnimation;

    characterAnimation = this;

    // Start the span's style off with the initial animation values; otherwise, we see a flicker
    update.call(characterAnimation, 0);

    // Check whether we should insert this span element before another sibling node or simply at
    // the end of the parent element
    if (characterAnimation.animationTextNode.nextSiblingNode) {
      characterAnimation.animationTextNode.parentAnimationElementNode.element
          .insertBefore(characterAnimation.span,
            characterAnimation.animationTextNode.nextSiblingNode);
    } else {
      characterAnimation.animationTextNode.parentAnimationElementNode.element
          .appendChild(characterAnimation.span);
    }

    characterAnimation.span.style.lineHeight =
        characterAnimation.animationTextNode.parentAnimationElementNode.fontSize;
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Updates this animation for the given current time to the appropriate progress level through
   * its overall animation curve.
   *
   * @param {number} currentTime
   */
  function update(currentTime) {
    var characterAnimation, progress;

    characterAnimation = this;

    progress = (currentTime - characterAnimation.startTime) / characterAnimation.duration;

    if (progress >= 1) {
      progress = 1;
      characterAnimation.isComplete = true;
    }

    characterAnimation.animationFunction(characterAnimation.span, progress,
        characterAnimation.index);
  }

  /**
   * Resets this CharacterAnimation object to represent a new letter.
   *
   * @param {AnimationTextNode} animationTextNode
   * @param {string} character
   * @param {number} index
   * @param {number} startTime
   * @param {number} duration
   */
  function reset(animationTextNode, character, index, startTime, duration) {
    var characterAnimation = this;

    characterAnimation.span.innerHTML = character;
    characterAnimation.animationTextNode = animationTextNode;
    characterAnimation.character = character;
    characterAnimation.index = index;
    characterAnimation.startTime = startTime;
    characterAnimation.duration = duration;
    characterAnimation.isComplete = false;

    addToParent.call(characterAnimation);
  }

  /**
   * Removes this span from its parent, and replaces it with the character it was animating.
   */
  function remove() {
    var characterAnimation = this;

    characterAnimation.animationTextNode.parentAnimationElementNode.element
        .removeChild(characterAnimation.span);
    characterAnimation.animationTextNode.domTextNode.textContent += characterAnimation.character;
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Function} animationFunction
   * @param {AnimationTextNode} [animationTextNode]
   * @param {string} [character]
   * @param {number} [index]
   * @param {number} [startTime]
   * @param {number} [duration]
   */
  function CharacterAnimation(animationFunction, animationTextNode, character, index, startTime,
                              duration) {
    var characterAnimation = this;

    characterAnimation.animationFunction = animationFunction;
    characterAnimation.span = null;
    characterAnimation.isComplete = false;
    characterAnimation.animationTextNode = null;
    characterAnimation.character = null;
    characterAnimation.index = -1;
    characterAnimation.startTime = 0;
    characterAnimation.duration = 0;

    characterAnimation.update = update;
    characterAnimation.reset = reset;
    characterAnimation.remove = remove;

    createSpan.call(characterAnimation);

    if (animationTextNode && character && index && startTime && duration) {
      reset.call(characterAnimation, animationTextNode, character, index, startTime, duration);
    }
  }

  // Expose this module
  if (!window.ta) window.ta = {};
  window.ta.CharacterAnimation = CharacterAnimation;

  console.log('CharacterAnimation module loaded');
})();

'use strict';

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
