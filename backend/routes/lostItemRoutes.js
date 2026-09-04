const express = require("express");
const { getLostItems, getLostItemById } = require("../controllers/lostItemController");
const {
  validateSearchQuery,
  validateItemId
} = require("../middleware/validators/lostItemValidator");

const router = express.Router();

router.get("/", validateSearchQuery, getLostItems);
router.get("/:id", validateItemId, getLostItemById);

module.exports = router;
