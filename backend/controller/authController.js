
// const bcrypt = require('bcrypt');
// const crypto = require('crypto');
// const jwt = require('jsonwebtoken');
// const { google } = require('googleapis'); 
// const nodemailer = require('nodemailer');
// const User = require('../models/User');
// const Skill = require('../models/Skill');
// const BlacklistedToken = require('../models/BlackListedToken');

// const oAuth2Client = new google.auth.OAuth2(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   process.env.BASE_URL + '/auth/google/callback'
// );


// const cookieOptions = {
//   httpOnly: true,
//   secure: process.env.NODE_ENV === 'production',
//   sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
//   path: '/',
// };


// const ACCESS_TOKEN_AGE = 60 * 60 * 1000;
// const REFRESH_TOKEN_AGE = 7 * 24 * 60 * 60 * 1000;

// function generateAccessToken(user) {
//   const payload = { id: user._id, email: user.email, role: user.role };
//   return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
// }

// function generateRefreshToken(user) {
//   const payload = { id: user._id, email: user.email };
//   return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
// }

// async function googleAuth(req, res) {
//   const scopes = [
//     'https://www.googleapis.com/auth/userinfo.email',
//     'https://www.googleapis.com/auth/userinfo.profile',
//   ];

//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: scopes.join(' '),
//     prompt: 'consent',
//   });
//   res.redirect(authUrl);
// }

// const calendarScopes = [
//   'https://www.googleapis.com/auth/calendar.events',
// ];

// async function googleAuthCallback(req, res) {
//   const { code } = req.query;

//   if (!code) {
//     return res.status(400).json({ message: 'Authorization code missing.' });
//   }

//   try {
//     const { tokens } = await oAuth2Client.getToken(code);
//     oAuth2Client.setCredentials(tokens);

//     const oauth2 = google.oauth2({
//       auth: oAuth2Client,
//       version: 'v2',
//     });
//     const { data } = await oauth2.userinfo.get();

//     const googleId = data.id;
//     const email = data.email.toLowerCase();
//     const name = data.name;

//     let user = await User.findOne({ googleId });
//     let isNewUser = false;

//     if (!user) {
//       user = await User.findOne({ email });

//       if (user) {
//         if (!user.googleId) {
//           user.googleId = googleId;
//           user.isGoogleUser = true;
//           if (!user.name) user.name = name;
//         }
//       } else {
//         user = new User({
//           name,
//           email,
//           googleId,
//           isGoogleUser: true,
//           isVerified: true,
//           password: null,
//         });
//         isNewUser = true;
//       }
//     }

//     if (tokens.refresh_token) {
//       user.googleCalendar.refreshToken = tokens.refresh_token;
//       user.googleCalendar.connected = true;
//       user.googleCalendar.lastConnected = new Date();
//     }

//     await user.save();

//     const accessToken = generateAccessToken(user);
//     const refreshToken = generateRefreshToken(user);

//     user.activeToken = accessToken;
//     user.refreshToken = refreshToken;
//     await user.save();

//     const redirectUrl = `${process.env.FRONTEND_URL}/?googleAuthSuccess=true&isNewUser=${isNewUser}`;

//     res
//       .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: ACCESS_TOKEN_AGE })
//       .cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_AGE })
//       .redirect(redirectUrl);

//   } catch (error) {
//     console.error("Google Auth Callback Error:", error);
//     const errorRedirectUrl = `${process.env.FRONTEND_URL}/?googleAuthSuccess=false&error=${encodeURIComponent(error.message)}`;
//     res.redirect(errorRedirectUrl);
//   }
// }

// const getGoogleCalendarAuthUrl = (req, res) => {
//   if (!req.user || !req.user._id) {
//     return res.status(401).json({ message: 'Authentication required to connect calendar.' });
//   }

//   const calendarOAuth2Client = new google.auth.OAuth2(
//     process.env.GOOGLE_CLIENT_ID,
//     process.env.GOOGLE_CLIENT_SECRET,
//     process.env.GOOGLE_CALENDAR_REDIRECT_URI // Use the specific calendar redirect URI here
//   );

//   const authUrl = calendarOAuth2Client.generateAuthUrl({
//     access_type: 'offline', // Crucial to get a refresh token for long-term access
//     scope: calendarScopes.join(' '), // Join scopes into a space-delimited string
//     prompt: 'consent', // Always ask for consent to ensure refresh token is re-issued if revoked
//     state: req.user._id.toString(), // Pass user ID to associate callback with the correct user
//   });
//   res.json({ authUrl });
// };

