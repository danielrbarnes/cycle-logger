'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LoggingEvent = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class LoggingEvent
 * @classdesc Represents a single logged entry.
 */

var LoggingEvent = exports.LoggingEvent = function () {

    /**
     * @member {String} LoggingEvent#logger The name of the {@link Logger} instance that recorded this event.
     */

    /**
     * @member {String} LoggingEvent#message The message logged.
     */

    /**
     * @member {Number} LoggingEvent#datetime The epoch time (number of milliseconds since 1/1/1970 UTC).
     */

    /**
     * @member {Loggers~Levels} LoggingEvent#level The level the event was logged at.
     */

    function LoggingEvent() {
        var props = arguments.length <= 0 || arguments[0] === undefined ? { logger: 'unknown', level: 'NONE', message: '' } : arguments[0];

        _classCallCheck(this, LoggingEvent);

        (0, _lodash.assign)(this, (0, _lodash.extend)({ datetime: Date.now() }, props));
    }

    /**
     * Converts the LoggingEvent instance to a formatted string. You can provide
     *
     * @function LoggingEvent#toString
     * @param [fmt='%datetime% %level [%logger%]: %message%'] {String} The string containing
     *  the tokens you wish to replace with the instance values.
     * @returns {String} A formatted string.
     * @example
     * // using built-in formatting:
     * Loggers.asObservable()
     *   .subscribe(event => file.writeln(event.toString()));
     * @example
     * // using custom formatting:
     * let format = '[%datetime] %level%: %message%';
     * Loggers.asObservable()
     *   .byName('my.logger')
     *   .subscribe(event => file.writeln(event.toString(format)));
     */


    _createClass(LoggingEvent, [{
        key: 'toString',
        value: function toString(fmt) {
            var _this = this;

            if (!(0, _lodash.isString)(fmt)) {
                fmt = '%datetime% %level% [%logger%]: %message%';
            }
            return (0, _lodash.reduce)((0, _lodash.keys)(this), function (out, prop) {
                return out.replace('%' + prop + '%', prop === 'datetime' ? new Date(_this[prop]).toISOString() : (0, _lodash.toString)(_this[prop]));
            }, fmt);
        }
    }]);

    return LoggingEvent;
}();