'use strict';

var _ = require('lodash');
var expect = require('chai').expect;
var Logger = require('../index').Logger;
var Observable = require('rxjs').Observable;

function multiLevelTest(logger, which, methods, counts, levels) {
    var callCount = 0;
    logger[which].apply(logger, levels)
        .subscribe(function onNext() {
            callCount++;
        });
    expect(callCount).to.equal(counts[0]);
    _.forEach(methods, function(method, index) {
        logger[method]();
        expect(callCount).to.equal(counts[index + 1]);
    });
    expect(callCount).to.equal(counts.pop());
}

describe('Logger', function() {

    /* jshint -W030 */

    it('returns function', function() {
        expect(Logger).to.be.a('function');
    });

    it('creates separate instances', function() {
        expect(new Logger()).not.to.equal(new Logger());
    });

    it('has static Levels member', function() {
        expect(Logger.Levels).not.to.be.undefined;
        expect(Logger.Levels.ALL).to.equal('ALL');
    });

    describe('> instance', function() {

        beforeEach(function createInstance() {
            this.logger = new Logger();
        });

        it('does not provide static Level member', function() {
            expect(this.logger.Levels).to.be.undefined;
        });

        it('has expected log methods', function() {
            var logger = this.logger;
            expect(logger.all).to.be.undefined;
            expect(logger.none).to.be.undefined;
            _.forEach(_.without(Logger.Levels, 'ALL', 'NONE'), function(level) {
                expect(logger[level.toLowerCase()]).to.be.a('function');
            });
        });

        it('has expected observable methods', function() {
            expect(this.logger.from).to.be.a('function');
            expect(this.logger.filter).to.be.a('function');
        });

        describe('.filter', function() {

            it('accepts single level', function() {
                expect(this.logger.filter('ALL')).to.be.defined;
            });

            it('accepts multiple levels', function() {
                expect(this.logger.filter('INFO', 'ERROR')).to.be.defined;
            });

            it('accepts array of levels', function() {
                expect(this.logger.filter(['INFO', 'WARN'])).to.be.defined;
            });

            it('returns Observable', function() {
                expect(this.logger.filter('ALL').subscribe).to.be.a('function');
            });

            it('ignores invalid levels', function() {
                expect(this.logger.filter('DNE')).to.be.defined;
            });

            it('ignores duplicate levels', function() {
                multiLevelTest(this.logger, 'filter', ['warn'], [0, 1], ['WARN', 'WARN']);
            });

            it('ALL returns all entries', function() {
                multiLevelTest(this.logger, 'filter', ['warn', 'info', 'debug', 'error'], [0, 1, 2, 3, 4], ['ALL']);
            });

            it('NONE returns no entries', function() {
                multiLevelTest(this.logger, 'filter', ['warn', 'info', 'debug', 'error'], [0, 0, 0, 0, 0], ['NONE']);
            });

            it('NONE and ALL defaults to NONE', function() {
                multiLevelTest(this.logger, 'filter', ['warn', 'info', 'debug', 'error'], [0, 0, 0, 0, 0], ['NONE', 'ALL']);
            });

            it('only shows messages at specified level', function() {
                multiLevelTest(this.logger, 'filter', ['warn', 'error', 'debug'], [0, 0, 1, 1], ['ERROR']);
            });

            it('passes level and message to subscribers', function() {
                this.logger.filter('INFO').subscribe(function onNext(data) {
                    expect(data.level).to.equal('INFO');
                    expect(data.msg).to.be.a('string');
                    expect(data.msg).to.equal('test message');
                });
                this.logger.info('test message');
            });

            it('formats message strings', function() {
                this.logger.filter('INFO')
                    .subscribe(function onNext(data) {
                        expect(data.msg).to.be.a('string');
                        expect(data.msg).to.equal('Hello, world: 123');
                    });
                this.logger.info('Hello, %s: %d', 'world', 123);
            });

            it('formats message objects', function() {
                this.logger.filter('INFO')
                    .subscribe(function onNext(data) {
                        expect(data.msg).to.be.a('string');
                        expect(data.msg).to.equal('{ a: \'b\', c: [Function: d] }');
                    });
                this.logger.info({a: 'b', c: function d() {}});
            });

        });

        describe('.from', function() {

            it('returns Observable', function() {
                expect(this.logger.from().subscribe).to.be.a('function');
            });

            it('ALL shows all messages', function() {
                multiLevelTest(this.logger, 'from', ['trace', 'debug', 'warn', 'info', 'error'], [0, 1, 2, 3, 4, 5], ['ALL']);
            });

            it('NONE shows no messages', function() {
                multiLevelTest(this.logger, 'from', ['trace', 'debug', 'warn', 'info', 'error'], [0, 0, 0, 0, 0, 0], ['NONE']);
            });

            it('WARN shows WARN and ERROR but not INFO', function() {
                multiLevelTest(this.logger, 'from', ['trace', 'debug', 'warn', 'info', 'error'], [0, 0, 0, 1, 1, 2], ['WARN']);
            });

        });

    });

});
