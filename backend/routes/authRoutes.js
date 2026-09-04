const express = require("express");
const { adminLogin, getMe, login, logout, register } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const {
  trimBodyStrings,
  validateLogin,
  validateRegister
} = require("../middleware/validators/userValidator");

const router = express.Router();

router.post("/register", trimBodyStrings, validateRegister, register);
router.post("/login", trimBodyStrings, validateLogin, login);
router.post("/admin/login", trimBodyStrings, validateLogin, adminLogin);
router.get("/me", authMiddleware, getMe);
router.post("/logout", authMiddleware, logout);

module.exports = router;
