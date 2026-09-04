const mongoose = require("mongoose");

const fail = (res, status, message) => res.status(status).json({ message });

const validateSendMessage = (req, res, next) => {
  const { lostItemId, message } = req.body;

  if (!lostItemId || !mongoose.Types.ObjectId.isValid(lostItemId)) {
    return fail(res, 400, "Invalid or missing Lost Item ID");
  }

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return fail(res, 400, "Message cannot be empty");
  }

  if (message.trim().length > 1000) {
    return fail(res, 400, "Message cannot exceed 1000 characters");
  }

  next();
};

const validateReply = (req, res, next) => {
  const { id } = req.params;
  const { message } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return fail(res, 400, "Invalid message ID");
  }

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return fail(res, 400, "Message cannot be empty");
  }

  if (message.trim().length > 1000) {
    return fail(res, 400, "Message cannot exceed 1000 characters");
  }

  next();
};

const validateMessageId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return fail(res, 400, "Invalid message ID");
  }
  next();
};

module.exports = { validateSendMessage, validateReply, validateMessageId };
