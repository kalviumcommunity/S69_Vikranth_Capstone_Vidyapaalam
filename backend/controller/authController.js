const bcrypt           = require('bcrypt');
const crypto           = require('crypto');
const jwt              = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const nodemailer       = require('nodemailer');
const User             = require('../models/User');
const BlacklistedToken = require('../models/BlackListedToken');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  path: '/',
};

const ACCESS_TOKEN_AGE  = 60 * 60 * 1000;         // 1 hour
const REFRESH_TOKEN_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

function generateAccessToken(user) {
  const payload = { id: user._id, email: user.email, role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}

function generateRefreshToken(user) {
  const payload = { id: user._id, email: user.email };
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

async function googleLogin(req, res) {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: "ID token is required" });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { sub: googleId, email, name } = ticket.getPayload();

    let user = await User.findOne({ googleId }) || await User.findOne({ email });
    if (!user) {
      const randomPassword = crypto.randomBytes(16).toString("hex");
      user = new User({ name, email, password: randomPassword, googleId });
      await user.save();
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }

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
        message: "Login successful",
        user: { id: user._id, name: user.name, email: user.email }
      });
  } catch (error) {
    console.error("Error verifying Google token:", error);
    res.status(401).json({ message: "Invalid Google token", error: error.message });
  }
}

async function refreshToken(req, res) {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.status(401).json({ error: 'Refresh token missing' });
  }

  try {
    // 1) Blacklist check
    if (await BlacklistedToken.findOne({ token })) {
      return res.status(403).json({ error: 'Refresh token revoked' });
    }

    // 2) Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // 3) Load user
    const user = await User.findById(decoded.id).select('refreshToken activeToken');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.refreshToken !== token) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    // 4) Blacklist old refresh token
    await BlacklistedToken.create({ token });

    // 5) Issue new tokens
    const newAccessToken  = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // 6) Persist new tokens
    user.activeToken  = newAccessToken;
    user.refreshToken = newRefreshToken;
    await user.save();

    // 7) Send cookies
    res
      .cookie('accessToken',  newAccessToken,  { ...cookieOptions, maxAge: ACCESS_TOKEN_AGE })
      .cookie('refreshToken', newRefreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_AGE })
      .json({ message: 'Tokens refreshed' });
  } catch (error) {
    console.error('Refresh token error:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Refresh token expired' });
    }
    return res.status(403).json({ error: 'Invalid or expired refresh token' });
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

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Invalid password' });
    }

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

async function logout(req, res) {
  try {
    const token = req.cookies.accessToken;
    if (token) {
      await BlacklistedToken.create({ token });
    }

    res
      .clearCookie('accessToken',  cookieOptions)
      .clearCookie('refreshToken', cookieOptions)
      .json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function profile(req, res) {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json(user);
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken  = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

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

async function resetPassword(req, res) {
  try {
    const tokenHash = crypto.createHash('sha256').update(req.body.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

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

async function verifyEmail(req, res) {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ error: "Invalid verification token" });
    }

    user.isVerified        = true;
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
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();
    res.status(200).json({ message: 'Role updated', role: user.role });
  } catch (error) {
    console.error('Error saving role:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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

