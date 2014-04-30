/**
 * This module defines a constructor for AnimatingCharacter objects.
 * @module AnimatingCharacter
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

  /**
   * @function AnimatingCharacter#recycle
   * @param {HTMLElement} parent
   */
  function recycle(parent) {
    var animatingCharacter = this;

    // TODO:
  }

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Initializes some static state for this module.
   * @function AnimatingCharacter.initStaticFields
   */
  function initStaticFields() {
    params = app.params;
    util = app.util;
    log = new app.Log('AnimatingCharacter');
    log.d('initStaticFields', 'Module initialized');
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {HTMLElement} parent
   */
  function AnimatingCharacter(parent) {
    var animatingCharacter = this;

    animatingCharacter.parent = parent;

    animatingCharacter.recycle = recycle;
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.AnimatingCharacter = AnimatingCharacter;
  AnimatingCharacter.initStaticFields = initStaticFields;

  console.log('AnimatingCharacter module loaded');
})();
