#!/usr/bin/env node

'use strict';

const config = require('./lib/Config');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-better-router');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const TokenGenerator = require('./lib/token-generator');

let app = new Koa();
let route = Router().loadMethods();

let privateKey = fs.readFileSync(path.resolve(config.privateKeyPath));
let publicKey = fs.readFileSync(path.resolve(config.publicKeyPath));

const params = { algorithm: 'RS512' };
const paramsAcessToken = { expiresIn: config.accessTokenExpiresIn };
const paramsRefreshToken = { expiresIn: config.refreshTokenExpiresIn };

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
app.listen(config.port);
