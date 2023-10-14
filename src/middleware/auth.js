const jwt = require('jsonwebtoken');
const User = require('../model/User');

const auth = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Vérifiez si le token a expiré
        const tokenExpDate = new Date(decoded.exp * 1000); // Convertissez la date d'expiration Unix en millisecondes
        const now = new Date();

        if (now >= tokenExpDate) {
            throw new Error('Token expiré');
        }

        const user = await User.findOne({ _id: decoded._id });

        if (!user) {
            throw new Error();
        }

        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        if (error.message === 'Token expiré') {
            res.status(401).send({ error: 'Token expiré' });
        } else {
            res.status(401).send({ error: 'Unauthorized' });
        }
    }
};

module.exports = auth;