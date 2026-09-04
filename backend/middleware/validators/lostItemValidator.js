const { CATEGORIES, STATUSES } = require("../../models/LostItem");

const urlRegex = /^https?:\/\/.+/i;

const fail = (res, message) => res.status(400).json({ message });
const isBlank = (value) => typeof value !== "string" || value.trim().length === 0;

const isFutureDate = (value) => {
  const selected = new Date(value);
  const today = new Date();
  selected.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return selected > today;
};

const validateItemName = (itemName, required, res) => {
  if (required && isBlank(itemName)) return fail(res, "Item name is required.");
  if (itemName === undefined) return null;
  if (isBlank(itemName)) return fail(res, "Item name is required.");

  const value = itemName.trim();
  if (value.length < 2) return fail(res, "Item name needs 2 characters.");
  if (value.length > 80) return fail(res, "Item name is too long.");

  return null;
};

const validateCategory = (category, required, res) => {
  if (required && isBlank(category)) return fail(res, "Select a category.");
  if (category !== undefined && !CATEGORIES.includes(category)) {
    return fail(res, "Select a valid category.");
  }
  return null;
};

const validateDescription = (description, required, res) => {
  if (required && isBlank(description)) return fail(res, "Description is required.");
  if (description === undefined) return null;
  if (isBlank(description)) return fail(res, "Description is required.");

  const value = description.trim();
  if (value.length < 10) return fail(res, "Add more description.");
  if (value.length > 600) return fail(res, "Description is too long.");

  return null;
};

const validateLostLocation = (lostLocation, required, res) => {
  if (required && isBlank(lostLocation)) return fail(res, "Location is required.");
  if (lostLocation === undefined) return null;
  if (isBlank(lostLocation)) return fail(res, "Location is required.");

  const value = lostLocation.trim();
  if (value.length < 3) return fail(res, "Location needs 3 characters.");
  if (value.length > 120) return fail(res, "Location is too long.");

  return null;
};

const validateLostDate = (lostDate, required, res) => {
  if (required && isBlank(lostDate)) return fail(res, "Select a valid date.");
  if (lostDate === undefined) return null;
  if (isBlank(lostDate) || Number.isNaN(Date.parse(lostDate))) {
    return fail(res, "Select a valid date.");
  }
  if (isFutureDate(lostDate)) return fail(res, "You can't set a future date.");

  return null;
};

const validateImageUrl = (imageUrl, res) => {
  if (imageUrl !== undefined && imageUrl !== "" && !urlRegex.test(imageUrl.trim())) {
    return fail(res, "Enter a valid image URL.");
  }
  return null;
};

const validateStatus = (status, res) => {
  if (status !== undefined && !STATUSES.includes(status)) {
    return fail(res, "Select a valid status.");
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

const validateLostItemFilters = (req, res, next) => {
  const { search = "", category = "", location = "", status = "", lostDate = "" } = req.query;

  if (typeof search !== "string" || search.trim().length > 80) return fail(res, "Search is too long.");
  if (typeof location !== "string" || location.trim().length > 120) return fail(res, "Location is too long.");
  if (category && !CATEGORIES.includes(category)) return fail(res, "Select a valid category.");
  if (status && !STATUSES.includes(status)) return fail(res, "Select a valid status.");
  if (lostDate) {
    const result = validateLostDate(lostDate, false, res);
    if (result) return result;
  }

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
  validateUpdateLostItem,
  validateLostItemFilters
};
