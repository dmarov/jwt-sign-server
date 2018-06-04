#!/usr/bin/env node

'use strict';

const args = require('./lib/args');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-better-router');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const TokenGenerator = require('./lib/token-generator');
const http = require('http');

let app = new Koa();
let route = Router().loadMethods();

let privateKey = fs.readFileSync(path.resolve(args.privateKey));
let publicKey = fs.readFileSync(path.resolve(args.publicKey));

const params = { algorithm: 'RS512' };
const paramsAcessToken = { expiresIn: args.accessTtl };
const paramsRefreshToken = { expiresIn: args.refreshTtl };

app.use(bodyParser());

route.get('/access-token', async ctx => {

    try {

        const gen = new TokenGenerator(privateKey, publicKey, params);

        let payload = ctx.request.body;

        let accessToken = gen.sign(payload, paramsAcessToken);
        let refreshToken = gen.refresh(accessToken, paramsRefreshToken);

        ctx.set("Content-Type", "application/json");

        ctx.response.body = {
            'accessToken': accessToken,
            'refreshToken': refreshToken,
        };

    } catch (e) {

        console.log(e);
        ctx.response.status = 500;

    }

});

route.get('/refresh-token', async ctx => {

    try {

        const gen = new TokenGenerator(privateKey, publicKey, params);

        let oldRefreshToken = ctx.request.body['refreshToken'];

        let accessToken = gen.refresh(oldRefreshToken, paramsAcessToken);
        let refreshToken = gen.refresh(accessToken, paramsRefreshToken);

        ctx.set("Content-Type", "application/json");
        ctx.response.body = {
            'accessToken': accessToken,
            'refreshToken': refreshToken,
        };

    } catch (e) {

        console.log(e);
        ctx.response.status = 500;

    }

});

let apiRoute = Router({ prefix: '/api/v1' });
apiRoute.extend(route);

app.use(route.middleware());
app.use(apiRoute.middleware());
// app.listen(args.port, args.host);
let server = http.createServer(app.callback());
server.listen(args.port, args.host)
