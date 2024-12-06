const mongoose = require('mongoose');
const argon2 = require('argon2');

const AuthorSchema = new mongoose.Schema({
  name: String,
  picture: String,
  authorDetails: String,
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  socialLinks: {
    facebook: {
      type: String,
      trim: true,
      default: ''
    },
    twitter: {
      type: String,
      trim: true,
      default: ''
    },
    linkedin: {
      type: String,
      trim: true,
      default: ''
    },
  }
});

// Hash the password before saving the author model
AuthorSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await argon2.hash(this.password);
  }
  next();
});

module.exports = mongoose.model('Author', AuthorSchema);
