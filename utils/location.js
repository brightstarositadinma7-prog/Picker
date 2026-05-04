const locationModel = require('../models/location')
const axios = require("axios")

exports.userLocation = async (req, res) => {
    try {
       const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress

       const ip = rawIp === "::1" ? "102.89.47.157" : rawIp

        const userAddress = await axios.get(`http://ip-api.com/json/${ip}`);
        const latitude = userAddress.data.lat;
        const longitude = userAddress.data.lon;
const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`

        const actualAddress = await axios.get(apiUrl, {headers:{
            "accept": "application/json",
            "User-Agent":"enogetname(enogetname@gmail.com)"
        }})

        const address = {
            lat: latitude,
            long: longitude,
            actualAddress: actualAddress.data.display_name,
            userId: req.user.id
        }

        const data = await locationModel.create(address)
        res.status(200).json({
            message: "Location gotten successfully",
            data: data
        })
    } catch (error) {
        next({
                message: error.message,
                statusCode: 500
            })
    }
}