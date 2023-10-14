const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['retrait', 'depot'],
        required: true
    },
    montant: {
        type: Number,
        required: true
    },
    statut: {
        type: String,
        enum: ['en attente', 'validée', 'annulée'],
        default: 'en attente'
    },
    reference: {
        type: String,
    },
    epargne: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Epargne',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;