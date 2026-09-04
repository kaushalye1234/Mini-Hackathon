const { User } = require("../models/User");
const generateToken = require("../utils/generateToken");

const sanitizeUser = (user) => user.toJSON();

const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("Email already exists");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.create({ name, email, password, role: "user" });
  const token = generateToken(user);

  return { user: sanitizeUser(user), token };
};

const authenticateCredentials = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    const error = new Error("Incorrect email or password");
    error.statusCode = 401;
    throw error;
  }

  const passwordMatches = await user.comparePassword(password);
  if (!passwordMatches) {
    const error = new Error("Incorrect email or password");
    error.statusCode = 401;
    throw error;
  }

  if (!user.isActive) {
    const error = new Error("Account disabled");
    error.statusCode = 403;
    throw error;
  }

  return user;
};

const loginUser = async ({ email, password }) => {
  const user = await authenticateCredentials({ email, password });
  const token = generateToken(user);
  return { user: sanitizeUser(user), token };
};

const loginAdminUser = async ({ email, password }) => {
  const user = await authenticateCredentials({ email, password });

  if (user.role !== "admin") {
    const error = new Error("Admin access requires an admin account");
    error.statusCode = 403;
    throw error;
  }

  const token = generateToken(user);
  return { user: sanitizeUser(user), token };
};

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return sanitizeUser(user);
};

module.exports = {
  registerUser,
  loginUser,
  loginAdminUser,
  getCurrentUser
};
