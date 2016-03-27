'use strict';

var expect = require('chai').expect;
var Subject = require('rxjs').Subject;
var Loggers = require('../dist/Loggers').Loggers;
var LoggingEvent = require('../dist/LoggingEvent').LoggingEvent;
var LoggerObservable = require('../dist/LoggerObservable').LoggerObservable;

describe('LoggerObservable', function() {

    beforeEach(function() {
        var self = this;
        this.subject = new Subject();
        this.observable = new LoggerObservable(function(observer) {
            self.subject.subscribe(observer);
        });
    });

    describe('.byName', function() {

        it('works with string', function() {
            var callCount = 0;
            this.observable.byName('logger')
                .subscribe(function(event) {
                    callCount++;
                    expect(event.logger).to.match(/logger/);
                });
            expect(callCount).to.equal(0);
            this.subject.next({logger: 'log name'}); // does not match
            expect(callCount).to.equal(0);
            this.subject.next({logger: 'logger name'}); // matches
            expect(callCount).to.equal(1);
            this.subject.next({logger: 'my logger'}); // matches
            expect(callCount).to.equal(2);
            this.subject.next({logger: 'my log'}); // does not match
            expect(callCount).to.equal(2);
        });

        it('works with regular expression', function() {
            var callCount = 0;
            this.observable.byName(/logger/)
                .subscribe(function(event) {
                    callCount++;
                    expect(event.logger).to.match(/logger/);
                });
            expect(callCount).to.equal(0);
            this.subject.next({logger: 'log name'}); // does not match
            expect(callCount).to.equal(0);
            this.subject.next({logger: 'logger name'}); // matches
            expect(callCount).to.equal(1);
            this.subject.next({logger: 'my logger'}); // matches
            expect(callCount).to.equal(2);
            this.subject.next({logger: 'my log'}); // does not match
            expect(callCount).to.equal(2);
        });

        it('throws if not a string or regexp', function() {
            var self = this;
            [
                null,
                undefined,
                NaN,
                new Date(),
                {},
                Function.prototype
            ].forEach(function(arg) {
                expect(function() {
                    self.observable.byName(arg);
                }).to.throw('Parameter `name` must be a string or regular expression.');
            });
        });

        it('returns observable of LoggingEvents', function() {
            Loggers.asObservable().byName(/log/)
                .subscribe(function(event) {
                    expect(event).to.be.an.instanceof(LoggingEvent);
                    expect(event).to.have.all.keys(['logger', 'level', 'message', 'datetime']);
                });
            Loggers.get('my logger').warn('warning message');
        });

        it('LoggingEvents are only for matching logger names', function(done) {
            Loggers.asObservable().byName(/log/)
                .subscribe(done.fail);
            Loggers.get('does not match').warn('warning message');
            done();
        });

    });

    describe('.byMinLevel', function() {

        it('throws if level not valid', function() {
            var self = this;
            expect(function() {
                self.observable.byMinLevel('DNE');
            }).to.throw(/The specified level is invalid./);
        });

        it('returns observable of LoggingEvents', function() {
            Loggers.asObservable().byMinLevel(Loggers.Levels.INFO)
                .subscribe(function(event) {
                    expect(event).to.be.an.instanceof(LoggingEvent);
                    expect(event).to.have.all.keys(['logger', 'level', 'message', 'datetime']);
                });
            Loggers.get('my logger').warn('warning message');
        });

        it('LoggingEvents are only at or above specified level', function() {
            var callCount = 0;
            Loggers.asObservable().byMinLevel(Loggers.Levels.WARN)
                .subscribe(function(event) {
                    callCount++;
                    expect(event.level).to.be.oneOf(['WARN', 'ERROR']);
                });
            Loggers.get('my logger')
                .warn('warning message')
                .info('info message')
                .debug('debug message')
                .error('error message');
            expect(callCount).to.equal(2);
        });

    });

    describe('.byLevels', function() {

        it('throws if any level not valid', function() {
            var self = this;
            expect(function() {
                self.observable.byLevels(Loggers.Levels.WARN, 'DNE', Loggers.Levels.INFO);
            }).to.throw(/The specified level is invalid./);
        });

        it('returns observable of LoggingEvents', function() {
            Loggers.asObservable().byLevels(Loggers.Levels.INFO, Loggers.Levels.WARN)
                .subscribe(function(event) {
                    expect(event).to.be.an.instanceof(LoggingEvent);
                    expect(event).to.have.all.keys(['logger', 'level', 'message', 'datetime']);
                });
            Loggers.get('my logger').warn('warning message');
        });

        it('LoggingEvents are only for specified levels', function() {
            var callCount = 0;
            Loggers.asObservable().byLevels(Loggers.Levels.INFO, Loggers.Levels.WARN)
                .subscribe(function(event) {
                    callCount++;
                    expect(event.level).to.be.oneOf(['INFO', 'WARN']);
                });
            Loggers.get('my logger')
                .warn('warning message')
                .info('info message')
                .error('error message')
                .debug('debug message');
            expect(callCount).to.equal(2);
        });

    });

});
