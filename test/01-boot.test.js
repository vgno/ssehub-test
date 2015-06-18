'use strict';

var assert = require('assert');
var spawnHub = require('../util/spawn-hub');
var grep = require('../util/stream-grep');
var ary = require('lodash.ary');

describe('boot', function() {
    var proc;

    beforeEach(function() {
        proc = null;
    });

    afterEach(function(done) {
        if (proc) {
            proc.on('close', ary(done, 0));
            proc.kill();
        }
    });

    it('can boot with no arguments', function(done) {
        proc = spawnHub();
        grep(proc.stderr)
            .find('Listening on 0.0.0.0:8090')
            .waitMax(100)
            .then(done);
    });

    [['not JSON', 'invalid-not-json'], ['wrong JSON data type', 'invalid-json']].forEach(function(test) {
        it('gives helpful message on invalid configuration (' + test[0] + ')', function(done) {
            proc = spawnHub.withConfig(test[1] + '.json');
            proc.on('exit', function(exitCode) {
                assert.equal(exitCode, 1, 'exit code should be 1');
            });

            grep(proc.stderr)
                .find('Failed to parse config file')
                .waitMax(100)
                .then(done);
        });
    });
});

