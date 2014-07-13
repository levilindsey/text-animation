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
