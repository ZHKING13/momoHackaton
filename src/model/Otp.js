const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'l\'email est requis'],
    },
    code: {
        type: String,
        required: [true, 'le code est requis'],
    },
    createdAt: {
        type: Date,
    },
    expiredAt: {
        type: Date,
    }
});


otpSchema.pre('save', async function(next) {
    try {

        const salt = await bcrypt.genSalt(10);

        const hashedCode = await bcrypt.hash(this.code, salt);

        this.code = hashedCode;
        next();
    } catch (error) {
        next(error);
    }
});
otpSchema.methods.matchCode = async function(enteredCode) {
    return await bcrypt.compare(enteredCode, this.code);
};

module.exports = mongoose.model('OTP', otpSchema);