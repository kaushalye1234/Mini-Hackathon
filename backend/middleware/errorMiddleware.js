const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  if (err.code === 11000) {
    return res.status(400).json({ message: "Email already exists" });
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)[0]?.message || "Validation failed";
    return res.status(400).json({ message });
  }

  return res.status(statusCode).json({
    message: err.message || "Internal server error"
  });
};

module.exports = errorMiddleware;
