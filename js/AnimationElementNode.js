/**
 * This module defines a constructor for AnimationElementNode objects.
 *
 * @module AnimationElementNode
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config, util, log;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Inserts this element into the DOM. This also inserts any un-inserted ancestors into the DOM.
   */
  function insertIntoDOM() {
    var animationElementNode = this;

    // Insert the parent element into the DOM if needed
    if (animationElementNode.parentAnimationElementNode &&
      !animationElementNode.parentAnimationElementNode.isInsertedInDOM) {
      animationElementNode.parentAnimationElementNode.insertIntoDOM();
    }

    // The root AnimationElementNode will not have a parent, but will also not have been removed
    if (animationElementNode.parentAnimationElementNode) {
      // Check whether we should insert this element before another sibling text node or simply at
      // the end of the parent element
      if (animationElementNode.nextSiblingTextNode) {
        animationElementNode.parentAnimationElementNode.element.insertBefore(
            animationElementNode.element, animationElementNode.nextSiblingTextNode);
      } else {
        animationElementNode.parentAnimationElementNode.element.appendChild(
            animationElementNode.element);
      }
    }

    animationElementNode.isInsertedInDOM = true;
  }

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Initializes some static state for this module.
   */
  function initStaticFields() {
    config = app.config;
    util = app.util;
    log = new app.Log('AnimationElementNode');
    log.d('initStaticFields', 'Module initialized');
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {HTMLElement} element
   * @param {AnimationElementNode} parentAnimationElementNode
   * @param {?Node} nextSiblingTextNode
   */
  function AnimationElementNode(element, parentAnimationElementNode, nextSiblingTextNode) {
    var animationElementNode = this;

    animationElementNode.element = element;
    animationElementNode.parentAnimationElementNode = parentAnimationElementNode;
    animationElementNode.nextSiblingTextNode = nextSiblingTextNode;
    animationElementNode.isInsertedInDOM = false;

    animationElementNode.insertIntoDOM = insertIntoDOM;
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.AnimationElementNode = AnimationElementNode;
  AnimationElementNode.initStaticFields = initStaticFields;

  console.log('AnimationElementNode module loaded');
})();
