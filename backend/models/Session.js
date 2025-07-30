const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  teacherName: { type: String, required: true },
  teacherInitials: { type: String },
  skill: { type: String, required: true },
  dateTime: { type: Date, required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  paymentId: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  timeRange: { type: String },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

sessionSchema.pre("save", function (next) {
  if (this.isModified("startTime") || this.isModified("endTime") || this.isNew) {
    const start = new Date(`1970-01-01 ${this.startTime}`);
    const end = new Date(`1970-01-01 ${this.endTime}`);
    this.timeRange = `${start.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })} - ${end.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}`;
  }
  next();
});

module.exports = mongoose.model("Session", sessionSchema);
