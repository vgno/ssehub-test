'use strict';

var os = require('os');
var fs = require('fs');
var path = require('path');
var child = require('child_process');
var merge = require('lodash.merge');
var hubPath = require('../util/ssehub-path');
var grep = require('./stream-grep');

var baseDir = path.resolve(path.join(__dirname, '..'));
var configPath = path.join(baseDir, 'test', 'fixtures', 'configs');

function spawnHub(opts, done) {
    if (typeof opts === 'function') {
        done = opts;
        opts = {};
    } else if (!opts) {
        opts = {};
    }

    var proc = child.spawn(hubPath, [], {
        cwd: opts.cwd || baseDir
    });

    if (opts.config) {
        proc.on('exit', cleanConfig);
    }

    //if (opts.on)

    if (!done) {
        return proc;
    }

    grep(proc.stderr)
        .find('Listening on 0.0.0.0:8090')
        .then(done);

    return proc;
}

spawnHub.withConfig = function(config, opts, done) {
    if (typeof opts === 'function') {
        done = opts;
        opts = {};
    }

    copyConfig(config);
    return spawnHub(merge({
        config: getTestConfigPath(),
        cwd: path.join(os.tmpdir(), 'ssehub')
    }, opts), done);
};

function copyConfig(config) {
    try {
        fs.mkdirSync(path.join(os.tmpdir(), 'ssehub'));
        fs.mkdirSync(path.join(os.tmpdir(), 'ssehub', 'conf'));
    } catch (e) {
        if (e.code !== 'EEXIST') {
            throw e;
        }
    }

    var content = fs.readFileSync(path.join(configPath, config));
    fs.writeFileSync(getTestConfigPath(), content);
}

function getTestConfigPath() {
    return path.join(os.tmpdir(), 'ssehub', 'conf', 'config.json');
}

function cleanConfig() {
    var file = getTestConfigPath();
    fs.unlinkSync(file);
    fs.rmdirSync(path.dirname(file));
    fs.rmdirSync(path.dirname(path.dirname(file)));
}

module.exports = spawnHub;
