const Transaction = require('../model/Transaction');
const Epargne = require('../model/Epargne');
const { transfertAmount, transfertStatus } = require('../feature/disturbment');
const { paymentRequest, getPaymentStatus } = require('../feature/MOMO_API');
const newTransaction = async(req, res) => {
    const { epargne, montant, type } = req.body;

    // Validation du montant
    if (isNaN(montant) || montant <= 0) {
        return res.status(400).json({
            error: 'Le montant doit être de type entier et positif'
        });
    }

    const existEpargne = await Epargne.findById(epargne);
    if (!existEpargne) {
        return res.status(400).json({
            error: 'Epargne not found'
        });
    }

    // Création de la transaction
    const user = req.user;
    const transaction = new Transaction({
        epargne,
        montant,
        type,
        user: user._id
    });

    try {
        if (type === "retrait") {
            if (existEpargne.solde < montant) {
                return res.status(400).json({
                    error: 'Le montant demandé est supérieur au montant de l\'épargne'
                });
            }
            let retrait = await transfertAmount(montant);
            console.log(retrait);
            if (!retrait.success) {
                return res.status(400).json({
                    error: 'une erreur est survenue merci de réessayer'
                })
            }
            transaction.reference = retrait.referenceId
        }

        if (type === "depot") {
            let depot = await paymentRequest({
                montant
            });
            console.log(depot);
            if (!depot.success) {
                return res.status(400).json({
                    error: 'une erreur est survenue merci de réessayer'
                })
            }
            transaction.reference = depot.referenceId
        }
        await transaction.save();
        let retraitMessage = "demande de retrait de " + montant + "f cfa effetuée avec succès";
        let depotMessage = "demande de depot de " + montant + "f cfa en attente merci de confirmer la transaction";
        res.status(201).json({
            success: true,
            message: type === "retrait" ? retraitMessage : depotMessage,
            transaction

        });
    } catch (error) {
        // Gérer les erreurs de sauvegarde de la transaction
        console.error(error);
        res.status(500).json({
            error: 'Une erreur s\'est produite lors de la création de la transaction'
        });
    }
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
async function confirmTransaction(transaction, epargne) {
    try {
        if (transaction.statut === "validée") {
            return {
                status: 400,
                message: 'Transaction déjà validée'
            };
        }

        let transactStatus;

        if (transaction.type === "depot") {
            transactStatus = await getPaymentStatus(transaction.reference);
        } else if (transaction.type === "retrait") {
            transactStatus = await transfertStatus(transaction.reference);
        }

        if (transactStatus.status === "SUCCESSFUL") {
            if (transaction.type === "depot") {
                epargne.solde += transaction.montant;
            } else if (transaction.type === "retrait") {
                epargne.solde -= transaction.montant;
            }
            transaction.statut = "validée";
            await epargne.save();
            await transaction.save();
            return {
                status: 200,
                message: `${transaction.type} validée avec succès`
            };
        } else if (transactStatus.status === "FAILED") {
            transaction.statut = "annulée";
            await transaction.save();
            return {
                status: 200,
                message: "transaction annulée"
            };
        } else if (transactStatus.status === "PENDING") {
            return {
                status: 200,
                message: "transaction en attente"
            };
        } else {
            return {
                status: 400,
                message: "Statut de transaction inconnu"
            };
        }
    } catch (error) {
        throw error;
    }
}

const confirmeTransaction = async(req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        const epargne = await Epargne.findById(transaction.epargne);

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        if (!epargne) {
            return res.status(404).json({ error: 'Epargne not found' });
        }

        const result = await confirmTransaction(transaction, epargne);

        res.status(result.status).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const depot = async(req, res) => {
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