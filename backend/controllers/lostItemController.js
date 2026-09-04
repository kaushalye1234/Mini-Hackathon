const { User } = require("../models/User");
const { LostItem } = require("../models/LostItem");

const escapeRegex = (text) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

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

module.exports = {
  getLostItems,
  getLostItemById
};
