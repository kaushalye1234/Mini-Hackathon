const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Please upload an image file."));
    }

    cb(null, true);
  }
});

const uploadLostItemImage = (req, res, next) => {
  upload.single("image")(req, res, (error) => {
    if (!error) {
      return next();
    }

    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "Image cannot exceed 5 MB." });
    }

    return res.status(400).json({ message: error.message || "Image upload failed." });
  });
};

module.exports = { uploadLostItemImage };
