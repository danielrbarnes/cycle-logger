'use strict';

import {order} from './common';
import {Observable} from 'rxjs';
import {
    map,
    trim,
    indexOf,
    includes,
    isRegExp,
    isString,
    toString,
    upperCase
} from 'lodash';

function formatLevel(level) {
    level = upperCase(trim(toString(level)));
    if (!includes(order, level)) {
        throw new Error(`The specified level is invalid. Valid levels include ${order.join(', ')}`);
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
export class LoggerObservable extends Observable {

    lift(operator) {
        const o = new LoggerObservable();
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
    byName(name) {
        if (isString(name)) {
            name = new RegExp(name);
        }
        if (!isRegExp(name)) {
            throw new Error('Parameter `name` must be a string or regular expression.');
        }
        return this.filter(event => !!event.logger.match(name));
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
    byMinLevel(level) {
        let index = order.indexOf(formatLevel(level));
        return this.filter(event => indexOf(order, event.level) >= index);
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
    byLevels(...levels) {
        levels = map(levels, formatLevel);
        return this.filter(event => includes(levels, event.level));
    }

}
