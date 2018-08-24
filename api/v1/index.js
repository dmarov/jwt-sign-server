'use strict';

const Router = require('koa-better-router');

const jwtSignServer = require('./jwt-sign-server');

const routes = Router();

routes.extend(jwtSignServer);

module.exports = routes;

