const mongoose = require('mongoose');

const epargneSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: [true, 'Le nom est obligatoire']
    },
    description: {
        type: String,
    },
    objetif: {
        type: Number,
    },
    solde: {
        type: Number,
        default: 0
    },
    dateCreation: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateFin: {
        type: Date,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});
epargneSchema.methods.getTransactions = async function() {
    const transactions = await mongoose.model('Transaction').find({ epargne: this._id });
    return transactions;
};
const Epargne = mongoose.model('Epargne', epargneSchema);
module.exports = Epargne;