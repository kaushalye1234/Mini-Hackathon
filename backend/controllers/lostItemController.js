const { LostItem } = require("../models/LostItem");

/* ── Helper ──────────────────────────────────────────────── */

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const isOwnerOrAdmin = (item, user) => {
  return (
    user.role === "admin" ||
    item.reportedBy._id.toString() === user._id.toString() ||
    item.reportedBy.toString() === user._id.toString()
  );
};

/* ── GET /api/lost-items ─────────────────────────────────── */
// Compatible with Member 3 search/filter integration.
// Supports: ?search, ?category, ?location, ?status, ?date query params.

const getLostItems = async (req, res, next) => {
  try {
    const { search, category, location, status, date } = req.query;

    const query = {};

    if (search && search.trim() !== "") {
      const sanitizedSearch = escapeRegex(search.trim());
      const searchRegex = new RegExp(sanitizedSearch, "i");

      query.$or = [
        { itemName: searchRegex },
        { description: searchRegex }
      ];
    }

    if (category && category.trim() !== "" && category.toUpperCase() !== "ALL") {
      query.category = category.trim();
    }

    if (location && location.trim() !== "") {
      const sanitizedLocation = escapeRegex(location.trim());
      query.location = new RegExp(sanitizedLocation, "i");
    }

    if (status && status.trim() !== "" && status.toUpperCase() !== "ALL") {
      query.status = status.trim().toUpperCase();
    }

    if (date && date.trim() !== "") {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        query.dateLost = { $gte: parsedDate };
      }
    }

    const items = await LostItem.find(query)
      .populate("reportedBy", "name email")
      .sort({ dateLost: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

/* ── GET /api/lost-items/my ──────────────────────────────── */
// Returns only the authenticated user's own lost items.

const getMyLostItems = async (req, res, next) => {
  try {
    const items = await LostItem.find({ reportedBy: req.user._id })
      .populate("reportedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

/* ── GET /api/lost-items/:id ─────────────────────────────── */

const getLostItemById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const item = await LostItem.findById(id).populate("reportedBy", "name email");

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Lost item not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

/* ── POST /api/lost-items ────────────────────────────────── */
// reportedBy is always taken from req.user — never from body.

const createLostItem = async (req, res, next) => {
  try {
    const { itemName, category, location, dateLost, description, imageUrl } = req.body;

    const item = await LostItem.create({
      itemName: itemName.trim(),
      category: category.trim(),
      location: location.trim(),
      dateLost: new Date(dateLost),
      description: description ? description.trim() : "",
      imageUrl: imageUrl ? imageUrl.trim() : "",
      reportedBy: req.user._id
    });

    const populated = await item.populate("reportedBy", "name email");

    return res.status(201).json({
      success: true,
      message: "Lost item reported successfully",
      data: populated
    });
  } catch (error) {
    next(error);
  }
};

/* ── PUT /api/lost-items/:id ─────────────────────────────── */
// Only owner or admin can update.

const updateLostItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const item = await LostItem.findById(id);

    if (!item) {
      return res.status(404).json({ success: false, message: "Lost item not found" });
    }

    if (!isOwnerOrAdmin(item, req.user)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: you can only edit your own lost item reports"
      });
    }

    // Build update object from allowed fields only
    const { itemName, category, location, dateLost, description, imageUrl } = req.body;

    if (itemName !== undefined) item.itemName = itemName.trim();
    if (category !== undefined) item.category = category.trim();
    if (location !== undefined) item.location = location.trim();
    if (dateLost !== undefined) item.dateLost = new Date(dateLost);
    if (description !== undefined) item.description = description.trim();
    if (imageUrl !== undefined) item.imageUrl = imageUrl.trim();

    await item.save();

    const populated = await item.populate("reportedBy", "name email");

    return res.status(200).json({
      success: true,
      message: "Lost item updated successfully",
      data: populated
    });
  } catch (error) {
    next(error);
  }
};

/* ── DELETE /api/lost-items/:id ──────────────────────────── */
// Only owner or admin can delete.

const deleteLostItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const item = await LostItem.findById(id);

    if (!item) {
      return res.status(404).json({ success: false, message: "Lost item not found" });
    }

    if (!isOwnerOrAdmin(item, req.user)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: you can only delete your own lost item reports"
      });
    }

    await item.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Lost item deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

/* ── PATCH /api/lost-items/:id/resolve ───────────────────── */
// Marks item as RESOLVED. Only owner or admin.

const resolveLostItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const item = await LostItem.findById(id);

    if (!item) {
      return res.status(404).json({ success: false, message: "Lost item not found" });
    }

    if (!isOwnerOrAdmin(item, req.user)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: only the owner can mark this item as resolved"
      });
    }

    if (item.status === "RESOLVED") {
      return res.status(400).json({
        success: false,
        message: "Item is already marked as resolved"
      });
    }

    item.status = "RESOLVED";
    await item.save();

    const populated = await item.populate("reportedBy", "name email");

    return res.status(200).json({
      success: true,
      message: "Item marked as resolved",
      data: populated
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLostItems,
  getMyLostItems,
  getLostItemById,
  createLostItem,
  updateLostItem,
  deleteLostItem,
  resolveLostItem
};
