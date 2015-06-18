'use strict';

var ary = require('lodash.ary');
var spawnHub = require('../util/spawn-hub');
var sseEvent = require('../util/sse-event');
var httpRequest = require('../util/http-request');

describe('connect', function() {
    var proc;

    beforeEach(function(done) {
        proc = spawnHub(done);
    });

    afterEach(function(done) {
        if (proc) {
            proc.on('close', ary(done, 0));
            proc.kill();
        }
    });

    it('allows connections on defined sse channel', function(done) {
        sseEvent('open').from('/sse').waitMax(100).then(done);
    });

    it('disallows connections on undefined sse channel', function(done) {
        httpRequest('/blah', function(err) {
            if (!err || err.code !== 404) {
                return done(new Error(
                    'Request to undefined sse channel should give 404 - got ' +
                    (err && err.code ? err.code : err.message)
                ));
            }

            done();
        });
    });
});

