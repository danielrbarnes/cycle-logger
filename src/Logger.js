'use strict';

/**
 * @overview Provides logging utilities for Cycle.js applications.
 * @author Daniel R Barnes
 */

import {format} from 'util';
import {trim, isEmpty, isString, toString} from 'lodash';

import {Loggers} from './Loggers';
import {LoggingEvent} from './LoggingEvent';
import {events} from './common';

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
export class Logger {

    constructor(name) {
        if (!isString(name) || isEmpty(trim(name))) {
            throw new Error('A name must be specified.');
        }
        this._name = name;
    }

    /**
     * @member {String} Logger#name The unique name of the Logger instance.
     * @readonly
     */
    get name() {
        return this._name;
    }

    /**
     * @private
     */
    static log(level, message, logger) {
        events.next(new LoggingEvent({
            level, message, logger
        }));
    }

    /**
     * Outputs trace information to any registered listeners.
     * @function Logger#trace
     * @param {String} msg The message string or object to log.
     * @param {*} args The arguments to substitute into the message string.
     *  See node's `util.format` method for more information on formatting.
     * @returns {Logger} The Logger instance, for chaining.
     */
    trace(msg, ...args) {
        var stacks = new Error().stack.split('\n');
        stacks.splice(0, 1, format(toString(msg), ...args));
        return Logger.log(
            Loggers.Levels.TRACE,
            stacks.join('\n'),
            this.name
        ), this;
    }

    /**
     * Outputs debug information to any registered listeners.
     * @function Logger#debug
     * @param {String} msg The message string or object to log.
     * @param {*} args The arguments to substitute into the message string.
     *  See node's `util.format` method for more information on formatting.
     * @returns {Logger} The Logger instance, for chaining.
     */
    debug(msg, ...args) {
        return Logger.log(
            Loggers.Levels.DEBUG,
            format(toString(msg), ...args),
            this.name
        ), this;
    }

    /**
     * Outputs non-error information to any registered listeners.
     * @function Logger#info
     * @param {String} msg The message string or object to log.
     * @param {*} args The arguments to substitute into the message string.
     *  See node's `util.format` method for more information on formatting.
     * @returns {Logger} The Logger instance, for chaining.
     */
    info(msg, ...args) {
        return Logger.log(
            Loggers.Levels.INFO,
            format(toString(msg), ...args),
            this.name
        ), this;
    }

    /**
     * Outputs warnings to any registered listeners.
     * @function Logger#warn
     * @param {String} msg The message string or object to log.
     * @param {*} args The arguments to substitute into the message string.
     *  See node's `util.format` method for more information on formatting.
     * @returns {Logger} The Logger instance, for chaining.
     */
    warn(msg, ...args) {
        return Logger.log(
            Loggers.Levels.WARN,
            format(toString(msg), ...args),
            this.name
        ), this;
    }

    /**
     * Outputs error information to any registered listeners.
     * @function Logger#error
     * @param {String} msg The message string or object to log.
     * @param {*} args The arguments to substitute into the message string.
     *  See node's `util.format` method for more information on formatting.
     * @returns {Logger} The Logger instance, for chaining.
     */
    error(msg, ...args) {
        return Logger.log(
            Loggers.Levels.ERROR,
            new Error(format(toString(msg), ...args)),
            this.name
        ), this;
    }

}
