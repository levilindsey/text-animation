/**
 * This module defines a constructor for CharacterAnimation objects.
 * @module CharacterAnimation
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config, util, log;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Creates a span to hold this character, and adds this span to its parent.
   *
   * @param {HTMLElement} parent
   * @param {string} character
   */
  function createSpan(parent, character) {
    var characterAnimation, span;

    characterAnimation = this;

    span = document.createElement('span');
    span.className += ' character-animation';
    span.innerHTML = character;
    characterAnimation.span = span;

    addToParent.call(characterAnimation, parent);
  }

  /**
   * - Appends this span to its parent element.
   * - Calculates the dimensions of the character in its default style, and forces the span to
   *   maintain those dimensions.
   *
   * @param {HTMLElement} parent
   */
  function addToParent(parent) {
    var characterAnimation;

    characterAnimation = this;

    parent.appendChild(characterAnimation.span);
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Updates this animation to the given progress level through its overall animation curve.
   *
   * @param {number} progress A number between 0 and 1.
   */
  function update(progress) {
    // TODO:
  }

  /**
   * Resets this CharacterAnimation object to represent a new letter.
   *
   * @param {HTMLElement} parent
   * @param {string} character
   */
  function recycle(parent, character) {
    var characterAnimation = this;

    characterAnimation.span.innerHTML = character;

    addToParent.call(characterAnimation, parent);
  }

  /**
   * Removes this span from its parent.
   */
  function remove() {
    var characterAnimation = this;

    characterAnimation.span.parentNode.removeChild(characterAnimation.span);
  }

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Initializes some static state for this module.
   *
   * @function CharacterAnimation.initStaticFields
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
   * @param {HTMLElement} parent
   * @param {string} character
   * @param {Function} animation
   */
  function CharacterAnimation(parent, character, animation) {
    var characterAnimation = this;

    characterAnimation.animation = animation;
    characterAnimation.span = null;

    characterAnimation.update = update;
    characterAnimation.recycle = recycle;
    characterAnimation.remove = remove;

    createSpan.call(characterAnimation, parent, character);
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.CharacterAnimation = CharacterAnimation;
  CharacterAnimation.initStaticFields = initStaticFields;

  console.log('CharacterAnimation module loaded');
})();
