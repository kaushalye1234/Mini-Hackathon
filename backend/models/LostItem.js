const mongoose = require("mongoose");

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

const STATUSES = ["LOST", "RESOLVED"];

const lostItemSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
      minlength: [2, "Item name must be at least 2 characters long"],
      maxlength: [100, "Item name cannot exceed 100 characters"]
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: CATEGORIES,
        message: "Invalid category selected"
      }
    },
    location: {
      type: String,
      required: [true, "Lost location is required"],
      trim: true,
      minlength: [2, "Location must be at least 2 characters long"]
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
      default: ""
    },
    dateLost: {
      type: Date,
      required: [true, "Date lost is required"]
    },
    status: {
      type: String,
      enum: {
        values: STATUSES,
        message: "Status must be either LOST or RESOLVED"
      },
      default: "LOST"
    },
    imageUrl: {
      type: String,
      default: ""
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Reporter user ID is required"]
    }
  },
  { timestamps: true }
);

lostItemSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

const LostItem = mongoose.model("LostItem", lostItemSchema);

module.exports = {
  LostItem,
  CATEGORIES,
  STATUSES
};
