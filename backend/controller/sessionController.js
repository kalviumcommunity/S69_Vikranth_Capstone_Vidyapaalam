// const Session = require("../models/Session");

// exports.getSessions = async (req, res) => {
//   try {
//     const sessions = await Session.find({ studentId: req.user.id });
//     const now = new Date();
//     const upcoming = sessions.filter((s) => new Date(s.date) > now);
//     const past = sessions.filter((s) => new Date(s.date) <= now);
//     res.json({ upcoming, past });
//   } catch (error) {
//     console.error("Error fetching sessions:", error);
//     res.status(500).json({ error: "Failed to fetch sessions" });
//   }
// };

// exports.createSession = async (req, res) => {
//   try {
//     const { teacherName, teacherInitials, skill, date, time } = req.body;
//     const newSession = new Session({
//       _id: `ses${Date.now()}`,
//       teacherName,
//       teacherInitials,
//       skill,
//       date: new Date(date),
//       time,
//       studentId: req.user.id,
//     });
//     await newSession.save();
//     res.status(201).json(newSession);
//   } catch (error) {
//     console.error("Error creating session:", error);
//     res.status(500).json({ error: "Failed to create session" });
//   }
// };


const Session = require("../models/Session");

exports.getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ studentId: req.user.id });
    const now = new Date();
    const upcoming = sessions.filter((s) => s.dateTime > now);
    const past = sessions.filter((s) => s.dateTime <= now);
    res.json({ upcoming, past });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
};

exports.createSession = async (req, res) => {
  try {
    const { teacherName, teacherInitials, skill, dateTime } = req.body;
    const newSession = new Session({
      teacherName,
      teacherInitials,
      skill,
      dateTime: new Date(dateTime),
      studentId: req.user.id,
    });
    await newSession.save();
    res.status(201).json(newSession);
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ error: "Failed to create session" });
  }
};

const createFullDateTime = (dateString, timeString) => {
  const datePart = dateString.split('T')[0];
  return new Date(`${datePart}T${timeString}:00`);
};

exports.getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ studentId: req.user.id }).lean();
    const now = new Date();
    const upcoming = [];
    const past = [];

    sessions.forEach(session => {
      const sessionEndDateTime = createFullDateTime(session.dateTime.toISOString(), session.endTime);
      if (isNaN(sessionEndDateTime.getTime())) {
        console.warn(`Backend: Invalid session end date/time for student session ID ${session._id}. Data: ${JSON.stringify(session)}`);
        past.push(session);
      } else if (sessionEndDateTime > now) {
        upcoming.push(session);
      } else {
        past.push(session);
      }
    });

    upcoming.sort((a, b) => createFullDateTime(a.dateTime.toISOString(), a.startTime).getTime() - createFullDateTime(b.dateTime.toISOString(), b.startTime).getTime());
    past.sort((a, b) => createFullDateTime(b.dateTime.toISOString(), b.startTime).getTime() - createFullDateTime(a.dateTime.toISOString(), a.startTime).getTime());

    res.json({ upcoming, past });
  } catch (error) {
    console.error("Error fetching student sessions:", error);
    res.status(500).json({ error: "Failed to fetch student sessions" });
  }
};

exports.getTeacherSessions = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const sessions = await Session.find({ teacherId: teacherId }).lean();
    const now = new Date();
    const upcomingSessions = [];
    const pastSessions = [];

    sessions.forEach(session => {
      const sessionEndDateTime = createFullDateTime(session.dateTime.toISOString(), session.endTime);
      if (isNaN(sessionEndDateTime.getTime())) {
        console.warn(`Backend: Invalid session end date/time for teacher session ID ${session._id}. Data: ${JSON.stringify(session)}`);
        pastSessions.push(session);
      } else if (sessionEndDateTime > now) {
        upcomingSessions.push(session);
      } else {
        pastSessions.push(session);
      }
    });

    upcomingSessions.sort((a, b) => createFullDateTime(a.dateTime.toISOString(), a.startTime).getTime() - createFullDateTime(b.dateTime.toISOString(), b.startTime).getTime());
    pastSessions.sort((a, b) => createFullDateTime(b.dateTime.toISOString(), b.startTime).getTime() - createFullDateTime(a.dateTime.toISOString(), a.startTime).getTime());

    res.json({ upcomingSessions, pastSessions });
  } catch (error) {
    console.error("Error fetching teacher sessions:", error);
    res.status(500).json({ error: "Failed to fetch teacher sessions" });
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
    console.error("Error creating session:", error);
    res.status(500).json({ error: "Failed to create session" });
  }
};
