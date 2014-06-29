/**
 * This static module drives the text-animation app.
 *
 * @module index
 */
(function () {

  var config, util, log, textAnimator, textAnimator;

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * Initializes this app.
   *
   * @function index~init
   */
  function init() {
    config = app.config;
    util = app.util;
    app.Log.initStaticFields();
    log = new app.Log('index');

    log.d('init');

    util.init();

    util.listen(window, 'load', onDocumentLoad);
  }

  /**
   * Resets all of the state for this app.
   *
   * @function index~reset
   */
  function reset() {
    var container;

    textAnimator = app.textAnimator;

    textAnimator.initStaticFields();

    log.i('reset', 'All modules initialized');

    container = document.getElementById('container');
    textAnimator = new textAnimator(container);

    checkBrowserCompatibility();
  }

  /**
   * This is the event handler for the completion of the DOM loading.
   *
   * @function index~onDocumentLoad
   */
  function onDocumentLoad() {
    log.i('onDocumentLoad');

    reset();
  }

  /**
   * @function index~checkBrowserCompatibility
   */
  function checkBrowserCompatibility() {
    if (!util.isBrowserCompatible) {
      showErrorMessage(config.L18N.EN.BAD_BROWSER_MESSAGE);
    }
  }

  /**
   * Adds an error message ribbon overtop of the document body. This message can be closed by
   * tapping on it.
   *
   * @param {String} message The text to show in the error display.
   */
  function showErrorMessage(message) {
    var body, errorMessageElement;

    body = document.getElementsByTagName('body')[0];

    errorMessageElement = util.createElement('div', body, null, ['errorMessage']);
    errorMessageElement.innerHTML = message;
    errorMessageElement.onclick = function () {
      body.removeChild(errorMessageElement);
    };
  }

  // ------------------------------------------------------------------------------------------- //

  if (!window.app) window.app = {};

  console.log('index module loaded');

  init();
})();
