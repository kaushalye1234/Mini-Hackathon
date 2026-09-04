const express = require("express");
const {
  createMessage,
  getInbox,
  getMessageById,
  getSent,
  markMessageRead,
  replyToMessage
} = require("../controllers/messageController");
const authMiddleware = require("../middleware/authMiddleware");
const {
  trimBodyStrings,
  validateCreateMessage,
  validateMessageText
} = require("../middleware/validators/messageValidator");

const router = express.Router();

router.use(authMiddleware);

router.post("/", trimBodyStrings, validateCreateMessage, createMessage);
router.get("/inbox", getInbox);
router.get("/sent", getSent);
router.post("/:id/reply", trimBodyStrings, validateMessageText, replyToMessage);
router.patch("/:id/read", markMessageRead);
router.get("/:id", getMessageById);

module.exports = router;
