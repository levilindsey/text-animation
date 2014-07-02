/**
 * This module defines a constructor for CharacterAnimation objects.
 *
 * @module CharacterAnimation
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config, util, log;

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

    // TODO: Calculate the dimensions of the character in its default style, and force the span to maintain those dimensions.
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
      log.v('update', 'Completed animation: ' + characterAnimation.character);// TODO: remove me!!
    }

    // TODO: use progress to set values according to animation...
  }

  /**
   * Resets this CharacterAnimation object to represent a new letter.
   *
   * @param {AnimationTextNode} animationTextNode
   * @param {string} character
   * @param {number} startTime
   * @param {number} duration
   */
  function reset(animationTextNode, character, startTime, duration) {
    var characterAnimation = this;

    characterAnimation.span.innerHTML = character;
    characterAnimation.animationTextNode = animationTextNode;
    characterAnimation.character = character;
    characterAnimation.startTime = startTime;
    characterAnimation.duration = duration;
    characterAnimation.isComplete = false;

    addToParent.call(characterAnimation);

    log.v('reset', characterAnimation.character);// TODO: remove me!!
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
  // Public static functions

  /**
   * Initializes some static state for this module.
   */
  function initStaticFields() {
    config = app.config;
    util = app.util;
    log = new app.Log('CharacterAnimation');
    log.d('initStaticFields', 'Module initialized');
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Object} animationConfig
   * @param {AnimationTextNode} [animationTextNode]
   * @param {string} [character]
   * @param {number} [startTime]
   * @param {number} [duration]
   */
  function CharacterAnimation(animationConfig, animationTextNode, character, startTime, duration) {
    var characterAnimation = this;

    characterAnimation.animationConfig = animationConfig;
    characterAnimation.span = null;
    characterAnimation.isComplete = false;
    characterAnimation.animationTextNode = null;
    characterAnimation.character = null;
    characterAnimation.startTime = 0;
    characterAnimation.duration = 0;

    characterAnimation.update = update;
    characterAnimation.reset = reset;
    characterAnimation.remove = remove;

    createSpan.call(characterAnimation);

    if (animationTextNode && character && startTime && duration) {
      reset.call(characterAnimation, animationTextNode, character, startTime, duration);
    }
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.CharacterAnimation = CharacterAnimation;
  CharacterAnimation.initStaticFields = initStaticFields;

  console.log('CharacterAnimation module loaded');
})();