// const googleCalendarAuthCallback = async (req, res) => {
//   const { code, state: userId } = req.query;

//   if (!code) {
//     return res.redirect(`${process.env.FRONTEND_URL}/settings?calendarAuthStatus=failed&error=${encodeURIComponent('Authorization code missing.')}`);
//   }

//   const calendarOAuth2Client = new google.auth.OAuth2(
//     process.env.GOOGLE_CLIENT_ID,
//     process.env.GOOGLE_CLIENT_SECRET,
//     process.env.GOOGLE_CALENDAR_REDIRECT_URI
//   );

//   try {
//     const { tokens } = await calendarOAuth2Client.getToken(code);

//     const user = await User.findById(userId);

//     if (!user) {
//       return res.redirect(`${process.env.FRONTEND_URL}/settings?calendarAuthStatus=failed&error=${encodeURIComponent('User not found during calendar callback.')}`);
//     }

//     if (tokens.refresh_token) {
//       user.googleCalendar.refreshToken = tokens.refresh_token;
//       user.googleCalendar.connected = true;
//       user.googleCalendar.lastConnected = new Date();
//       await user.save();
//     } else if (user.googleCalendar.connected) {
//       user.googleCalendar.lastConnected = new Date();
//       await user.save();
//     }

//     res.redirect(`${process.env.FRONTEND_URL}/settings?calendarAuthStatus=success`);

//   } catch (error) {
//     console.error("Google Calendar Auth Callback Error:", error);
//     if (error.code === 400 && error.message.includes('invalid_grant')) {
//         const user = await User.findById(userId);
//         if (user) {
//             user.googleCalendar.connected = false;
//             user.googleCalendar.refreshToken = null;
//             await user.save();
//         }
//         return res.redirect(`${process.env.FRONTEND_URL}/settings?calendarAuthStatus=failed&error=${encodeURIComponent('Google Calendar connection expired. Please reconnect.')}`);
//     }
//     res.redirect(`${process.env.FRONTEND_URL}/settings?calendarAuthStatus=failed&error=${encodeURIComponent(error.message || 'Unknown error occurred during calendar connection.')}`);
//   }
// };

// async function refreshToken(req, res) {
//   const token = req.cookies.refreshToken;
//   if (!token) return res.status(401).json({ error: 'Refresh token missing' });

//   try {
//     const isBlacklisted = await BlacklistedToken.findOne({ token });
//     if (isBlacklisted) {
//       return res.status(403).json({ error: 'Refresh token revoked' });
//     }

//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
//     } catch (err) {
//       return res.status(403).json({ error: 'Invalid or expired refresh token' });
//     }

//     const user = await User.findById(decoded.id);
//     if (!user || user.refreshToken !== token) {
//       return res.status(403).json({ error: 'Invalid refresh token' });
//     }

//     await BlacklistedToken.create({ token });

//     const newAccessToken = generateAccessToken(user);
//     const newRefreshToken = generateRefreshToken(user);

//     user.activeToken = newAccessToken;
//     user.refreshToken = newRefreshToken;
//     await user.save();

//     res
//       .cookie('accessToken', newAccessToken, { ...cookieOptions, maxAge: ACCESS_TOKEN_AGE })
//       .cookie('refreshToken', newRefreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_AGE })
//       .json({ message: 'Tokens refreshed' });

//   } catch (error) {
//     console.error('Unexpected refreshToken error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }

// async function signup(req, res) {
//   try {
//     const { name, email, password, role = 'student' } = req.body;
//     const normalizedEmail = email.trim().toLowerCase();

//     if (await User.findOne({ email: normalizedEmail })) {
//       return res.status(409).json({ error: 'User with this email already exists' });
//     }

//     const newUser = new User({ name, email: normalizedEmail, password, role });
//     const verificationToken = crypto.randomBytes(20).toString("hex");
//     newUser.verificationToken = verificationToken;
//     await newUser.save();

//     const verifyUrl = `${process.env.BASE_URL}/auth/verifyemail/${verificationToken}`;

//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
//     });

//     if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
//       await transporter.sendMail({
//         from: process.env.EMAIL_USER,
//         to: normalizedEmail,
//         subject: "Verify Your Email",
//         text: `Click here to verify your account: ${verifyUrl}`
//       });
//     }

//     const accessToken = generateAccessToken(newUser);
//     const refreshToken = generateRefreshToken(newUser);
//     newUser.activeToken = accessToken;
//     newUser.refreshToken = refreshToken;
//     await newUser.save();

