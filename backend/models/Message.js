const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    lostItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LostItem",
      required: true
    },
    message: {
      type: String,
      required: [true, "Message cannot be empty."],
      trim: true,
      maxlength: [1000, "Message cannot exceed 1000 characters."]
    },
    isRead: {
      type: Boolean,
      default: false
    },
    parentMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null
    }
  },
  { timestamps: true }
);

messageSchema.index({ receiver: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ lostItem: 1, createdAt: -1 });

messageSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model("Message", messageSchema);
