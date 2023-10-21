const express = require('express');
const { registerUser, loginUser, emailVerification, resetPassword, sendEmailOTP } = require('../controllers/user');
const router = express.Router();

/**
 * @swagger
 * /api/v1/user/otp:
 *   post:
 *     summary: envoyer un code de vérification
 *     description: utilisé pour envoyer un code de vérification de l'adresse e-mail de l'utilisateur.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                description: Adresse e-mail de l'utilisateur (obligatoire).
 *                required: true
 *              
 *     responses:
 *       200:
 *         description: Otp envoyer avec succès.
 *       401:
 *         description: Echec d'envoi du code de vérification.
 */
router.route("/otp").post(sendEmailOTP);
/**
 * @swagger
 * /api/v1/user/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
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
 *               prenom:
 *                 type: string
 *                 description: Prénom de l'utilisateur.
 *               email:
 *                 type: string
 *                 description: Adresse e-mail de l'utilisateur (unique).
 *               numero:
 *                 type: string
 *                 description: Numéro de téléphone de l'utilisateur (unique).
 *               motDePasse:
 *                 type: string
 *                 description: Mot de passe de l'utilisateur (au moins 8 caractères).
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
 *               motDePasse:
 *                 type: string
 *                 description: Mot de passe de l'utilisateur.
 *     responses:
 *       200:
 *         description: Utilisateur connecté avec succès.
 *       400:
 *         description: Mot de passe de l'utilisateur invalide.
 *       401:
 *         description: Échec de la connexion de l'utilisateur.
 *       404:
 *         description:Aucun utilisateur trouvé.
 */
router.route("/login").post(loginUser);

/**
 * @swagger
 * /api/v1/user/verify:
 *   post:
 *     summary: Vérification de l'adresse e-mail
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
 *               code:
 *                  type: number
 *                  description: Le code OTP recu par mail.
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               motDePasse:
 *                 type: string
 *                 description: Nouveau mot de passe de l'utilisateur (au moins 8 caractères).
 *     responses:
 *       200:
 *         description: Mot de passe réinitialisé avec succès en utilisant le jeton.
 *       401:
 *         description: Échec de la réinitialisation du mot de passe avec le jeton.
 */
router.route("/reset/:token").post(resetPassword);

module.exports = router;