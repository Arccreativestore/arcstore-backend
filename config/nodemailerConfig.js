const nodemailer = require('nodemailer');
const env = require('dotenv').config()

const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.G_PORT,
    secure: false,
    auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD,
    },
});


module.exports = transporter