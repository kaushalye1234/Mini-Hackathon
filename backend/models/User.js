const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const ROLES = ["admin", "user"];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
      minlength: [2, "Name needs 2 characters."],
      maxlength: [60, "Name is too long."],
      validate: [
        {
          validator: (value) => !/\d/.test(value),
          message: "Name cannot include numbers."
        },
        {
          validator: (value) => !/[<>]/.test(value),
          message: "Name has invalid characters."
        }
      ]
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Enter a valid email."]
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [8, "Password needs 8 characters."],
      validate: [
        {
          validator: (value) => /[A-Z]/.test(value),
          message: "Password needs one capital letter."
        },
        {
          validator: (value) => /[a-z]/.test(value),
          message: "Password needs one lowercase letter."
        },
        {
          validator: (value) => /\d/.test(value),
          message: "Password needs one number."
        },
        {
          validator: (value) => !/\s/.test(value),
          message: "Password cannot contain spaces."
        }
      ],
      select: false
    },
    role: {
      type: String,
      enum: ROLES,
      default: "user"
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  }
});

module.exports = { User: mongoose.model("User", userSchema), ROLES };
