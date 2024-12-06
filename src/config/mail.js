const nodemailer = require('nodemailer');
const emailusername = '';
const emailpassword = '';


const transporter = nodemailer.createTransport({
    service:'gmail',
    port: 587,
    auth: {
        user: emailusername,
        pass: emailpassword
    },
    host: 'smtp.gmail.com'

});

module.exports = transporter;