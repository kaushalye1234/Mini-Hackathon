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
      minlength: [2, "Item name needs 2 characters."],
      maxlength: [80, "Item name is too long."]
    },
    category: {
      type: String,
      required: [true, "Select a category."],
      enum: CATEGORIES
    },
    description: {
      type: String,
      required: [true, "Description is required."],
      trim: true,
      minlength: [10, "Add more description."],
      maxlength: [600, "Description is too long."]
    },
    lostLocation: {
      type: String,
      required: [true, "Location is required."],
      trim: true,
      minlength: [3, "Location needs 3 characters."],
      maxlength: [120, "Location is too long."]
    },
    lostDate: {
      type: Date,
      required: [true, "Select a valid date."],
      validate: {
        validator: (value) => {
          if (!value) return false;
          const selected = new Date(value);
          const today = new Date();
          selected.setHours(0, 0, 0, 0);
          today.setHours(0, 0, 0, 0);
          return selected <= today;
        },
        message: "You can't set a future date."
      }
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
