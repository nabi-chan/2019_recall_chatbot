const Router = require('koa-router');
const user = new Router();
const userCtrl = require('./user.ctrl');

user.get('/getData/:value', userCtrl.getalldata);

module.exports = user;