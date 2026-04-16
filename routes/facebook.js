const passport = require('passport')
const router = require('express').Router();

router.get('/facebookLogin',
  passport.authenticate('facebook', { scope: ['email'] })
);

  module.exports = router