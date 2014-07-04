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
   */
  function AnimationElementNode(element, parentAnimationElementNode) {
    var animationElementNode = this;

    animationElementNode.element = element;
    animationElementNode.parentAnimationElementNode = parentAnimationElementNode;
    animationElementNode.isInsertedInDOM = false;
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.AnimationElementNode = AnimationElementNode;
  AnimationElementNode.initStaticFields = initStaticFields;

  console.log('AnimationElementNode module loaded');
})();
