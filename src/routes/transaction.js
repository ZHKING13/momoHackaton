const express = require('express');
const auth = require('../middleware/auth');
const { newTransaction, confirmeTransaction } = require('../controllers/transaction');
const router = express.Router();

/**
 * @swagger
 * /api/v1/transaction:
 *   post:
 *     summary: Créer une nouvelle transaction
 *     description: Utilisé pour créer une nouvelle transaction.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               epargne:
 *                 type: string
 *                 description: ID de l'épargne associée à la transaction.
 *               montant:
 *                 type: number
 *                 description: Montant de la transaction (doit être un nombre positif).
 *               type:
 *                 type: string
 *                 description: Type de transaction (doit être "retrait" ou "depot").
 *     responses:
 *       201:
 *         description: Transaction créée avec succès.
 *       400:
 *         description: Requête incorrecte ou montant invalide.
 *       401:
 *         description: Accès non autorisé.
 *       500:
 *         description: Erreur interne du serveur lors de la création de la transaction.
 */

router.route("/transaction").post(auth, newTransaction);
/**
 * @swagger
 * /api/v1/transaction/{id}:
 *   patch:
 *     summary: Confirmer une transaction
 *     description: Utilisé pour confirmer une transaction existante.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la transaction à confirmer.
 *     responses:
 *       200:
 *         description: Transaction confirmée avec succès.
 *       400:
 *         description: Requête incorrecte ou statut de transaction inconnu.
 *       401:
 *         description: Accès non autorisé.
 *       404:
 *         description: Transaction ou épargne non trouvée.
 */

router.route("/transaction/:id").patch(auth, confirmeTransaction);
exports.transactionRouter = router;