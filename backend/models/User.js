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
    select: false,
  },
  googleCalendar: {
    connected: {
      type: Boolean,
      default: false,
    },
    accessToken: {
      type: String,
      default: null,
      select: false,
    },
    refreshToken: {
      type: String,
      default: null,
      select: false,
    },
    accessTokenExpiryDate: {
      type: Date,
      default: null,
      select: false,
    },
    lastConnected: {
      type: Date,
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
    default: null, // Role can be null initially during onboarding
  },
  interestedSkills: [{
    type: String,
    trim: true,
  }],
  teachingSkills: [{
    type: String,
    trim: true,
  }],
  availability: [{
    date: {
      type: Date,
      required: true,
    },
    slots: [{ 
      startTime: { type: String, required: true }, // e.g., "09:00"
      endTime: { type: String, required: true }   // e.g., "10:00"
    }],
  }],
  teacherOnboardingComplete: { 
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true 
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) { // Handle case where password might not be selected/present
    return false;
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);