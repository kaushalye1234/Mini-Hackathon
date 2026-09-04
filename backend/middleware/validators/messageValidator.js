const fail = (res, message) => res.status(400).json({ message });
const isBlank = (value) => typeof value !== "string" || value.trim().length === 0;

const trimBodyStrings = (req, res, next) => {
  Object.keys(req.body).forEach((key) => {
    if (typeof req.body[key] === "string") {
      req.body[key] = req.body[key].trim();
    }
  });
  next();
};

const validateMessageText = (req, res, next) => {
  if (isBlank(req.body.message)) {
    return fail(res, "Message cannot be empty.");
  }

  if (req.body.message.trim().length > 1000) {
    return fail(res, "Message cannot exceed 1000 characters.");
  }

  next();
};

const validateCreateMessage = (req, res, next) => {
  if (isBlank(req.body.lostItemId)) {
    return fail(res, "Lost item is required.");
  }

  return validateMessageText(req, res, next);
};

module.exports = {
  trimBodyStrings,
  validateCreateMessage,
  validateMessageText
};
