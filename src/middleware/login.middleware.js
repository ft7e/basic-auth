'use strict';
const bcrypt = require('bcrypt');
const base64 = require('base-64');
const { User } = require('../models/index.model');
module.exports = async (req, res, next) => {
  if (req.headers.authorization) {
    let basicHeaderPart = req.headers.authorization.split(' ');
    let encoded = basicHeaderPart[1];
    let decoded = base64.decode(encoded);
    let [username, password] = decoded.split(':');
    try {
      const matchingUsername = await User.findOne({
        where: { username: username },
      });
      const matchingPassword = await bcrypt.compare(
        password,
        matchingUsername.password
      );
      if (matchingPassword) {
        next();
      } else {
        res.status(403).send('HAH WRONG PASSWORD');
        res.end();
      }
    } catch (e) {
      res.status(403).send('HAH WRONG USERNAME');
      res.end();
    }
  }
};
