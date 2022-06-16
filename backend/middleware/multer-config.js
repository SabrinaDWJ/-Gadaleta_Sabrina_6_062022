// Récupération des images stockées sur le serveur

const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': '.jpg',
    'image/jpeg': '.jpg',
    'image/png': '.png'
};

// Définition du lieu de stockage
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    // Définition du nom du fichier image
    filename: (req, file, callback) => {
        const extension = MIME_TYPES[file.mimetype];
        const name = file.originalname.split(extension).join('_');
        callback(null, name + Date.now() + extension);
    }
});

module.exports = multer({ storage: storage }).single('image');