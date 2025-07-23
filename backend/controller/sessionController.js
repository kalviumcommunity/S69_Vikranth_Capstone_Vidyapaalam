const Session = require("../models/Session");

exports.getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ studentId: req.user.id });
    const now = new Date();
    const upcoming = sessions.filter((s) => new Date(s.date) > now);
    const past = sessions.filter((s) => new Date(s.date) <= now);
    res.json({ upcoming, past });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
};

exports.createSession = async (req, res) => {
  try {
    const { teacherName, teacherInitials, skill, date, time } = req.body;
    const newSession = new Session({
      _id: `ses${Date.now()}`,
      teacherName,
      teacherInitials,
      skill,
      date: new Date(date),
      time,
      studentId: req.user.id,
    });
    await newSession.save();
    res.status(201).json(newSession);
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ error: "Failed to create session" });
  }
};