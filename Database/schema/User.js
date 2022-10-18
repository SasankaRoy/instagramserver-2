const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      require: true,
      min: 3,
      max: 10,
    },
    email: {
      type: String,
      unique: true,
      require: true,
    },
    password: {
      type: String,
      require: true,
      min: 5,
      max: 15,
      require: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    following: {
      type: Array,
      default: [],
    },
    followers: {
      type: Array,
      default: [],
    },
    status: {
      type: String,
    },
    city:{
      type: String,
    },
    education:{
      type: String,
    },
    DateOfBirth: {
      type: String,
    },
    hobbies: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", userSchema);
