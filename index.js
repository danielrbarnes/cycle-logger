'use strict';

/**
 * @overview Provides a logging utility for Cycle.js applications.
 * @author Daniel R Barnes
 */

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Logger = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('util');

var _cycleEvents = require('cycle-events');

var _rxjs = require('rxjs');

var _lodash = require('lodash');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var order = ['ALL', 'TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'NONE'],
    baseLevels = (0, _lodash.without)(order, 'NONE', 'ALL');

// UTILITY METHODS

function invalidLevel(level) {
    return !(0, _lodash.isString)(level) || !(0, _lodash.includes)(order, (0, _lodash.upperCase)((0, _lodash.trim)(level)));
}

/**
 * @external Broker
 * @desc The cycle-ready event broker from `cycle-events`.
 */

/**
 * Provides logging functionality to Cycle.js applications.
 * @class Logger
 * @inherits Broker
 * @example
 * var Logger = require('Logger');
 * var logger = new Logger();
 * // Loggers inherit from cycle-events.Broker
 * // you can listen for specific logging levels:
 * logger.on(Logger.Levels.WARN, function(msg) {
 *   logFile.writeLine('warning: %s', msg);
 * });
 * @example
 * // you can also view all messages at or above
 * // a specific logging level:
 * logger.from(Logger.Levels.INFO).subscribe(function onNext(data) {
 *   logFile.writeLine(data.level, data.msg);
 * });
 * logger.error('this will be written to the file');
 * logger.info('this will also be written to the file');
 * logger.debug('this will not be written to the file');
 * @example
 * logger.filter('WARN', 'INFO').subscribe(function onNext(data) {
 *   logFile.writeLine(data.level, data.msg);
 * });
 * logger.warn('this will be written to the file');
 * logger.info('this will also be written to the file');
 * logger.error('this will not be written to the file');
 */

var Logger = exports.Logger = function (_Broker) {
    _inherits(Logger, _Broker);

    function Logger() {
        _classCallCheck(this, Logger);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Logger).apply(this, arguments));
    }

    _createClass(Logger, [{
        key: 'from',


        /**
         * Creates an Observable populated with future logging events at or
         * above the specified logging level.
         * @function Logger#from
         * @param {String} level One of the [built-in logging levels]{@link Logger~Levels}.
         * @example
         * logger.from(Logger.Levels.WARN)
         *   .subscribe(function log(data) {
         *     logFile.writeLine(data.level, data.msg);
         *   });
         * logger.warn('this will be logged');
         * logger.error('this will also be logged');
         * logger.debug('this will NOT be logged');
         */
        value: function from(level) {
            return level === 'NONE' ? _rxjs.Observable.never() : this.filter.apply(this, _toConsumableArray((0, _lodash.without)(order, 'NONE').slice(order.indexOf(level))));
        }

        /**
         * Creates an Observable populated with future logging events
         * matching the specified logging levels.
         * @function Logger#filter
         * @param {String} levels One or more of the [built-in logging levels]{@link Logger~Levels}.
         * @example
         * logger.filter(Logger.Levels.INFO, Logger.Levels.ERROR)
         *   .subscribe(function log(data) {
         *     logFile.writeLine(data.level, data.msg);
         *   });
         * logger.error('this will be logged');
         * logger.warn('this will NOT be logged');
         * logger.debug('this also will NOT be logged');
         * logger.info('this will be logged, too');
         */

    }, {
        key: 'filter',
        value: function filter() {
            var _this2 = this;

            for (var _len = arguments.length, levels = Array(_len), _key = 0; _key < _len; _key++) {
                levels[_key] = arguments[_key];
            }

            levels = (0, _lodash.uniq)((0, _lodash.without)(levels, invalidLevel));
            if ((0, _lodash.includes)(levels, 'NONE')) {
                return _rxjs.Observable.never();
            }
            if ((0, _lodash.includes)(levels, 'ALL')) {
                levels = baseLevels;
            }
            return _rxjs.Observable.merge.apply(_rxjs.Observable, _toConsumableArray(levels.map(function (level) {
                return _rxjs.Observable.fromEvent(_this2, level, function (msg) {
                    return { level: level, msg: msg };
                });
            })));
        }
    }], [{
        key: 'Levels',


        /**
         * @typedef Logger~Levels
         * @type {Object}
         * @desc The available logging levels. In order:
         *  ALL &lt; TRACE &lt; DEBUG &lt; INFO &lt; WARN &lt; ERROR &lt; NONE
         * @property {String} ALL
         * @property {String} TRACE Extremely detailed information, like object dumps.
         * @property {String} DEBUG Detailed information on your program's execution flow.
         * @property {String} INFO Interesting lifecycle events.
         * @property {String} WARN Use of deprecated APIs, 'almost' errors, and other undesirable or unexpected events.
         * @property {String} ERROR Runtime errors and unexpected conditions.
         * @property {String} NONE
         */

        /**
         * @member {Logger~Levels} Logger.Levels
         * @desc An enumeration of logging levels that users can subscribe to. In order:
         *  ALL &lt; TRACE &lt; DEBUG &lt; INFO &lt; WARN &lt; ERROR &lt; NONE
         * @example
         * logger.on(Logger.Levels.WARN, function warningOccurred(msg) { ... });
         * logger.on(Logger.Levels.ERROR, function errorOccurred(msg) { ... });
         */
        get: function get() {
            return (0, _lodash.reduce)(order, function (obj, level) {
                return obj[level] = level, obj;
            }, {});
        }
    }]);

    return Logger;
}(_cycleEvents.Broker);

/**
 * Outputs trace information to any registered listeners.
 * @function Logger#trace
 * @param {*} msg The message string or object to log.
 * @param {*} args The arguments to substitute into the message string.
 *  See node's `util.format` method for more information on formatting.
 */

/**
 * Outputs debug information to any registered listeners.
 * @function Logger#debug
 * @param {*} msg The message string or object to log.
 * @param {*} args The arguments to substitute into the message string.
 *  See node's `util.format` method for more information on formatting.
 */

/**
 * Outputs non-error information to any registered listeners.
 * @function Logger#info
 * @param {*} msg The message string or object to log.
 * @param {*} args The arguments to substitute into the message string.
 *  See node's `util.format` method for more information on formatting.
 */

/**
 * Outputs warnings to any registered listeners.
 * @function Logger#warn
 * @param {*} msg The message string or object to log.
 * @param {*} args The arguments to substitute into the message string.
 *  See node's `util.format` method for more information on formatting.
 */

/**
 * Outputs error information to any registered listeners.
 * @function Logger#error
 * @param {*} msg The message string or object to log.
 * @param {*} args The arguments to substitute into the message string.
 *  See node's `util.format` method for more information on formatting.
 */

(0, _lodash.assign)(Logger.prototype, (0, _lodash.reduce)(baseLevels, function (obj, level) {
    return obj[(0, _lodash.lowerCase)(level)] = function log(msg) {
        for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
        }

        this.emit(level, _util.format.apply(undefined, [(0, _lodash.isUndefined)(msg) ? '' : msg].concat(args)));
    }, obj;
}, {}));
