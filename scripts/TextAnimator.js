/**
 * This module defines a constructor for TextAnimator objects.
 * @module TextAnimator
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var params, util, log;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Initializes some static state for this module.
   * @function TextAnimator.initStaticFields
   */
  function initStaticFields() {
    params = app.params;
    util = app.util;
    log = new app.Log('TextAnimator');
    log.d('initStaticFields', 'Module initialized');
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {HTMLElement} root
   */
  function TextAnimator(root) {
    var textAnimator = this;

    textAnimator.root = root;
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.TextAnimator = TextAnimator;
  TextAnimator.initStaticFields = initStaticFields;

  console.log('TextAnimator module loaded');
})();
