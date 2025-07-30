const express = require("express");
const router = express.Router();
const {
    getSessions,
    createSession,
    getTeacherSessions
} = require("../controller/sessionController");
const {protect} = require("../middleware/authMiddleware"); // Ensure this exists

router.get("/student/sessions", protect, getSessions);
router.post("/student/sessions", protect, createSession);
router.get("/teacher/sessions", protect, getTeacherSessions);


module.exports = router;
