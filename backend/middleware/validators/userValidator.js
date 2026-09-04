const { ROLES } = require("../../models/User");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const USER_STATUSES = ["active", "inactive"];

const fail = (res, message) => res.status(400).json({ message });
const isBlank = (value) => typeof value !== "string" || value.trim().length === 0;

const validateName = (name, required, res) => {
  if (required && isBlank(name)) return fail(res, "Name is required.");
  if (name === undefined) return null;
  if (isBlank(name)) return fail(res, "Name is required.");

  const value = name.trim();
  if (value.length < 2) return fail(res, "Name needs 2 characters.");
  if (value.length > 60) return fail(res, "Name is too long.");
  if (/\d/.test(value)) return fail(res, "Name cannot include numbers.");
  if (/[<>]/.test(value)) return fail(res, "Name has invalid characters.");

  return null;
};

const validateEmail = (email, required, res) => {
  if (required && isBlank(email)) return fail(res, "Email is required.");
  if (email === undefined) return null;
  if (isBlank(email)) return fail(res, "Email is required.");
  if (!emailRegex.test(email.trim())) return fail(res, "Enter a valid email.");

  return null;
};

const validatePasswordStrength = (password, required, res) => {
  if (required && isBlank(password)) return fail(res, "Password is required.");
  if (password === undefined) return null;
  if (isBlank(password)) return fail(res, "Password is required.");
  if (password.length < 8) return fail(res, "Password needs 8 characters.");
  if (!/[A-Z]/.test(password)) return fail(res, "Password needs one capital letter.");
  if (!/[a-z]/.test(password)) return fail(res, "Password needs one lowercase letter.");
  if (!/\d/.test(password)) return fail(res, "Password needs one number.");
  if (/\s/.test(password)) return fail(res, "Password cannot contain spaces.");

  return null;
};

const validateLoginPassword = (password, res) => {
  if (isBlank(password)) return fail(res, "Password is required.");
  return null;
};

const validateRole = (role, res) => {
  if (role !== undefined && !ROLES.includes(role)) {
    return fail(res, "Select a valid role.");
  }

  return null;
};

const validateIsActive = (isActive, res) => {
  if (isActive !== undefined && typeof isActive !== "boolean") {
    return fail(res, "Select account status.");
  }

  return null;
};

const validateUserFilters = (req, res, next) => {
  const { search = "", role = "", status = "" } = req.query;

  if (typeof search !== "string" || search.trim().length > 80) {
    return fail(res, "Search is too long.");
  }

  if (role && !ROLES.includes(role)) return fail(res, "Select a valid role.");
  if (status && !USER_STATUSES.includes(status)) return fail(res, "Select a valid status.");

  next();
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
    validatePasswordStrength(req.body.password, true, res) ||
    next()
  );
};

const validateLogin = (req, res, next) => {
  return validateEmail(req.body.email, true, res) || validateLoginPassword(req.body.password, res) || next();
};

const validateCreateUser = (req, res, next) => {
  return (
    validateName(req.body.name, true, res) ||
    validateEmail(req.body.email, true, res) ||
    validatePasswordStrength(req.body.password, true, res) ||
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
  return validateName(req.body.name, false, res) || validateEmail(req.body.email, false, res) || next();
};

module.exports = {
  trimBodyStrings,
  validateRegister,
  validateLogin,
  validateCreateUser,
  validateUpdateUser,
  validateUpdateProfile,
  validateUserFilters
};
