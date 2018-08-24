#!/usr/bin/env node

'use strict';

const args = require('./lib/args');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-better-router');
const http = require('http');
const apiV1 = require('./api/v1');

let app = new Koa();

app.use(bodyParser());

let apiRoute = Router({ prefix: '/api/v1' });
apiRoute.extend(apiV1);

app.use(apiV1.middleware());
app.use(apiRoute.middleware());
let server = http.createServer(app.callback());
server.listen(args.port, args.host)
