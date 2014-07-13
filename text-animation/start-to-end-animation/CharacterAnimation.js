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

    characterAnimation.animationFunction(characterAnimation.span, progress);
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
   * @param {number} [startTime]
   * @param {number} [duration]
   */
  function CharacterAnimation(animationFunction, animationTextNode, character, startTime,
                              duration) {
    var characterAnimation = this;

    characterAnimation.animationFunction = animationFunction;
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
  if (!window.ta) window.ta = {};
  window.ta.CharacterAnimation = CharacterAnimation;

  console.log('CharacterAnimation module loaded');
})();
