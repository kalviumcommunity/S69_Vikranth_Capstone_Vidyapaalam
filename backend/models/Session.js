const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  teacherName: { type: String, required: true },
  teacherInitials: { type: String },
  skill: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Session", sessionSchema);

