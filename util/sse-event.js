'use strict';

var once = require('lodash.once');
var EventSource = require('eventsource');

function sseEvent(eventName) {
    var whenDone, waitMax, es, url;

    function attach() {
        if (waitMax) {
            setTimeout(function() {
                whenDone(new Error('Waited ' + waitMax + 'ms for "' + eventName + '", got nothing'));
            }, waitMax);
        }

        es = new EventSource(url);
        es.addEventListener(eventName, function() {
            whenDone();
        });
        es.addEventListener('error', function() {
            whenDone(new Error('SSE stream closed without encountering "' + eventName + '"-event'));
        });
    }

    var api = {
        from: function(path) {
            url = path.indexOf('/') === 0 ? 'http://localhost:8090' + path : path;
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

module.exports = sseEvent;
