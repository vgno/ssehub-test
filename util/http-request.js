'use strict';

var got = require('got');

module.exports = function httpRequest(path, callback) {
    got(getUrl(path), callback);
};

function getUrl(path) {
    return path.indexOf('/') === 0 ? 'http://localhost:8090' + path : path;
}
