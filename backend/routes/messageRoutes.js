const express = require("express");
const {
  sendMessage,
  getInbox,
  getSent,
  getMessageById,
  replyToMessage,
  markAsRead
} = require("../controllers/messageController");
const authMiddleware = require("../middleware/authMiddleware");
const {
  validateSendMessage,
  validateReply,
  validateMessageId
} = require("../middleware/validators/messageValidator");

const router = express.Router();

// All message routes require authentication
router.use(authMiddleware);

router.post("/", validateSendMessage, sendMessage);
router.get("/inbox", getInbox);
router.get("/sent", getSent);
router.get("/:id", validateMessageId, getMessageById);
router.post("/:id/reply", validateReply, replyToMessage);
router.patch("/:id/read", validateMessageId, markAsRead);

module.exports = router;
