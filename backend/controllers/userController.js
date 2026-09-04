const userService = require("../services/userService");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getUsers(req.query);
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await userService.getUserStats();
    res.status(200).json({ stats });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({ user, message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.status(200).json({ user, message: "User updated successfully" });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id, req.user._id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await userService.updateProfile(req.user._id, req.body);
    res.status(200).json({ user, message: "Profile updated successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getDashboardStats,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateProfile
};
