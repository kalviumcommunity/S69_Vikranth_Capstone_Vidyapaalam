
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
// const bcrypt = require('bcrypt');
// const crypto = require('crypto');
// const jwt = require('jsonwebtoken');
// const { google } = require('googleapis');
// const nodemailer = require('nodemailer');
// const User = require('../models/User');
// const Skill = require('../models/Skill'); // Assuming this is still used somewhere
// const BlacklistedToken = require('../models/BlackListedToken');

// const oAuth2Client = new google.auth.OAuth2(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   process.env.BASE_URL + '/auth/google/callback'
// );

// const cookieOptions = {
//   httpOnly: true,
//   secure: true,
//   sameSite: "none" ,
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
//       .populate('interestedSkills')
//       // Select Google Calendar connection status for frontend display
//       .select('+googleCalendar.connected');

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
// const bcrypt = require('bcrypt');
// const crypto = require('crypto');
// const jwt = require('jsonwebtoken');
// const { google } = require('googleapis');
// const nodemailer = require('nodemailer');
// const User = require('../models/User');
// const Skill = require('../models/Skill'); // Assuming this is still used somewhere
// const BlacklistedToken = require('../models/BlackListedToken');

// const oAuth2Client = new google.auth.OAuth2(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   process.env.BASE_URL + '/auth/google/callback'
// );

// const cookieOptions = {
//   httpOnly: true,
//   secure: true, // Should be true in production (which you have in .env)
//   sameSite: "None", // Essential for cross-origin (frontend on Netlify, backend on Render)
//   path: '/',
// };

// const ACCESS_TOKEN_AGE = 60 * 60 * 1000; // 1 hour
// const REFRESH_TOKEN_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

// function generateAccessToken(user) {
//   const payload = { id: user._id, email: user.email, role: user.role };
   
//   return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
// }

// function generateRefreshToken(user) {
//   const payload = { id: user._id, email: user.email };
//     console.log("--- Generating Refresh Token ---");
//     console.log("  Server Time (ISO String):", new Date().toISOString());
//     console.log("  Server Time (Milliseconds since Epoch):", Date.now());
//     console.log("  Token Payload:", payload);
//     console.log("  JWT_REFRESH_SECRET (first 5 chars):", process.env.JWT_REFRESH_SECRET ? process.env.JWT_REFRESH_SECRET.substring(0, 5) : 'N/A');
//   return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
// }

// async function googleAuth(req, res) {
//   const scopes = [
//     'https://www.googleapis.com/auth/userinfo.email',
//     'https://www.googleapis.com/auth/userinfo.profile',
//   ];

//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: scopes.join(' '),
//     prompt: 'consent',
//   });
//   res.redirect(authUrl);
// }

// async function googleAuthCallback(req, res) {
//   const { code } = req.query;

//   if (!code) {
//     console.error('Google Auth Callback Error: Authorization code missing.');
//     return res.status(400).json({ message: 'Authorization code missing.' });
//   }

//   try {
//     const { tokens } = await oAuth2Client.getToken(code);
//     oAuth2Client.setCredentials(tokens);

//     const oauth2 = google.oauth2({
//       auth: oAuth2Client,
//       version: 'v2',
//     });
//     const { data } = await oauth2.userinfo.get();

//     const googleId = data.id;
//     const email = data.email.toLowerCase();
//     const name = data.name;

//     let user = await User.findOne({ googleId });
//     let isNewUser = false;

//     if (!user) {
//       user = await User.findOne({ email });

//       if (user) {
//         if (!user.googleId) {
//           user.googleId = googleId;
//           user.isGoogleUser = true;
//           if (!user.name) user.name = name;
//         }
//       } else {
//         user = new User({
//           name,
//           email,
//           googleId,
//           isGoogleUser: true,
//           isVerified: true,
//           password: null,
//         });
//         isNewUser = true;
//       }
//     }

//     await user.save(); 

//     const accessToken = generateAccessToken(user);
//     const refreshToken = generateRefreshToken(user);

