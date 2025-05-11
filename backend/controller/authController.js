// src/controllers/authController.js

const User = require('../models/User');                           
const bcrypt = require('bcrypt');                                
const jwt = require('jsonwebtoken');                             
const BlacklistedToken = require('../models/BlackListedToken');  
const { OAuth2Client } = require("google-auth-library");         
const crypto = require("crypto");                               
const nodemailer = require('nodemailer');                       

// Initialize Google OAuth2 client with your Google client ID
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Cookie options for access and refresh tokens
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // true in production (HTTPS), false in dev (HTTP)

  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  path : '/'
};
const ACCESS_TOKEN_AGE  = 60 * 60 * 1000;                       // Access token valid for 1 hour
const REFRESH_TOKEN_AGE = 7 * 24 * 60 * 60 * 1000;              // Refresh token valid for 7 days

// Generate a JWT access token
function generateAccessToken(user) {
  const payload = { id: user._id, email: user.email, role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Generate a JWT refresh token
function generateRefreshToken(user) {
  const payload = { id: user._id, email: user.email };
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

// Google login handler
async function googleLogin(req, res) {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ message: "ID token is required" });

    // Verify the token with Google's servers
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { sub: googleId, email, name } = ticket.getPayload();

    // Find or create user in our database
    let user = await User.findOne({ googleId }) || await User.findOne({ email });
    if (!user) {
      const randomPassword = crypto.randomBytes(16).toString("hex");
      user = new User({ name, email, password: randomPassword, googleId });
      await user.save();
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }

    // Issue new tokens as cookies
    const accessToken  = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res
      .cookie('accessToken',  accessToken,  { ...cookieOptions, maxAge: ACCESS_TOKEN_AGE })
      .cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_AGE })
      .status(200)
      .json({ message: "Login successful", user: { id: user._id, name: user.name, email: user.email } });

  } catch (error) {
    console.error("Error verifying Google token:", error);
    res.status(401).json({ message: "Invalid Google token", error: error.message });
  }
}

// Refresh token handler
async function refreshToken(req, res) {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ error: 'Refresh token missing' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    // Generate new tokens and update user record
    const newAccessToken  = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    user.activeToken  = newAccessToken;
    user.refreshToken = newRefreshToken;
    await user.save();

    // Send tokens back as cookies
    res
      .cookie('accessToken',  newAccessToken,  { ...cookieOptions, maxAge: ACCESS_TOKEN_AGE })
      .cookie('refreshToken', newRefreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_AGE })
      .json({ message: 'Tokens refreshed' });

  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(403).json({ error: 'Invalid or expired refresh token' });
  }
}

// User signup handler
async function signup(req, res) {
  try {
    const { name, email, password, role = 'student' } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    // Check for existing user
    if (await User.findOne({ email: normalizedEmail })) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Create new user
    const newUser = new User({ name, email: normalizedEmail, password, role });
    const verificationToken = crypto.randomBytes(20).toString("hex");
    newUser.verificationToken = verificationToken;
    await newUser.save();

    // Send verification email
    const verifyUrl = `${req.protocol}://${req.get("host")}/auth/verifyemail/${verificationToken}`;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: normalizedEmail,
      subject: "Verify Your Email",
      text: `Click here to verify your account: ${verifyUrl}`
    });

    // Issue tokens as cookies
    const accessToken  = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);
    newUser.activeToken  = accessToken;
    newUser.refreshToken = refreshToken;
    await newUser.save();

    res
      .cookie('accessToken',  accessToken,  { ...cookieOptions, maxAge: ACCESS_TOKEN_AGE })
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

// User login handler
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check password
    if (!await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Issue tokens as cookies
    const accessToken  = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    user.activeToken  = accessToken;
    user.refreshToken = refreshToken;
    await user.save();

    res
      .cookie('accessToken',  accessToken,  { ...cookieOptions, maxAge: ACCESS_TOKEN_AGE })
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

// User logout handler
async function logout(req, res) {
  try {
    const token = req.cookies.accessToken;                       // Get current access token
    if (token) await BlacklistedToken.create({ token });         // Blacklist it

    // Clear auth cookies
    res
      .clearCookie('accessToken',  cookieOptions)
      .clearCookie('refreshToken', cookieOptions)
      .json({ message: 'Logout successful' });

  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Fetch authenticated user profile
async function profile(req, res) {
  try {
    console.log("Incoming request to /auth/profile"); // Log when the endpoint is hit
    console.log("req.user:", req.user); // Log the content of req.user

    if (!req.user) {
      console.error("Authorization failed: req.user is undefined");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findById(req.user.userId).select("-password");
    console.log("Fetched user from database:", user); // Log the fetched user data

    if (!user) {
      console.warn("User not found for userId:", req.user.userId); // Log if user is not found
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching profile:", error); // Log any error that occurs
    res.status(500).json({ error: "Internal Server Error" });
  }
}


// Forgot password handler
async function forgotPassword(req, res) {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Generate and store reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken  = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;      // Expires in 10 minutes
    await user.save();

    // Send reset email
    const resetUrl = `${req.protocol}://${req.get('host')}/auth/resetpassword/${resetToken}`;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      text: `Reset your password here: ${resetUrl}`
    });

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Error during forgot password:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Reset password handler
async function resetPassword(req, res) {
  const tokenHash = crypto.createHash('sha256').update(req.body.token).digest('hex');
  try {
    const user = await User.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ error: 'Invalid or expired token' });

    // Update user password
    user.password = req.body.password;
    user.resetPasswordToken  = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error during reset password:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Verify email handler
async function verifyEmail(req, res) {
  const { token } = req.params;
  try {
    const user = await User.findOne({ verificationToken: token });
    if (!user) return res.status(400).json({ error: "Invalid verification token" });

    user.isVerified        = true;
    user.verificationToken = null;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Save role handler
async function saveRole(req, res) {
  try {
    const { role } = req.body;
    // authMiddleware sets req.user.userId
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    return res.status(200).json({ message: 'Role updated', role: user.role });
  } catch (error) {
    console.error('Error saving role:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}


module.exports = {
  googleLogin,
  refreshToken,
  signup,
  login,
  logout,
  profile,
  forgotPassword,
  resetPassword,
  verifyEmail,
  saveRole
};