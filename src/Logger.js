'use strict';

/**
 * @overview Provides a logging utility for Cycle.js applications.
 * @author Daniel R Barnes
 */

import {format} from 'util';
import {Broker} from 'cycle-events';
import {Observable} from 'rxjs';

import {
    isString,
    isEmpty,
    without,
    reduce,
    keys,
    bind,
    trim,
    uniq,
    assign,
    includes,
    upperCase,
    lowerCase
} from 'lodash';

const order = ['ALL', 'TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'NONE'],
      baseLevels = without(order, 'NONE', 'ALL');

// UTILITY METHODS

function invalidLevel(level) {
    return !isString(level) ||
        !includes(order, upperCase(trim(level)));
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
export class Logger extends Broker {

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
    static get Levels() {
        return reduce(order, (obj, level) => {
            return obj[level] = level, obj;
        }, {});
    }

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
    from(level) {
        if (level === 'NONE') {
            return Observable.never();
        }
        let levels = without(order, 'NONE')
            .slice(order.indexOf(level));
        return this.filter(...levels);
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
    filter(...levels) {
        levels = uniq(without(levels, invalidLevel));
        if (includes(levels, 'NONE')) {
            levels = Array.prototype;
        }
        if (includes(levels, 'ALL')) {
            levels = baseLevels;
        }
        return Observable.merge(...levels.map((level) =>
            Observable.fromEvent(this, level, function(msg) {
                return {level, msg};
            })));
    }

}

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

assign(Logger.prototype, reduce(baseLevels, (obj, level) => {
    return obj[lowerCase(level)] = function log(msg, ...args) {
        this.emit(level, format(msg === undefined ? '' : msg, ...args));
    }, obj;
}, {}));
