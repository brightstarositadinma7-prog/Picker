const { register, verifyEmail, resendOTP, login, getAllUsers,getOneUser } = require('../controller/userController');
const passport = require('passport')
const router = require('express').Router();

// tags
/**
 * @swagger
 * tags:
 *   name: User
 *   description: API endpoints for user management
 */

// For all users
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The User ID
 *           example: 69f6fc59f069dce732d54a15
 *         name:
 *           type: string
 *           description: The User's First Name
 *           example: John
 *         email:
 *           type: string
 *           description: The User's Email
 *           example: example@example.com
 *         phoneNumber:
 *           type: string
 *           description: The User's Phone Number
 *           example: +2348012345678
 *         password:
 *           type: string
 *           description: The User's Password
 *           example: password123
 *         confirmPassword:
 *           type: string
 *           description: The User's Confirm Password
 *           example: password123
 *              
 */

// Register a new user
/**
 * @swagger
 * /api/v1/user/register:
 *   post:
 *     tags:
 *       - User
 *     summary: User registration
 *     description: Register a new user with name, email, phone number, password, and confirm password
 *     requestBody:
 *       required: true 
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               name:
 *                 type: string  
 *                 description: The User's First Name
 *                 example: John
 *               email:
 *                 type: string
 *                 description: The User's Email
 *                 example: example@example.com
 *               phoneNumber:
 *                 type: string
 *                 description: The User's Phone Number
 *                 example: +2348012345678
 *               password:
 *                 type: string
 *                 description: The User's Password
 *                 example: password123
 *               confirmPassword:
 *                 type: string
 *                 description: The User's Confirm Password
 *                 example: password123
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message
 *                   example: User created successfully
 */
 router.post('/register', register);


// Login a user
/**
 * @swagger
 * /api/v1/user/login:
 *   post:
 *     tags:
 *       - User
 *     summary: User login
 *     description: Login a user with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The User's Email
 *                 example: example@example.com
 *               password:
 *                 type: string
 *                 description: The User's Password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message
 *                   example: Login successful
 */
router.post('/login', login);


// Verify user email
/**
 * @swagger
 * /api/v1/user/verify:
 *   post:
 *     summary: Verify User Email
 *     description: Verify a user's email address with an OTP
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The User's Email
 *                 example: example@example.com
 *               otp:
 *                 type: string
 *                 description: The OTP for email verification
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message
 *                   example: Email verified successfully
 */
router.post('/verify', verifyEmail);


// Resend OTP for email verification
/**
 * @swagger
 * /api/v1/user/resend-otp:
 *   post:
 *     summary: Resend OTP
 *     description: Resend an OTP for email verification
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The User's Email
 *                 example: example@example.com
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message
 *                   example: OTP sent successfully
 */
router.post('/resend-otp', resendOTP);

router.get('/collect', passport.authenticate('google', {scope: ['profile', 'email']}))

router.get('/googleLogin', passport.authenticate('google', {
    successRedirect: '/api/user/loginsuccess', 
    failureRedirect: '/api/user/loginfailed'}))

router.get('/loginsuccess', (req, res) => {
        res.json({message: 'Login successful', 
            data: req.user})
    })

router.get('/loginfailed', (req, res) => {
        res.json({message: 'Login failed'})
    })  
    

// router.get('/githubLogin', passport.authenticate('github2'));

// router.get('/githubLogin/callback',passport.authenticate('github2', {failureRedirect: '/login',session: false}),
//   (req, res)  => {
//     res.json({message:"GitHub login successful", data:req.user});
//   }
// );

// router.get('/auth/facebook',
//   passport.authenticate('facebook'));

// router.get('/auth/facebook/callback',
//   passport.authenticate('facebook', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
//    })





/**
 * @swagger
 * /api/v1/user/getAllUsers:
 *   get:
 *     tags:
 *       - User
 *     summary: All Users
 *     description: Get all users in the database
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The User ID
 *                         example: 69f6fc59f069dce732d54a15
 *                       name:
 *                         type: string
 *                         description: The User's First Name
 *                         example: John
 *                       email:
 *                         type: string
 *                         description: The User's Email
 *                         example: example@example.com
 *                       phoneNumber:
 *                         type: string
 *                         description: The User's Phone Number
 *                         example: +2348012345678
 *                       isVerified:
 *                         type: boolean
 *                         description: The User's Verification Status
 *                         example: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: The User's Creation Date
 *                         example: 2026-05-04T15:56:49.406Z
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: The User's Update Date
 *                         example: 2026-05-04T15:56:49.406Z
 *              
 */

// Get One user

/**
 * @swagger
 * /api/v1/user/getOneUser/{id}:
 *   get:
 *     tags:
 *       - User
 *     summary: Get User by ID
 *     description: Get a user by their ID
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The User ID
 *         required: true
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The User ID
 *                         example: 69f6fc59f069dce732d54a15
 *                       name:
 *                         type: string
 *                         description: The User's First Name
 *                         example: John
 *                       email:
 *                         type: string
 *                         description: The User's Email
 *                         example: example@example.com
 *                       phoneNumber:
 *                         type: string
 *                         description: The User's Phone Number
 *                         example: +2348012345678
 *                       isVerified:
 *                         type: boolean
 *                         description: The User's Verification Status
 *                         example: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: The User's Creation Date
 *                         example: 2026-05-04T15:56:49.406Z
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: The User's Update Date
 *                         example: 2026-05-04T15:56:49.406Z
 *              
 */


router.get('/getAllUsers', getAllUsers)
router.get('/getOneUser/:id', getOneUser)

module.exports = router