const express = require('express');
const { registerUser, loginUser, emailVerification, resetPassword, sendEmailOTP, updatePassword } = require('../controllers/user');
const router = express.Router();
/**
 * @swagger
 * tags:
 *   - name: Utilisateur
 *     description: Opérations liées aux utilisateurs
 */
/**
 * @swagger
 * /api/v1/user/otp:
 *   post:
 *     summary: Envoi d'un code de vérification par e-mail
 *     tags: [Utilisateur]
 *     description: Utilisé pour envoyer un code de vérification à l'adresse e-mail de l'utilisateur.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Adresse e-mail de l'utilisateur (obligatoire).
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Code de vérification envoyé avec succès.
 *       401:
 *         description: Échec de l'envoi du code de vérification.
 */

router.route("/otp").post(sendEmailOTP);
/**
 * @swagger
 * /api/v1/user/verify:
 *   post:
 *     summary: Vérification de l'adresse e-mail
 *     tags: [Utilisateur]
 *     description: Utilisé pour vérifier l'adresse e-mail d'un utilisateur.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Adresse e-mail de l'utilisateur.
 *                 example: user@example.com
 *               code:
 *                  type: number
 *                  description: Le code OTP reçu par e-mail.
 *                  example: 123456
 *     responses:
 *       200:
 *         description: Adresse e-mail vérifiée avec succès.
 *       401:
 *         description: Échec de la vérification de l'adresse e-mail.
 */

router.route("/verify").post(emailVerification);

/**
 * @swagger
 * /api/v1/user/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags: [Utilisateur]
 *     description: Utilisé pour enregistrer un nouvel utilisateur.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *                 description: Nom de l'utilisateur (entre 2 et 50 caractères).
 *                 example: John
 *               prenom:
 *                 type: string
 *                 description: Prénom de l'utilisateur.
 *                 example: Doe
 *               email:
 *                 type: string
 *                 description: Adresse e-mail de l'utilisateur (unique).
 *                 example: user@example.com
 *               numero:
 *                 type: string
 *                 description: Numéro de téléphone de l'utilisateur (unique).
 *                 example: +1234567890
 *               motDePasse:
 *                 type: string
 *                 description: Mot de passe de l'utilisateur (au moins 8 caractères).
 *                 example: password123
 *     responses:
 *       200:
 *         description: Utilisateur enregistré avec succès.
 *       400:
 *         description: Échec de l'inscription de l'utilisateur.
 */

router.route("/register").post(registerUser);

/**
 * @swagger
 * /api/v1/user/login:
 *   post:
 *     summary: Connexion de l'utilisateur
 *     tags: [Utilisateur]
 *     description: Utilisé pour connecter un utilisateur existant.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Adresse e-mail de l'utilisateur.
 *                 example: user@example.com
 *               motDePasse:
 *                 type: string
 *                 description: Mot de passe de l'utilisateur.
 *                 example: password123
 *     responses:
 *       200:
 *         description: Utilisateur connecté avec succès.
 *       400:
 *         description: Mot de passe de l'utilisateur invalide.
 *       401:
 *         description: Échec de la connexion de l'utilisateur.
 *       404:
 *         description: Aucun utilisateur trouvé.
 */

router.route("/login").post(loginUser);


/**
 * @swagger
 * /api/v1/user/forgot:
 *   post:
 *     summary: Réinitialisation du mot de passe
 *     tags: [Utilisateur]
 *     description: Utilisé pour réinitialiser le mot de passe d'un utilisateur.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Adresse e-mail de l'utilisateur.
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: OTP de réinitialisation envoyé avec succès.
 *       401:
 *         description: Échec de l'envoi d'OTP de réinitialisation.
 *       404:
 *         description: Aucun utilisateur trouver.
 */

router.route("/forgot").post(resetPassword);

/**
 * @swagger
 * /api/v1/user/reset:
 *   post:
 *     summary: Réinitialisation du mot de passe 
 *     tags: [Utilisateur]
 *     description: Utilisé pour réinitialiser le mot de passe d'un utilisateur en utilisant un jeton de réinitialisation.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: email de l'utilisateur.
 *                 example: example@email.com
 *               motDePasse:
 *                 type: string
 *                 description: Nouveau mot de passe de l'utilisateur (au moins 8 caractères).
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Mot de passe réinitialisé avec succès.
 *       401:
 *         description: Échec de la réinitialisation du mot de passe.
 */

router.route("/reset").post(updatePassword);

module.exports = router;