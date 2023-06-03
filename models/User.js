const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  votes: { type: Number, default: 0 }, // add votes field
  candidate: { type: Boolean, default: false },  // New attribute candidate set to false
  voted_for : { type: Array, default: [] } // add voted for to track votes

});

module.exports = mongoose.model('User', UserSchema);
