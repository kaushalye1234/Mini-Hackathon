const mongoose = require("mongoose");
const { CATEGORIES, STATUSES } = require("../../models/LostItem");

const fail = (res, status, message) => res.status(status).json({ message });

/* ── Helpers ─────────────────────────────────────────────── */

const isBlank = (v) => typeof v !== "string" || v.trim().length === 0;

const isValidUrl = (str) => {
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

/* ── Search query validator (GET /api/lost-items) ───────── */

const validateSearchQuery = (req, res, next) => {
  const { search, category, location, status } = req.query;

  if (status && status !== "ALL" && !STATUSES.includes(status.toUpperCase())) {
    return fail(res, 400, `Status must be one of: ${STATUSES.join(", ")} or ALL`);
  }

  if (category && category !== "ALL" && !CATEGORIES.includes(category)) {
    return fail(res, 400, "Category must be a valid category or ALL");
  }

  if (search && typeof search === "string" && search.trim().length > 100) {
    return fail(res, 400, "Search query is too long (maximum 100 characters)");
  }

  next();
};

/* ── ID param validator ──────────────────────────────────── */

const validateItemId = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return fail(res, 400, "Invalid Lost Item ID format");
  }

  next();
};

/* ── Create body validator ───────────────────────────────── */

const validateCreateBody = (req, res, next) => {
  const { itemName, category, location, dateLost, description, imageUrl } = req.body;

  if (isBlank(itemName)) {
    return fail(res, 400, "Item name is required.");
  }

  if (itemName && itemName.trim().length > 100) {
    return fail(res, 400, "Item name cannot exceed 100 characters.");
  }

  if (isBlank(category)) {
    return fail(res, 400, "Please select a category.");
  }

  if (!CATEGORIES.includes(category.trim())) {
    return fail(res, 400, `Please select a valid category.`);
  }

  if (isBlank(location)) {
    return fail(res, 400, "Lost location is required.");
  }

  if (isBlank(dateLost)) {
    return fail(res, 400, "Please enter a valid lost date.");
  }

  const parsedDate = new Date(dateLost);
  if (isNaN(parsedDate.getTime())) {
    return fail(res, 400, "Please enter a valid lost date.");
  }

  if (parsedDate > new Date()) {
    return fail(res, 400, "Lost date cannot be in the future.");
  }

  if (description && description.trim().length > 1000) {
    return fail(res, 400, "Description cannot exceed the allowed length.");
  }

  if (imageUrl && imageUrl.trim() !== "" && !isValidUrl(imageUrl.trim())) {
    return fail(res, 400, "Please enter a valid image URL (must start with http or https).");
  }

  next();
};

/* ── Update body validator ───────────────────────────────── */

const validateUpdateBody = (req, res, next) => {
  const { itemName, category, location, dateLost, description, imageUrl } = req.body;

  if (itemName !== undefined && isBlank(itemName)) {
    return fail(res, 400, "Item name is required.");
  }

  if (itemName && itemName.trim().length > 100) {
    return fail(res, 400, "Item name cannot exceed 100 characters.");
  }

  if (category !== undefined) {
    if (isBlank(category)) {
      return fail(res, 400, "Please select a category.");
    }
    if (!CATEGORIES.includes(category.trim())) {
      return fail(res, 400, "Please select a valid category.");
    }
  }

  if (location !== undefined && isBlank(location)) {
    return fail(res, 400, "Lost location is required.");
  }

  if (dateLost !== undefined) {
    const parsedDate = new Date(dateLost);
    if (isNaN(parsedDate.getTime())) {
      return fail(res, 400, "Please enter a valid lost date.");
    }
    if (parsedDate > new Date()) {
      return fail(res, 400, "Lost date cannot be in the future.");
    }
  }

  if (description && description.trim().length > 1000) {
    return fail(res, 400, "Description cannot exceed the allowed length.");
  }

  if (imageUrl && imageUrl.trim() !== "" && !isValidUrl(imageUrl.trim())) {
    return fail(res, 400, "Please enter a valid image URL (must start with http or https).");
  }

  next();
};

module.exports = {
  validateSearchQuery,
  validateItemId,
  validateCreateBody,
  validateUpdateBody
};
