// Création des actions pour le modèle "sauce"
const Sauce = require("../models/Sauce");
// File System: Permet de créer et gérer les fichiers pour y stocker ou lire des informations 
const fs = require('fs');

// Ajout d'une sauce
exports.createSauce = async (req, res) => {
    try {
        const sauceObject = JSON.parse(req.body.sauce);
        delete sauceObject._id;
        let sauce = new Sauce({
            userId: sauceObject.userId,
            name: sauceObject.name,
            manufacturer: sauceObject.manufacturer,
            description: sauceObject.description,
            mainPepper: sauceObject.mainPepper,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
            heat: sauceObject.heat,
            likes: 0,
            dislikes: 0,
            usersLiked: [],
            usersDisliked: []
        });
        await sauce.save();
        return res.status(201).json({ message: "Sauce enregistrée !" })
    }
    catch (err) {
        console.error(err);
        return res.status(500).send("Internal error");
    };
}

// Récupération des informations de toutes les sauces
exports.getAllSauce = async (req, res) => {
    try {
        let sauces = await Sauce.find();
        return res.status(200).json(sauces);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send("Internal error");
    }
};

// Récupération des informations d'une seule sauce
exports.getOneSauce = async (req, res) => {
    try {
        let sauce = await Sauce.findOne({ _id: req.params.id });
        return res.status(200).json(sauce)
    }
    catch (err) {
        console.error(err);
        return res.status(500).send("Internal error");
    }

};
// Modification des informations d'une seule sauce
exports.modifySauce = async (req, res) => {
    try {
        let sauceObject = req.body.sauce ? JSON.parse(req.body.sauce) : req.body;

        if (req.file) {
            let sauce = await Sauce.findOne({ _id: req.params.id });
            fs.unlink(`images/${sauce.imageUrl.split('/images/')[1]}`, async () => {
                sauceObject.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
                await Sauce.updateOne({ _id: req.params.id }, {
                    imageUrl: sauceObject.imageUrl
                });
            });
        }
        await Sauce.updateOne({ _id: req.params.id }, {
            userId: sauceObject.userId,
            name: sauceObject.name,
            manufacturer: sauceObject.manufacturer,
            description: sauceObject.description,
            mainPepper: sauceObject.mainPepper,
            heat: sauceObject.heat
        });
        return res.status(200).json({ message: 'Sauce modifiée !' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur interne !' });
    }
};


// Suppression d'une seule sauce 
exports.deleteSauce = async (req, res) => {
    try {
        let sauce = await Sauce.findOne({ _id: req.params.id })
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, async () => {
            await sauce.deleteOne({ _id: req.params.id });
            return res.status(200).json({ message: "Sauce supprimée !" });
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).send("Internal error");
    }
}

// Ajout des likes et dislikes pour chaque sauce

exports.likeSauce = async (req, res) => {
    try {
        let sauce = await Sauce.findOne({ _id: req.params.id });
        if (!sauce) {
            throw res.status(404).json({ message: 'Sauce introuvable !' });
        }
        switch (req.body.like) {
            /* Si le client Like cette sauce */
            case 1:
                if (!sauce.usersLiked.includes(req.body.userId)) {
                    await Sauce.updateOne(
                        { _id: req.params.id },
                        {
                            $inc: { likes: 1 },
                            $push: { usersLiked: req.body.userId }
                        }
                    )
                }
                break;
            /* Si le client disike cette sauce */
            case -1:
                if (!sauce.usersDisliked.includes(req.body.userId)) {
                    await Sauce.updateOne(
                        { _id: req.params.id },
                        {
                            $inc: { dislikes: 1 },
                            $push: { usersDisliked: req.body.userId }
                        }
                    )
                }
                break;
            /* Si le client annule son choix */
            case 0:
                if (sauce.usersLiked.includes(req.body.userId)) {
                    await Sauce.updateOne(
                        { _id: req.params.id },
                        {
                            $inc: { likes: -1 },
                            $pull: { usersLiked: req.body.userId }
                        }
                    )
                }
                if (sauce.usersDisliked.includes(req.body.userId)) {
                    await Sauce.updateOne(
                        { _id: req.params.id },
                        {
                            $inc: { dislikes: -1 },
                            $pull: { usersDisliked: req.body.userId }
                        }
                    )
                }
                break;
        }
        return res.status(200).json({ message: 'Like ou Dislike mis à jour !' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur interne !' });
    }
};