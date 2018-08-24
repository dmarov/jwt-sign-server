#!/usr/bin/env node

'use strict';

const args = require('../../lib/args');
const Router = require('koa-better-router');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const TokenGenerator = require('../../lib/token-generator');

let route = Router().loadMethods();

let privateKey = fs.readFileSync(path.resolve(args.privateKey));
let publicKey = fs.readFileSync(path.resolve(args.publicKey));

const params = { algorithm: 'RS512' };
const paramsAcessToken = { expiresIn: args.accessTtl };
const paramsRefreshToken = { expiresIn: args.refreshTtl };

route.get('/', async ctx => {

    try {

        ctx.set("Content-Type", "text/html");
        let docPath = path.resolve(__dirname, '../../doc/api/v1/openapi.html');
        ctx.response.body = fs.createReadStream(docPath);

    } catch (e) {

        console.log(e);
        ctx.response.status = 500;

    }

});

route.get('/generator', async ctx => {

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
        ctx.response.body = e.message;

    }

});

route.get('/refresher', async ctx => {

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

        if (e.name === 'TokenExpiredError') {
            ctx.response.status = 400;
        } else if (e.name === 'JsonWebTokenError' && e.message === 'invalid signature')  {
            ctx.response.status = 400;
        } else {
            console.log(e);
            ctx.response.status = 500;
        }

        ctx.response.body = e.message;

    }

});

route.get('/decoder', async ctx => {

    let token = ctx.request.body['token'];

    try {

        let payload = jwt.verify(token, publicKey);

        ctx.set("Content-Type", "application/json");
        ctx.response.body = payload;

    } catch (e) {

        if (e.name === 'TokenExpiredError') {
            ctx.response.status = 400;
            ctx.response.body = e.message;
        } else if (e.name === 'JsonWebTokenError' && e.message === 'invalid signature') {
            ctx.response.status = 400;
            ctx.response.body = e.message;
        } else if (e.name === 'JsonWebTokenError' && e.message === 'jwt must be provided') {
            ctx.response.status = 400;
            ctx.response.body = e.message;
        } else {
            console.log(e);
            ctx.response.status = 500;
        }

    }

});

module.exports = route;
