const express = require("express");
const {
  getLostItems,
  getMyLostItems,
  getLostItemById,
  createLostItem,
  updateLostItem,
  deleteLostItem,
  resolveLostItem
} = require("../controllers/lostItemController");
const authMiddleware = require("../middleware/authMiddleware");
const {
  validateSearchQuery,
  validateItemId,
  validateCreateBody,
  validateUpdateBody
} = require("../middleware/validators/lostItemValidator");

const router = express.Router();

// Public routes
router.get("/", validateSearchQuery, getLostItems);

// Protected routes — must be authenticated
// NOTE: /my must come before /:id to avoid "my" being treated as a MongoDB ID
router.get("/my", authMiddleware, getMyLostItems);
router.get("/:id", validateItemId, getLostItemById);

router.post("/", authMiddleware, validateCreateBody, createLostItem);
router.put("/:id", authMiddleware, validateItemId, validateUpdateBody, updateLostItem);
router.delete("/:id", authMiddleware, validateItemId, deleteLostItem);
router.patch("/:id/resolve", authMiddleware, validateItemId, resolveLostItem);

module.exports = router;
