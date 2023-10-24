const express = require('express');
const { createEpargne, getEpargneById, getEpargnes, deleteEpargne } = require('../controllers/epargne');
const auth = require('../middleware/auth');
const router = express.Router();

router.route("/epargne").post(auth, createEpargne);
router.route("/epargne").get(auth, getEpargnes);
router.route("/epargne/:id").get(auth, getEpargneById);
router.route("/epargne/:id").delete(auth, deleteEpargne);
/**
 * @swagger
 * /epargne:
 *   post:
 *     summary: Créer un compte épargne
 *     description: Crée un compte épargne avec le nom, le solde et la date de fin spécifiés.
 *     tags:
 *       - Epargne
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               solde:
 *                 type: number
 *               dateFin:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Compte épargne créé avec succès.
 *       400:
 *         description: Erreur lors de la création du compte épargne.
 */

/**
 * @swagger
 * /epargne:
 *   get:
 *     summary: Obtenir la liste des comptes épargne de l'utilisateur
 *     description: Récupère la liste des comptes épargne de l'utilisateur actuellement connecté.
 *     tags:
 *       - Epargne
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Succès - Liste des comptes épargne.
 *       400:
 *         description: Erreur lors de la récupération de la liste des comptes épargne.
 */

/**
 * @swagger
 * /epargne/{id}:
 *   get:
 *     summary: Obtenir un compte épargne par ID
 *     description: Récupère un compte épargne spécifique en utilisant son ID.
 *     tags:
 *       - Epargne
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du compte épargne.
 *     responses:
 *       200:
 *         description: Succès - Détails du compte épargne.
 *       404:
 *         description: Compte épargne non trouvé.
 *       400:
 *         description: Erreur lors de la récupération du compte épargne.
 */

/**
 * @swagger
 * /epargne/{id}:
 *   delete:
 *     summary: Supprimer un compte épargne par ID
 *     description: Supprime un compte épargne spécifique en utilisant son ID.
 *     tags:
 *       - Epargne
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du compte épargne.
 *     responses:
 *       200:
 *         description: Compte épargne supprimé avec succès.
 *       404:
 *         description: Compte épargne non trouvé.
 *       400:
 *         description: Erreur lors de la suppression du compte épargne.
 */

exports.epargneRouter = router;