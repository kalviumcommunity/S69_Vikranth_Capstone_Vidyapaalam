const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    sparse: true, // Allows multiple documents to have null or missing email, only unique if present
  },
  password: {
    type: String,
    },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  bio: {
    type: String,
    default: "",
  },
  phoneNumber: { // ADD THIS NEW FIELD
    type: String,
    trim: true,
    default: "", // Can be empty if not provided or for Google users initially
  },
  role: {
    type: String,
    enum: ["student", "teacher", "admin"],
    default: "teacher", // Ensure this default aligns with your initial onboarding flow
  },
  activeToken: {
    type: String,
    default: null,
  },
  refreshToken: {
    type: String,
    default: null,
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpire: {
    type: Date,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    default: null,
  },
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) { // Added check for password existence
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

module.exports = mongoose.model("User", UserSchema);