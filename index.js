#!/usr/bin/env node

'use strict';

const config = require('./lib/Config');
const Koa = require('koa');
const Router = require('koa-better-router');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

let app = new Koa();
let route = Router().loadMethods();

route.get('/auth-token', ctx => {

    try {

        let data = { permissions: ['write'] };
        let secret = fs.readFileSync(path.resolve(config.privateKeyPath));
        let params = { algorithm: 'RS512', expiresIn: config.tokenExpiresIn };

        let token = jwt.sign(data, secret, params);
        ctx.body = { token: token };

    } catch (e) {

        ctx.body = {};

    }

});

let apiRoute = Router({ prefix: '/api/v1' });
apiRoute.extend(route);

app.use(apiRoute.middleware());
app.listen(config.port);
