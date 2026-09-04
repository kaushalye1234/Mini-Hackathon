const authService = require("../services/authService");

const register = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.loginUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const adminLogin = async (req, res, next) => {
  try {
    const result = await authService.loginAdminUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user._id);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

const logout = (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = {
  register,
  login,
  adminLogin,
  getMe,
  logout
};
