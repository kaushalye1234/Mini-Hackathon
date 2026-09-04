const { v2: cloudinary } = require("cloudinary");

cloudinary.config({ secure: true });

module.exports = cloudinary;
