/**
 * This module defines a constructor for ElementNode objects.
 *
 * @module ElementNode
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
    log = new app.Log('ElementNode');
    log.d('initStaticFields', 'Module initialized');
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {HTMLElement} element
   */
  function ElementNode(element) {
    var elementNode = this;

    elementNode.element = element;
    elementNode.childNodes = null;
    elementNode.characterCount = 0;
    elementNode.parentNode = null;
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.ElementNode = ElementNode;
  ElementNode.initStaticFields = initStaticFields;

  console.log('ElementNode module loaded');
})();
