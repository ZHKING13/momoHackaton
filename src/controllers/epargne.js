const Epargne = require('../model/Epargne');
exports.createEpargne = async(req, res) => {
    const { nom, solde, dateFin } = req.body;
    try {
        const epargne = new Epargne({
            nom,
            solde,
            dateFin,
            user: req.user._id
        });
        await epargne.save();
        res.status(201).json({
            succes: true,
            message: 'compte Epargne créée avec succes ',
            epargne
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getEpargnes = async(req, res) => {
    try {
        const epargnes = await Epargne.find({ user: req.user._id });
        res.status(200).json({
            succes: true,
            epargnes
        })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
exports.deleteEpargne = async(req, res) => {
    try {
        const epargne = await Epargne.findById(req.params.id);
        if (!epargne) {
            return res.status(404).json({ error: 'Epargne not found' });
        }
        await Epargne.findByIdAndDelete(req.params.id);
        res.status(200).json({
            succes: true,
            message: 'Epargne supprimée avec succes'
        })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
exports.getEpargneById = async(req, res) => {
    try {
        const epargne = await Epargne.findById(req.params.id);
        const transactions = await epargne.getTransactions();
        if (!epargne) {
            return res.status(404).json({ error: 'Epargne not found' });
        }
        res.status(200).json({
            succes: true,
            epargne,
            transactions
        })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}