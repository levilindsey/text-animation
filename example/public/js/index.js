/**
 * This static module drives the text-animation app.
 *
 * @module index
 */
(function () {

  var currentJob;

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * Initializes the app.
   */
  function init() {
    window.addEventListener('load', onDocumentLoad, false);
  }

  /**
   * Resets all of the state for the app.
   */
  function reset() {
    currentJob = null;

    console.log('All modules initialized');

    addAnimationButtons();
  }

  /**
   * Creates a button for each pre-configured animation settings.
   */
  function addAnimationButtons() {
    var buttonContainer, textContainer, onJobEnd, i, count;

    buttonContainer = document.getElementById('buttons');
    textContainer = document.getElementById('recipe');

    onJobEnd = function (completedSuccessfully) {
      currentJob = null;
    };

    for (i = 0, count = app.config.textAnimations.length; i < count; i += 1) {
      addAnimationButton(app.config.textAnimations[i], textContainer, buttonContainer, onJobEnd);
    }
  }

  /**
   * Creates a button for the given pre-configured animation settings.
   *
   * @param {Object} animationConfig
   * @param {HTMLElement} textContainer
   * @param {HTMLElement} buttonContainer
   * @param {Function} onJobEnd
   */
  function addAnimationButton(animationConfig, textContainer, buttonContainer, onJobEnd) {
    var button = document.createElement('button');

    button.innerHTML = animationConfig.name;
    button.animationConfig = animationConfig;

    button.addEventListener('click', function () {
      if (currentJob) {
        ta.textAnimator.cancelJob(currentJob);
      }

      currentJob = ta.textAnimator.createJob(textContainer, this.animationConfig.totalDuration,
          this.animationConfig.characterDuration, this.animationConfig.fn, onJobEnd);

      ta.textAnimator.startJob(currentJob);
    }, false);

    buttonContainer.appendChild(button);
  }

  /**
   * This is the event handler for the completion of the DOM loading.
   */
  function onDocumentLoad() {
    console.log('onDocumentLoad');

    reset();
    window.removeEventListener('load', onDocumentLoad);
  }

  // ------------------------------------------------------------------------------------------- //

  if (!window.app) window.app = {};

  console.log('index module loaded');

  init();
})();