//     user.activeToken = accessToken;
//     user.refreshToken = refreshToken;
//     await user.save();

//     const redirectUrl = `${process.env.FRONTEND_URL}/?googleAuthSuccess=true&isNewUser=${isNewUser}`;

//     res
//       .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: ACCESS_TOKEN_AGE })
//       .cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_AGE })
//       .redirect(redirectUrl);

//   } catch (error) {
//     console.error("Google Auth Callback Error:", error);
//     const errorRedirectUrl = `${process.env.FRONTEND_URL}/?googleAuthSuccess=false&error=${encodeURIComponent(error.message)}`;
//     res.redirect(errorRedirectUrl);
//   }
// }

// async function refreshToken(req, res) {
//   const token = req.cookies.refreshToken;
//   console.log('Refresh Token Endpoint: Received request.');

//   if (!token) {
//     console.log('Refresh Token Endpoint: No refresh token provided.');
//     return res.status(401).json({ error: 'Refresh token missing' });
//   }

//   try {
//     const isBlacklisted = await BlacklistedToken.findOne({ token });
//     if (isBlacklisted) {
//       console.log('Refresh Token Endpoint: Refresh token is blacklisted.');
//       return res.status(401).json({ error: 'Refresh token revoked. Please log in again.' }); // Changed to 401
//     }

//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
//       console.log('Refresh Token Endpoint: Refresh token verified. Decoded ID:', decoded.id);
//     } catch (err) {
//       console.error('Refresh Token Endpoint: JWT verification failed:', err.name, err.message);
//       // If refresh token itself is invalid or expired
//       return res.status(401).json({ error: 'Invalid or expired refresh token. Please log in again.' }); // Changed to 401
//     }

//     // Ensure activeToken and refreshToken are selected
//     const user = await User.findById(decoded.id).select('+refreshToken +activeToken'); 
//     if (!user || user.refreshToken !== token) {
//       console.log('Refresh Token Endpoint: User not found or refresh token mismatch.');
//       // Clear tokens if mismatch found for security
//       res.clearCookie('accessToken', cookieOptions);
//       res.clearCookie('refreshToken', cookieOptions);
//       return res.status(401).json({ error: 'Invalid refresh token. Please log in again.' }); // Changed to 401
//     }

//     // OPTIONAL: Blacklist the old refresh token if you want single-use refresh tokens.
//     // If you uncomment this, ensure your frontend is robust to receive the new tokens.
//     // If the client doesn't receive the new token for any reason, they'll be logged out.
//     // await BlacklistedToken.create({ token }); 
//     // console.log('Refresh Token Endpoint: Old refresh token blacklisted.');


//     const newAccessToken = generateAccessToken(user);
//     const newRefreshToken = generateRefreshToken(user);

//     user.activeToken = newAccessToken; // Update active access token
//     user.refreshToken = newRefreshToken; // Update refresh token for the user in DB
//     await user.save();
//     console.log('Refresh Token Endpoint: New tokens generated and user saved.');

//     res
//       .cookie('accessToken', newAccessToken, { ...cookieOptions, maxAge: ACCESS_TOKEN_AGE })
//       .cookie('refreshToken', newRefreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_AGE })
//       .json({ message: 'Tokens refreshed' });
//     console.log('Refresh Token Endpoint: New tokens sent as cookies.');

//   } catch (error) {
//     console.error('Unexpected refreshToken error:', error);
//     // Clear cookies on any unhandled error to force re-login
//     res.clearCookie('accessToken', cookieOptions);
//     res.clearCookie('refreshToken', cookieOptions);
//     res.status(500).json({ error: 'Internal Server Error during token refresh.' });
//   }
// }

// async function signup(req, res) {
//   try {
//     const { name, email, password, role = 'student' } = req.body;
//     const normalizedEmail = email.trim().toLowerCase();

//     if (await User.findOne({ email: normalizedEmail })) {
//       return res.status(409).json({ error: 'User with this email already exists' });
//     }

