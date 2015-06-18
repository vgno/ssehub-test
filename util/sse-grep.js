'use strict';

var once = require('lodash.once');
var EventSource = require('eventsource');

function sseGrep(path) {
    var whenDone, grepTerm, waitMax, es;
    var url = path.indexOf('/') === 0 ? 'http://localhost:8090' + path : path;

    function attach() {
        if (waitMax) {
            setTimeout(function() {
                es.close();
                whenDone(new Error('Waited ' + waitMax + 'ms without finding "' + grepTerm + '"'));
            }, waitMax);
        }

        es = new EventSource(url);
        es.addEventListener('message', function(msg) {
            if (msg.data.indexOf(grepTerm) >= 0) {
                es.close();
                whenDone();
            }
        }).on('error', function() {
            es.close();
            whenDone(new Error('SSE stream ended without finding "' + grepTerm + '"'));
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

module.exports = sseGrep;
