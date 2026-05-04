const { authenticate } = require('../middleware/auth');
const { userWeather } = require('../utils/weather');

const router = require('express').Router();

router.get('/weather', authenticate, userWeather);


module.exports = router 