'use strict';

var expect = require('chai').expect;
var Logger = require('../dist/Logger').Logger;

describe('Logger', function() {

    it('has static log method', function() {
        expect(Logger).itself.to.respondTo('log');
    });

    it('throws if name not provided', function() {
        expect(function() {
            new Logger();
        }).to.throw('A name must be specified.');
    });

    it('has name property', function() {
        expect(new Logger('test name').name).to.equal('test name');
    });

    it('name property is readonly', function() {
        expect(function() {
            new Logger('test').name = 'readonly';
        }).to.throw();
    });

    ['trace', 'debug', 'info', 'warn', 'error'].forEach(function(level) {

        describe('.' + level, function() {

            it('calls static log method', function() {
                var orig = Logger.log;
                Logger.log = function spy(lvl, message, logger) {
                    expect(lvl).to.equal(level.toUpperCase());
                    expect(
                        message.message ||
                        message.split('\n').shift() ||
                        message
                    ).to.equal('test message');
                    expect(logger).to.equal('logger name');
                };
                new Logger('logger name')[level]('test message');
                Logger.log = orig;
            });

            it('returns Logger instance for chaining', function() {
                expect(new Logger('test')[level]()).to.be.an.instanceof(Logger);
            });

            if (level === 'error') {

                it('turns message into Error instance', function() {
                    var orig = Logger.log;
                    Logger.log = function spy(lvl, message) {
                        expect(message).to.be.an.instanceof(Error);
                    };
                    new Logger('test').error('test message');
                    Logger.log = orig;
                });

            } else if (level === 'trace') {

                it('includes stack trace with message', function() {
                    var orig = Logger.log;
                    Logger.log = function spy(lvl, message) {
                        expect(message.split('\n').some(function(line) {
                            return line.indexOf('Logger-spec') !== -1;
                        })).to.equal(true);
                    };
                    new Logger('test').trace('test message');
                    Logger.log = orig;
                });

            }

        });

    });

});
