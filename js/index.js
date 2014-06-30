/**
 * This static module drives the text-animation app.
 *
 * @module index
 */
(function () {

  var config, util, log, textAnimator;

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * Initializes this app.
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
   */
  function reset() {
    var container, totalDuration, characterDuration, animationConfig, onComplete, job;

    textAnimator = app.textAnimator;

    app.ElementNode.initStaticFields();
    app.CharacterAnimation.initStaticFields();
    app.TextAnimationJob.initStaticFields();
    textAnimator.initStaticFields();

    log.i('reset', 'All modules initialized');

    container = document.getElementById('container');
    totalDuration = 5000;
    characterDuration = 100;
    animationConfig = {
      // TODO:
    };
    onComplete = function () {
      document.getElementsByTagName('body')[0].style.backgroundColor = '#44ccee';
    };

    job = textAnimator.createJob(container, totalDuration, characterDuration, animationConfig, onComplete);
    setTimeout(function () {
      textAnimator.startJob(job);
    }, 1000);

    checkBrowserCompatibility();
  }

  /**
   * This is the event handler for the completion of the DOM loading.
   */
  function onDocumentLoad() {
    log.i('onDocumentLoad');

    reset();
  }

  /**
   * Checks browser compatibility with some of the features that this app requires.
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
   * @param {string} message The text to show in the error display.
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
