const { google } = require('googleapis');
const User = require('../models/User');
const BlacklistedToken = require('../models/BlackListedToken');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/calendar',
];

const ACCESS_TOKEN_AGE = 15 * 60 * 1000;
const REFRESH_TOKEN_AGE = 7 * 24 * 60 * 60 * 1000;

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/', 
};



const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
};

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({
    name,
    email,
    password: password,
    role: null,
    isGoogleUser: false,
    googleId: null,
    isVerified: false,
    googleCalendar: {
      connected: false,
      accessToken: null,
      refreshToken: null,
      accessTokenExpiryDate: null,
      lastConnected: null
    }
  });

  if (user) {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: ACCESS_TOKEN_AGE });
    res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_AGE });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isGoogleUser: user.isGoogleUser,
        googleCalendar: user.googleCalendar,
        isVerified: user.isVerified
      }
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  if (user.isGoogleUser && !user.password) {
    return res.status(400).json({ message: 'This account was created with Google. Please use the "Continue with Google" button.' });
  }

  if (!user.password || !(await user.matchPassword(password))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: ACCESS_TOKEN_AGE });
  res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_AGE });

  res.status(200).json({
    message: 'Logged in successfully',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isGoogleUser: user.isGoogleUser,
      googleCalendar: user.googleCalendar,
      isVerified: user.isVerified
    }
  });
};

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      bio: user.bio,
      interestedSkills: user.interestedSkills,
      teachingSkills: user.teachingSkills,
      isGoogleUser: user.isGoogleUser,
      googleCalendar: user.googleCalendar,
      teacherOnboardingComplete: user.teacherOnboardingComplete,
      isVerified: user.isVerified
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

exports.refreshToken = async (req, res) => {
  const refreshTokenCookie = req.cookies.refreshToken;

  if (!refreshTokenCookie) {
    return res.status(401).json({ message: 'No refresh token provided' });
  }

  const isBlacklisted = await BlacklistedToken.findOne({ token: refreshTokenCookie });
  if (isBlacklisted) {
    console.log('Blacklisted refresh token detected:', refreshTokenCookie);
    return res.status(401).json({ message: 'Not authorized, token blacklisted' });
  }

  try {
    const decoded = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: ACCESS_TOKEN_AGE });
    res.cookie('refreshToken', newRefreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_AGE });

    res.status(200).json({ message: 'Access token refreshed' });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

exports.logoutUser = async (req, res) => {
  const refreshTokenCookie = req.cookies.refreshToken;

  if (refreshTokenCookie) {
    try {
      await BlacklistedToken.create({ token: refreshTokenCookie });
      console.log('Refresh token blacklisted:', refreshTokenCookie);
    } catch (error) {
      console.error('Error blacklisting token:', error);
    }
  }

  res.clearCookie('accessToken', { path: '/' });
  res.clearCookie('refreshToken', { path: '/' });
  res.status(200).json({ message: 'Logged out successfully' });
};

exports.saveRole = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  const { role } = req.body;

  if (!role) {
    return res.status(400).json({ message: 'Role is required.' });
  }

  const allowedRoles = ['student', 'teacher'];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role provided.' });
  }

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.role = role;
    await user.save();
    res.status(200).json({ message: 'Role updated successfully', user: { id: user._id, role: user.role } });

  } catch (error) {
    console.error('Error saving role to database:', error);
    res.status(500).json({ message: 'Internal Server Error while saving role.' });
  }
};

