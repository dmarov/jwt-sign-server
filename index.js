#!/usr/bin/env node

'use strict';

const Koa = require('koa');
const Router = require('koa-better-router');
const fs = require('fs');
const jwt = require('jsonwebtoken');

let app = new Koa();
let route = Router().loadMethods();

const HOSTNAME = '127.0.0.1';
const PORT = 3002;

route.get('/auth-token', ctx => {

    try {

        let secret = fs.readFileSync('keys/private.key');
        let token = jwt.sign({ permissions: ['write'] }, secret, { algorithm: 'RS512', expiresIn: '24h' });
        ctx.body = { token: token };

    } catch (e) {

        ctx.body = {};

    }

});

let apiRoute = Router({ prefix: '/api/v1' });
apiRoute.extend(route);

app.use(apiRoute.middleware());
app.listen(PORT);
