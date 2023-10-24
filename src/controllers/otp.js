const OTP = require('../model/Otp');
const { generateOTP } = require('../util/generateOtp');
const { sendEmail } = require('../util/sendEmail');
const { AUTH_MAIL } = process.env;
const sendOTP = async({ email, subject, message, duration = 10 }) => {
    try {
        if (!email || !subject || !message) {
            throw new Error('email, subject and message are required');
        }
        await OTP.deleteOne({ email });
        const newOtp = generateOTP();
        const mailOption = {
            from: AUTH_MAIL,
            to: email,
            subject,
            html: `<p style="color:#000;
            ;font-size:18px;letter-spacing:2px">${message}</p><p style="color:#5D41D0;
            ;font-size:25px;letter-spacing:2px"><b>${newOtp}</b></p><p style="
            ;font-size:16px;letter-spacing:2px">ce code est<b> valide pour ${duration} minutes</b></p>`,

        }
        await sendEmail(mailOption);
        const otp = new OTP({
            email,
            code: newOtp,
            createdAt: new Date(),
            expiredAt: new Date(Date.now() + 60000 * +duration),
        });
        await otp.save();
        return otp;

    } catch (error) {
        throw error;
    }
}

const verifyOtp = async(email, code) => {
    try {
        if (!email && !code) {
            throw new Error('email and code are required');
        }
        const otp = await OTP.findOne({ email });
        if (!otp) {
            throw new Error('Invalid OTP');
        }
        if (otp.expiredAt < new Date()) {
            await OTP.deleteOne({ email });
            throw new Error('OTP expired');
        }
        const isMatch = await otp.matchCode(code);
        if (!isMatch) {
            throw new Error('Invalid OTP');
        }
        return isMatch;

    } catch (error) {
        throw error;
    }
}
const deletOtp = async(email) => {
    try {
        await OTP.deleteOne({ email });
    } catch (error) {
        throw error;
    }
}

module.exports = { sendOTP, verifyOtp, deletOtp }