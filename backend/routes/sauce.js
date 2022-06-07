// Création des actions pour le modèle "sauce"
const Sauce = require("../models/Sauce");

// Ajout d'une sauce
exports.createSauce = (req, res, next) => {
    const sauce = new Sauce({
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
    sauce.save()
        .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
        .catch((error) => res.status(400).json({ error }));
};

// Modification des informations d'une seule sauce
exports.modifySauce = (req, res, next) => {
    const sauce = new Sauce({
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
    sauce.updateOne({ _id: req.params.id }, sauce)
        .then(() => res.status(200).json({ message: "Sauce modifiée!" }))
        .catch((error) => res.status(400).json({ error }));
};

// Suppression d'une seule sauce 
exports.deleteSauce = (req, res, next) => {
    Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
        .catch((error) => res.status(400).json({ error }));
};

// Récupération des informations d'une seule sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id, })
        .then((sauce) => { res.status(200).json(sauce)})
        .catch((error) => {res.status(404).json({ error: error})});
        
};

// Récupération des informations de toutes les sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then((sauces) => { res.status(200).json(sauces); })
        .catch((error) => {
            res.status(400).json({ error: error, });
        });
};

// Ajout des likes et dislikes pour chaque sauce