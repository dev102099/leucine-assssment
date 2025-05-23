const express = require("express");
const { signup, login, signout } = require("../controllers/userController");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", signout);
module.exports = router;
