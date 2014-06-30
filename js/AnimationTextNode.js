/**
 * This module defines a constructor for AnimationTextNode objects.
 *
 * @module AnimationTextNode
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
    log = new app.Log('AnimationTextNode');
    log.d('initStaticFields', 'Module initialized');
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {HTMLElement} parentElement
   * @param {string} text
   */
  function AnimationTextNode(parentElement, text) {
    var animationTextNode = this;

    animationTextNode.parentElement = parentElement;
    animationTextNode.text = text;
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.AnimationTextNode = AnimationTextNode;
  AnimationTextNode.initStaticFields = initStaticFields;

  console.log('AnimationTextNode module loaded');
})();