exports.updateUserProfile = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.body.name !== undefined) user.name = req.body.name;
    if (req.body.phoneNumber !== undefined) user.phoneNumber = req.body.phoneNumber;
    if (req.body.bio !== undefined) user.bio = req.body.bio;
    if (req.body.teacherOnboardingComplete !== undefined) user.teacherOnboardingComplete = req.body.teacherOnboardingComplete;
    if (req.body.isVerified !== undefined) user.isVerified = req.body.isVerified;

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        bio: user.bio,
        interestedSkills: user.interestedSkills,
        teachingSkills: user.teachingSkills,
        isGoogleUser: user.isGoogleUser,
        googleCalendar: user.googleCalendar,
        teacherOnboardingComplete: user.teacherOnboardingComplete,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateInterestedSkills = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  const { interestedSkills } = req.body;

  if (!Array.isArray(interestedSkills)) {
    return res.status(400).json({ message: 'Interested skills must be an array.' });
  }

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.interestedSkills = interestedSkills;
    await user.save();

    res.status(200).json({
      message: 'Interested skills updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        interestedSkills: user.interestedSkills,
        isGoogleUser: user.isGoogleUser,
        googleCalendar: user.googleCalendar,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error('Error updating interested skills:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateTeachingSkills = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  const { teachingSkills } = req.body;

  if (!Array.isArray(teachingSkills)) {
    return res.status(400).json({ message: 'Teaching skills must be an array.' });
  }

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.teachingSkills = teachingSkills;
    await user.save();

    res.status(200).json({
      message: 'Teaching skills updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        teachingSkills: user.teachingSkills,
        isGoogleUser: user.isGoogleUser,
        googleCalendar: user.googleCalendar,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error('Error updating teaching skills:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateAvailability = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  const { date, slots } = req.body;

  if (!date || !Array.isArray(slots)) {
    return res.status(400).json({ message: 'Date and slots array are required.' });
  }

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const inputDate = new Date(date);
    if (isNaN(inputDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format provided.' });
    }
    inputDate.setUTCHours(0, 0, 0, 0);

    let existingAvailability = user.availability.find(a => {
      const storedDate = new Date(a.date);
      storedDate.setUTCHours(0, 0, 0, 0);
      return storedDate.getTime() === inputDate.getTime();
    });

    if (existingAvailability) {
      existingAvailability.slots = slots;
    } else {
      user.availability.push({ date: inputDate, slots: slots });
    }

    await user.save();

    res.status(200).json({
      message: 'Availability updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        availability: user.availability,
        isGoogleUser: user.isGoogleUser,
        googleCalendar: user.googleCalendar,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.googleAuthUrl = async function(req, res) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: GOOGLE_SCOPES.join(' '),
    prompt: 'consent',
  });
  res.redirect(authUrl);
};


exports.googleAuthCallback = async function (req, res) {
  const { code } = req.query;
  const frontendBase = process.env.FRONTEND_URL;

  if (!code) {
    const errorUrl = `${frontendBase}/signin?error=Missing authorization code`;
    return res.redirect(errorUrl);
  }

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ auth: oAuth2Client, version: 'v2' });
    const { data } = await oauth2.userinfo.get();

    const googleId = data.id;
    const email = data.email?.toLowerCase();
    const name = data.name;

    let user = await User.findOne({ googleId }) || await User.findOne({ email });
    let isNewUser = false;

    if (!user) {
      if (!email) throw new Error("Email not provided by Google");

      user = new User({
        name,
        email,
        googleId,
        isGoogleUser: true,
        isVerified: true,
        password: undefined,
        role: null,
        googleCalendar: {
          connected: true,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          accessTokenExpiryDate: new Date(tokens.expiry_date),
          lastConnected: new Date(),
        },
      });

      isNewUser = true;
    } else {
      // Update existing user
      user.googleId = googleId;
      user.isGoogleUser = true;
      user.isVerified = true;
      if (!user.name && name) user.name = name;
      if (!user.email && email) user.email = email;

      user.googleCalendar = {
        connected: true,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || user.googleCalendar.refreshToken,
        accessTokenExpiryDate: new Date(tokens.expiry_date),
        lastConnected: new Date(),
      };
    }

    await user.save();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: ACCESS_TOKEN_AGE });
    res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_AGE });

    let redirectPath = "/onboarding";
    if (!isNewUser && user.role === "student") {
      redirectPath = "/student/overview";
    } else if (!isNewUser && user.role === "teacher") {
      redirectPath = "/teacher/overview";
    }

    // ✅ Important: Redirect to frontend (not JSON response)
    return res.redirect(`${frontendBase}${redirectPath}`);

  } catch (error) {
    console.error("Google OAuth Callback Error:", error);
    const errorMessage = encodeURIComponent(error.message || "Google authentication failed");
    return res.redirect(`${frontendBase}/signin?error=${errorMessage}`);
  }
};

    

  

exports.disconnectCalendar = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.googleCalendar = {
      connected: false,
      accessToken: null,
      refreshToken: null,
      accessTokenExpiryDate: null,
      lastConnected: null,
    };
    await user.save();

    res.status(200).json({ message: 'Google Calendar disconnected successfully.' });

  } catch (error) {
    console.error('Error disconnecting Google Calendar:', error);
    res.status(500).json({ message: 'Internal Server Error during calendar disconnect.' });
  }
};
