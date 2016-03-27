'use strict';

import {Subject} from 'rxjs';
import {LoggerObservable} from './LoggerObservable';

export const
    order = ['ALL', 'TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'NONE'],
    events = new Subject(),
    observable = new LoggerObservable(observer => {
        return events.subscribe(observer);
    });
