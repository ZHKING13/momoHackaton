const Transaction = require('../model/Transaction');
const Epargne = require('../model/Epargne');
const newTransaction = async(req, res) => {
    const { epargne, montant, type } = req.body;
    // check if amount is a number
    if (isNaN(montant) || montant <= 0) {
        return res.status(400).json({
            error: 'Le montant doit être de type entier et positif'
        });
    }
    const user = req.user;
    const transaction = new Transaction({
        epargne,
        montant,
        type,
        user: user._id
    })
    await transaction.save();
}

const getTransactions = async(req, res) => {
    try {
        const transactions = await Transaction.find();
        res.status(200).json({
            succes: true,
            transactions
        })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
const confirmeTransaction = async(req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        const epargne = await Epargne.findById(transaction.epargne);
        epargne.montant += transaction.montant;
        transaction.statut = "validée"
        await epargne.save();
        await Transaction.findByIdAndDelete(req.params.id);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
const addBalance = async(req, res) => {
    try {
        const { montant } = req.body;
    } catch (error) {

    }

}
module.exports = {
    newTransaction,
    getTransactions,
    confirmeTransaction
}