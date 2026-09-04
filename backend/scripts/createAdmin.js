require("dotenv").config();

const connectDB = require("../config/db");
const { User } = require("../models/User");

const args = process.argv.slice(2).reduce((values, arg) => {
  const [key, value] = arg.replace(/^--/, "").split("=");
  values[key] = value;
  return values;
}, {});

const name = args.name || process.env.ADMIN_NAME;
const email = args.email || process.env.ADMIN_EMAIL;
const password = args.password || process.env.ADMIN_PASSWORD;

const createAdmin = async () => {
  if (!name || !email || !password) {
    throw new Error(
      "Provide --name, --email, and --password or set ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD"
    );
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    existingUser.name = name;
    existingUser.role = "admin";
    existingUser.isActive = true;
    existingUser.password = password;
    await existingUser.save();
    console.log(`Admin user updated: ${existingUser.email}`);
    return;
  }

  const user = await User.create({
    name,
    email,
    password,
    role: "admin",
    isActive: true
  });

  console.log(`Admin user created: ${user.email}`);
};

connectDB()
  .then(createAdmin)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
