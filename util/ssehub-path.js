'use strict';

var fs = require('fs');
var path = require('path');
var which = require('which');

function resolveSseHubhubPath() {
    var hubPath = process.env.SSEHUB_PATH;

    if (hubPath) {
        try {
            var stats = fs.statSync(hubPath), filePath;
            if (stats.isDirectory()) {
                filePath = path.join(hubPath, 'ssehub');
                hubPath = fs.statSync(filePath).isFile() ? filePath : false;
            }
        } catch(err) {
            hubPath = false;
        }

        if (!hubPath) {
            console.error('Could not find ssehub binary at defined SSEHUB_PATH (' + process.env.SSEHUB_PATH + ')');
            process.exit(1);
        }

        return hubPath;
    }

    try {
        hubPath = which.sync('ssehub');
    } catch (err) {
        console.error('Path to ssehub binary could not be resolved, please define SSEHUB_PATH env var');
        process.exit(1);
    }

    return hubPath;
}

module.exports = resolveSseHubhubPath();
