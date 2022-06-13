'use strict';

const express = require('express');
const { User } = require('../models/index.model');
const base64 = require('base-64');
const bcrypt = require('bcrypt');
const login = require('../middleware/login.middleware');
const userRouter = express.Router();

// all Routes
userRouter.post('/signup', signup);
userRouter.post('/signin', signin);
userRouter.get('/hey', login, hey);

//functions
async function signup(req, res) {
  try {
    let username = req.body.username;
    let password = await bcrypt.hash(req.body.password, 10);

    const sentData = await User.create({
      username: username,
      password: password,
    });
    res.status(201).json(sentData);
  } catch (e) {
    console.log('signup Error, ', e);
  }
}

async function signin(req, res) {
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
        res.status(200).json(matchingUsername);
      } else {
        res.status(500).send('Wrong credintials');
      }
    } catch (e) {
      console.log('Error signing in, ', e);
    }
  }
}
function hey(req, res) {
  res.status(200).send('HAH IT WORKED WELCOME');
}

module.exports = userRouter;
