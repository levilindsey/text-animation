/**
 * This static module drives the text-animation app.
 *
 * @module index
 */
(function () {

  var currentJob, buttons;

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

    buttons = [];

    buttonContainer = document.getElementById('buttons');
    textContainer = document.getElementById('recipe');

    onJobEnd = function (completedSuccessfully) {
      currentJob = null;
    };

    addRandomAnimationButton(buttonContainer);

    addButtonHeader('Fancy', buttonContainer);

    for (i = 0, count = app.config.textAnimations.fancy.length; i < count; i += 1) {
      addAnimationButton(app.config.textAnimations.fancy[i], textContainer, buttonContainer, onJobEnd);
    }

    addButtonHeader('Simple', buttonContainer);

    for (i = 0, count = app.config.textAnimations.simple.length; i < count; i += 1) {
      addAnimationButton(app.config.textAnimations.simple[i], textContainer, buttonContainer, onJobEnd);
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
    var button, onClick;

    button = document.createElement('button');

    button.innerHTML = animationConfig.name;
    button.animationConfig = animationConfig;

    onClick = function () {
      if (currentJob) {
        ta.textAnimator.cancelJob(currentJob);
      }

      currentJob = ta.textAnimator.createJob(textContainer, this.animationConfig.totalDuration,
          this.animationConfig.characterDuration, this.animationConfig.easingFunctionName,
          this.animationConfig.fn, onJobEnd);

      ta.textAnimator.startJob(currentJob);
    };

    button.addEventListener('click', onClick, false);

    buttonContainer.appendChild(button);
    buttons.push(button);

    // There is a starting animation that is fired automatically shortly after the page loads
    if (animationConfig.isStartingAnimation) {
      setTimeout(function () {
        var event = new Event('click');
        button.dispatchEvent(event);
      }, app.config.startingAnimationDelay);
    }
  }

  /**
   * Creates a button that triggers a random animation.
   *
   * @param {HTMLElement} buttonContainer
   */
  function addRandomAnimationButton(buttonContainer) {
    var button, onClick;

    button = document.createElement('button');

    button.innerHTML = 'Random';

    onClick = function () {
      var event = new Event('click');
      buttons[parseInt(Math.random() * (buttons.length - 1) + 1)].dispatchEvent(event);
    };

    button.addEventListener('click', onClick, false);

    buttonContainer.appendChild(button);
    buttons.push(onClick);
  }

  /**
   * Creates a button section header with the given text.
   *
   * @param {string} text
   * @param {HTMLElement} buttonContainer
   */
  function addButtonHeader(text, buttonContainer) {
    var h = document.createElement('h3');
    h.innerHTML = text;
    buttonContainer.appendChild(h);
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
