const messageService = require("../services/messageService");

const createMessage = async (req, res, next) => {
  try {
    const message = await messageService.createMessage(req.body, req.user._id);
    res.status(201).json({ message, notice: "Message sent successfully." });
  } catch (error) {
    next(error);
  }
};

const getInbox = async (req, res, next) => {
  try {
    const messages = await messageService.getInbox(req.user._id);
    res.status(200).json({ messages });
  } catch (error) {
    next(error);
  }
};

const getSent = async (req, res, next) => {
  try {
    const messages = await messageService.getSent(req.user._id);
    res.status(200).json({ messages });
  } catch (error) {
    next(error);
  }
};

const getMessageById = async (req, res, next) => {
  try {
    const message = await messageService.getMessageById(req.params.id, req.user._id);
    res.status(200).json({ message });
  } catch (error) {
    next(error);
  }
};

const replyToMessage = async (req, res, next) => {
  try {
    const message = await messageService.replyToMessage(req.params.id, req.body, req.user._id);
    res.status(201).json({ message, notice: "Reply sent successfully." });
  } catch (error) {
    next(error);
  }
};

const markMessageRead = async (req, res, next) => {
  try {
    const message = await messageService.markMessageRead(req.params.id, req.user._id);
    res.status(200).json({ message, notice: "Message marked as read." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMessage,
  getInbox,
  getSent,
  getMessageById,
  replyToMessage,
  markMessageRead
};