//     res
//       .cookie('accessToken', accessToken, { ...cookieOptions, maxAge: ACCESS_TOKEN_AGE })
//       .cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_AGE })
//       .status(201)
//       .json({
//         message: 'User registered—please check your email for verification.',
//         user: { id: newUser._id, name: newUser.name, email: newUser.email }
//       });

//   } catch (error) {
//     console.error('Error during signup:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }

// async function login(req, res) {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email: email.trim().toLowerCase() });

//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     const accessToken = generateAccessToken(user);
//     const refreshToken = generateRefreshToken(user);

//     user.activeToken = accessToken;
//     user.refreshToken = refreshToken;
//     await user.save();

//     res
//       .cookie('accessToken', accessToken, { ...cookieOptions, maxAge: ACCESS_TOKEN_AGE })
//       .cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_AGE })
//       .status(200)
//       .json({
//         message: 'Login successful',
//         user: { id: user._id, name: user.name, email: user.email }
//       });

//   } catch (error) {
//     console.error('Error during login:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }

// async function logout(req, res) {
//   try {
//     const token = req.cookies.accessToken;
//     if (token) await BlacklistedToken.create({ token });

//     res
//       .clearCookie('accessToken', cookieOptions)
//       .clearCookie('refreshToken', cookieOptions)
//       .json({ message: 'Logout successful' });

//   } catch (error) {
//     console.error('Error logging out:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }

