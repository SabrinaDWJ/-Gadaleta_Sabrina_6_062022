const mongoose = require('mongoose');

// Importation du module empechant la création de deux comptes avec le même email
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  });

  userSchema.plugin(uniqueValidator);

  module.exports = mongoose.model('User', userSchema);