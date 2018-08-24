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

route.get('/', async ctx => {

    try {

        ctx.set("Content-Type", "text/html");
        let docPath = path.resolve(__dirname, 'doc/openapi.html');
        ctx.response.body = fs.createReadStream(docPath);

    } catch (e) {

        console.log(e);
        ctx.response.status = 500;

    }

});

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

route.get('/token-refresher', async ctx => {

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

        if (e.name === 'JsonWebTokenError')  {
            ctx.response.status = 400;
            ctx.response.body = e.message;
        } else {
            console.log(e);
            ctx.response.status = 500;
        }

    }

});

route.get('/token-verifier', async ctx => {

    try {

        let token = ctx.request.body['token'];

        try {
            jwt.verify(token, publicKey);
            ctx.set("Content-Type", "application/json");
            ctx.response.body = true;
        } catch (e) {
            ctx.set("Content-Type", "application/json");
            ctx.response.body = false;
        }

    } catch (e) {

        console.log(e);
        ctx.response.status = 500;

    }

});

let apiRoute = Router({ prefix: '/api/v1' });
apiRoute.extend(route);

app.use(route.middleware());
app.use(apiRoute.middleware());
let server = http.createServer(app.callback());
server.listen(args.port, args.host)
