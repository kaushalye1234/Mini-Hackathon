const mongoose = require("mongoose");
const { LostItem } = require("../models/LostItem");

const sanitizeLostItem = (item) => item.toJSON();

const assertValidId = (id, label = "ID") => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error(`Invalid ${label} format`);
    error.statusCode = 400;
    throw error;
  }
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const populateReporter = (query) => query.populate("reportedBy", "name email role");

const buildFilters = ({ search, category, location, status, lostDate }) => {
  const filters = {};

  if (search) {
    const regex = new RegExp(escapeRegex(search.trim()), "i");
    filters.$or = [{ itemName: regex }, { description: regex }];
  }

  if (category) filters.category = category;
  if (status) filters.status = status;

  if (location) {
    filters.lostLocation = new RegExp(escapeRegex(location.trim()), "i");
  }

  if (lostDate && !Number.isNaN(Date.parse(lostDate))) {
    const start = new Date(lostDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    filters.lostDate = { $gte: start, $lt: end };
  }

  return filters;
};

const getLostItems = async (query) => {
  const items = await populateReporter(LostItem.find(buildFilters(query))).sort({ createdAt: -1 });
  return items.map(sanitizeLostItem);
};

const getMyLostItems = async (userId) => {
  const items = await populateReporter(LostItem.find({ reportedBy: userId })).sort({ createdAt: -1 });
  return items.map(sanitizeLostItem);
};

const getLostItemById = async (id) => {
  assertValidId(id, "lost item ID");

  const item = await populateReporter(LostItem.findById(id));
  if (!item) {
    const error = new Error("Lost item not found.");
    error.statusCode = 404;
    throw error;
  }

  return sanitizeLostItem(item);
};

const createLostItem = async (payload, userId) => {
  const item = await LostItem.create({
    itemName: payload.itemName,
    category: payload.category,
    description: payload.description,
    lostLocation: payload.lostLocation,
    lostDate: payload.lostDate,
    imageUrl: payload.imageUrl || "",
    reportedBy: userId
  });

  const populated = await populateReporter(LostItem.findById(item._id));
  return sanitizeLostItem(populated);
};

const assertOwner = (item, userId) => {
  if (item.reportedBy.toString() !== userId.toString()) {
    const error = new Error("You can only manage your own lost items.");
    error.statusCode = 403;
    throw error;
  }
};

const ensureLostItemOwner = async (id, userId) => {
  assertValidId(id, "lost item ID");

  const item = await LostItem.findById(id);
  if (!item) {
    const error = new Error("Lost item not found.");
    error.statusCode = 404;
    throw error;
  }

  assertOwner(item, userId);
  return sanitizeLostItem(item);
};
const updateLostItem = async (id, payload, userId) => {
  assertValidId(id, "lost item ID");

  const item = await LostItem.findById(id);
  if (!item) {
    const error = new Error("Lost item not found.");
    error.statusCode = 404;
    throw error;
  }

  assertOwner(item, userId);

  const allowedUpdates = ["itemName", "category", "description", "lostLocation", "lostDate", "imageUrl"];
  allowedUpdates.forEach((key) => {
    if (payload[key] !== undefined) {
      item[key] = payload[key];
    }
  });

  await item.save();
  const populated = await populateReporter(LostItem.findById(item._id));
  return sanitizeLostItem(populated);
};

const deleteLostItem = async (id, userId) => {
  assertValidId(id, "lost item ID");

  const item = await LostItem.findById(id);
  if (!item) {
    const error = new Error("Lost item not found.");
    error.statusCode = 404;
    throw error;
  }

  assertOwner(item, userId);
  await item.deleteOne();
};

const resolveLostItem = async (id, userId) => {
  assertValidId(id, "lost item ID");

  const item = await LostItem.findById(id);
  if (!item) {
    const error = new Error("Lost item not found.");
    error.statusCode = 404;
    throw error;
  }

  assertOwner(item, userId);
  item.status = "RESOLVED";
  await item.save();

  const populated = await populateReporter(LostItem.findById(item._id));
  return sanitizeLostItem(populated);
};

module.exports = {
  getLostItems,
  getMyLostItems,
  getLostItemById,
  createLostItem,
  updateLostItem,
  deleteLostItem,
  resolveLostItem,
  ensureLostItemOwner
};
