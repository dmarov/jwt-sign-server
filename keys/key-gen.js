#!/usr/bin/env node
'use strict';

const fs = require('fs');
const minimist = require('minimist');
const exec = require('child_process').exec;

const argv = minimist(process.argv.slice(2));

let privateKeyPath = argv['priv'] ? argv['priv'] : 'private.key';
let publicKeyPath = argv['pub'] ? argv['pub'] : 'public.key';

exec(`openssl genrsa -out ${privateKeyPath} 2048`, _ => {

    exec(`openssl rsa -in ${privateKeyPath} -pubout -out ${publicKeyPath}`); 

});
