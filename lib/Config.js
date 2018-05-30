'use strict';

const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const minimist = require('minimist');

class Config {

    constructor() {

        this.port = 3002;
        this.privateKeyPath = 'keys/private.key';
        this.publicKeyPath = 'keys/public.key';
        this.accessTokenExpiresIn = '2m';
        this.refreshTokenExpiresIn = '30 days';

    }

}

let argv = minimist(process.argv.slice(2));
let fileData = {};
let config = new Proxy(new Config, {

    set(target, prop, value) {

        let letter = prop[0].toUpperCase();
        let newProp = prop.replace(/^./, letter);
        let method = `set${newProp}`;

        if (target[method]) {

            target[method](value);

        } else {

            target[prop] = value;

        }

        return true;

    }

});

if (argv.config) {

    let buffer = fs.readFileSync(path.resolve(argv.config), 'utf8');
    fileData = yaml.load(buffer);

}

Object.assign(config, fileData, argv);
module.exports = config;
