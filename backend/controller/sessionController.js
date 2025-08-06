const Session = require("../models/Session");
const User = require("../models/User");

const createFullDateTime = (dateString, timeString) => {
  const datePart = dateString.split('T')[0];
  return new Date(`${datePart}T${timeString}:00`);
};

exports.getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ studentId: req.user.id })
      .populate('teacherId', 'name')
      .lean();

    const now = new Date();
    const upcoming = [];
    const past = [];

    sessions.forEach(session => {
      const sessionEndDateTime = createFullDateTime(session.dateTime instanceof Date ? session.dateTime.toISOString() : session.dateTime, session.endTime);
      if (isNaN(sessionEndDateTime.getTime())) {
        past.push(session);
      } else if (sessionEndDateTime > now) {
        upcoming.push(session);
      } else {
        past.push(session);
      }
    });

    upcoming.sort((a, b) => createFullDateTime(a.dateTime instanceof Date ? a.dateTime.toISOString() : a.dateTime, a.startTime).getTime() - createFullDateTime(b.dateTime instanceof Date ? b.dateTime.toISOString() : b.dateTime, b.startTime).getTime());
    past.sort((a, b) => createFullDateTime(b.dateTime instanceof Date ? b.dateTime.toISOString() : b.dateTime, b.startTime).getTime() - createFullDateTime(a.dateTime instanceof Date ? a.dateTime.toISOString() : a.dateTime, a.startTime).getTime());

    res.json({ upcoming, past });
  } catch (error) {
    console.error("Error fetching student sessions:", error);
    res.status(500).json({ error: "Failed to fetch student sessions" });
  }
};

exports.createSession = async (req, res) => {
  try {
    const { teacherName, teacherInitials, skill, dateTime, startTime, endTime, paymentId, teacherId } = req.body;
    const newSession = new Session({
      teacherName,
      teacherInitials,
      skill,
      dateTime: new Date(dateTime),
      studentId: req.user.id,
      paymentId,
      startTime,
      endTime,
      teacherId,
    });
    await newSession.save();
    res.status(201).json(newSession);
  } catch (error) {
    res.status(500).json({ error: "Failed to create session" });
  }
};

exports.getTeacherSessions = async (req, res) => {
  try {
    const teacherId = req.user.id; 
    console.log(`[Backend Log] Fetching sessions for teacher ID: ${teacherId}`);

    const now = new Date();

    const sessions = await Session.find({ teacherId: teacherId })
                                  .populate('studentId', 'name email')
                                  .sort({ dateTime: 1, startTime: 1 });

    const upcomingSessions = [];
    const pastSessions = [];

    sessions.forEach(session => {
      const sessionEndDateTime = new Date(`${session.dateTime.toISOString().split('T')[0]}T${session.endTime}:00`);

      if (isNaN(sessionEndDateTime.getTime())) {
          pastSessions.push(session);
      } else if (sessionEndDateTime > now) {
          upcomingSessions.push(session);
      } else {
          pastSessions.push(session);
      }
    });

    res.status(200).json({
      upcomingSessions,
      pastSessions,
    });

  } catch (error) {

    res.status(500).json({ message: "Server error", error: error.message });
  }
};
