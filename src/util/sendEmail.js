const nodemailer = require('nodemailer');
const { trace } = require('../routes/user');

const { AUTH_MAIL, AUTH_PASS } = process.env;
const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
    auth: {
        user: AUTH_MAIL,
        pass: AUTH_PASS,
    },
});
transporter.verify(function(error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log("Server is ready to take our messages");
    }

})
const sendEmail = async(mailOption) => {
    try {
        await transporter.sendMail(mailOption)
        return
    } catch (error) {
        throw error
    }
}
module.exports = { sendEmail }