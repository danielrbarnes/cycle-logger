'use strict';

var expect = require('chai').expect;
var Logger = require('../dist/Logger').Logger;
var Loggers = require('../dist/Loggers').Loggers;
var Observable = require('rxjs').Observable;

describe('Loggers', function() {

    it('has expected static methods', function() {
        expect(Loggers).itself.to.respondTo('get');
        expect(Loggers).itself.to.respondTo('asObservable');
    });

    it('has expected static Levels member', function() {
        expect(Loggers.Levels).to.contain.keys('ALL', 'TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'NONE');
    });

    describe('.get', function() {

        it('throws if non-string provided', function() {
            [
                undefined,
                null,
                NaN,
                123,
                /rx/,
                {},
                new Date(),
                Function.prototype
            ].forEach(function(arg) {
                expect(function() {
                    Loggers.get(arg);
                }).to.throw('A name must be specified.');
            });
        });

        it('throws if empty or whitespace string provided', function() {
            [
                '',
                ' ',
                '   ',
                '     '
            ].forEach(function(arg) {
                expect(function() {
                    Loggers.get(arg);
                }).to.throw('A name must be specified.');
            });
        });

        it('trims provided name', function() {
            expect(Loggers.get(' test   ').name).to.equal('test');
        });

        it('returns Logger instance', function() {
            expect(Loggers.get('test')).to.be.an.instanceof(Logger);
        });

        it('returns previous Logger instance if one exists', function() {
            var instance1 = Loggers.get('new instance'),
                instance2 = Loggers.get('new instance');
            expect(instance1).to.equal(instance2);
        });

    });

    describe('.asObservable', function() {

        it('returns Observable instance', function() {
            expect(Loggers.asObservable()).to.be.an.instanceof(Observable);
        });

        it('returns same Observable instance', function() {
            var obs1 = Loggers.asObservable(),
                obs2 = Loggers.asObservable();
            expect(obs1).to.equal(obs2);
        });

    });

});
