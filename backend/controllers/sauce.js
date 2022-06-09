// Création des actions pour le modèle "sauce"
const Sauce = require("../models/Sauce");

// Ajout d'une sauce
exports.createSauce = (req, res, next) => {
    try {
        let sauce = new Sauce({
            userId: req.body.userId,
            name: req.body.name,
            manufacturer: req.body.manufacturer,
            description: req.body.description,
            mainPepper: req.body.mainPepper,
            imageUrl: req.body.imageUrl,
            heat: req.body.heat,
            likes: req.body.likes,
            dislikes: req.body.dislikes,
            usersLiked: req.body.usersLiked,
            usersDisliked: req.body.usersDisliked
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
exports.modifySauce = (req, res, next) => {
    try {
        let sauce = new Sauce({
            _id: req.params.id,
            userId: req.body.userId,
            name: req.body.name,
            manufacturer: req.body.manufacturer,
            description: req.body.description,
            mainPepper: req.body.mainPepper,
            imageUrl: req.body.imageUrl,
            heat: req.body.heat,
            likes: req.body.likes,
            dislikes: req.body.dislikes,
            usersLiked: req.body.usersLiked,
            usersDisliked: req.body.usersDisliked
        });
        await sauce.updateOne({ _id: req.params.id }, sauce);
        return res.status(200).json({ message: "Sauce modifiée!" })
    }
    catch (err) {
        console.error(err);
        return res.status(500).send("Internal error");
    }

};

// Suppression d'une seule sauce 
exports.deleteSauce = (req, res, next) => {
    try {
        await Sauce.deleteOne({ _id: req.params.id });
        return res.status(200).json({ message: "Sauce supprimée !" });
    }
    catch (err) {
        console.error(err);
        return res.status(500).send("Internal error");
    }
}

// Récupération des informations d'une seule sauce
exports.getOneSauce = (req, res, next) => {
    try {
        await Sauce.findOne({ _id: req.params.id, });
        return res.status(200).json(sauce)
    }
    catch (err) {
        console.error(err);
        return res.status(500).send("Internal error");
    }

};

// Récupération des informations de toutes les sauces
exports.getAllSauce = (req, res, next) => {
    try {
        await Sauce.find();
        return res.status(200).json(sauces);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send("Internal error");
    }
};

// Ajout des likes et dislikes pour chaque sauce