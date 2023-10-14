const express = require('express');
const auth = require('../middleware/auth');
const { newTransaction, confirmeTransaction } = require('../controllers/transaction');
const router = express.Router();

router.route("/transaction").post(auth, newTransaction);
router.route("/transaction/:id").patch(auth, confirmeTransaction);
exports.transactionRouter = router;