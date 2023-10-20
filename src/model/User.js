const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: [true, 'Le nom est obligatoire'],
        minlength: 2,
        maxlength: 50
    },
    prenom: {
        type: String,
        required: [true, 'Le prénom est obligatoire'],
    },
    email: {
        type: String,
        required: [true, 'L\'email est obligatoire'],
        unique: true
    },
    numero: {
        type: String,
        required: [true, 'Le numéro de téléphone est obligatoire'],
        unique: true
    },
    motDePasse: {
        type: String,
        required: [true, 'Le mot de passe est obligatoire et contenir 8 caractere minimum'],
        minlength: 8,
        select: false
    },
    verify: {
        type: Boolean,
        default: false

    }


}, {
    timestamps: true
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '10h' });
    return token;
};

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.motDePasse);
};

userSchema.pre('save', async function(next) {
    if (!this.isModified('motDePasse')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;