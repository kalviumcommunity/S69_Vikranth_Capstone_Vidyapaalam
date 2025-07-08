// server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 5000; 

app.use(express.json());

app.use(cors({
  origin: 'https://gregarious-sprinkles-9e14c9.netlify.app', 

}));

app.use(cookieParser());

// Import Routes
const authRoutes = require('./routes/authRoutes');
const skillRoutes = require('./routes/skillRoutes');
const teacherProfileRoutes = require('./routes/teacherRoutes');
const googleCalendarAuthRoutes = require('./routes/googleCalendarAuthRoutes'); 

// Mount Routes
app.use('/auth', authRoutes); 
app.use('/api/skills', skillRoutes);
app.use('/api/teacher-profiles', teacherProfileRoutes);
app.use('/auth/calendar', googleCalendarAuthRoutes); 

// Base route
app.get('/', (req, res) => {
  res.send('Welcome to VidyaPaalam');
});

connectDB();

app.listen(port, () => {
  console.log("Server running on port: " + port);
});
