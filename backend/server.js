// const express = require('express');
// const cors = require('cors');
// const connectDB = require('./config/db');
// require('dotenv').config();
// const {loginLimiter} = require('./config/rateLimiter')
// const cookieParser = require('cookie-parser');


// const app = express();
// const port = process.env.PORT; 

// app.use(express.json());

// app.use(cors({
//     origin: 'http://localhost:5173',       
//     credentials: true,                     
//     methods: ['GET','POST','PATCH','DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization']
//   }));
  
  
// app.use(cookieParser());


// const authRoutes = require('./routes/authRoutes');
// app.use('/auth', authRoutes);


// app.get('/', (req, res) => {
//     res.send('Welcome to VidyaPaalam');
// });


// connectDB();


// app.listen(port, () => {
//     console.log("Server running on port: " + port);
// });

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());

// Import Routes
const authRoutes = require('./routes/authRoutes');
const skillRoutes = require('./routes/skillRoutes');
const teacherProfileRoutes = require('./routes/teacherRoutes');

// Mount Routes
app.use('/auth', authRoutes); 
app.use('/api/skills', skillRoutes); 
app.use('/api/teacher-profiles', teacherProfileRoutes); 

// Base route
app.get('/', (req, res) => {
  res.send('Welcome to VidyaPaalam');
});

connectDB();

app.listen(port, () => {
  console.log("Server running on port: " + port);
});