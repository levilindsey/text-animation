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
   *
   * @param {AnimationTextNode} textNode
   */
  function addToParent(textNode) {
    var characterAnimation;

    characterAnimation = this;

    textNode.parentElement.appendChild(characterAnimation.span);

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
      log('update', 'Completed animation: ' + characterAnimation.span.innerHTML);// TODO: remove me!!
    }

    // TODO: use progress to set values according to animation...
  }

  /**
   * Resets this CharacterAnimation object to represent a new letter.
   *
   * @param {AnimationTextNode} textNode
   * @param {string} character
   * @param {number} startTime
   * @param {number} duration
   */
  function reset(textNode, character, startTime, duration) {
    var characterAnimation = this;

    characterAnimation.span.innerHTML = character;
    characterAnimation.duration = duration;
    characterAnimation.startTime = startTime;
    characterAnimation.isComplete = false;

    addToParent.call(characterAnimation, textNode);
    log('reset', characterAnimation.span.innerHTML);// TODO: remove me!!
  }

  /**
   * Removes this span from its parent, and replaces it with the character it was animating.
   */
  function remove() {
    var characterAnimation, parent;

    characterAnimation = this;
    parent = characterAnimation.span.parentNode;

    parent.removeChild(characterAnimation.span);
    parent.innerHTML += characterAnimation.span.innerHTML;
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
   * @param {AnimationTextNode} [textNode]
   * @param {string} [character]
   * @param {number} [startTime]
   * @param {number} [duration]
   */
  function CharacterAnimation(animationConfig, textNode, character, startTime, duration) {
    var characterAnimation = this;

    characterAnimation.animationConfig = animationConfig;
    characterAnimation.span = null;
    characterAnimation.isComplete = false;
    characterAnimation.startTime = 0;
    characterAnimation.duration = 0;

    characterAnimation.update = update;
    characterAnimation.reset = reset;
    characterAnimation.remove = remove;

    createSpan.call(characterAnimation);

    if (textNode && character && startTime && duration) {
      reset.call(characterAnimation, textNode, character, startTime, duration);
    }
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.CharacterAnimation = CharacterAnimation;
  CharacterAnimation.initStaticFields = initStaticFields;

  console.log('CharacterAnimation module loaded');
})();
