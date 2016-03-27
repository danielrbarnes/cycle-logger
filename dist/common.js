'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.observable = exports.events = exports.order = undefined;

var _rxjs = require('rxjs');

var _LoggerObservable = require('./LoggerObservable');

var order = exports.order = ['ALL', 'TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'NONE'],
    events = exports.events = new _rxjs.Subject(),
    observable = exports.observable = new _LoggerObservable.LoggerObservable(function (observer) {
    return events.subscribe(observer);
});