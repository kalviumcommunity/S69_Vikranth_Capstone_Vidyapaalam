// server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();
const cookieParser = require('cookie-parser');

require('./services/firebaseAdmin'); 

const app = express();
const port = process.env.PORT || 5000; 

const paymentRoutes = require("./routes/paymentRoutes");
const paymentController = require("./controller/paymentController")

app.post(
  '/api/razorpay-webhook',
  express.raw({ type: '*/*' }), 
  paymentController.handleRazorpayWebhook
);

app.use(express.json());

app.use(cors({
  origin: 'https://gregarious-sprinkles-9e14c9.netlify.app', 
  credentials : true
}));

app.use(cookieParser());

// Import Routes
const authRoutes = require('./routes/authRoutes');
const skillRoutes = require('./routes/skillRoutes');
const teacherProfileRoutes = require('./routes/teacherRoutes');
const googleCalendarAuthRoutes = require('./routes/googleCalendarAuthRoutes'); 
const sessionRoutes = require("./routes/sessionRoutes");
const streamRoutes = require('./routes/streamRoutes');


// Mount Routes
app.use('/auth', authRoutes); 
app.use('/api/skills', skillRoutes);
app.use('/api/teacher-profiles', teacherProfileRoutes);
app.use('/auth/calendar', googleCalendarAuthRoutes); 
app.use("/api", sessionRoutes);
app.use("/api", paymentRoutes);
app.use('/api/stream', streamRoutes);


// Base route
app.get('/', (req, res) => {
  res.send('Welcome to VidyaPaalam');
});

connectDB();

app.listen(port, () => {
  console.log("Server running on port: " + port);
});