//     const newUser = new User({ name, email: normalizedEmail, password, role });
//     const verificationToken = crypto.randomBytes(20).toString("hex");
//     newUser.verificationToken = verificationToken;
//     await newUser.save();

//     const verifyUrl = `${process.env.BASE_URL}/auth/verifyemail/${verificationToken}`;

//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
//     });

//     if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
//       await transporter.sendMail({
//         from: process.env.EMAIL_USER,
//         to: normalizedEmail,
//         subject: "Verify Your Email",
//         text: `Click here to verify your account: ${verifyUrl}`
//       });
//     }

//     // Tokens are generated and set *after* successful signup and email sending
//     const accessToken = generateAccessToken(newUser);
//     const refreshToken = generateRefreshToken(newUser);
//     newUser.activeToken = accessToken; // Store the new access token
//     newUser.refreshToken = refreshToken; // Store the new refresh token
//     await newUser.save(); // Save user with updated tokens

//     res
//       .cookie('accessToken', accessToken, { ...cookieOptions, maxAge: ACCESS_TOKEN_AGE })
//       .cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_AGE })
//       .status(201)
//       .json({
//         message: 'User registered—please check your email for verification.',
//         user: { id: newUser._id, name: newUser.name, email: newUser.email }
//       });

//   } catch (error) {
//     console.error('Error during signup:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }

// async function login(req, res) {
//   try {
//     const { email, password } = req.body;
//     // Ensure password, activeToken, and refreshToken are selected from DB
//     const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password +activeToken +refreshToken'); 

//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     // Generate new tokens on successful login
//     const accessToken = generateAccessToken(user);
//     const refreshToken = generateRefreshToken(user);

//     // Update user with new tokens
//     user.activeToken = accessToken;
//     user.refreshToken = refreshToken;
//     await user.save();

//     res
//       .cookie('accessToken', accessToken, { ...cookieOptions, maxAge: ACCESS_TOKEN_AGE })
//       .cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_AGE })
//       .status(200)
//       .json({
//         message: 'Login successful',
//         user: { id: user._id, name: user.name, email: user.email }
//       });

//   } catch (error) {
//     console.error('Error during login:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }

// async function logout(req, res) {
//   try {
//     const accessToken = req.cookies.accessToken;
//     const refreshToken = req.cookies.refreshToken;

//     // Blacklist current access token
//     if (accessToken) await BlacklistedToken.create({ token: accessToken });

//     // Clear refreshToken and activeToken from user in DB
//     if (req.user && req.user.id) { // req.user is set by 'protect' middleware
//       const user = await User.findById(req.user.id);
//       if (user) {
//         user.activeToken = null;
//         user.refreshToken = null;
//         await user.save();
//       }
//     } else if (refreshToken) { // Fallback if protect middleware didn't run (e.g., direct logout from frontend after token expired)
//       try {
//         const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
//         const user = await User.findById(decoded.id);
//         if (user) {
//           user.activeToken = null;
//           user.refreshToken = null;
//           await user.save();
//         }
//       } catch (err) {
//         console.warn('Logout: Could not decode refresh token for user DB cleanup:', err.message);
//       }
//     }

//     res
//       .clearCookie('accessToken', cookieOptions)
//       .clearCookie('refreshToken', cookieOptions)
//       .json({ message: 'Logout successful' });

//   } catch (error) {
//     console.error('Error logging out:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }

