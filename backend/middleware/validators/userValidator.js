const { ROLES } = require("../../models/User");

const emailRegex = /^\S+@\S+\.\S+$/;

const fail = (res, message) => res.status(400).json({ message });

const isBlank = (value) => typeof value !== "string" || value.trim().length === 0;

const validateName = (name, required, res) => {
  if (required && isBlank(name)) {
    return fail(res, "Name is required");
  }

  if (name !== undefined && isBlank(name)) {
    return fail(res, "Name cannot be empty");
  }

  if (name !== undefined && name.trim().length < 2) {
    return fail(res, "Name must be at least 2 characters long");
  }

  return null;
};

const validateEmail = (email, required, res) => {
  if (required && isBlank(email)) {
    return fail(res, "Email is required");
  }

  if (email !== undefined && !emailRegex.test(email.trim())) {
    return fail(res, "Valid email is required");
  }

  return null;
};

const validatePassword = (password, required, res) => {
  if (required && isBlank(password)) {
    return fail(res, "Password is required");
  }

  if (password !== undefined && password.length < 6) {
    return fail(res, "Password must be at least 6 characters long");
  }

  return null;
};

const validateRole = (role, res) => {
  if (role !== undefined && !ROLES.includes(role)) {
    return fail(res, `Role must be one of: ${ROLES.join(", ")}`);
  }

  return null;
};

const validateIsActive = (isActive, res) => {
  if (isActive !== undefined && typeof isActive !== "boolean") {
    return fail(res, "isActive must be true or false");
  }

  return null;
};

const trimBodyStrings = (req, res, next) => {
  Object.keys(req.body).forEach((key) => {
    if (typeof req.body[key] === "string") {
      req.body[key] = req.body[key].trim();
    }
  });
  next();
};

const validateRegister = (req, res, next) => {
  return (
    validateName(req.body.name, true, res) ||
    validateEmail(req.body.email, true, res) ||
    validatePassword(req.body.password, true, res) ||
    next()
  );
};

const validateLogin = (req, res, next) => {
  return (
    validateEmail(req.body.email, true, res) ||
    validatePassword(req.body.password, true, res) ||
    next()
  );
};

const validateCreateUser = (req, res, next) => {
  return (
    validateName(req.body.name, true, res) ||
    validateEmail(req.body.email, true, res) ||
    validatePassword(req.body.password, true, res) ||
    validateRole(req.body.role, res) ||
    validateIsActive(req.body.isActive, res) ||
    next()
  );
};

const validateUpdateUser = (req, res, next) => {
  return (
    validateName(req.body.name, false, res) ||
    validateEmail(req.body.email, false, res) ||
    validateRole(req.body.role, res) ||
    validateIsActive(req.body.isActive, res) ||
    next()
  );
};

const validateUpdateProfile = (req, res, next) => {
  return (
    validateName(req.body.name, false, res) ||
    validateEmail(req.body.email, false, res) ||
    next()
  );
};

module.exports = {
  trimBodyStrings,
  validateRegister,
  validateLogin,
  validateCreateUser,
  validateUpdateUser,
  validateUpdateProfile
};
