'use strict';

import {
    keys,
    assign,
    extend,
    reduce,
    isString,
    toString
} from 'lodash';

/**
 * @class LoggingEvent
 * @classdesc Represents a single logged entry.
 */
export class LoggingEvent {

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

    constructor(props = {logger: 'unknown', level: 'NONE', message: ''}) {
        assign(this, extend({datetime: Date.now()}, props));
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
    toString(fmt) {
        if (!isString(fmt)) {
            fmt = '%datetime% %level% [%logger%]: %message%';
        }
        return reduce(keys(this), (out, prop) => {
            return out.replace(`%${prop}%`, prop === 'datetime' ?
                new Date(this[prop]).toISOString() : toString(this[prop]));
        }, fmt);
    }

}
