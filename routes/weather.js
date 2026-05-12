const { authenticate } = require('../middleware/auth');
const { userWeather } = require('../utils/weather');

const router = require('express').Router();

router.get('/weather', authenticate, userWeather);
/**
 * @swagger
 * /api/v1/weather:
 *     get:
 *       tags:
 *         - Weather
 *       summary: Get Weather Information
 *       description: Retrieve weather information for the authenticated user
 *       security:
 *         - bearerAuth: []    
 *       responses:
 *         200:
 *           description: Weather information retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   location:
 *                     type: string
 *                     description: The user's location
 *                     example: Lagos, Nigeria
 *                   temperature:
 *                     type: number
 *                     description: The temperature
 *                     example: 25.5
 *                   description:
 *                     type: string
 *                     description: The weather description
 *                     example: Partly cloudy
 *         401:
 *           description: Unauthorized
 */


module.exports = router 