'use strict';

const { Router } = require('express');
const router = Router();
const User = require('./../models/user');

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Hello World!' });
});

const routeGuardMiddleware = (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/auth/sign-in');
  } else {
    next();
  }
};

router.get('/main', routeGuardMiddleware, (req, res, next) => {
  res.render('protected/main');
});
router.get('/private', routeGuardMiddleware, (req, res, next) => {
  res.render('protected/private');
});

router.get('/profile', routeGuardMiddleware, (req, res, next) => {
  res.render('protected/profile');
});

router.post('/profile', (req, res, next) => {
  const profileName = req.body.name;
  User.updateOne({name: profileName} )
  .then(name => {
    res.redirect('/profile');
  })
  .catch(err => {
    console.log('Had trouble updating the name ' + err);
  })
});
module.exports = router;
