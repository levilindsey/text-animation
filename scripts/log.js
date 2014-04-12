/**
 * This module defines a constructor for Log objects, which can be used by the modules in this
 * application for descriptive logging.
 * @module log
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var log, params, util, runStartTime, recentEntries;

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * Creates a log entry message with the given parameters, records a copy of the entry, and
   * writes the message out to the console.
   * @function Log~write
   * @param {string} severity A character indicating the type of this log entry.
   * @param {string} methodName The name of the calling method.
   * @param {string} [message] The message for this log entry.
   */
  function write(severity, methodName, message) {
    message =
        '[' + severity + ']; ' + this.moduleName + '.' + methodName + '; ' + (message || '--') +
            '; ' + util.millisToTimeString(getCurrentRunTime());

    // Record each entry in a queue of fixed-size
    recentEntries.push(message);
    if (recentEntries.length > params.LOG.RECENT_ENTRIES_LIMIT) {
      recentEntries.shift();
    }

    console.log(message);
  }

  /**
   * Logs app info--specifically: the name, the current version, the copyright info, and the
   * current date and time.
   * @function Log~writeAppInfo
   * @param {Date} dateObj A Date object representing the start time of the app.
   */
  function writeAppInfo(dateObj) {
    log.i('writeAppInfo', params.APP.TITLE + ' (Version ' + params.APP.VERSION + ')');
    log.i('writeAppInfo', params.APP.LICENSE);
    log.i('writeAppInfo', 'Start time=' + util.dateObjToDateTimeString(dateObj));
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Adds a new VERBOSE log entry. Typically, this type of entry records information that could be
   * helpful for debugging, but is un-important for normal circumstances.
   * @function Log#v
   * @param {string} methodName The name of the calling method.
   * @param {string} [message] The message for this log entry.
   */
  function v(methodName, message) {
    if (params.LOG.VERBOSE) {
      write.call(this, 'V', methodName, message);
    }
  }

  /**
   * Adds a new DEBUG log entry. Typically, this type of entry records information that could be
   * helpful for debugging, but is un-important for normal circumstances.
   * @function Log#d
   * @param {string} methodName The name of the calling method.
   * @param {string} [message] The message for this log entry.
   */
  function d(methodName, message) {
    if (params.LOG.DEBUG) {
      write.call(this, 'D', methodName, message);
    }
  }

  /**
   * Adds a new INFORMATION log entry. Typically, this type of entry records information that
   * could be helpful for debugging, but is un-important for normal circumstances.
   * @function Log#i
   * @param {string} methodName The name of the calling method.
   * @param {string} [message] The message for this log entry.
   */
  function i(methodName, message) {
    write.call(this, 'I', methodName, message);
  }

  /**
   * Adds a new WARNING log entry. Typically, this type of entry records information that could be
   * helpful for debugging, but is un-important for normal circumstances.
   * @function Log#w
   * @param {string} methodName The name of the calling method.
   * @param {string} [message] The message for this log entry.
   */
  function w(methodName, message) {
    write.call(this, 'W', methodName, message);
  }

  /**
   * Adds a new ERROR log entry. Typically, this type of entry records information that could be
   * helpful for debugging, but is un-important for normal circumstances.
   * @function Log#e
   * @param {string} methodName The name of the calling method.
   * @param {string} [message] The message for this log entry.
   * @param {boolean} [forceQuit=false] If true, then close the app after recording this log entry and
   * after uploading an error report.
   */
  function e(methodName, message, forceQuit) {
    write.call(this, 'E', methodName, message);

    // TODO: upload an error report

    if (forceQuit) {
      // TODO: force quit the app
    }
  }

  /**
   * Gets the time (in milliseconds) since the app started.
   * @function Log#getCurrentRunTime
   * @returns {number} The number of milliseconds since the app started.
   */
  function getCurrentRunTime() {
    return Date.now() - runStartTime;
  }

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Initializes some static state for this module.
   * @function Log.initStaticFields
   */
  function initStaticFields() {
    var dateObj = new Date();
    runStartTime = dateObj.getTime();
    params = app.params;
    util = app.util;
    recentEntries = [];
    log = new app.Log('log');
    writeAppInfo(dateObj);
    log.d('initStaticFields', 'Module initialized');
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {string} moduleName The name of the client module using this Log instance.
   */
  function Log(moduleName) {
    return {
      // Public fields
      moduleName: moduleName,

      // Public methods
      v: v,
      d: d,
      i: i,
      w: w,
      e: e,
      getCurrentRunTime: getCurrentRunTime
    };
  }

  // Expose this module
  if (!window.app) window.app = {};
  window.app.Log = Log;
  Log.initStaticFields = initStaticFields;

  console.log('log module loaded');
})();
