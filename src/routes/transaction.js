const express = require('express');
const auth = require('../middleware/auth');
const { newTransaction, confirmeTransaction } = require('../controllers/transaction');
const router = express.Router();

router.route("/transation").post(auth, newTransaction);
router.route("/transaction").patch(auth, confirmeTransaction);
router.route("/transaction").delete(auth, confirmeTransaction);