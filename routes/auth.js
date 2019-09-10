'use strict';

const { Router } = require('express');
const router = Router();
const User = require('./../models/user');
const bcrypt = require('bcryptjs');


router.get('/sign-up', (req, res, next) => {
  res.render('auth/sign-up');
});

router.post('/sign-up', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  bcrypt.hash(password, 10)
    .then(hash => {
      return User.create({
        name,
        email,
        passwordHash: hash
      });
    })
    .then(user => {
      req.session.user =  user;
      // console.log(user);
      res.redirect('/private');
    })
    .catch(error => {
      console.log('There was an error in the sign up process.', error);
    });
});

router.get('/sign-in', (req, res, next) => {
  res.render('auth/sign-in');
});

router.post('/sign-in', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  
  let auxiliaryUser;

  User.findOne({ email })
    .then(user => {
      if (!user) {
        throw new Error('USER_NOT_FOUND');
      } else {
        auxiliaryUser = user;
        return bcrypt.compare(password, user.passwordHash);
      }
    })
    .then(matches => {
      if (!matches) {
        throw new Error('PASSWORD_DOESNT_MATCH');
      } else {
        req.session.user = auxiliaryUser
        }
        res.redirect('/private');
    })
    .catch(error => {
      console.log('There was an error signing up the user', error);
      next(error);
    });
});


module.exports = router;