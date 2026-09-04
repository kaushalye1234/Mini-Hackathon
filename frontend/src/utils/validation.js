const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const allowedRoles = ["admin", "user"];
const allowedStatuses = ["LOST", "RESOLVED"];
const maxImageSize = 5 * 1024 * 1024;

export const todayInputValue = () => {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

export const hasErrors = (errors) => Object.keys(errors).length > 0;

export const firstError = (errors) => Object.values(errors).find(Boolean) || "";

const isBlank = (value) => !String(value || "").trim();

const isFutureDate = (value) => {
  const selected = new Date(`${value}T00:00:00`);
  const today = new Date(`${todayInputValue()}T00:00:00`);
  return selected > today;
};

export const validateEmail = (email) => {
  if (isBlank(email)) return "Email is required.";
  if (!emailRegex.test(email.trim())) return "Enter a valid email.";
  return "";
};

export const validateName = (name) => {
  const value = String(name || "").trim();
  if (!value) return "Name is required.";
  if (value.length < 2) return "Name needs 2 characters.";
  if (value.length > 60) return "Name is too long.";
  if (/\d/.test(value)) return "Name cannot include numbers.";
  if (/[<>]/.test(value)) return "Name has invalid characters.";
  return "";
};

export const validatePassword = (password) => {
  if (isBlank(password)) return "Password is required.";
  if (password.length < 8) return "Password needs 8 characters.";
  if (!/[A-Z]/.test(password)) return "Password needs one capital letter.";
  if (!/[a-z]/.test(password)) return "Password needs one lowercase letter.";
  if (!/\d/.test(password)) return "Password needs one number.";
  if (/\s/.test(password)) return "Password cannot contain spaces.";
  return "";
};

export const validateLoginForm = (form) => {
  const errors = {};
  const emailError = validateEmail(form.email);
  if (emailError) errors.email = emailError;
  if (isBlank(form.password)) errors.password = "Password is required.";
  return errors;
};

export const validateRegisterForm = (form) => {
  const errors = {};
  const nameError = validateName(form.name);
  const emailError = validateEmail(form.email);
  const passwordError = validatePassword(form.password);

  if (nameError) errors.name = nameError;
  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;
  if (!form.confirmPassword) {
    errors.confirmPassword = "Confirm your password.";
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
};

export const validateProfileForm = (form) => {
  const errors = {};
  const nameError = validateName(form.name);
  const emailError = validateEmail(form.email);

  if (nameError) errors.name = nameError;
  if (emailError) errors.email = emailError;

  return errors;
};

export const validateAdminUserForm = (form, { requirePassword = false } = {}) => {
  const errors = validateProfileForm(form);

  if (requirePassword) {
    const passwordError = validatePassword(form.password);
    if (passwordError) errors.password = passwordError;
  }

  if (!allowedRoles.includes(form.role)) {
    errors.role = "Select a valid role.";
  }

  if (typeof form.isActive !== "boolean") {
    errors.isActive = "Select account status.";
  }

  return errors;
};

export const validateImageFile = (file) => {
  if (!file) return "";
  if (!file.type.startsWith("image/")) return "Upload an image file.";
  if (file.size > maxImageSize) return "Image must be under 5 MB.";
  return "";
};

export const validateLostItemForm = (form, imageFile, categories = []) => {
  const errors = {};
  const itemName = String(form.itemName || "").trim();
  const description = String(form.description || "").trim();
  const lostLocation = String(form.lostLocation || "").trim();

  if (!itemName) errors.itemName = "Item name is required.";
  else if (itemName.length < 2) errors.itemName = "Item name needs 2 characters.";
  else if (itemName.length > 80) errors.itemName = "Item name is too long.";

  if (!form.category) errors.category = "Select a category.";
  else if (categories.length && !categories.includes(form.category)) errors.category = "Select a valid category.";

  if (!description) errors.description = "Description is required.";
  else if (description.length < 10) errors.description = "Add more description.";
  else if (description.length > 600) errors.description = "Description is too long.";

  if (!lostLocation) errors.lostLocation = "Location is required.";
  else if (lostLocation.length < 3) errors.lostLocation = "Location needs 3 characters.";
  else if (lostLocation.length > 120) errors.lostLocation = "Location is too long.";

  if (!form.lostDate || Number.isNaN(Date.parse(form.lostDate))) {
    errors.lostDate = "Select a valid date.";
  } else if (isFutureDate(form.lostDate)) {
    errors.lostDate = "You can't set a future date.";
  }

  const imageError = validateImageFile(imageFile);
  if (imageError) errors.image = imageError;

  return errors;
};

export const validateLostItemFilters = (filters, categories = []) => {
  const errors = {};

  if (filters.search.trim().length > 80) errors.search = "Search is too long.";
  if (filters.location.trim().length > 120) errors.location = "Location is too long.";
  if (filters.category && categories.length && !categories.includes(filters.category)) {
    errors.category = "Select a valid category.";
  }
  if (filters.status && !allowedStatuses.includes(filters.status)) errors.status = "Select a valid status.";
  if (filters.lostDate && Number.isNaN(Date.parse(filters.lostDate))) {
    errors.lostDate = "Select a valid date.";
  } else if (filters.lostDate && isFutureDate(filters.lostDate)) {
    errors.lostDate = "Future date not allowed.";
  }

  return errors;
};

export const validateMessageForm = (message) => {
  const errors = {};
  const value = String(message || "").trim();

  if (!value) errors.message = "Message cannot be empty.";
  else if (value.length < 5) errors.message = "Message needs 5 characters.";
  else if (value.length > 1000) errors.message = "Message is too long.";

  return errors;
};

export const validateUserFilters = (filters) => {
  const errors = {};
  const search = String(filters.search || "").trim();

  if (search.length > 80) errors.search = "Search is too long.";
  if (filters.role && !allowedRoles.includes(filters.role)) errors.role = "Select a valid role.";
  if (filters.status && !["active", "inactive"].includes(filters.status)) {
    errors.status = "Select a valid status.";
  }

  return errors;
};
