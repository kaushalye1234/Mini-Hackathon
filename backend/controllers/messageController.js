const Message = require("../models/Message");
const { LostItem } = require("../models/LostItem");

// POST /api/messages
const sendMessage = async (req, res, next) => {
  try {
    const { lostItemId, message } = req.body;

    const item = await LostItem.findById(lostItemId);
    if (!item) {
      return res.status(404).json({ message: "Lost item not found" });
    }

    // Prevent messaging own post
    if (item.reportedBy.toString() === req.user._id.toString()) {
      return res.status(403).json({ message: "You cannot send a message to yourself" });
    }

    const newMsg = await Message.create({
      sender: req.user._id,
      receiver: item.reportedBy,
      lostItem: item._id,
      message: message.trim()
    });

    const populated = await newMsg.populate([
      { path: "sender", select: "name email" },
      { path: "receiver", select: "name email" },
      { path: "lostItem", select: "itemName category" }
    ]);

    return res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

// GET /api/messages/inbox
const getInbox = async (req, res, next) => {
  try {
    const messages = await Message.find({ receiver: req.user._id })
      .populate("sender", "name email")
      .populate("lostItem", "itemName category")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    next(error);
  }
};

// GET /api/messages/sent
const getSent = async (req, res, next) => {
  try {
    const messages = await Message.find({ sender: req.user._id })
      .populate("receiver", "name email")
      .populate("lostItem", "itemName category")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    next(error);
  }
};

// GET /api/messages/:id
const getMessageById = async (req, res, next) => {
  try {
    const msg = await Message.findById(req.params.id)
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .populate("lostItem", "itemName category location status")
      .populate("parentMessage");

    if (!msg) {
      return res.status(404).json({ message: "Message not found" });
    }

    const userId = req.user._id.toString();
    const isSender = msg.sender._id.toString() === userId;
    const isReceiver = msg.receiver._id.toString() === userId;

    if (!isSender && !isReceiver) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Auto-mark as read when receiver opens it
    if (isReceiver && !msg.isRead) {
      msg.isRead = true;
      await msg.save();
    }

    return res.status(200).json({ success: true, data: msg });
  } catch (error) {
    next(error);
  }
};

// POST /api/messages/:id/reply
const replyToMessage = async (req, res, next) => {
  try {
    const original = await Message.findById(req.params.id);
    if (!original) {
      return res.status(404).json({ message: "Message not found" });
    }

    const userId = req.user._id.toString();
    const isSender = original.sender.toString() === userId;
    const isReceiver = original.receiver.toString() === userId;

    if (!isSender && !isReceiver) {
      return res.status(403).json({ message: "Access denied" });
    }

    // receiver of reply is the other participant
    const replyReceiver = isSender ? original.receiver : original.sender;

    const reply = await Message.create({
      sender: req.user._id,
      receiver: replyReceiver,
      lostItem: original.lostItem,
      message: req.body.message.trim(),
      parentMessage: original._id
    });

    const populated = await reply.populate([
      { path: "sender", select: "name email" },
      { path: "receiver", select: "name email" },
      { path: "lostItem", select: "itemName category" }
    ]);

    return res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/messages/:id/read
const markAsRead = async (req, res, next) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (msg.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the receiver can mark a message as read" });
    }

    msg.isRead = true;
    await msg.save();

    return res.status(200).json({ success: true, message: "Marked as read" });
  } catch (error) {
    next(error);
  }
};

module.exports = { sendMessage, getInbox, getSent, getMessageById, replyToMessage, markAsRead };
