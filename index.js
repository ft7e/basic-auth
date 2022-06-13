'use strict';
require('dotenv').config();
const server = require('./src/server');
const { db } = require('./src/models/index.model');
const PORT = process.env.PORT || 3010;

db.sync()
  .then(() => {
    server.start(PORT);
  })
  .catch(console.error);
