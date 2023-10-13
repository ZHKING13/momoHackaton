const express = require('express');
const { registerUser, loginUser, emailVerification, resetPassword } = require('../controllers/user');
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/verify").post(emailVerification);
router.route("/forgot").post(resetPassword);
router.route("/reset/:token").post(resetPassword);

module.exports = router;