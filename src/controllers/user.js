// Importer le modèle d'utilisateur
const User = require('../model/User');
const { sendOTP, verifyOtp, deletOtp } = require('./otp');

// Fonction pour créer un utilisateur
exports.registerUser = async(req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).json({
            succes: true,
            message: 'User created successfully',
            user,
            token,

        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


exports.loginUser = async(req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const isMatch = await user.matchPassword(req.body.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const token = await user.generateAuthToken();
        res.status(200).json({
            succes: true,
            token,
            user
        })
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}
exports.getUsers = async(req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Fonction pour récupérer un utilisateur par son ID
exports.getUserById = async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.sendEmailOTP = async(req, res) => {
    try {
        const { email } = req.body
        if (!email) res.status(401).json({ error: "email obligatoire" });

        let otp = await sendOTP({
            email,
            subject: 'Email verification',
            message: 'Votre code de vérification est le suivant :'
        });
        if (!otp) {
            return res.status(400).json({
                error: 'une erreur est survenue pendant l\'envoi de otp'
            });
        }
        res.status(201).json({
            succes: true,
            message: "OTP envoyer avec succès"
        })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
exports.emailVerification = async(req, res) => {
    try {
        const { email, code } = req.body;
        const isMatch = await verifyOtp(email, code);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid OTP' });
        }
        await deletOtp(email);
        res.status(200).json({
            succes: true,
            message: 'User verified successfully',
            valide: isMatch
        });
    } catch (error) {
        res.status(401).json({ error: error.message });

    }
}
exports.resetPasswordVerification = async(req, res) => {
    try {
        const { email, code } = req.body;
        const isMatch = await verifyOtp(email, code);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }
        const user = await User.findOne({ email });
        await deletOtp(email);
        res.status(200).json({
            succes: true,
            message: 'User verified successfully',
            valide: isMatch
        });


    } catch (error) {
        res.status(400).json({ error: error.message });

    }
}
exports.resetPassword = async(req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email not provided' });
        }
        const user = await User.findOne({ email });
        const token = await user.generateAuthToken();
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const mailOptions = {
            email: email,
            subject: 'Reset password',
            message: 'Votre code de réinitialisation est le suivant :',
        }
        await sendOTP(mailOptions);
        res.status(200).json({
            succes: true,
            message: 'Code sent successfully',
            token
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}
exports.updatePassword = async(req, res) => {
    try {
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ error: 'Password not provided' });
        }
        const user = await User.findById(req.user._id);
        user.password = password;
        await user.save();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
exports.updateUser = async(req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Fonction pour supprimer un utilisateur
exports.deleteUser = async(req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};