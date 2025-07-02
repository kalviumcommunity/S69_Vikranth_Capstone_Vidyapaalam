

// controllers/authController.js
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Skill = require('../models/Skill'); // Assuming this is still used somewhere
const BlacklistedToken = require('../models/BlackListedToken');

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.BASE_URL + '/auth/google/callback'
);

const cookieOptions = {
  httpOnly: true,
  secure: true, // Should be true in production (which you have in .env)
  sameSite: "None", // Essential for cross-origin (frontend on Netlify, backend on Render)
  path: '/',
};

const ACCESS_TOKEN_AGE = 60 * 60 * 1000; // 1 hour
const REFRESH_TOKEN_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

function generateAccessToken(user) {
  const payload = { id: user._id, email: user.email, role: user.role };
   
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}

function generateRefreshToken(user) {
  const payload = { id: user._id, email: user.email };
   
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

async function googleAuth(req, res) {
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ];

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes.join(' '),
    prompt: 'consent',
  });
  res.redirect(authUrl);
}

async function googleAuthCallback(req, res) {
  const { code } = req.query;

  if (!code) {
    console.error('Google Auth Callback Error: Authorization code missing.');
    return res.status(400).json({ message: 'Authorization code missing.' });
  }

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: oAuth2Client,
      version: 'v2',
    });
    const { data } = await oauth2.userinfo.get();

    const googleId = data.id;
    const email = data.email.toLowerCase();
    const name = data.name;

    let user = await User.findOne({ googleId });
    let isNewUser = false;

    if (!user) {
      user = await User.findOne({ email });

      if (user) {
        if (!user.googleId) {
          user.googleId = googleId;
          user.isGoogleUser = true;
          if (!user.name) user.name = name;
        }
      } else {
        user = new User({
          name,
          email,
          googleId,
          isGoogleUser: true,
          isVerified: true,
          password: null,
        });
        isNewUser = true;
      }
    }

    await user.save(); 

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.activeToken = accessToken;
    user.refreshToken = refreshToken;
    await user.save();

    const redirectUrl = `${process.env.FRONTEND_URL}/onboarding/?googleAuthSuccess=true&isNewUser=${isNewUser}`;

    res
      .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: ACCESS_TOKEN_AGE })
      .cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_AGE })
      .redirect(redirectUrl);

  } catch (error) {
    console.error("Google Auth Callback Error:", error);
    const errorRedirectUrl = `${process.env.FRONTEND_URL}/?googleAuthSuccess=false&error=${encodeURIComponent(error.message)}`;
    res.redirect(errorRedirectUrl);
  }
}

async function refreshToken(req, res) {
  const token = req.cookies.refreshToken;
  console.log('Refresh Token Endpoint: Received request.');

  if (!token) {
    console.log('Refresh Token Endpoint: No refresh token provided.');
    return res.status(401).json({ error: 'Refresh token missing' });
  }

  try {
    const isBlacklisted = await BlacklistedToken.findOne({ token });
    if (isBlacklisted) {
      console.log('Refresh Token Endpoint: Refresh token is blacklisted.');
      return res.status(401).json({ error: 'Refresh token revoked. Please log in again.' }); // Changed to 401
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      console.log('Refresh Token Endpoint: Refresh token verified. Decoded ID:', decoded.id);
    } catch (err) {
      console.error('Refresh Token Endpoint: JWT verification failed:', err.name, err.message);
      // If refresh token itself is invalid or expired
      return res.status(401).json({ error: 'Invalid or expired refresh token. Please log in again.' }); // Changed to 401
    }

    // Ensure activeToken and refreshToken are selected
    const user = await User.findById(decoded.id).select('+refreshToken +activeToken'); 
    if (!user || user.refreshToken !== token) {
      console.log('Refresh Token Endpoint: User not found or refresh token mismatch.');
      // Clear tokens if mismatch found for security
      res.clearCookie('accessToken', cookieOptions);
      res.clearCookie('refreshToken', cookieOptions);
      return res.status(401).json({ error: 'Invalid refresh token. Please log in again.' }); // Changed to 401
    }

    // OPTIONAL: Blacklist the old refresh token if you want single-use refresh tokens.
    // If you uncomment this, ensure your frontend is robust to receive the new tokens.
    // If the client doesn't receive the new token for any reason, they'll be logged out.
    // await BlacklistedToken.create({ token }); 
    // console.log('Refresh Token Endpoint: Old refresh token blacklisted.');


    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.activeToken = newAccessToken; // Update active access token
    user.refreshToken = newRefreshToken; // Update refresh token for the user in DB
    await user.save();
    console.log('Refresh Token Endpoint: New tokens generated and user saved.');

    res
      .cookie('accessToken', newAccessToken, { ...cookieOptions, maxAge: ACCESS_TOKEN_AGE })
      .cookie('refreshToken', newRefreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_AGE })
      .json({ message: 'Tokens refreshed' });
    console.log('Refresh Token Endpoint: New tokens sent as cookies.');

  } catch (error) {
    console.error('Unexpected refreshToken error:', error);
    // Clear cookies on any unhandled error to force re-login
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
    res.status(500).json({ error: 'Internal Server Error during token refresh.' });
  }
}

