const mongoose = require("mongoose");
const { CATEGORIES, STATUSES } = require("../../models/LostItem");

const fail = (res, message) => res.status(400).json({ message });

const validateSearchQuery = (req, res, next) => {
  const { search, category, location, status } = req.query;

  if (status && status !== "ALL" && !STATUSES.includes(status.toUpperCase())) {
    return fail(res, `Status must be one of: ${STATUSES.join(", ")} or ALL`);
  }

  if (category && category !== "ALL" && !CATEGORIES.includes(category)) {
    return fail(res, `Category must be a valid category or ALL`);
  }

  if (search && typeof search === "string" && search.trim().length > 100) {
    return fail(res, "Search query is too long (maximum 100 characters)");
  }

  next();
};

const validateItemId = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return fail(res, "Invalid Lost Item ID format");
  }

  next();
};

module.exports = {
  validateSearchQuery,
  validateItemId
};
