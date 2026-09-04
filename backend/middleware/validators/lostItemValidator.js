const { CATEGORIES, STATUSES } = require("../../models/LostItem");

const urlRegex = /^https?:\/\/.+/i;

const fail = (res, message) => res.status(400).json({ message });
const isBlank = (value) => typeof value !== "string" || value.trim().length === 0;

const validateItemName = (itemName, required, res) => {
  if (required && isBlank(itemName)) return fail(res, "Item name is required.");
  if (itemName !== undefined && isBlank(itemName)) return fail(res, "Item name is required.");
  if (itemName !== undefined && itemName.trim().length < 2) {
    return fail(res, "Item name must be at least 2 characters long.");
  }
  if (itemName !== undefined && itemName.trim().length > 80) {
    return fail(res, "Item name cannot exceed 80 characters.");
  }
  return null;
};

const validateCategory = (category, required, res) => {
  if (required && isBlank(category)) return fail(res, "Please select a category.");
  if (category !== undefined && !CATEGORIES.includes(category)) {
    return fail(res, "Please select a valid category.");
  }
  return null;
};

const validateDescription = (description, required, res) => {
  if (required && isBlank(description)) return fail(res, "Description is required.");
  if (description !== undefined && isBlank(description)) return fail(res, "Description is required.");
  if (description !== undefined && description.trim().length > 600) {
    return fail(res, "Description cannot exceed the allowed length.");
  }
  return null;
};

const validateLostLocation = (lostLocation, required, res) => {
  if (required && isBlank(lostLocation)) return fail(res, "Lost location is required.");
  if (lostLocation !== undefined && isBlank(lostLocation)) return fail(res, "Lost location is required.");
  if (lostLocation !== undefined && lostLocation.trim().length > 120) {
    return fail(res, "Lost location cannot exceed 120 characters.");
  }
  return null;
};

const validateLostDate = (lostDate, required, res) => {
  if (required && isBlank(lostDate)) return fail(res, "Please enter a valid lost date.");
  if (lostDate !== undefined && Number.isNaN(Date.parse(lostDate))) {
    return fail(res, "Please enter a valid lost date.");
  }
  return null;
};

const validateImageUrl = (imageUrl, res) => {
  if (imageUrl !== undefined && imageUrl !== "" && !urlRegex.test(imageUrl.trim())) {
    return fail(res, "Please enter a valid image URL.");
  }
  return null;
};

const validateStatus = (status, res) => {
  if (status !== undefined && !STATUSES.includes(status)) {
    return fail(res, "Please select a valid status.");
  }
  return null;
};

const trimBodyStrings = (req, res, next) => {
  Object.keys(req.body).forEach((key) => {
    if (typeof req.body[key] === "string") {
      req.body[key] = req.body[key].trim();
    }
  });
  next();
};

const validateCreateLostItem = (req, res, next) => {
  return (
    validateItemName(req.body.itemName, true, res) ||
    validateCategory(req.body.category, true, res) ||
    validateDescription(req.body.description, true, res) ||
    validateLostLocation(req.body.lostLocation, true, res) ||
    validateLostDate(req.body.lostDate, true, res) ||
    validateImageUrl(req.body.imageUrl, res) ||
    next()
  );
};

const validateUpdateLostItem = (req, res, next) => {
  return (
    validateItemName(req.body.itemName, false, res) ||
    validateCategory(req.body.category, false, res) ||
    validateDescription(req.body.description, false, res) ||
    validateLostLocation(req.body.lostLocation, false, res) ||
    validateLostDate(req.body.lostDate, false, res) ||
    validateImageUrl(req.body.imageUrl, res) ||
    validateStatus(req.body.status, res) ||
    next()
  );
};

module.exports = {
  trimBodyStrings,
  validateCreateLostItem,
  validateUpdateLostItem
};
