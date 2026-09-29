const cloudinary = require("../config/cloudinary");
const lostItemService = require("../services/lostItemService");

const uploadImageToCloudinary = (file) => {
  if (!file) return Promise.resolve(null);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "campusfind-lk/lost-items",
        resource_type: "image"
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    
    uploadStream.end(file.buffer);
  });
};

const getLostItems = async (req, res, next) => {
  try {
    const lostItems = await lostItemService.getLostItems(req.query);
    res.status(200).json({ lostItems });
  } catch (error) {
    next(error);
  }
};

const getMyLostItems = async (req, res, next) => {
  try {
    const lostItems = await lostItemService.getMyLostItems(req.user._id);
    res.status(200).json({ lostItems });
  } catch (error) {
    next(error);
  }
};

const getLostItemById = async (req, res, next) => {
  try {
    const lostItem = await lostItemService.getLostItemById(req.params.id);
    res.status(200).json({ lostItem });
  } catch (error) {
    next(error);
  }
};

const createLostItem = async (req, res, next) => {
  try {
    const imageUrl = await uploadImageToCloudinary(req.file);
    const lostItem = await lostItemService.createLostItem(
      { ...req.body, imageUrl: imageUrl || "" },
      req.user._id
    );
    res.status(201).json({ lostItem, message: "Lost item reported successfully." });
  } catch (error) {
    next(error);
  }
};

const updateLostItem = async (req, res, next) => {
  try {
    await lostItemService.ensureLostItemOwner(req.params.id, req.user._id);
    const imageUrl = await uploadImageToCloudinary(req.file);
    const updates = imageUrl ? { ...req.body, imageUrl } : req.body;
    const lostItem = await lostItemService.updateLostItem(req.params.id, updates, req.user._id);
    res.status(200).json({ lostItem, message: "Lost item updated successfully." });
  } catch (error) {
    next(error);
  }
};

const deleteLostItem = async (req, res, next) => {
  try {
    await lostItemService.deleteLostItem(req.params.id, req.user._id);
    res.status(200).json({ message: "Lost item deleted successfully." });
  } catch (error) {
    next(error);
  }
};

const resolveLostItem = async (req, res, next) => {
  try {
    const lostItem = await lostItemService.resolveLostItem(req.params.id, req.user._id);
    res.status(200).json({ lostItem, message: "Lost item marked as resolved." });
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