// async function profile(req, res) {
//   try {
//     const user = await User.findById(req.user.id)
//       .select("-password -refreshToken -activeToken") // Exclude sensitive token fields from profile response
//       .populate('interestedSkills')
//       // Select Google Calendar connection status for frontend display
//       .select('+googleCalendar.connected'); // Explicitly include if it's set to select: false

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     res.status(200).json({
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role || null,
//       interestedSkills: user.interestedSkills,
//       googleCalendarConnected: user.googleCalendar ? user.googleCalendar.connected : false,
//     });

//   } catch (err) {
//     console.error('Error in profile controller:', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }

// async function forgotPassword(req, res) {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ error: 'User not found' });

//     const resetToken = crypto.randomBytes(20).toString('hex');
//     user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
//     user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
//     await user.save();

//     const resetUrl = `${process.env.BASE_URL}/auth/resetpassword/${resetToken}`;
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
//     });

//     if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
//       await transporter.sendMail({
//         from: process.env.EMAIL_USER,
//         to: email,
//         subject: 'Password Reset Request',
//         text: `Reset your password here: ${resetUrl}`
//       });
//     }

//     res.json({ message: 'Password reset email sent' });

//   } catch (error) {
//     console.error('Error during forgot password:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }

// async function resetPassword(req, res) {
//   try {
//     const tokenHash = crypto.createHash('sha256').update(req.body.token).digest('hex');
//     const user = await User.findOne({
//       resetPasswordToken: tokenHash,
//       resetPasswordExpire: { $gt: Date.now() },
//     });

//     if (!user) return res.status(400).json({ error: 'Invalid or expired token' });

//     user.password = req.body.password;
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;
//     await user.save();

//     res.json({ message: 'Password reset successful' });

//   } catch (error) {
//     console.error('Error during reset password:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }

// async function verifyEmail(req, res) {
//   try {
//     const { token } = req.params;
//     const user = await User.findOne({ verificationToken: token });
//     if (!user) return res.status(400).json({ error: "Invalid verification token" });

//     user.isVerified = true;
//     user.verificationToken = null;
//     await user.save();

//     res.json({ message: "Email verified successfully" });

//   } catch (error) {
//     console.error("Error verifying email:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// }

// async function saveRole(req, res) {
//   try {
//     const { role } = req.body;
//     const user = await User.findById(req.user.id);
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     user.role = role;
//     await user.save();
//     res.status(200).json({ message: 'Role updated', role: user.role });

//   } catch (error) {
//     console.error('Error saving role:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }

// const updateInterestedSkills = async (req, res) => {
//   const { skills } = req.body;
//   if (!Array.isArray(skills)) {
//     return res.status(400).json({ message: 'Skills must be an array of strings.' });
//   }
//   const user = await User.findById(req.user.id);
//   if (!user || user.role !== 'student') {
//     return res.status(403).json({ message: 'Only students can update interested skills.' });
//   }
//   user.interestedSkills = skills;
//   await user.save();
//   return res.status(200).json({ message: 'Updated.', interestedSkills: user.interestedSkills });
// };

// async function updateProfile(req, res) {
//   try {
//     const { fullName, phone, bio } = req.body;
//     const user = await User.findById(req.user.id);

//     if (!user) return res.status(404).json({ message: 'User not found' });

//     if (fullName !== undefined) user.name = fullName.trim();
//     if (phone !== undefined) user.phoneNumber = phone.trim();
//     if (bio !== undefined) user.bio = bio.trim();

//     await user.save();

//     res.status(200).json({
//       message: 'Profile updated',
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         phone: user.phoneNumber,
//         bio: user.bio,
//         interestedSkills: user.interestedSkills
//       }
//     });
//   } catch (err) {
//     console.error('Error in updateProfile:', err);
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// }

// const updateTeachingSkills = async (req, res) => {
//   const { teachingSkills } = req.body;

//   if (!Array.isArray(teachingSkills)) {
//     return res.status(400).json({ message: 'Skills must be an array of strings.' });
//   }
//   if (teachingSkills.length === 0) {
//     return res.status(400).json({ message: 'Please select at least one skill you can teach.' });
//   }
//   if (!teachingSkills.every(skill => typeof skill === 'string')) {
//     return res.status(400).json({ message: 'All skills must be strings.' });
//   }

//   if (!req.user || !req.user.id) {
//     return res.status(401).json({ message: 'Not authorized: User ID missing.' });
//   }

//   try {
//     const user = await User.findById(req.user.id);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found.' });
//     }

//     if (user.role !== 'teacher') {
//       return res.status(403).json({ message: 'Only teachers can update teaching skills.' });
//     }

//     user.teachingSkills = teachingSkills;
//     await user.save();

//     return res.status(200).json({ message: 'Teaching skills updated successfully.', teachingSkills: user.teachingSkills });

//   } catch (error) {
//     console.error("Error in updateTeachingSkills controller:", error);
//     if (error.name === 'ValidationError') {
//       const messages = Object.values(error.errors).map(val => val.message);
//       return res.status(400).json({ success: false, message: messages.join(', ') });
//     }
//     return res.status(500).json({ message: 'Server error updating teaching skills.' });
//   }
// };

// const updateAvailability = async (req, res) => {
//   const { date, slots } = req.body;

//   if (!date || !Array.isArray(slots)) {
//     return res.status(400).json({ message: 'Both date and slots are required.' });
//   }

//   const user = await User.findById(req.user.id);
//   if (!user || user.role !== 'teacher') {
//     return res.status(403).json({ message: 'Only teachers can update availability.' });
//   }

//   user.availability = {
//     date: new Date(date),
//     slots: slots.map(slot => slot.trim()),
//   };

//   await user.save();

//   return res.status(200).json({ message: 'Availability updated.', availability: user.availability });
// };

// module.exports = {
//   googleAuth,
//   googleAuthCallback,
//   refreshToken,
//   signup,
//   login,
//   logout,
//   profile,
//   forgotPassword,
//   resetPassword,
//   verifyEmail,
//   saveRole,
//   updateInterestedSkills,
//   updateTeachingSkills,
//   updateAvailability,
//   updateProfile
// };


const { google } = require('googleapis');
const User = require('../models/User');
const BlacklistedToken = require('../models/BlackListedToken'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 

const GOOGLE_CALENDAR_CLIENT = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALENDAR_REDIRECT_URI
);

const calendarScopes = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];

const generateTokens = (id) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  });
  const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
  return { accessToken, refreshToken };
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

  // Hash password before saving
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword, // Save the hashed password
    role: null, 
    googleCalendar: {
      connected: false,
      accessToken: null,
      refreshToken: null,
      accessTokenExpiryDate: null,
      lastConnected: null
    }
  });

  if (user) {
    const { accessToken, refreshToken } = generateTokens(user._id);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 15 * 60 * 1000
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        googleCalendar: user.googleCalendar
      }
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Select password to be able to compare it
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Compare provided password with hashed password in DB
  // Assumes user model has a method like 'matchPassword' that uses bcrypt.compare
  const isMatch = await user.matchPassword(password);

  if (user && isMatch) {
    const { accessToken, refreshToken } = generateTokens(user._id);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 15 * 60 * 1000
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      message: 'Logged in successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        googleCalendar: user.googleCalendar
      }
    });
  } else {
    res.status(400).json({ message: 'Invalid credentials' });
  }
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
      googleCalendar: user.googleCalendar,
      teacherOnboardingComplete: user.teacherOnboardingComplete
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

  // Check if the refresh token is blacklisted
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

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 15 * 60 * 1000
    });
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

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
      // Add the refresh token to the blacklist
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

