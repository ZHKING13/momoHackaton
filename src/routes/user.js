const express = require('express');
const { registerUser, loginUser, emailVerification, resetPassword } = require('../controllers/user');
const router = express.Router();

/**
 * @swagger
 * /api/v1/user/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     description: Utilisé pour enregistrer un nouvel utilisateur.
 *     responses:
 *       200:
 *         description: Utilisateur enregistré avec succès un otp est envoyer surle mail de l'utilisateur.
 *       400:
 *         description: Échec de l'inscription de l'utilisateur.
 */
router.route("/register").post(registerUser);

/**
 * @swagger
 * /api/v1/user/login:
 *   post:
 *     summary: Connexion de l'utilisateur
 *     description: Utilisé pour connecter un utilisateur existant.
 *     responses:
 *       200:
 *         description: Utilisateur connecté avec succès.
 *       401:
 *         description: Échec de la connexion de l'utilisateur.
 */
router.route("/login").post(loginUser);

/**
 * @swagger
 * /api/v1/user/verify:
 *   post:
 *     summary: Vérification de l'adresse e-mail
 *     description: Utilisé pour vérifier l'adresse e-mail d'un utilisateur.
 *     responses:
 *       200:
 *         description: Adresse e-mail vérifiée avec succès.
 *       401:
 *         description: Échec de la vérification de l'adresse e-mail.
 */
router.route("/verify").post(emailVerification);

/**
 * @swagger
 * /api/v1/user/forgot:
 *   post:
 *     summary: Réinitialisation du mot de passe
 *     description: Utilisé pour réinitialiser le mot de passe d'un utilisateur.
 *     responses:
 *       200:
 *         description: Mot de passe réinitialisé avec succès.
 *       401:
 *         description: Échec de la réinitialisation du mot de passe.
 */
router.route("/forgot").post(resetPassword);

/**
 * @swagger
 * /api/v1/user/reset/{token}:
 *   post:
 *     summary: Réinitialisation du mot de passe avec jeton
 *     description: Utilisé pour réinitialiser le mot de passe d'un utilisateur en utilisant un jeton de réinitialisation.
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Jeton de réinitialisation du mot de passe.
 *     responses:
 *       200:
 *         description: Mot de passe réinitialisé avec succès en utilisant le jeton.
 *       401:
 *         description: Échec de la réinitialisation du mot de passe avec le jeton.
 */
router.route("/reset/:token").post(resetPassword);

module.exports = router;
