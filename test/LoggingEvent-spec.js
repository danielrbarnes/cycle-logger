'use strict';

var expect = require('chai').expect;
var LoggingEvent = require('../dist/LoggingEvent').LoggingEvent;

describe('LoggingEvent', function() {

    it('has expected properties', function() {
        var le = new LoggingEvent();
        expect(le).to.haveOwnProperty('level');
        expect(le).to.haveOwnProperty('logger');
        expect(le).to.haveOwnProperty('message');
        expect(le).to.haveOwnProperty('datetime');
    });

    describe('.toString', function() {

        it('returns expected result with no format provided', function() {
            expect(new LoggingEvent().toString()).to.match(
                /^\d{4}\-\d{2}\-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z NONE \[unknown\]: $/
            );
        });

        it('uses custom format if one is provided', function() {
            expect(new LoggingEvent({
                level: 'WARN',
                message: 'my message'
            }).toString('%level%: %message%')).to.equal(
                'WARN: my message'
            );
        });

        it('only replaces known property names in custom format', function() {
            expect(new LoggingEvent({
                level: 'ERROR',
                message: 'error message'
            }).toString('%level%: %something% %message%')).to.equal(
                'ERROR: %something% error message'
            );
        });

    });

});
