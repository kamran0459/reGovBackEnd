'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const logger = require('morgan');
const db = require('./core/api/client/sequelize')('mysql://root@localhost:3306/regov');
require('./lib/models').init(db);
const router = require('./router');
// const authUser = require('./lib/auth/user');
const _ = require('lodash');

let app = express();
global.appDir = __dirname;

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.static('public'));

app.options({
  origin: '*',
  credentials: true }, cors());
app.use(cors());
app.use(fileUpload());

app.use('/API', router);

module.exports = app;
