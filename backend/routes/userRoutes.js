const express = require("express");
const {
  createUser,
  deleteUser,
  getAllUsers,
  getDashboardStats,
  getUserById,
  updateProfile,
  updateUser
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const {
  trimBodyStrings,
  validateCreateUser,
  validateUpdateProfile,
  validateUpdateUser
} = require("../middleware/validators/userValidator");

const router = express.Router();
const adminOnly = [authMiddleware, authorizeRoles("admin")];

router.put("/profile", authMiddleware, trimBodyStrings, validateUpdateProfile, updateProfile);
router.get("/stats", ...adminOnly, getDashboardStats);
router.get("/", ...adminOnly, getAllUsers);
router.post("/", ...adminOnly, trimBodyStrings, validateCreateUser, createUser);
router.get("/:id", ...adminOnly, getUserById);
router.put("/:id", ...adminOnly, trimBodyStrings, validateUpdateUser, updateUser);
router.delete("/:id", ...adminOnly, deleteUser);

module.exports = router;
