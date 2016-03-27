'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LoggerObservable = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _common = require('./common');

var _rxjs = require('rxjs');

var _lodash = require('lodash');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function formatLevel(level) {
    level = (0, _lodash.upperCase)((0, _lodash.trim)((0, _lodash.toString)(level)));
    if (!(0, _lodash.includes)(_common.order, level)) {
        throw new Error('The specified level is invalid. Valid levels include ' + _common.order.join(', '));
    }
    return level;
}

/**
 * Provides operators for filtering {@link LoggingEvent logging events}.
 * @class LoggerObservable
 * @inherits Observable
 * @example
 * Loggers.asObservable()
 *   .byName('log name')
 *   .map(event => event.message)
 *   .subscribe(msg => file.writeln(msg));
 */

var LoggerObservable = exports.LoggerObservable = function (_Observable) {
    _inherits(LoggerObservable, _Observable);

    function LoggerObservable() {
        _classCallCheck(this, LoggerObservable);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(LoggerObservable).apply(this, arguments));
    }

    _createClass(LoggerObservable, [{
        key: 'lift',
        value: function lift(operator) {
            var o = new LoggerObservable();
            o.source = this;
            o.operator = operator;
            return o;
        }

        /**
         * @function LoggerObservable.byName
         * @param name {String|RegExp} The string or regular expression to use to match
         *  against {@link Logger} names in {@link LoggingEvent}s.
         * @returns {Observable<LoggingEvent>}
         * @example
         * Loggers.asObservable()
         *   .byName('log name')
         *   .map(event => event.message)
         *   .subscribe(msg => file.writeln(msg));
         */

    }, {
        key: 'byName',
        value: function byName(name) {
            if ((0, _lodash.isString)(name)) {
                name = new RegExp(name);
            }
            if (!(0, _lodash.isRegExp)(name)) {
                throw new Error('Parameter `name` must be a string or regular expression.');
            }
            return this.filter(function (event) {
                return !!event.logger.match(name);
            });
        }

        /**
         * @function LoggerObservable.byMinLevel
         * @param level {Loggers~Levels} The minimum level to filter {@link LoggingEvent}s.
         *  Any events at or above this level will be included in the resulting observable.
         * @returns {Observable<LoggingEvent>}
         * @throws The specified level is invalid.
         * @example
         * Loggers.asObservable()
         *   .byMinLevel(Loggers.Levels.WARN)
         *   .subscribe(event => file.writeln(`${event.logger}: ${event.message}`));
         */

    }, {
        key: 'byMinLevel',
        value: function byMinLevel(level) {
            var index = _common.order.indexOf(formatLevel(level));
            return this.filter(function (event) {
                return (0, _lodash.indexOf)(_common.order, event.level) >= index;
            });
        }

        /**
         * @function LoggerObservable.byLevels
         * @param levels {Loggers~Levels[]} One or more levels to filter {@link LoggingEvent}s by.
         * @returns {Observable<LoggingEvent>}
         * @throws The specified level is invalid.
         * @example
         * Loggers.asObservable()
         *   .byLevels(Loggers.Levels.INFO, Loggers.Levels.ERROR)
         *   .map(event => event.message)
         *   .subscribe(msg => file.writeln(msg));
         */

    }, {
        key: 'byLevels',
        value: function byLevels() {
            for (var _len = arguments.length, levels = Array(_len), _key = 0; _key < _len; _key++) {
                levels[_key] = arguments[_key];
            }

            levels = (0, _lodash.map)(levels, formatLevel);
            return this.filter(function (event) {
                return (0, _lodash.includes)(levels, event.level);
            });
        }
    }]);

    return LoggerObservable;
}(_rxjs.Observable);