require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const compression = require('compression');
const app = express();

app.use(logger('dev'));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));
// routes
app.use(require('./routes/api.js'));

require('./config')
  .then(() => app.listen(process.env.PORT || 3000))
  .catch((err) => console.error(err));
