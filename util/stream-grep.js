'use strict';

var split = require('split');
var once = require('lodash.once');

function streamGrep(stream) {
    var whenDone, grepTerm, waitMax, lines = [];

    function attach() {
        if (waitMax) {
            setTimeout(function() {
                whenDone(new Error('Waited ' + waitMax + 'ms without finding "' + grepTerm + '"'));
            }, waitMax);
        }

        stream.pipe(split()).on('data', function(line) {
            lines.push(line);
            if (line.indexOf(grepTerm) >= 0) {
                whenDone();
            }
        }).on('end', function() {
            //console.log(lines.join('\n'));
            whenDone(new Error('Stream ended without finding "' + grepTerm + '"'));
        });
    }

    var api = {
        find: function(text) {
            grepTerm = text;
            return api;
        },
        waitMax: function(ms) {
            waitMax = ms;
            return api;
        },
        then: function(done) {
            whenDone = once(done);
            attach();
            return api;
        }
    };

    return api;
}

module.exports = streamGrep;
