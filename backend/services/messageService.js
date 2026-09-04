const mongoose = require("mongoose");
const Message = require("../models/Message");
const { LostItem } = require("../models/LostItem");

const assertValidId = (id, label = "ID") => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error(`Invalid ${label} format`);
    error.statusCode = 400;
    throw error;
  }
};

const populateMessage = (query) =>
  query
    .populate("sender", "name email role")
    .populate("receiver", "name email role")
    .populate("lostItem", "itemName category lostLocation lostDate status reportedBy");

const sanitizeMessage = (message) => message.toJSON();

const assertParticipant = (message, userId) => {
  const isSender = message.sender.toString() === userId.toString();
  const isReceiver = message.receiver.toString() === userId.toString();

  if (!isSender && !isReceiver) {
    const error = new Error("You can only view your own messages.");
    error.statusCode = 403;
    throw error;
  }
};

const createMessage = async ({ lostItemId, message }, senderId) => {
  assertValidId(lostItemId, "lost item ID");

  const lostItem = await LostItem.findById(lostItemId);
  if (!lostItem) {
    const error = new Error("Lost item not found.");
    error.statusCode = 404;
    throw error;
  }

  if (lostItem.reportedBy.toString() === senderId.toString()) {
    const error = new Error("You cannot send a message to yourself.");
    error.statusCode = 400;
    throw error;
  }

  const created = await Message.create({
    sender: senderId,
    receiver: lostItem.reportedBy,
    lostItem: lostItem._id,
    message
  });

  const populated = await populateMessage(Message.findById(created._id));
  return sanitizeMessage(populated);
};

const getInbox = async (userId) => {
  const messages = await populateMessage(Message.find({ receiver: userId })).sort({ createdAt: -1 });
  return messages.map(sanitizeMessage);
};

const getSent = async (userId) => {
  const messages = await populateMessage(Message.find({ sender: userId })).sort({ createdAt: -1 });
  return messages.map(sanitizeMessage);
};

const getMessageById = async (id, userId) => {
  assertValidId(id, "message ID");

  const message = await Message.findById(id);
  if (!message) {
    const error = new Error("Message not found.");
    error.statusCode = 404;
    throw error;
  }

  assertParticipant(message, userId);

  const populated = await populateMessage(Message.findById(id));
  return sanitizeMessage(populated);
};

const replyToMessage = async (id, { message }, userId) => {
  assertValidId(id, "message ID");

  const original = await Message.findById(id);
  if (!original) {
    const error = new Error("Message not found.");
    error.statusCode = 404;
    throw error;
  }

  assertParticipant(original, userId);

  const receiver = original.sender.toString() === userId.toString() ? original.receiver : original.sender;
  const created = await Message.create({
    sender: userId,
    receiver,
    lostItem: original.lostItem,
    parentMessage: original._id,
    message
  });

  const populated = await populateMessage(Message.findById(created._id));
  return sanitizeMessage(populated);
};

const markMessageRead = async (id, userId) => {
  assertValidId(id, "message ID");

  const message = await Message.findById(id);
  if (!message) {
    const error = new Error("Message not found.");
    error.statusCode = 404;
    throw error;
  }

  if (message.receiver.toString() !== userId.toString()) {
    const error = new Error("Only the receiver can mark this message as read.");
    error.statusCode = 403;
    throw error;
  }

  message.isRead = true;
  await message.save();

  const populated = await populateMessage(Message.findById(message._id));
  return sanitizeMessage(populated);
};

module.exports = {
  createMessage,
  getInbox,
  getSent,
  getMessageById,
  replyToMessage,
  markMessageRead
};
