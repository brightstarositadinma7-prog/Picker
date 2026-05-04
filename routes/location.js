const { authenticate } = require('../middleware/auth');
const { userLocation } = require('../utils/location');

const router = require('express').Router();

router.get('/location', authenticate, userLocation);


module.exports = router 