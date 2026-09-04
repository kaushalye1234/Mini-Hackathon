const express = require("express");
const {
  createLostItem,
  deleteLostItem,
  getLostItemById,
  getLostItems,
  getMyLostItems,
  resolveLostItem,
  updateLostItem
} = require("../controllers/lostItemController");
const authMiddleware = require("../middleware/authMiddleware");
const { uploadLostItemImage } = require("../middleware/uploadMiddleware");
const {
  trimBodyStrings,
  validateCreateLostItem,
  validateUpdateLostItem,
  validateLostItemFilters
} = require("../middleware/validators/lostItemValidator");

const router = express.Router();

router.use(authMiddleware);

router.get("/", validateLostItemFilters, getLostItems);
router.post("/", uploadLostItemImage, trimBodyStrings, validateCreateLostItem, createLostItem);
router.get("/my", getMyLostItems);
router.patch("/:id/resolve", resolveLostItem);
router.get("/:id", getLostItemById);
router.put("/:id", uploadLostItemImage, trimBodyStrings, validateUpdateLostItem, updateLostItem);
router.delete("/:id", deleteLostItem);

module.exports = router;
