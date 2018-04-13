#!/usr/bin/env node

'use strict';

const config = require('./lib/Config');
const Koa = require('koa');
const jsonBody = require('koa-json-body');
const Router = require('koa-better-router');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

let app = new Koa();
let route = Router().loadMethods();

let secret = fs.readFileSync(path.resolve(config.privateKeyPath));
let params = { algorithm: 'RS512', expiresIn: config.tokenExpiresIn };

app.use(jsonBody({fallback: true}));

// should get user name from server


route.get('/authorization-token', async ctx => {

    try {

        let data = ctx.request.body;
        let token = jwt.sign(data, secret, params);
        ctx.response.body = { 'authorization-token': token };

    } catch (e) {

        ctx.response.status = 500;

    }

});

let apiRoute = Router({ prefix: '/api/v1' });
apiRoute.extend(route);

app.use(apiRoute.middleware());
app.listen(config.port);
