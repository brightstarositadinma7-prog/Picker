const restaurantModel = require('../models/restaurantModel');
const bcrypt = require('bcrypt');
const sendMail = require('../utils/nodemailer');
const otpGenerator = require('otp-generator');
const { signUpTemplate } = require('../utils/emailTemplate');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary')
const categoryModel = require('../models/categoryModel');
const menuModel = require('../models/menuModel')



exports.registerRestaurant = async(req, res) => {
    try {
        const {name, email, country, phoneNumber, password, confirmPassword} = req.body;

        const emailExists = await restaurantModel.findOne({ email: email})
        if (emailExists) {
            return next({
                message: `restaurant with email: ${email} already exists`,
                statusCode: 400
            })
        }

        if (password !== confirmPassword) {
            return next({
                message: `Password does not match`,
                statusCode: 400
            })
    }

        const OTP = otpGenerator.generate(4, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });

        const expiresAt = new Date(Date.now() + 10 * 60000);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const restaurant = await new restaurantModel({
            name, 
            email, 
            country,
            phoneNumber, 
            password: hashedPassword,  
            otpExpiresAt: expiresAt
        });

        console.log("1");
        
         console.log(restaurant);
        

        const emailOptions = {
            email: restaurant.email,
            subject: 'Welcome to Picker',
            html: signUpTemplate(restaurant.name, OTP)
        }
        
         await sendMail(emailOptions);

         await restaurant.save()

        const data = {
            name: restaurant.name,
            email: restaurant.email,
            phoneNumber: restaurant.phoneNumber,
            country: restaurant.country
        }

        res.status(201).json({
            message: 'restaurant created successfully',
            data
        })
    } catch (error) {
        next({
                message: error.message,
                statusCode: 500
            })
    }
};

exports.verifyRestaurantEmail = async (req, res) => {
    try {
       const { email, otp } = req.body;
       
       const restaurant = await restaurantModel.findOne({ email })
       if (!restaurant) {
        return next({
                message: `restaurant not found`,
                statusCode: 404
            })
       }
       if (new Date() > restaurant.otpExpiresAt || restaurant.otp != otp ) {
        return next({
                message: `Invalid OTP`,
                statusCode: 400
            })
       }
       
       restaurant.isVerified = true;
       restaurant.otp = null
       restaurant.otpExpiresAt = null

       await restaurant.save()

       res.status(200).json({
        message: 'restaurant verified successfully'
       })

    } catch (error) {
        next({
                message: error.message,
                statusCode: 500
            })
    }
};

exports.resendRestaurantOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const restaurant = await restaurantModel.findOne({ email })
        if (!restaurant) {
            return next({
                message: `restaurant not found`,
                statusCode: 404
            })
        }

        const OTP = otpGenerator.generate(4, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false })

        const expiresAt = new Date(Date.now() + 10 * 60000);

        restaurant.otp = OTP;
        restaurant.otpExpiresAt = expiresAt;

        const emailOptions = {
            email: restaurant.email,
            subject: 'New otp confirmation',
            html: signUpTemplate(restaurant.name, OTP)
        }

        await sendMail(emailOptions);

        await restaurant.save()

        res.status(200).json({
            message: 'OTP resent successfully'
        })
    } catch (error) {
       next({
                message: error.message,
                statusCode: 500
            })
    }
};

exports.loginRestaurant = async( req, res) => {
    try {
        const { email, password } = req.body

        const restaurant = await restaurantModel.findOne({ email })
        if (!restaurant) {
            return next({
                message: `restaurant not found`,
                statusCode: 404
            })
        }

        if (restaurant.isVerified == false) {
            return next({
                message: `Please verify your email`,
                statusCode: 404
            })
        }

        const passwordCorrect = await bcrypt.compare(password, restaurant.password);

        if (!passwordCorrect) {
            return next({
                message: `Invalid credentials`,
                statusCode: 400
            })
        }

        const token = await jwt.sign({ id: restaurant._id }, process.env.JWT_SECRET, { expiresIn: '1 hour'});

        res.status(200).json({
            message: 'Login Successful',
            token
        })
    } catch (error) {
        next({
                message: error.message,
                statusCode: 500
            })
    }
};

exports.uploadProduct = async(req, res) => {
    try {
       const { id } = req.user
        
        const { category, menuName, menuDescription, amount, menuImage } = req.body;
        cloudinary.config({
            cloud_name: process.env.API_CLOUDNAME,
            api_secret: process.env.API_SECRET,
            api_key: process.env.API_KEY,
        })

        const UploadCloud = await cloudinary.uploader.upload(req.file.path);
        if (!req.file.path) {
            return next({
                message: `File Path not found`,
                statusCode: 404
            })
        }
        const createProduct = await menuModel.create({
            restaurantId: id,
            category, 
            menuName, 
            menuDescription, 
            amount,
            menuImage: UploadCloud.secure_url
        })

        res.status(201).json({
            message: 'menu created successfully',
            createProduct
        })

    } catch (error) {
        next({
                message: error.message,
                statusCode: 500
            })
    }
};
 
// exports.createCategory = async (req, res) => {
//     try {
//         const { name } = req.body;

//         const category = await categoryModel.create({
//             name
//         })

//         res.status(201).json({
//             message: 'category created successfully',
//             category
//         })
//     } catch (error) {
//         res.status(500).json({
//             message: error.message
//         })
//     }
// };

exports.getAllMenu = async (req, res) => {
    try {
        const { id } = req.user;
        const restaurant = await restaurantModel.findById(id);

        if (!restaurant) {
            return next({
                message: `Restaurant not found`,
                statusCode: 404
            })
        };

        const menus = await menuModel.find({
            restaurantId: restaurant._id
        });
        const categories = [...new Set(menus.map(e => e.category))];

        res.status(200).json({
            message: 'All menus',
            menus,
            categories
        })
    } catch (error) {
        next({
                message: error.message,
                statusCode: 500
            })
    }
}

exports.deletemenu = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return next({
                message: `menu not found`,
                statusCode: 404
            })
        }

        const menu = await menuModel.findByIdAndDelete(id)

        res.status(200).json({
            message: 'menu deleted successfully',
            menu
        })
    } catch (error) {
        next({
                message: error.message,
                statusCode: 500
            })
    }
}