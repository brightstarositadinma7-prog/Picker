const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const sendMail = require('../utils/nodemailer');
const otpGenerator = require('otp-generator');
const { signUpTemplate } = require('../utils/emailTemplate');
const jwt = require('jsonwebtoken')

exports.register = async(req, res) => {
    try {
        const {name, email, phoneNumber, password, confirmPassword} = req.body;

        const emailExists = await userModel.findOne({ email: email})
        if (emailExists) {
            return res.status(400).json({
                message: `User with email: ${email} already exists`
            })
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: 'Passwords do not match.'
            })
    }

        const OTP = otpGenerator.generate(4, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });

        const expiresAt = new Date(Date.now() + 10 * 60000);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await userModel.create({
            name, 
            email, 
            phoneNumber, 
            otp: OTP,
            password: hashedPassword,  
            otpExpiresAt: expiresAt
        });

        console.log("1");
        
         console.log(user);
        

        const emailOptions = {
            email: user.email,
            subject: 'Welcome to The Girly Zone',
            html: signUpTemplate(user.name, OTP)
        }
         console.log("2");
        
         await sendMail(emailOptions);
        // console.log("2");
        // console.log(mail);
        // console.log("3");
        
        const data = {
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber
        }

        res.status(201).json({
            message: 'User created successfully',
            data
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

exports.verifyEmail = async (req, res) => {
    try {
       const { email, otp } = req.body;
       
       const user = await userModel.findOne({ email })
       if (!user) {
        return res.status(404).json({
            message: 'User not found'
        })
       }
       if (new Date() > user.otpExpiresAt || user.otp != otp ) {
        return res.status(404).json({
            message: 'Invalid OTP'
        })
       }
       
       user.isVerified = true;
       user.otp = null
       user.otpExpiresAt = null

       await user.save()

       res.status(200).json({
        message: 'User verified successfully'
       })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

exports.resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        const OTP = otpGenerator.generate(4, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false })

        const expiresAt = new Date(Date.now() + 10 * 60000);

        user.otp = OTP;
        user.otpExpiresAt = expiresAt;

        const emailOptions = {
            email: user.email,
            subject: 'New otp confirmation',
            html: signUpTemplate(user.name, OTP)
        }

        await sendMail(emailOptions);

        await user.save()

        res.status(200).json({
            message: 'OTP resent successfully'
        })
    } catch (error) {
       res.status(500).json({
            message: error.message
        }) 
    }
};

exports.login = async( req, res) => {
    try {
        const { email, password } = req.body

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        if (user.isVerified == false) {
            return res.status(404).json({
                message: 'Please verify your email'
            })
        }

        const passwordCorrect = await bcrypt.compare(password, user.password);

        if (!passwordCorrect) {
            return res.status(400).json({
                message: 'Invalid credentials'
            })
        }

        const token = await jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '30mins'});

        res.status(200).json({
            message: 'Login Successful',
            token
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        }) 
    }
}