exports.googleCalendarAuthUrl = (req, res) => {
  console.log("calendarController.googleCalendarAuthUrl: Entered function.");
  console.log("calendarController.googleCalendarAuthUrl: req.user at start:", req.user);
  console.log("calendarController.googleCalendarAuthUrl: req.user.id at start:", req.user ? req.user.id : "N/A");
  console.log("calendarController.googleCalendarAuthUrl: req.user._id at start (if any):", req.user ? req.user._id : "N/A");

  if (!req.user || !req.user.id) {
    console.log("calendarController.googleCalendarAuthUrl: req.user is NOT present or req.user.id is missing. Sending 401.");
    return res.status(401).json({ message: 'Authentication required to connect calendar.' });
  }
  console.log("calendarController.googleCalendarAuthUrl: req.user.id is present. Proceeding to generate auth URL.");

  const authUrl = GOOGLE_CALENDAR_CLIENT.generateAuthUrl({
    access_type: 'offline',
    scope: calendarScopes.join(' '),
    prompt: 'consent',
    state: req.user.id.toString(),
  });

  res.json({ authUrl });
  console.log("calendarController.googleCalendarAuthUrl: Sent auth URL to frontend.");
};

exports.googleCalendarAuthCallback = async (req, res) => {
  const { code, state: userId, error } = req.query;

  if (error) {
    console.error("Google Calendar Auth Callback Error:", error);
    return res.redirect(`${process.env.FRONTEND_URL}/onboarding?calendarAuthStatus=failed&error=${encodeURIComponent(error)}`);
  }

  if (!code || !userId) {
    console.error("Missing code or state (userId) in Google Calendar OAuth callback.");
    return res.redirect(`${process.env.FRONTEND_URL}/onboarding?calendarAuthStatus=failed&error=${encodeURIComponent('Missing authentication parameters.')}`);
  }

  try {
    const { tokens } = await GOOGLE_CALENDAR_CLIENT.getToken(code);

    const user = await User.findById(userId);

    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/onboarding?calendarAuthStatus=failed&error=${encodeURIComponent('User not found during calendar callback.')}`);
    }

    user.googleCalendar.accessToken = tokens.access_token;
    user.googleCalendar.accessTokenExpiryDate = new Date(tokens.expiry_date);
    if (tokens.refresh_token) {
      user.googleCalendar.refreshToken = tokens.refresh_token;
    }
    user.googleCalendar.connected = true;
    user.googleCalendar.lastConnected = new Date();

    await user.save();

    console.log(`Google Calendar connected for user: ${user.email}. Redirecting to availability step.`);

    res.redirect(`${process.env.FRONTEND_URL}/onboarding?calendarAuthStatus=success&nextStep=availability`);

  } catch (err) {
    console.error("Error exchanging Google code for tokens or saving to DB:", err);
    if (err.code === 400 && err.message.includes('invalid_grant')) {
      const user = await User.findById(userId);
      if (user) {
        user.googleCalendar.connected = false;
        user.googleCalendar.refreshToken = null;
        user.googleCalendar.accessToken = null;
        user.googleCalendar.accessTokenExpiryDate = null;
        await user.save();
      }
      return res.redirect(`${process.env.FRONTEND_URL}/onboarding?calendarAuthStatus=failed&error=${encodeURIComponent('Google Calendar connection expired. Please reconnect.')}`);
    }
    const errorMessage = err.message || "Failed to connect Google Calendar.";
    res.redirect(`${process.env.FRONTEND_URL}/onboarding?calendarAuthStatus=failed&error=${encodeURIComponent(errorMessage)}`);
  }
};

exports.getGoogleCalendarBusyTimes = async (req, res) => {
  const { date } = req.query;
  const userId = req.user.id;

  if (!date) {
    return res.status(400).json({ message: "Date parameter is required (YYYY-MM-DD)." });
  }

  try {
    const user = await User.findById(userId).select('+googleCalendar.refreshToken +googleCalendar.accessToken +googleCalendar.accessTokenExpiryDate');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    if (user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can fetch calendar availability.' });
    }
    if (!user.googleCalendar || !user.googleCalendar.connected || !user.googleCalendar.refreshToken) {
      return res.status(400).json({ message: 'Google Calendar not connected for this user. Please connect your calendar.' });
    }

    const userOAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CALENDAR_REDIRECT_URI
    );

    userOAuth2Client.setCredentials({
      access_token: user.googleCalendar.accessToken,
      refresh_token: user.googleCalendar.refreshToken,
      expiry_date: user.googleCalendar.accessTokenExpiryDate?.getTime(),
    });

    const FIVE_MINUTES = 5 * 60 * 1000;
    const isAccessTokenExpired = !user.googleCalendar.accessToken ||
      !user.googleCalendar.accessTokenExpiryDate ||
      (new Date().getTime() + FIVE_MINUTES) >= user.googleCalendar.accessTokenExpiryDate.getTime();

    if (isAccessTokenExpired && user.googleCalendar.refreshToken) {
      console.log(`Access token expired for user ${userId}. Attempting to refresh.`);
      const { credentials } = await userOAuth2Client.refreshAccessToken();

      user.googleCalendar.accessToken = credentials.access_token;
      user.googleCalendar.accessTokenExpiryDate = new Date(credentials.expiry_date);
      if (credentials.refresh_token) {
        user.googleCalendar.refreshToken = credentials.refresh_token;
      }
      await user.save();
      userOAuth2Client.setCredentials(credentials);
    } else if (isAccessTokenExpired && !user.googleCalendar.refreshToken) {
      console.error(`Access token expired and no refresh token for user ${userId}. Requires re-authentication.`);
      user.googleCalendar.connected = false;
      user.googleCalendar.refreshToken = null;
      user.googleCalendar.accessToken = null;
      user.googleCalendar.accessTokenExpiryDate = null;
      await user.save();
      return res.status(401).json({ message: "Google Calendar token expired. Please reconnect your calendar.", needsReauth: true });
    }

    const calendar = google.calendar({ version: 'v3', auth: userOAuth2Client });

    const selectedDate = new Date(date);
    if (isNaN(selectedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format. Please useYYYY-MM-DD." });
    }

    const startOfDay = new Date(selectedDate.setUTCHours(0, 0, 0, 0)).toISOString();
    const endOfDay = new Date(selectedDate.setUTCHours(23, 59, 59, 999)).toISOString();

    const busyResponse = await calendar.freebusy.query({
      requestBody: {
        timeMin: startOfDay,
        timeMax: endOfDay,
        items: [{ id: 'primary' }],
      },
    });

    const busyTimes = busyResponse.data.calendars.primary.busy || [];

    res.status(200).json({
      message: 'Google Calendar busy times fetched successfully.',
      busyTimes: busyTimes,
    });

  } catch (error) {
    console.error('Error fetching Google Calendar busy times:', error.message);

    if (error.code === 401 || (error.response && error.response.data && error.response.data.error === 'invalid_grant')) {
      const user = await User.findById(req.user.id);
      if (user) {
        user.googleCalendar.connected = false;
        user.googleCalendar.refreshToken = null;
        user.googleCalendar.accessToken = null;
        user.googleCalendar.accessTokenExpiryDate = null;
        await user.save();
      }
      return res.status(401).json({ message: 'Google Calendar connection expired. Please reconnect.', needsReauth: true });
    }
    const errorMessage = error.message || "Failed to fetch Google Calendar busy times.";
    res.status(500).json({ message: 'Failed to fetch Google Calendar busy times.', error: errorMessage });
  }
};

exports.saveRole = async (req, res) => {
  console.log("authController.saveRole: Entered function.");
  console.log("authController.saveRole: req.user:", req.user);
  console.log("authController.saveRole: req.body:", req.body);

  if (!req.user || !req.user.id) {
    console.error("authController.saveRole: User not authenticated (req.user.id missing).");
    return res.status(401).json({ message: 'Authentication required.' });
  }

  const { role } = req.body;

  if (!role) {
    console.error("authController.saveRole: Role is missing from request body.");
    return res.status(400).json({ message: 'Role is required.' });
  }

  const allowedRoles = ['student', 'teacher'];
  if (!allowedRoles.includes(role)) {
    console.error(`authController.saveRole: Invalid role provided: ${role}`);
    return res.status(400).json({ message: 'Invalid role provided.' });
  }

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      console.error(`authController.saveRole: User not found for ID: ${req.user.id}`);
      return res.status(404).json({ message: 'User not found.' });
    }

    user.role = role;
    await user.save();
    console.log(`authController.saveRole: Role updated successfully for user ${user.id} to ${user.role}.`);
    res.status(200).json({ message: 'Role updated successfully', user: { id: user._id, role: user.role } });

  } catch (error) {
    console.error('authController.saveRole: Error saving role to database:', error);
    res.status(500).json({ message: 'Internal Server Error while saving role.' });
  }
};

exports.updateUserProfile = async (req, res) => {
  console.log("authController.updateUserProfile: Entered function.");
  console.log("authController.updateUserProfile: req.user:", req.user);
  console.log("authController.updateUserProfile: req.body:", req.body);

  if (!req.user || !req.user.id) {
    console.error("authController.updateUserProfile: User not authenticated.");
    return res.status(401).json({ message: 'Authentication required.' });
  }

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      console.error(`authController.updateUserProfile: User not found for ID: ${req.user.id}`);
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.body.name !== undefined) user.name = req.body.name;
    if (req.body.phoneNumber !== undefined) user.phoneNumber = req.body.phoneNumber;
    if (req.body.bio !== undefined) user.bio = req.body.bio;
    if (req.body.teacherOnboardingComplete !== undefined) user.teacherOnboardingComplete = req.body.teacherOnboardingComplete;

    await user.save();
    console.log(`authController.updateUserProfile: Profile updated successfully for user ${user.id}.`);

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
        googleCalendar: user.googleCalendar,
        teacherOnboardingComplete: user.teacherOnboardingComplete
      }
    });

  } catch (error) {
    console.error('authController.updateUserProfile: Error updating profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateTeachingSkills = async (req, res) => {
  console.log("authController.updateTeachingSkills: Entered function.");
  console.log("authController.updateTeachingSkills: req.user:", req.user);
  console.log("authController.updateTeachingSkills: req.body:", req.body);

  if (!req.user || !req.user.id) {
    console.error("authController.updateTeachingSkills: User not authenticated.");
    return res.status(401).json({ message: 'Authentication required.' });
  }

  const { teachingSkills } = req.body;

  if (!Array.isArray(teachingSkills)) {
    console.error("authController.updateTeachingSkills: teachingSkills must be an array.");
    return res.status(400).json({ message: 'Teaching skills must be an array.' });
  }

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      console.error(`authController.updateTeachingSkills: User not found for ID: ${req.user.id}`);
      return res.status(404).json({ message: 'User not found' });
    }

    user.teachingSkills = teachingSkills;
    await user.save();
    console.log(`authController.updateTeachingSkills: Teaching skills updated successfully for user ${user.id}.`);

    res.status(200).json({
      message: 'Teaching skills updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        teachingSkills: user.teachingSkills,
        googleCalendar: user.googleCalendar
      }
    });

  } catch (error) {
    console.error('authController.updateTeachingSkills: Error updating teaching skills:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateAvailability = async (req, res) => {
  console.log("authController.updateAvailability: Entered function.");
  console.log("authController.updateAvailability: req.user:", req.user);
  console.log("authController.updateAvailability: req.body:", req.body);

  if (!req.user || !req.user.id) {
    console.error("authController.updateAvailability: User not authenticated.");
    return res.status(401).json({ message: 'Authentication required.' });
  }

  const { date, slots } = req.body;

  if (!date || !Array.isArray(slots)) {
    console.error("authController.updateAvailability: Date and slots array are required.");
    return res.status(400).json({ message: 'Date and slots array are required.' });
  }

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      console.error(`authController.updateAvailability: User not found for ID: ${req.user.id}`);
      return res.status(404).json({ message: 'User not found' });
    }

    let existingAvailability = user.availability.find(a => new Date(a.date).toDateString() === new Date(date).toDateString());

    if (existingAvailability) {
        existingAvailability.slots = slots;
    } else {
        user.availability.push({ date: new Date(date), slots: slots });
    }

    await user.save();
    console.log(`authController.updateAvailability: Availability updated successfully for user ${user.id} for date ${date}.`);

    res.status(200).json({
      message: 'Availability updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        availability: user.availability,
        googleCalendar: user.googleCalendar
      }
    });

  } catch (error) {
    console.error('authController.updateAvailability: Error updating availability:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
