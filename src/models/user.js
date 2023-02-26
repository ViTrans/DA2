const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  avatar: {
    type: String,
    required: false,
    unique: true,
    trim: true,
    minlength: 3,
  },
  posts: {
    type: Array,
    required: false,
    unique: true,
    trim: true,
    minlength: 3,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
userSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};
module.exports = mongoose.model("Users", userSchema);
