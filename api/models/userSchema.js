const mongoose = require("mongoose");
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  todo: [todoSchema],
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
