const { register, verifyEmail, resendOTP, login, getAllUsers } = require('../controller/userController');
const passport = require('passport')
const router = require('express').Router();

router.post('/register', register);

router.post('/verify', verifyEmail);

router.post('/resend-otp', resendOTP);

router.post('/login', login);

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
    

router.get('/githubLogin', passport.authenticate('github2'));

router.get('/githubLogin/callback',passport.authenticate('github2', {failureRedirect: '/login',session: false}),
  (req, res)  => {
    res.json({message:"GitHub login successful", data:req.user});
  }
);

// router.get('/auth/facebook',
//   passport.authenticate('facebook'));

// router.get('/auth/facebook/callback',
//   passport.authenticate('facebook', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
//    });

/**
 * @swagger
 * /api/v1/user/getAllUsers:
 *   get:
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

router.get('/getAllUsers', getAllUsers)

module.exports = router