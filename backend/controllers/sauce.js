// Création des actions pour le modèle "sauce"
const Sauce = require("../models/Sauce");
const fs = require('fs');

// Ajout d'une sauce
exports.createSauce = async (req, res) => {
    try {
        const sauceObject = JSON.parse(req.body.sauce);
        delete sauceObject._id;
        let sauce = new Sauce({
            // userId: sauceObject.userId,
            // name: sauceObject.name,
            // manufacturer: sauceObject.manufacturer,
            // description: sauceObject.description,
            // mainPepper: sauceObject.mainPepper,
            ...sauceObject,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            // heat: sauceObject.heat,
            // likes: 0,
            // dislikes: 0,
            // usersLiked: [],
            // usersDisliked: []
        });
        await sauce.save();
        return res.status(201).json({ message: "Sauce enregistrée !" })
    }
    catch (err) {
        console.error(err);
        return res.status(500).send("Internal error");
    };
}

// Modification des informations d'une seule sauce
exports.modifySauce = async (req, res) => {
    try {
        let sauceObject = req.file ?
            {
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            }
            : { ...req.body };
            await Sauce.updateOne({ _id: req.params.id }, {
            _id: req.params.id,
            userId: sauceObject.userId,
            name: sauceObject.name,
            manufacturer: sauceObject.manufacturer,
            description: sauceObject.description,
            mainPepper: sauceObject.mainPepper,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
            heat: sauceObject.heat,
        });
        return res.status(200).json({ message: "Sauce modifiée!" })
    }
    catch (err) {
        console.error(err);
        return res.status(500).send("Internal error");
    }

};

// Suppression d'une seule sauce 
exports.deleteSauce = async (req, res, next) => {
    try {
        let sauce = Sauce.findOne({ _id: req.params.id })
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, async () => {
            await Sauce.deleteOne({ _id: req.params.id });
            return res.status(200).json({ message: "Sauce supprimée !" });
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).send("Internal error");
    }
}

    // Récupération des informations d'une seule sauce
    exports.getOneSauce = async (req, res, next) => {
        try {
            await Sauce.findOne({ _id: req.params.id, });
            return res.status(200).json(Sauce)
        }
        catch (err) {
            console.error(err);
            return res.status(500).send("Internal error");
        }

    };

    // Récupération des informations de toutes les sauces
    exports.getAllSauce = async (req, res, next) => {
        try {
            await Sauce.find();
            return res.status(200).json(Sauce);
        }
        catch (err) {
            console.error(err);
            return res.status(500).send("Internal error");
        }
    };

// Ajout des likes et dislikes pour chaque sauce