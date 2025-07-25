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
   firebaseUid: { 
    type: String,
    unique: true,
    sparse: true,
    default: null, 
  },
  picture: { 
    type: String,
    default: null,
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
  availability: [{
    date: {
      type: Date,
      required: true,
    },
    slots: [{
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
      available: { type: Boolean, default: true }, 
    }],
  }],
  teacherOnboardingComplete: {
    type: Boolean,
    default: false,
  },
  activeToken: {
    type: String, 
    default: null, 
    select: false, 
  },
    paymentAcknowledged: { type: Boolean, default: false },
    
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
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);