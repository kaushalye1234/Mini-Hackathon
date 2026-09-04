const mongoose = require("mongoose");

const STATUSES = ["LOST", "RESOLVED"];
const CATEGORIES = [
  "Electronics",
  "Wallet / Purse",
  "ID / Documents",
  "Books",
  "Clothing",
  "Bags",
  "Keys",
  "Accessories",
  "Other"
];

const lostItemSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: [true, "Item name is required."],
      trim: true,
      minlength: [2, "Item name must be at least 2 characters long."],
      maxlength: [80, "Item name cannot exceed 80 characters."]
    },
    category: {
      type: String,
      required: [true, "Please select a category."],
      enum: CATEGORIES
    },
    description: {
      type: String,
      required: [true, "Description is required."],
      trim: true,
      maxlength: [600, "Description cannot exceed 600 characters."]
    },
    lostLocation: {
      type: String,
      required: [true, "Lost location is required."],
      trim: true,
      maxlength: [120, "Lost location cannot exceed 120 characters."]
    },
    lostDate: {
      type: Date,
      required: [true, "Please enter a valid lost date."]
    },
    imageUrl: {
      type: String,
      trim: true,
      default: ""
    },
    status: {
      type: String,
      enum: STATUSES,
      default: "LOST"
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

lostItemSchema.index({ itemName: "text", description: "text" });
lostItemSchema.index({ reportedBy: 1, createdAt: -1 });
lostItemSchema.index({ category: 1, status: 1 });

lostItemSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

module.exports = { LostItem: mongoose.model("LostItem", lostItemSchema), CATEGORIES, STATUSES };
