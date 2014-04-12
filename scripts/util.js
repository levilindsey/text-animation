/**
 * This module defines a collection of static general utility functions.
 * @module util
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var util, params, log;

  /**
   * Sets up a cross-browser compatible XHR function. This function is stored as util.XHR.
   * @function util~setUpXHR
   */
  function setUpXHR() {
    if (window.XMLHttpRequest) {
      util.XHR = window.XMLHttpRequest;
    } else {
      util.XHR = function () {
        var activeXObject;
        try {
          activeXObject = new ActiveXObject('Msxml2.XMLHTTP.6.0');
          return activeXObject;
        } catch (e1) {
        }
        try {
          activeXObject = new ActiveXObject('Msxml2.XMLHTTP.3.0');
          util.isBrowserCompatible = false;
          return activeXObject;
        } catch (e2) {
        }
        try {
          activeXObject = new ActiveXObject('Msxml2.XMLHTTP');
          util.isBrowserCompatible = false;
          return activeXObject;
        } catch (e3) {
        }
        throw new Error('This browser does not support XMLHttpRequest.');
      };
    }
  }

  /**
   * Sets up a cross-browser compatible function for adding event listeners. This function is
   * stored as util.listen.
   * @function util~setUpListen
   */
  function setUpListen() {
    var body = document.getElementsByTagName('body')[0];
    if (body.addEventListener) {
      util.listen = function (element, eventName, handler) {
        element.addEventListener(eventName, handler, false);
      };
    } else if (body.attachEvent) {
      util.isBrowserCompatible = false;
      util.listen = function (element, eventName, handler) {
        element.attachEvent('on' + eventName, handler);
      };
    } else {
      util.isBrowserCompatible = false;
      util.listen = function (element, eventName, handler) {
        element['on' + eventName] = handler;
      };
    }
  }

  /**
   * Sets up a cross-browser compatible function for removing event listeners. This function is
   * stored as util.stopListening.
   * @function util~setUpStopListening
   */
  function setUpStopListening() {
    var body = document.getElementsByTagName('body')[0];
    if (body.removeEventListener) {
      util.stopListening = function (element, eventName, handler) {
        element.removeEventListener(eventName, handler, false);
      };
    } else if (body.detachEvent) {
      util.isBrowserCompatible = false;
      util.stopListening = function (element, eventName, handler) {
        element.detachEvent('on' + eventName, handler);
      };
    } else {
      util.isBrowserCompatible = false;
      util.stopListening = function (element, eventName) {
        element['on' + eventName] = null;
      };
    }
  }

  /**
   * Sets up a cross-browser compatible function for entering full-screen mode. This function is
   * stored as util.requestFullscreen.
   * @function util~setUpRequestFullScreen
   */
  function setUpRequestFullScreen() {
    var body = document.getElementsByTagName('body')[0];
    if (body.requestFullscreen) {
      util.requestFullscreen = function (element) {
        element.requestFullscreen();
      };
    } else if (body.mozRequestFullScreen) {
      util.requestFullscreen = function (element) {
        element.mozRequestFullScreen();
      };
    } else if (body.webkitRequestFullScreen) {
      util.requestFullscreen = function (element) {
        element.webkitRequestFullScreen();
      };
    } else if (body.msRequestFullScreen) {
      util.requestFullscreen = function (element) {
        element.msRequestFullScreen();
      };
    } else {
      util.requestFullscreen = function () {
        log.e('This browser does not support fullscreen mode.');
      };
      log.w('This browser does not support fullscreen mode.');
    }
  }

  /**
   * Sets up a cross-browser compatible function for exiting full-screen mode. This function is
   * stored as util.cancelFullScreen.
   * @function util~setUpCancelFullScreen
   */
  function setUpCancelFullScreen() {
    if (document.cancelFullScreen) {
      util.cancelFullScreen = function () {
        document.cancelFullScreen();
      };
    } else if (document.mozCancelFullScreen) {
      util.cancelFullScreen = function () {
        document.mozCancelFullScreen();
      };
    } else if (document.webkitCancelFullScreen) {
      util.cancelFullScreen = function () {
        document.webkitCancelFullScreen();
      };
    } else if (document.webkitExitFullScreen) {
      util.cancelFullScreen = function () {
        document.webkitExitFullScreen();
      };
    } else {
      util.cancelFullScreen = function () {
        log.e('This browser does not support fullscreen mode.');
      };
      log.w('This browser does not support fullscreen mode.');
    }
  }

  /**
   * Sets up a cross-browser compatible function for adding an event listener for full-screen mode
   * being exited. This function is stored as util.addOnEndFullScreen.
   * @function util~setUpAddOnEndFullScreen
   */
  function setUpAddOnEndFullScreen() {
    if (typeof document.webkitCancelFullScreen !== 'undefined') {
      util.addOnEndFullScreen = function (handler) {
        util.listen(document, 'webkitfullscreenchange', function () {
          if (!document.webkitIsFullScreen) {
            handler();
          }
        });
      }
    } else if (typeof document.mozCancelFullScreen !== 'undefined') {
      util.addOnEndFullScreen = function (handler) {
        util.listen(document, 'mozfullscreenchange', function () {
          if (!document.mozFullScreen) {
            handler();
          }
        });
      }
    } else if (typeof document.cancelFullScreen !== 'undefined') {
      util.addOnEndFullScreen = function (handler) {
        util.listen(document, 'fullscreenchange', function () {
          if (!document.fullScreen) {
            handler();
          }
        });
      }
    } else {
      util.addOnEndFullScreen = function () {
        log.e('This browser does not support the fullscreenchange event.');
      }
      log.w('This browser does not support the fullscreenchange event.');
    }
  }

  /**
   * Sets up a cross-browser compatible function for stopping the propogation of a given event.
   * This function is stored as util.stopPropogation.
   * @function util~setUpStopPropogation
   */
  function setUpStopPropogation() {
    util.stopPropogation = function (event) {
      if (event.stopPropagation) {
        event.stopPropagation();
      } else {
        util.isBrowserCompatible = false;
        event.cancelBubble = true;
      }
    };
  }

  /**
   * Sets up a cross-browser compatible function for stopping the default browser response to a
   * given event. This function is stored as util.setUpPreventDefault.
   * @function util~setUpPreventDefault
   */
  function setUpPreventDefault() {
    util.preventDefault = function (event) {
      if (event.preventDefault) {
        event.preventDefault();
      } else {
        util.isBrowserCompatible = false;
        event.returnValue = false;
      }
    };
  }

  /**
   * Sets up a cross-browser compatible function for adding an event listener for the end of a CSS
   * transition. This function is stored as util.setUpListenForTransitionEnd.
   * @function util~setUpListenForTransitionEnd
   */
  function setUpListenForTransitionEnd() {
    var body, transitions, transition, transitionEndEventName;

    body = document.getElementsByTagName('body')[0];

    transitions = {
      'transition': 'transitionend',
      'OTransition': 'otransitionend',
      'MozTransition': 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd'
    };

    for (transition in transitions) {
      if (body.style[transition] !== 'undefined') {
        transitionEndEventName = transitions[transition];
        break;
      }
    }

    if (transitionEndEventName) {
      util.listenForTransitionEnd = function (element, handler) {
        util.listen(element, transitionEndEventName, handler);
      };
      util.stopListeningForTransitionEnd = function (element, handler) {
        util.stopListening(element, transitionEndEventName, handler);
      };
    } else {
      util.isBrowserCompatible = false;
      util.listenForTransitionEnd = function () {
        log.e('This browser does not support the transitionend event.');
      };
      util.stopListeningForTransitionEnd = function () {
        log.e('This browser does not support the transitionend event.');
      };
      log.w('This browser does not support the transitionend event.');
    }
  }

  /**
   * Sets up a cross-browser compatible functions for getting the current horizontal and vertical
   * scroll of the overall page. This function is stored as util.setUpGetScrollTopAndLeft.
   * @function util~setUpGetScrollTopAndLeft
   */
  function setUpGetScrollTopAndLeft() {
    var body;
    if (document.documentElement) {
      util.getScrollTop = function () {
        return document.documentElement.scrollTop;
      };
      util.getScrollLeft = function () {
        return document.documentElement.scrollLeft;
      };
    } else if (typeof pageYOffset !== 'undefined') {
      util.getScrollTop = function () {
        return pageYOffset;
      };
      util.getScrollLeft = function () {
        return pageXOffset;
      };
    } else {
      body = document.getElementsByTagName('body')[0];
      util.getScrollTop = function () {
        return body.scrollTop;
      };
      util.getScrollLeft = function () {
        return body.scrollLeft;
      };
    }
  }

  /**
   * Sets up a cross-browser compatible function for getting the intermediate transition value of
   * a given property of a given element. This function is stored as util.getMidTransitionValue.
   * @function util~setUpGetMidTransitionValue
   */
  function setUpGetMidTransitionValue() {
    var body = document.getElementsByTagName('body')[0];
    if (window.getComputedStyle) {
      util.getMidTransitionValue = function (element, property) {
        return getComputedStyle(element).getPropertyValue(property);
      };
    } else if (body.currentStyle) {
      util.getMidTransitionValue = function (element, property) {
        try {
          return element.currentStyle[property];
        } catch (e) {
          log.w('Element ' + element + ' does not have intermediate property ' + property)
          return '';
        }
      };
    } else {
      util.getMidTransitionValue = function () {
        log.e('This browser does not support getComputedStyle.');
        return '';
      };
      log.w('This browser does not support getComputedStyle.');
    }
  }

  /**
   * @function util.setUpCreateObjectURL
   */
  function setUpCreateObjectURL() {
    if (window.webkitURL) {
      util.createObjectURL = function(fileObject) {
        return window.webkitURL.createObjectURL(fileObject);
      };
      util.revokeObjectURL = function(objectURL) {
        window.webkitURL.revokeObjectURL(objectURL);
      };
    } else if (window.URL && window.URL.createObjectURL) {
      util.createObjectURL = function(fileObject) {
        return window.URL.createObjectURL(fileObject);
      };
      util.revokeObjectURL = function(objectURL) {
        window.URL.revokeObjectURL(objectURL);
      };
    } else {
      util.createObjectURL = function () {
        log.e('This browser does not support createObjectURL.');
        return null;
      };
      util.revokeObjectURL = function () {
        log.e('This browser does not support revokeObjectURL.');
        return null;
      };
      log.w('This browser does not support createObjectURL/revokeObjectURL.');
    }
  }

  /**
   * Determines whether the current browser is probably a mobile browser. This flag is recorded in
   * util.isMobileBrowser.
   * @function util~checkIfMobileBrowser
   */
  function checkIfMobileBrowser() {
    var MOBILE_REGEX_1, MOBILE_REGEX_2, userAgentInfo;

    MOBILE_REGEX_1 =
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i;
    MOBILE_REGEX_2 =
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i;
    userAgentInfo = navigator.userAgent || navigator.vendor || window.opera;

    util.isMobileBrowser = mobileCheck(userAgentInfo);

    log.i('checkIfMobileBrowser', 'isMobileBrowser=' + util.isMobileBrowser);

    function mobileCheck(userAgentInfo) {
      return MOBILE_REGEX_1.test(userAgentInfo) || MOBILE_REGEX_2.test(userAgentInfo.substr(0, 4));
    }
  }

  /**
   * Determines whether the current device has a small screen. This flag is recorded in
   * util.isSmallScreen.
   * @function util~checkIfSmallScreen
   */
  function checkIfSmallScreen() {
    util.isSmallScreen =
        screen.width < params.SMALL_SCREEN_WIDTH_THRESHOLD ||
            screen.height < params.SMALL_SCREEN_HEIGHT_THRESHOLD;
  }

  /**
   * Sets up various cross-browser compatible utility functions that are all dependent on whether
   * the current browser is a mobile browser.
   * @function util~setUpMobileBrowserDependantHelpers
   */
  function setUpMobileBrowserDependantHelpers() {
    if (util.isMobileBrowser) {
      /**
       * Adds a tap event listener in a mobile-browser-friendly manner.
       * @function util.addTapEventListener
       * @param {HTMLElement} element The element to listen for the event on.
       * @param {Function} callback The callback function to handle the event.
       * @param {Boolean} preventDefault True if the default browser response should be prevented.
       * @returns {Function} The event-handler shim which is used to prevent the default browser
       * response (if the preventDefault flag is set to true). It is important for the client to
       * keep track of this, so that if the tap event-lister is later removed, the default browser
       * behavior can then be resumed.
       */
      util.addTapEventListener = function (element, callback, preventDefault) {
        var preventionCallback;
        if (preventDefault) {
          preventionCallback = function (event) {
            util.preventDefault(event);
          };
          util.listen(element, 'touchstart', preventionCallback);
        }
        util.listen(element, 'click', callback);
        return preventionCallback;
      };

      /**
       * Removes the given tap event listener for mobile browsers.
       * @function util.removeTapEventListener
       * @param {HTMLElement} element The element to listen for the event on.
       * @param {Function} callback The callback function to handle the event.
       * @param {Function} [preventionCallback] The event handler shim that was used, if the
       * default browser response was prevented with this tap event handler.
       */
      util.removeTapEventListener = function (element, callback, preventionCallback) {
        util.stopListening(element, 'click', callback);
        util.stopListening(element, 'touchstart', preventionCallback);
      };

      /**
       * Adds a pointer-move event listener in a mobile-browser-friendly manner.
       * @function util.addPointerMoveEventListener
       * @param {HTMLElement} element The element to listen for the event on.
       * @param {Function} callback The callback function to handle the event.
       */
      util.addPointerMoveEventListener = function (element, callback) {
        util.listen(element, 'touchmove', callback);
      };

      /**
       * Removes the given pointer-move event listener for mobile browsers.
       * @function util.removePointerMoveEventListener
       * @param {HTMLElement} element The element to listen for the event on.
       * @param {Function} callback The callback function to handle the event.
       */
      util.removePointerMoveEventListener = function (element, callback) {
        util.stopListening(element, 'touchmove', callback);
      };
    } else {
      /**
       * Adds a tap event listener in a non-mobile-browser-friendly manner.
       * @function util.addTapEventListener
       * @param {HTMLElement} element The element to listen for the event on.
       * @param {Function} callback The callback function to handle the event.
       * @param {Boolean} preventDefault True if the default browser response should be prevented.
       * @returns {Function} The event-handler shim which is used to prevent the default browser
       * response (if the preventDefault flag is set to true). It is important for the client to
       * keep track of this, so that if the tap event-lister is later removed, the default browser
       * behavior can then be resumed.
       */
      util.addTapEventListener = function (element, callback, preventDefault) {
        var preventionCallback;
        if (preventDefault) {
          preventionCallback = function (event) {
            util.preventDefault(event);
          };
          util.listen(element, 'mousedown', preventionCallback);
        }
        util.listen(element, 'click', callback);
        return preventionCallback;
      };

      /**
       * Removes the given tap event listener for non-mobile browsers.
       * @function util.removeTapEventListener
       * @param {HTMLElement} element The element to listen for the event on.
       * @param {Function} callback The callback function to handle the event.
       * @param {Function} [preventionCallback] The event handler shim that was used, if the
       * default browser response was prevented with this tap event handler.
       */
      util.removeTapEventListener = function (element, callback, preventionCallback) {
        util.stopListening(element, 'click', callback);
        util.stopListening(element, 'mousedown', preventionCallback);
      };

      /**
       * Adds a pointer-move event listener in a non-mobile-browser-friendly manner.
       * @function util.addPointerMoveEventListener
       * @param {HTMLElement} element The element to listen for the event on.
       * @param {Function} callback The callback function to handle the event.
       */
      util.addPointerMoveEventListener = function (element, callback) {
        util.listen(element, 'mousemove', callback);
      };

      /**
       * Removes the given pointer-move event listener for non-mobile browsers.
       * @function util.removePointerMoveEventListener
       * @param {HTMLElement} element The element to listen for the event on.
       * @param {Function} callback The callback function to handle the event.
       */
      util.removePointerMoveEventListener = function (element, callback) {
        util.stopListening(element, 'mousemove', callback);
      };
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Initializes some static state for this module.
   * @function util.init
   */
  function init() {
    params = app.params;
    log = new app.Log('util');

    util.isBrowserCompatible = true;

    checkIfMobileBrowser();
    checkIfSmallScreen();

    setUpXHR();
    setUpListen();
    setUpStopListening();
    setUpRequestFullScreen();
    setUpCancelFullScreen();
    setUpStopPropogation();
    setUpPreventDefault();
    setUpListenForTransitionEnd();
    setUpGetScrollTopAndLeft();
    setUpAddOnEndFullScreen();
    setUpGetMidTransitionValue();
    setUpCreateObjectURL();
    setUpMobileBrowserDependantHelpers();

    log.d('init', 'Module initialized');
  }

  /**
   * Sends an asynchronous GET request to the given URL, and calls the appropriate callback
   * function when the request succeeds or fails.
   * @function util.sendRequest
   * @param {String} url The URL to send the GET request to.
   * @param {Function} onSuccess The function to call when a response is successfully received.
   * @param {Function} [onError] The function to call when the request does not complete successfully.
   * @returns {Object} The XHR object used to send the request.
   */
  function sendRequest(url, onSuccess, onError) {
    var xhr;

    onError = onError || function (msg) {
    };

    // Initialize the request
    xhr = new util.XHR();
    try {
      xhr.open('GET', url);
    } catch (e) {
      onError('Unable to open the request');
    }

    // Prepare to handle the response
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          onSuccess(xhr.responseText);
        } else {
          if (!xhr.aborted) {
            onError('Server responded with code ' + xhr.status + ' and message ' +
                xhr.responseText);
          }
        }
      }
    };

    // Send the request
    try {
      xhr.send();
    } catch (e) {
      onError('Unable to send the request');
    }

    return xhr;
  }

  /**
   *
   * @function util.loadImageViaXHR
   * @param {String} src
   * @param {Image} imageElement
   * @param {Function} onSuccess
   * @param {Function} onError
   * @param {Function} onProgress
   * @returns {Object} The XHR object used to send the request.
   */
  function loadImageViaXHR(src, imageElement, onSuccess, onError, onProgress) {
    var xhr;

    onError = onError || function (msg) {
    };

    xhr = new util.XHR();

    // Prepare to handle the response

    util.listen(xhr, 'progress', function (event) {
      if (event.lengthComputable) {
        //log.v('loadImageViaXHR.OnProgress', event.loaded + '/' + event.total);
        onProgress(event.loaded / event.total);
      } else {
        log.w('loadImageViaXHR.OnProgress', 'Length is not computable');
      }
    });

    util.listen(xhr, 'load', function () {
      //log.v('load');
      var imageObjectURL;

      // Encode and add the image to the DOM
      imageObjectURL = util.createObjectURL(xhr.response);
      util.listen(imageElement, 'load', function () {
        util.revokeObjectURL(imageObjectURL);
      });
      imageElement.src = imageObjectURL;
    });

    util.listen(xhr, 'loadend', function () {
      //log.v('loadend');
      onSuccess();
    });

    util.listen(xhr, 'abort', function () {
      //log.v('abort');
      if (!xhr.aborted) {
        onError('Abort');
      }
    });

    util.listen(xhr, 'error', function () {
      //log.v('error');
      onError('Error');
    });

    util.listen(xhr, 'timeout', function () {
      //log.v('timeout');
      onError('Timeout');
    });

    // Initialize the request
    try {
      xhr.open('GET', src, true);
    } catch (e) {
      onError('Unable to open the request');
    }

    //xhr.overrideMimeType('text/plain; charset=x-user-defined');
    xhr.responseType = 'blob';

    // Send the request
    try {
      xhr.send(null);
    } catch (e) {
      onError('Unable to send the request');
    }

    return xhr;
  }

  /**
   * Aborts the given request, and adds a property to the object as a flag indicating that this was
   * stopped from being aborted and not from some other error.
   * @util util.abortXHR
   * @param {Object} xhr
   */
  function abortXHR(xhr) {
    xhr.aborted = true;
    xhr.abort();
  }

  /**
   * Converts a Date object into a string representation in the form "yyyy/mm/dd@hh:mm:ss.mmm".
   * @function util.dateObjToDateTimeString
   * @param {Date} dateObj The Date object to get a string representation of.
   * @returns {String} A string representation of the date and time.
   */
  function dateObjToDateTimeString(dateObj) {
    return dateObj.getFullYear() + '/' + (dateObj.getMonth() + 1) + '/' + dateObj.getDate() + '@' +
        dateObj.getHours() + ':' + dateObj.getMinutes() + ':' + dateObj.getSeconds() + '.' +
        dateObj.getMilliseconds();
  }

  /**
   * Converts a number of milliseconds into a string representation of the time in the form
   * "[hh:]mm:ss.mmm".
   * @function util.millisToTimeString
   * @param {Number} millis The number of milliseconds to convert to a string representation.
   * @returns {String} A string representation of the number of milliseconds.
   */
  function millisToTimeString(millis) {
    var hours, minutes, seconds;

    hours = parseInt((millis / 3600000), 10);
    millis %= 3600000;
    minutes = parseInt((millis / 60000), 10);
    millis %= 60000;
    seconds = parseInt((millis / 1000), 10);
    millis %= 1000;

    hours = hours > 9 ? '' + hours + ':' : hours > 0 ? '0' + hours + ':' : '';
    minutes = (minutes > 9 ? '' + minutes : '0' + minutes) + ':';
    seconds = (seconds > 9 ? '' + seconds : '0' + seconds) + '.';
    millis = millis > 99 ? '' + millis : millis > 9 ? '0' + millis : '00' + millis;

    return hours + minutes + seconds + millis;
  }

  /**
   * Adds an event listener for each of the given events to each of the given elements.
   * @function util.listenToMultipleForMultiple
   * @param {Array.<HTMLElement>} elements The elements to add event listeners to.
   * @param {Array.<String>} events The event listeners to add to the elements.
   * @param {Function} callback The single callback for handling the events.
   */
  function listenToMultipleForMultiple(elements, events, callback) {
    elements.forEach(function (element) {
      events.forEach(function (event) {
        util.listen(element, event, callback);
      });
    });
  }

  /**
   * Creates a DOM element with the given tag name, appends it to the given parent element, and
   * gives it the given id and classes.
   * @function util.createElement
   * @param {String} tagName The tag name to give the new element.
   * @param {HTMLElement} [parent] The parent element to append the new element to.
   * @param {String} [id] The id to give the new element.
   * @param {Array.<String>} [classes] The classes to give the new element.
   * @returns {HTMLElement} The new element.
   */
  function createElement(tagName, parent, id, classes) {
    var element = document.createElement(tagName);
    if (parent) {
      parent.appendChild(element);
    }
    if (id) {
      element.id = id;
    }
    if (classes) {
      classes.forEach(function (className) {
        addClass(element, className)
      });
    }
    return element;
  }

  /**
   * Determines whether the given element contains the given class.
   * @function util~containsClass
   * @param {HTMLElement} element The element to check.
   * @param {String} className The class to check for.
   * @returns {Boolean} True if the element does contain the class.
   */
  function containsClass(element, className) {
    var startIndex, indexAfterEnd;
    startIndex = element.className.indexOf(className);
    if (startIndex >= 0) {
      if (startIndex === 0 || element.className[startIndex - 1] === ' ') {
        indexAfterEnd = startIndex + className.length;
        if (indexAfterEnd === element.className.length ||
            element.className[indexAfterEnd] === ' ') {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Toggles whether the given element has the given class. If the enabled argument is given, then
   * the inclusion of the class will be forced. That is, if enabled=true, then this will ensure the
   * element has the class; if enabled=false, then this will ensure the element does NOT have the
   * class; if enabled=undefined, then this will simply toggle whether the element has the class.
   * @function util.toggleClass
   * @param {HTMLElement} element The element to add the class to or remove the class from.
   * @param {String} className The class to add or remove.
   * @param {Boolean} [enabled] If given, then the inclusion of the class will be forced.
   */
  function toggleClass(element, className, enabled) {
    if (typeof enabled === 'undefined') {
      if (containsClass(element, className)) {
        removeClass(element, className);
      } else {
        addClass(element, className);
      }
    } else if (enabled) {
      addClass(element, className);
    } else {
      removeClass(element, className);
    }
  }

  /**
   * Gets the coordinates of the element relative to the top-left corner of the page.
   * @function util.getPageOffset
   * @param {HTMLElement} element The element to get the coordinates of.
   * @returns {{x: Number, y: Number}} The coordinates of the element relative to the top-left
   * corner of the page.
   */
  function getPageOffset(element) {
    var x = 0, y = 0;
    while (element) {
      x += element.offsetLeft;
      y += element.offsetTop;
      element = element.offsetParent;
    }
    x -= util.getScrollLeft();
    y -= util.getScrollTop();
    return { x: x, y: y };
  }

  /**
   * Gets the dimensions of the viewport.
   * @function util.getViewportSize
   * @returns {{w: Number, h: Number}} The dimensions of the viewport.
   */
  function getViewportSize() {
    var w, h;
    if (typeof window.innerWidth !== 'undefined') {
      // Good browsers
      w = window.innerWidth;
      h = window.innerHeight;
    } else if (typeof document.documentElement !== 'undefined' &&
        typeof document.documentElement.clientWidth !== 'undefined' &&
        document.documentElement.clientWidth !== 0) {
      // IE6 in standards compliant mode
      w = document.documentElement.clientWidth;
      h = document.documentElement.clientHeight;
    } else {
      // Older versions of IE
      w = document.getElementsByTagName('body')[0].clientWidth;
      h = document.getElementsByTagName('body')[0].clientHeight;
    }
    return { w: w, h: h };
  }

  /**
   * Removes the given child element from the given parent element if the child does indeed belong
   * to the parent.
   * @function util.removeChildIfPresent
   * @param {HTMLElement} parent The parent to remove the child from.
   * @param {HTMLElement} child The child to remove.
   * @returns {Boolean} True if the child did indeed belong to the parent.
   */
  function removeChildIfPresent(parent, child) {
    if (child && child.parentNode === parent) {
      parent.removeChild(child);
      return true;
    }
    return false
  }

  /**
   * Adds the given class to the given element.
   * @function util.addClass
   * @param {HTMLElement} element The element to add the class to.
   * @param {String} className The class to add.
   */
  function addClass(element, className) {
    element.className += ' ' + className;
  }

  /**
   * Removes the given class from the given element.
   * @function util.removeClass
   * @param {HTMLElement} element The element to remove the class from.
   * @param {String} className The class to remove.
   */
  function removeClass(element, className) {
    element.className = element.className.split(' ').filter(function (value) {
      return value !== className;
    }).join(' ');
  }

  /**
   * Removes all classes from the given element.
   * @function util.clearClasses
   * @param {HTMLElement} element The element to remove all classes from.
   */
  function clearClasses(element) {
    element.className = '';
  }

  /**
   * Calculates the width that the DOM would give to a div with the given text. The given tag
   * name, parent, id, and classes allow the width to be affected by various CSS rules.
   * @function util.getTextWidth
   * @param {String} text The text to determine the width of.
   * @param {String} tagName The tag name this text would supposedly have.
   * @param {HTMLElement} [parent] The parent this text would supposedly be a child of; defaults
   * to the document body.
   * @param {String} [id] The id this text would supposedly have.
   * @param {Array.<String>} [classes] The classes this text would supposedly have.
   * @returns {Number} The width of the text under these conditions.
   */
  function getTextWidth(text, tagName, parent, id, classes) {
    var tmpElement, width;
    parent = parent || document.getElementsByTagName('body')[0];
    tmpElement = util.createElement(tagName, null, id, classes);
    tmpElement.style.position = 'absolute';
    tmpElement.style.visibility = 'hidden';
    tmpElement.style.whiteSpace = 'nowrap';
    parent.appendChild(tmpElement);
    tmpElement.innerHTML = text;
    width = tmpElement.clientWidth;
    parent.removeChild(tmpElement);
    return width;
  }

  /**
   * Encodes and concatenates the given URL parameters into a single query string.
   * @function util.encodeQueryString
   * @param {Object} rawParams An object whose properties represent the URL query string
   * parameters.
   * @return {String} The query string.
   */
  function encodeQueryString(rawParams) {
    var parameter, encodedParams;
    encodedParams = [];
    for (parameter in rawParams) {
      if (rawParams.hasOwnProperty(parameter)) {
        encodedParams.push(encodeURIComponent(parameter) + '=' +
            encodeURIComponent(rawParams[parameter]));
      }
    }
    return '?' + encodedParams.join('&');
  }

  /**
   * Retrieves the value corresponding to the given name from the given query string.
   * (borrowed from http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript)
   * @function util.getQueryStringParameterValue
   * @param {String} queryString The query string containing the parameter.
   * @param {String} name The (non-encoded) name of the parameter value to retrieve.
   * @returns {string} The query string parameter value, or null if the parameter was not found.
   */
  function getQueryStringParameterValue(queryString, name) {
    var regex, results;
    name = encodeURIComponent(name);
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    regex = new RegExp('[\\?&]' + name + '=([^&#]*)', 'i');
    results = regex.exec(queryString);
    return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  /**
   * Sets the CSS transition duration style of the given element.
   * @function util.setTransitionDurationSeconds
   * @param {HTMLElement} element The element.
   * @param {Number} value The duration.
   */
  function setTransitionDurationSeconds(element, value) {
    element.style.transitionDuration = value + 's';
    element.style.WebkitTransitionDuration = value + 's';
    element.style.MozTransitionDuration = value + 's';
    element.style.msTransitionDuration = value + 's';
    element.style.OTransitionDuration = value + 's';
  }

  /**
   * Sets the CSS transition delay style of the given element.
   * @function util.setTransitionDelaySeconds
   * @param {HTMLElement} element The element.
   * @param {Number} value The delay.
   */
  function setTransitionDelaySeconds(element, value) {
    element.style.transitionDelay = value + 's';
    element.style.WebkitTransitionDelay = value + 's';
    element.style.MozTransitionDelay = value + 's';
    element.style.msTransitionDelay = value + 's';
    element.style.OTransitionDelay = value + 's';
  }

  /**
   * Sets the CSS transition-timing-function style of the given element with the given cubic-
   * bezier points.
   * @function util.setTransitionCubicBezierTimingFunction
   * @param {HTMLElement} element The element.
   * @param {{p1x: Number, p1y: Number, p2x: Number, p2y: Number}} bezierPts The cubic-bezier
   * points to use for this timing function.
   */
  function setTransitionCubicBezierTimingFunction(element, bezierPts) {
    var value = 'cubic-bezier(' + bezierPts.p1x + ',' + bezierPts.p1y + ',' + bezierPts.p2x + ',' +
        bezierPts.p2y + ')';
    element.style.transitionTimingFunction = value;
    element.style.WebkitTransitionTimingFunction = value;
    element.style.MozTransitionTimingFunction = value;
    element.style.msTransitionTimingFunction = value;
    element.style.OTransitionTimingFunction = value;
  }

  /**
   * Returns a pseudo-random number between the given lower and upper bounds and according to a
   * uniform distribution.
   * @function util.getRandom
   * @param {Number} lowerBound The lower bound.
   * @param {Number} upperBound The upper bound.
   * @returns {Number} The random number.
   */
  function getRandom(lowerBound, upperBound) {
    return Math.random() * (upperBound - lowerBound) + lowerBound;
  }

  /**
   * Calculates an eased progress value.
   * @function util.getEasedProgress
   * @param {Number} deltaTime The elapsed time since the start.
   * @param {Number} duration The duration.
   * @param {Function} easingFunction The easing function to use.
   * @returns {Number} The eased progress value.
   */
  function getEasedProgress(deltaTime, duration, easingFunction) {
    return easingFunction(deltaTime / duration);
  }

  /**
   * Interpolates the given values using the given weights.
   * @function util.interpolate
   * @param {Number} value1 The first value.
   * @param {Number} value2 The second value.
   * @param {Number} weight1 The weight of the first value.
   * @param {Number} weight2 The weight of the second value.
   * @returns {Number} The interpolated value.
   */
  function interpolate(value1, value2, weight1, weight2) {
    return value1 * weight1 + value2 * weight2;
  }

  // A collection of different types of easing functions.
  var easingFunctions = {
    linear: function (t) {
      return t;
    },
    easeInQuad: function (t) {
      return t * t;
    },
    easeOutQuad: function (t) {
      return t * (2 - t);
    },
    easeInOutQuad: function (t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    easeInCubic: function (t) {
      return t * t * t;
    },
    easeOutCubic: function (t) {
      return 1 + --t * t * t;
    },
    easeInOutCubic: function (t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    easeInQuart: function (t) {
      return t * t * t * t;
    },
    easeOutQuart: function (t) {
      return 1 - --t * t * t * t;
    },
    easeInOutQuart: function (t) {
      return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
    },
    easeInQuint: function (t) {
      return t * t * t * t * t;
    },
    easeOutQuint: function (t) {
      return 1 + --t * t * t * t * t;
    },
    easeInOutQuint: function (t) {
      return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
    }
  };

  /**
   * Gets an easing function by name. Defaults to linear if given an invalid name.
   * @param {String} easingFunctionName The name of an easing function.
   * @returns {Function} The easing function.
   */
  function getEasingFunction(easingFunctionName) {
    return easingFunctions[easingFunctionName] || easingFunctions['linear'];
  }

  /**
   * Removes any children elements from the given parent that have the given class.
   * @function util.removeChildrenWithClass
   * @param {HTMLElement} parent The parent to remove children from.
   * @param {String} className The class to match.
   */
  function removeChildrenWithClass(parent, className) {
    var matchingChildren, i, count;

    matchingChildren = parent.querySelectorAll('.' + className);

    for (i = 0, count = matchingChildren.length; i < count; i++) {
      parent.removeChild(matchingChildren[i]);
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module

  /**
   * Exposes the static util functions.
   * @global
   */
  util = {
    init: init,
    sendRequest: sendRequest,
    loadImageViaXHR: loadImageViaXHR,
    abortXHR: abortXHR,
    dateObjToDateTimeString: dateObjToDateTimeString,
    millisToTimeString: millisToTimeString,
    listenToMultipleForMultiple: listenToMultipleForMultiple,
    createElement: createElement,
    containsClass: containsClass,
    toggleClass: toggleClass,
    getPageOffset: getPageOffset,
    getViewportSize: getViewportSize,
    removeChildIfPresent: removeChildIfPresent,
    addClass: addClass,
    removeClass: removeClass,
    clearClasses: clearClasses,
    getTextWidth: getTextWidth,
    encodeQueryString: encodeQueryString,
    getQueryStringParameterValue: getQueryStringParameterValue,
    setTransitionDurationSeconds: setTransitionDurationSeconds,
    setTransitionDelaySeconds: setTransitionDelaySeconds,
    setTransitionCubicBezierTimingFunction: setTransitionCubicBezierTimingFunction,
    getRandom: getRandom,
    getEasedProgress: getEasedProgress,
    interpolate: interpolate,
    getEasingFunction: getEasingFunction,
    removeChildrenWithClass: removeChildrenWithClass,
    XHR: null,
    listen: null,
    stopListening: null,
    requestFullscreen: null,
    cancelFullScreen: null,
    stopPropogation: null,
    preventDefault: null,
    listenForTransitionEnd: null,
    stopListeningForTransitionEnd: null,
    getScrollTop: null,
    getScrollLeft: null,
    addOnEndFullScreen: null,
    getMidTransitionValue: null,
    addTapEventListener: null,
    removeTapEventListener: null,
    addPointerMoveEventListener: null,
    removePointerMoveEventListener: null,
    revokeObjectURL: null,
    createObjectURL: null,
    isMobileBrowser: false,
    isSmallScreen: false,
    isBrowserCompatible: false
  };

  // Expose this module
  if (!window.app) window.app = {};
  window.app.util = util;

  console.log('util module loaded');
})();