async function signup(req, res) {
  try {
    const { name, email, password, role = 'student' } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    if (await User.findOne({ email: normalizedEmail })) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const newUser = new User({ name, email: normalizedEmail, password, role });
    const verificationToken = crypto.randomBytes(20).toString("hex");
    newUser.verificationToken = verificationToken;
    await newUser.save();

    const verifyUrl = `${process.env.BASE_URL}/auth/verifyemail/${verificationToken}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: normalizedEmail,
        subject: "Verify Your Email",
        text: `Click here to verify your account: ${verifyUrl}`
      });
    }

    // Tokens are generated and set *after* successful signup and email sending
    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);
    newUser.activeToken = accessToken; // Store the new access token
    newUser.refreshToken = refreshToken; // Store the new refresh token
    await newUser.save(); // Save user with updated tokens

    res
      .cookie('accessToken', accessToken, { ...cookieOptions, maxAge: ACCESS_TOKEN_AGE })
      .cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_AGE })
      .status(201)
      .json({
        message: 'User registered—please check your email for verification.',
        user: { id: newUser._id, name: newUser.name, email: newUser.email }
      });

  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    // Ensure password, activeToken, and refreshToken are selected from DB
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password +activeToken +refreshToken'); 

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate new tokens on successful login
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Update user with new tokens
    user.activeToken = accessToken;
    user.refreshToken = refreshToken;
    await user.save();

    res
      .cookie('accessToken', accessToken, { ...cookieOptions, maxAge: ACCESS_TOKEN_AGE })
      .cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_AGE })
      .status(200)
      .json({
        message: 'Login successful',
        user: { id: user._id, name: user.name, email: user.email }
      });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function logout(req, res) {
  try {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    // Blacklist current access token
    if (accessToken) await BlacklistedToken.create({ token: accessToken });

    // Clear refreshToken and activeToken from user in DB
    if (req.user && req.user.id) { // req.user is set by 'protect' middleware
      const user = await User.findById(req.user.id);
      if (user) {
        user.activeToken = null;
        user.refreshToken = null;
        await user.save();
      }
    } else if (refreshToken) { // Fallback if protect middleware didn't run (e.g., direct logout from frontend after token expired)
      try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);
        if (user) {
          user.activeToken = null;
          user.refreshToken = null;
          await user.save();
        }
      } catch (err) {
        console.warn('Logout: Could not decode refresh token for user DB cleanup:', err.message);
      }
    }

    res
      .clearCookie('accessToken', cookieOptions)
      .clearCookie('refreshToken', cookieOptions)
      .json({ message: 'Logout successful' });

  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function profile(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("-password -refreshToken -activeToken") // Exclude sensitive token fields from profile response
      .populate('interestedSkills')
      // Select Google Calendar connection status for frontend display
      .select('+googleCalendar.connected'); // Explicitly include if it's set to select: false

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role || null,
      interestedSkills: user.interestedSkills,
      googleCalendarConnected: user.googleCalendar ? user.googleCalendar.connected : false,
    });

  } catch (err) {
    console.error('Error in profile controller:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.BASE_URL}/auth/resetpassword/${resetToken}`;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Request',
        text: `Reset your password here: ${resetUrl}`
      });
    }

    res.json({ message: 'Password reset email sent' });

  } catch (error) {
    console.error('Error during forgot password:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function resetPassword(req, res) {
  try {
    const tokenHash = crypto.createHash('sha256').update(req.body.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ error: 'Invalid or expired token' });

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });

  } catch (error) {
    console.error('Error during reset password:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function verifyEmail(req, res) {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });
    if (!user) return res.status(400).json({ error: "Invalid verification token" });

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.json({ message: "Email verified successfully" });

  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function saveRole(req, res) {
  try {
    const { role } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role;
    await user.save();
    res.status(200).json({ message: 'Role updated', role: user.role });

  } catch (error) {
    console.error('Error saving role:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const updateInterestedSkills = async (req, res) => {
  const { skills } = req.body;
  if (!Array.isArray(skills)) {
    return res.status(400).json({ message: 'Skills must be an array of strings.' });
  }
  const user = await User.findById(req.user.id);
  if (!user || user.role !== 'student') {
    return res.status(403).json({ message: 'Only students can update interested skills.' });
  }
  user.interestedSkills = skills;
  await user.save();
  return res.status(200).json({ message: 'Updated.', interestedSkills: user.interestedSkills });
};

async function updateProfile(req, res) {
  try {
    const { fullName, phone, bio } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (fullName !== undefined) user.name = fullName.trim();
    if (phone !== undefined) user.phoneNumber = phone.trim();
    if (bio !== undefined) user.bio = bio.trim();

    await user.save();

    res.status(200).json({
      message: 'Profile updated',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phoneNumber,
        bio: user.bio,
        interestedSkills: user.interestedSkills
      }
    });
  } catch (err) {
    console.error('Error in updateProfile:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

const updateTeachingSkills = async (req, res) => {
  const { teachingSkills } = req.body;

  if (!Array.isArray(teachingSkills)) {
    return res.status(400).json({ message: 'Skills must be an array of strings.' });
  }
  if (teachingSkills.length === 0) {
    return res.status(400).json({ message: 'Please select at least one skill you can teach.' });
  }
  if (!teachingSkills.every(skill => typeof skill === 'string')) {
    return res.status(400).json({ message: 'All skills must be strings.' });
  }

  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Not authorized: User ID missing.' });
  }

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can update teaching skills.' });
    }

    user.teachingSkills = teachingSkills;
    await user.save();

    return res.status(200).json({ message: 'Teaching skills updated successfully.', teachingSkills: user.teachingSkills });

  } catch (error) {
    console.error("Error in updateTeachingSkills controller:", error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    return res.status(500).json({ message: 'Server error updating teaching skills.' });
  }
};

const updateAvailability = async (req, res) => {
  const { date, slots } = req.body;

  if (!date || !Array.isArray(slots)) {
    return res.status(400).json({ message: 'Both date and slots are required.' });
  }

  const user = await User.findById(req.user.id);
  if (!user || user.role !== 'teacher') {
    return res.status(403).json({ message: 'Only teachers can update availability.' });
  }

  user.availability = {
    date: new Date(date),
    slots: slots.map(slot => slot.trim()),
  };

  await user.save();

  return res.status(200).json({ message: 'Availability updated.', availability: user.availability });
};

module.exports = {
  googleAuth,
  googleAuthCallback,
  refreshToken,
  signup,
  login,
  logout,
  profile,
  forgotPassword,
  resetPassword,
  verifyEmail,
  saveRole,
  updateInterestedSkills,
  updateTeachingSkills,
  updateAvailability,
  updateProfile
};

