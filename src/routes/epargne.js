const express = require('express');
const { createEpargne, getEpargneById, getEpargnes, deleteEpargne } = require('../controllers/epargne');
const auth = require('../middleware/auth');
const router = express.Router();

router.route("/epargne").post(auth, createEpargne);
router.route("/epargne").get(auth, getEpargnes);
router.route("/epargne/:id").get(auth, getEpargneById);
router.route("/epargne/:id").delete(auth, deleteEpargne);
exports.epargneRouter = router;