// async function profile(req, res) {
//   try {
//     const user = await User.findById(req.user.id)
//       .select("-password")
//       .populate('interestedSkills');

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     res.status(200).json({
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role || null,
//       interestedSkills: user.interestedSkills,
//       googleCalendarConnected: user.googleCalendar ? user.googleCalendar.connected : false,
//     });

//   } catch (err) {
//     console.error('Error in profile controller:', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }

// async function forgotPassword(req, res) {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ error: 'User not found' });

//     const resetToken = crypto.randomBytes(20).toString('hex');
//     user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
//     user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
//     await user.save();

//     const resetUrl = `${process.env.BASE_URL}/auth/resetpassword/${resetToken}`;
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
//     });

//     if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
//       await transporter.sendMail({
//         from: process.env.EMAIL_USER,
//         to: email,
//         subject: 'Password Reset Request',
//         text: `Reset your password here: ${resetUrl}`
//       });
//     }

//     res.json({ message: 'Password reset email sent' });

//   } catch (error) {
//     console.error('Error during forgot password:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }

// async function resetPassword(req, res) {
//   try {
//     const tokenHash = crypto.createHash('sha256').update(req.body.token).digest('hex');
//     const user = await User.findOne({
//       resetPasswordToken: tokenHash,
//       resetPasswordExpire: { $gt: Date.now() },
//     });

//     if (!user) return res.status(400).json({ error: 'Invalid or expired token' });

//     user.password = req.body.password;
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;
//     await user.save();

//     res.json({ message: 'Password reset successful' });

//   } catch (error) {
//     console.error('Error during reset password:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }

// async function verifyEmail(req, res) {
//   try {
//     const { token } = req.params;
//     const user = await User.findOne({ verificationToken: token });
//     if (!user) return res.status(400).json({ error: "Invalid verification token" });

//     user.isVerified = true;
//     user.verificationToken = null;
//     await user.save();

//     res.json({ message: "Email verified successfully" });

//   } catch (error) {
//     console.error("Error verifying email:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// }

// async function saveRole(req, res) {
//   try {
//     const { role } = req.body;
//     const user = await User.findById(req.user.id);
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     user.role = role;
//     await user.save();
//     res.status(200).json({ message: 'Role updated', role: user.role });

//   } catch (error) {
//     console.error('Error saving role:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }

// const updateInterestedSkills = async (req, res) => {
//   const { skills } = req.body;
//   if (!Array.isArray(skills)) {
//     return res.status(400).json({ message: 'Skills must be an array of strings.' });
//   }
//   const user = await User.findById(req.user.id);
//   if (!user || user.role !== 'student') {
//     return res.status(403).json({ message: 'Only students can update interested skills.' });
//   }
//   user.interestedSkills = skills;
//   await user.save();
//   return res.status(200).json({ message: 'Updated.', interestedSkills: user.interestedSkills });
// };

// async function updateProfile(req, res) {
//   try {
//     const { fullName, phone, bio } = req.body;
//     const user = await User.findById(req.user.id);

//     if (!user) return res.status(404).json({ message: 'User not found' });

//     if (fullName !== undefined) user.name = fullName.trim();
//     if (phone !== undefined) user.phoneNumber = phone.trim();
//     if (bio !== undefined) user.bio = bio.trim();

//     await user.save();

//     res.status(200).json({
//       message: 'Profile updated',
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         phone: user.phoneNumber,
//         bio: user.bio,
//         interestedSkills: user.interestedSkills
//       }
//     });
//   } catch (err) {
//     console.error('Error in updateProfile:', err);
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// }


// const updateTeachingSkills = async (req, res) => {
//   const { teachingSkills } = req.body;

//   if (!Array.isArray(teachingSkills)) {
//     return res.status(400).json({ message: 'Skills must be an array of strings.' });
//   }
//   if (teachingSkills.length === 0) {
//     return res.status(400).json({ message: 'Please select at least one skill you can teach.' });
//   }
//   if (!teachingSkills.every(skill => typeof skill === 'string')) {
//     return res.status(400).json({ message: 'All skills must be strings.' });
//   }

//   if (!req.user || !req.user.id) {
//     return res.status(401).json({ message: 'Not authorized: User ID missing.' });
//   }

//   try {
//     const user = await User.findById(req.user.id);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found.' });
//     }

//     if (user.role !== 'teacher') {
//       return res.status(403).json({ message: 'Only teachers can update teaching skills.' });
//     }

//     user.teachingSkills = teachingSkills;
//     await user.save();

//     return res.status(200).json({ message: 'Teaching skills updated successfully.', teachingSkills: user.teachingSkills });

//   } catch (error) {
//     console.error("Error in updateTeachingSkills controller:", error);
//     if (error.name === 'ValidationError') {
//       const messages = Object.values(error.errors).map(val => val.message);
//       return res.status(400).json({ success: false, message: messages.join(', ') });
//     }
//     return res.status(500).json({ message: 'Server error updating teaching skills.' });
//   }
// };

// const updateAvailability = async (req, res) => {
//   const { date, slots } = req.body;

//   if (!date || !Array.isArray(slots)) {
//     return res.status(400).json({ message: 'Both date and slots are required.' });
//   }

//   const user = await User.findById(req.user.id);
//   if (!user || user.role !== 'teacher') {
//     return res.status(403).json({ message: 'Only teachers can update availability.' });
//   }

//   user.availability = {
//     date: new Date(date),
//     slots: slots.map(slot => slot.trim()),
//   };

//   await user.save();

//   return res.status(200).json({ message: 'Availability updated.', availability: user.availability });
// };


// module.exports = {
//   googleAuth, 
//   googleAuthCallback, 
//   getGoogleCalendarAuthUrl,
//   googleCalendarAuthCallback,
//   refreshToken,
//   signup,
//   login,
//   logout,
//   profile,
//   forgotPassword,
//   resetPassword,
//   verifyEmail,
//   saveRole,
//   updateInterestedSkills,
//   updateTeachingSkills,
//   updateAvailability,
//   updateProfile
// };


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
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  path: '/',
};

const ACCESS_TOKEN_AGE = 60 * 60 * 1000;
const REFRESH_TOKEN_AGE = 7 * 24 * 60 * 60 * 1000;

function generateAccessToken(user) {
  const payload = { id: user._id, email: user.email, role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}

function generateRefreshToken(user) {
  const payload = { id: user._2id, email: user.email };
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

    const redirectUrl = `${process.env.FRONTEND_URL}/?googleAuthSuccess=true&isNewUser=${isNewUser}`;

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
  if (!token) return res.status(401).json({ error: 'Refresh token missing' });

  try {
    const isBlacklisted = await BlacklistedToken.findOne({ token });
    if (isBlacklisted) {
      return res.status(403).json({ error: 'Refresh token revoked' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(403).json({ error: 'Invalid or expired refresh token' });
    }

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    await BlacklistedToken.create({ token });

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.activeToken = newAccessToken;
    user.refreshToken = newRefreshToken;
    await user.save();

    res
      .cookie('accessToken', newAccessToken, { ...cookieOptions, maxAge: ACCESS_TOKEN_AGE })
      .cookie('refreshToken', newRefreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_AGE })
      .json({ message: 'Tokens refreshed' });

  } catch (error) {
    console.error('Unexpected refreshToken error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);
    newUser.activeToken = accessToken;
    newUser.refreshToken = refreshToken;
    await newUser.save();

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
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

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
    const token = req.cookies.accessToken;
    if (token) await BlacklistedToken.create({ token });

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
      .select("-password")
      .populate('interestedSkills')
      // Select Google Calendar connection status for frontend display
      .select('+googleCalendar.connected');

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