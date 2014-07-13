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
