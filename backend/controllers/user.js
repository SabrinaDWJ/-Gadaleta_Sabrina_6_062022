const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const User = require('../models/User');

// Création d'un compte utilisateur 
exports.signup = async (req, res) => {
    try {
        let hash = await bcrypt.hash(req.body.password, 10)
        const user = await new User({
            email: req.body.email,
            password: hash
        });
        await user.save()
        return res.status(201).json({ message: 'Utilisateur créé !' })

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur interne !' });
    }
};

// Connexion à un compte utilisateur
exports.login = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé !' });
        }
        let valid = bcrypt.compare(req.body.password, user.password)
        if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
        }
        return res.status(200).json({
            userId: user._id,
            token: jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
            )
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur interne !' });
    }
};