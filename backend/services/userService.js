const { User } = require("../models/User");

const sanitizeUser = (user) => user.toJSON();
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildUserFilters = ({ search, role, status }) => {
  const filters = {};

  if (search) {
    const regex = { $regex: escapeRegex(search.trim()), $options: "i" };
    filters.$or = [{ name: regex }, { email: regex }];
  }

  if (role) {
    filters.role = role;
  }

  if (status === "active") {
    filters.isActive = true;
  }

  if (status === "inactive") {
    filters.isActive = false;
  }

  return filters;
};

const getUsers = async (query) => {
  const users = await User.find(buildUserFilters(query)).sort({ createdAt: -1 });
  return users.map(sanitizeUser);
};

const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return sanitizeUser(user);
};

const createUser = async ({ name, email, password, role = "user", isActive = true }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("An account with this email already exists.");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.create({ name, email, password, role, isActive });
  return sanitizeUser(user);
};

const updateUser = async (id, updates) => {
  if (updates.email) {
    const existingUser = await User.findOne({ email: updates.email, _id: { $ne: id } });
    if (existingUser) {
      const error = new Error("An account with this email already exists.");
      error.statusCode = 400;
      throw error;
    }
  }

  delete updates.password;

  const user = await User.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return sanitizeUser(user);
};

const deleteUser = async (id, currentUserId) => {
  if (id === currentUserId.toString()) {
    const error = new Error("You cannot delete your own account");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findByIdAndDelete(id);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
};

const updateProfile = async (userId, updates) => {
  const allowedUpdates = {
    name: updates.name,
    email: updates.email
  };

  Object.keys(allowedUpdates).forEach((key) => {
    if (allowedUpdates[key] === undefined) {
      delete allowedUpdates[key];
    }
  });

  return updateUser(userId, allowedUpdates);
};

const getUserStats = async () => {
  const [totalUsers, activeUsers, inactiveUsers, adminUsers, normalUsers] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    User.countDocuments({ isActive: false }),
    User.countDocuments({ role: "admin" }),
    User.countDocuments({ role: "user" })
  ]);

  return { totalUsers, activeUsers, inactiveUsers, adminUsers, normalUsers };
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateProfile,
  getUserStats
};
