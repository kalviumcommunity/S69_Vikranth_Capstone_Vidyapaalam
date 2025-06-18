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
    sparse: true,
  },
  password: {
    type: String,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  isGoogleUser: { type: Boolean, default: false },

  googleCalendar: {
    refreshToken: {
      type: String,
      default: null,
    },
  },
  bio: {
    type: String,
    default: "",
  },
  phoneNumber: {
    type: String,
    trim: true,
    default: "",
  },
  role: {
    type: String,
    enum: ["student", "teacher", "admin"],
    default: "teacher",
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
  interestedSkills: [{
    type: String,
    trim: true,
  }],
  teachingSkills: [{
    type: String,
    trim: true,
  }],

  availability: {
    date: {
      type: Date,
    },
    slots: [{
      type: String,
      trim: true,
    }],
  }
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) { // Added check for password existence
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

module.exports = mongoose.model("User", UserSchema);
