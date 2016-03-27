'use strict';

import {Logger} from './Logger';
import {order, observable} from './common';
import {trim, reduce, isEmpty, isString} from 'lodash';

const loggers = new Map();

/**
 * @class Loggers
 * @classdesc Create new {@link Logger} instances or filter logging events
 *  by Logger name or logging level.
 * @example
 * // create a new Logger instance
 * var log = Loggers.get('my.log.name');
 * @example
 * // Logger  instances are singletons. If you create a Logger instance
 * // in one file, you can access it in any other files:
 * // in fileA.js:
 * var log = Loggers.get('my.log.name');
 * // in fileB.js:
 * var log = Loggers.get('my.log.name'); // same Logger instance
 * @example
 * // subscribe to all events output by 'my' loggers:
 * var fileWriter = new FileObservable('my/file/path.log');
 * Loggers.asObservable().byName(/^my/).subscribe(fileWriter);
 * @example
 * // you can also filter by log level:
 * Loggers.asObservable()
 *   .byLevels(Loggers.Levels.INFO, Loggers.Levels.ERROR)
 *   .subscribe(event => log(`${event.level}: [${event.logger}] ${event.message}`));
 * @example
 * // retrieve all logging events:
 * Loggers.asObservable()
 *   .subscribe(event => log(`${event.level}: [${event.logger}] ${event.message}`));
 * @example
 * // combine multiple filters together:
 * Loggers.asObservable()
 *   .byName('my.')
 *   .byMinLevel(Loggers.Levels.WARN)
 *   .subscribe(event => log(`${event.level}: [${event.logger}] ${event.message}`));
 */
export class Loggers {

    /**
     * @typedef Loggers~Levels
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
     * @member {Loggers~Levels} Loggers.Levels
     * @enum
     * @desc An enumeration of logging levels that users can subscribe to. In order:
     *  ALL &lt; TRACE &lt; DEBUG &lt; INFO &lt; WARN &lt; ERROR &lt; NONE
     * @example
     * Loggers.asObservable()
     *   .byLevels(Loggers.Levels.WARN, Loggers.Levels.INFO)
     *   .subscribe(function loggingEventReceived(event) {
     *     myLogFile.writeln(event.toString());
     *   });
     */
    static get Levels() {
        return reduce(order, (obj, level) => {
            return obj[level] = level, obj;
        }, {});
    }

    /**
     * Retrieves the specified {@link Logger} instance, creating one if necessary.
     * @function Loggers.get
     * @param name {String} The name of the {@link Logger} instance to create/retrieve.
     * @returns {Logger} The Logger instance with the specified name.
     * @throws {Error} A name must be specified.
     * @example
     * Loggers.get('my.logger').warn('some warning message');
     */
    static get(name) {
        if (!isString(name) || isEmpty(trim(name))) {
            throw new Error('A name must be specified.');
        }
        name = trim(name);
        if (!loggers.has(name)) {
            loggers.set(name, new Logger(name));
        }
        return loggers.get(name);
    }

    /**
     * Returns a {@link LoggerObservable} instance that can be filtered by Logger name
     * or {@link Loggers~Levels built-in log level}.
     * @function Loggers.asObservable
     * @returns {LoggerObservable}
     * @example
     * Loggers.asObservable()
     *   .byMinLevel(Loggers.Levels.WARN)
     *   .byName('my.logger')
     *   .subscribe(...);
     */
    static asObservable() {
        return observable;
    }

}
