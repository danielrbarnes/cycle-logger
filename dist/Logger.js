'use strict';

/**
 * @overview Provides logging utilities for Cycle.js applications.
 * @author Daniel R Barnes
 */

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Logger = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('util');

var _lodash = require('lodash');

var _Loggers = require('./Loggers');

var _LoggingEvent = require('./LoggingEvent');

var _common = require('./common');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class Logger
 * @classdesc Provides methods to log information at various {@link Loggers~Levels levels}.
 * @example
 * // show an error:
 * Loggers.get('middleware')
 *   .error('I/O Error: %s', 'Unexpected end of file.')
 * @example
 * // methods can be chained:
 * Loggers.get('my.logger')
 *   .warn('found bad data: %s', input)
 *   .info('MyClass.myMethod: user provided bad data')
 *   .trace();
 */

var Logger = exports.Logger = function () {
    function Logger(name) {
        _classCallCheck(this, Logger);

        if (!(0, _lodash.isString)(name) || (0, _lodash.isEmpty)((0, _lodash.trim)(name))) {
            throw new Error('A name must be specified.');
        }
        this._name = name;
    }

    /**
     * @member {String} Logger#name The unique name of the Logger instance.
     * @readonly
     */


    _createClass(Logger, [{
        key: 'trace',


        /**
         * Outputs trace information to any registered listeners.
         * @function Logger#trace
         * @param {String} msg The message string or object to log.
         * @param {*} args The arguments to substitute into the message string.
         *  See node's `util.format` method for more information on formatting.
         * @returns {Logger} The Logger instance, for chaining.
         */
        value: function trace(msg) {
            var stacks = new Error().stack.split('\n');

            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            stacks.splice(0, 1, _util.format.apply(undefined, [(0, _lodash.toString)(msg)].concat(args)));
            return Logger.log(_Loggers.Loggers.Levels.TRACE, stacks.join('\n'), this.name), this;
        }

        /**
         * Outputs debug information to any registered listeners.
         * @function Logger#debug
         * @param {String} msg The message string or object to log.
         * @param {*} args The arguments to substitute into the message string.
         *  See node's `util.format` method for more information on formatting.
         * @returns {Logger} The Logger instance, for chaining.
         */

    }, {
        key: 'debug',
        value: function debug(msg) {
            for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
            }

            return Logger.log(_Loggers.Loggers.Levels.DEBUG, _util.format.apply(undefined, [(0, _lodash.toString)(msg)].concat(args)), this.name), this;
        }

        /**
         * Outputs non-error information to any registered listeners.
         * @function Logger#info
         * @param {String} msg The message string or object to log.
         * @param {*} args The arguments to substitute into the message string.
         *  See node's `util.format` method for more information on formatting.
         * @returns {Logger} The Logger instance, for chaining.
         */

    }, {
        key: 'info',
        value: function info(msg) {
            for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                args[_key3 - 1] = arguments[_key3];
            }

            return Logger.log(_Loggers.Loggers.Levels.INFO, _util.format.apply(undefined, [(0, _lodash.toString)(msg)].concat(args)), this.name), this;
        }

        /**
         * Outputs warnings to any registered listeners.
         * @function Logger#warn
         * @param {String} msg The message string or object to log.
         * @param {*} args The arguments to substitute into the message string.
         *  See node's `util.format` method for more information on formatting.
         * @returns {Logger} The Logger instance, for chaining.
         */

    }, {
        key: 'warn',
        value: function warn(msg) {
            for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
                args[_key4 - 1] = arguments[_key4];
            }

            return Logger.log(_Loggers.Loggers.Levels.WARN, _util.format.apply(undefined, [(0, _lodash.toString)(msg)].concat(args)), this.name), this;
        }

        /**
         * Outputs error information to any registered listeners.
         * @function Logger#error
         * @param {String} msg The message string or object to log.
         * @param {*} args The arguments to substitute into the message string.
         *  See node's `util.format` method for more information on formatting.
         * @returns {Logger} The Logger instance, for chaining.
         */

    }, {
        key: 'error',
        value: function error(msg) {
            for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
                args[_key5 - 1] = arguments[_key5];
            }

            return Logger.log(_Loggers.Loggers.Levels.ERROR, new Error(_util.format.apply(undefined, [(0, _lodash.toString)(msg)].concat(args))), this.name), this;
        }
    }, {
        key: 'name',
        get: function get() {
            return this._name;
        }

        /**
         * @private
         */

    }], [{
        key: 'log',
        value: function log(level, message, logger) {
            _common.events.next(new _LoggingEvent.LoggingEvent({
                level: level, message: message, logger: logger
            }));
        }
    }]);

    return Logger;
}();