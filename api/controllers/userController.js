const userModel = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all the fields" });
    }
    const user = await userModel.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    const hashedPass = await bcrypt.hashSync(password, 10);
    const newUser = new userModel({
      name,
      email,
      password: hashedPass,
    });
    await newUser.save();

    return res.status(200).json({ newUser });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all the fields" });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    const isMatch = await bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const { password2, ...others } = user._doc;
    return res
      .cookie("access_token", token, {
        httpOnly: true,
        smaeSite: "none",
        secure: true,
      })
      .status(200)
      .json({ success: true, message: "Login successful", others });
  } catch (error) {
    next(error);
  }
};
const signout = async (req, res) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      smaeSite: "none",
      secure: true,
    });
    return res
      .status(200)
      .json({ success: true, message: "Logout successful" });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  signup,
  login,
  signout,
};
