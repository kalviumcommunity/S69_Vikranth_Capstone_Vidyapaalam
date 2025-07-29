
// const User = require("../models/User");
// const Session = require("../models/Session");
// const Razorpay = require("razorpay");
// const crypto = require("crypto");

// const razorpay = new Razorpay({
//   key_id: "rzp_test_59BvySck8scTA8",
//   key_secret: "KZEGvAwmK7Mpp2xJ0L0xJefc",
// });

// exports.createPaymentOrder = async (req, res) => {
//   try {
//     const { amount, currency = "INR", teacherData } = req.body;
//     console.log("Received payload:", { amount, currency, teacherData });
//     if (!amount || !teacherData || !teacherData.dateTime || !teacherData.startTime || !teacherData.endTime) {
//       return res.status(400).json({ error: "Amount, dateTime, startTime, and endTime are required" });
//     }

//     const userIdShort = req.user.id.toString().slice(-10);
//     const timestampShort = Date.now().toString().slice(-7);
//     const receiptId = `rcpt_${userIdShort}_${timestampShort}`;

//     console.log("Generated Receipt ID:", receiptId);

//     const options = {
//       amount: amount * 100,
//       currency,
//       receipt: receiptId,
//       notes: {
//         userId: req.user.id.toString(),
//         teacherData: JSON.stringify(teacherData),
//       },
//     };

//     const order = await razorpay.orders.create(options);
//     res.json({ orderId: order.id, amount, currency, teacherData });
//   } catch (error) {
//     console.error("Error creating payment order:", {
//       message: error.message,
//       code: error.code,
//       status: error.statusCode,
//       details: error.response?.data || "No response data",
//     });
//     const statusCode = error.statusCode || 500;
//     res.status(statusCode).json({
//       error: error.message || "Failed to create payment order",
//       details: error.response?.data || "No specific details from payment gateway",
//     });
//   }
// };


// exports.handleRazorpayWebhook = async (req, res) => {
//   const secret = "957602e3b363da9db40cced06b8d569e3ec6d18218d07327e9eafe816982cf3d";

//   // --- DEBUGGING LOGS (Keep these in for now) ---
//   console.log("--- WEBHOOK RECEIVED ---");
//   console.log("Headers:", req.headers);
//   console.log("req.body (Buffer from express.raw):", req.body); // Now req.body is the Buffer
//   // console.log("req.rawBody (should be undefined):", req.rawBody ? req.rawBody.toString() : "undefined/null"); // This will now always be undefined, so we can remove this line after confirmation
//   console.log("--- END DEBUGGING LOGS ---");

//   // The raw body is now on req.body because of express.raw()
//   const dataToHash = req.body; // req.body is already the Buffer now

//   if (!dataToHash || !(dataToHash instanceof Buffer)) {
//     console.error("Webhook Error: Raw body not found or not a Buffer for signature verification.");
//     return res.status(400).json({ status: "failure", error: "No raw body data" });
//   }

//   const shasum = crypto.createHmac("sha256", secret);
//   shasum.update(dataToHash); // Use the Buffer directly for hashing

//   const digest = shasum.digest("hex");

//   // Manually parse the buffer to get the JSON payload for processing
//   let payment;
//   try {
//     payment = JSON.parse(dataToHash.toString('utf8'));
//   } catch (parseError) {
//     console.error("Webhook Error: Failed to parse raw body as JSON:", parseError);
//     return res.status(400).json({ status: "failure", error: "Malformed JSON body" });
//   }

//   if (digest === req.headers["x-razorpay-signature"]) {
//     try {
//       // payment variable now holds the parsed JSON
//       if (payment.event === 'payment.captured') {
//         const userId = payment.payload.payment.entity.notes.userId;
//         const user = await User.findById(userId);

//         if (!user) {
//           console.error(`Webhook Error: User not found for userId: ${userId}`);
//           return res.status(404).json({ status: "failure", error: "User not found" });
//         }

//         if (user.lastPaymentId === payment.payload.payment.entity.id) {
//           console.log(`Webhook: Payment ${payment.payload.payment.entity.id} already processed for user ${user.name}`);
//           return res.json({ status: "success", message: "Payment already processed" });
//         }

//         user.paymentAcknowledged = true;
//         user.lastPaymentId = payment.payload.payment.entity.id;
//         await user.save();

//         const teacherDataString = payment.payload.payment.entity.notes.teacherData;
//         let teacherData;
//         try {
//           teacherData = JSON.parse(teacherDataString);
//         } catch (parseError) {
//           console.error("Webhook Error: Failed to parse teacherData from notes:", parseError.message);
//           return res.status(400).json({ status: "failure", error: "Malformed teacherData in notes" });
//         }

//         const newSession = new Session({
//           teacherName: teacherData.name,
//           teacherInitials: teacherData.name
//             .split(" ")
//             .map((n) => n[0])
//             .join("")
//             .toUpperCase()
//             .slice(0, 2),
//           skill: teacherData.skill || "Unknown",
//           dateTime: new Date(teacherData.dateTime),
//           studentId: user._id,
//           paymentId: payment.payload.payment.entity.id,
//           startTime: teacherData.startTime,
//           endTime: teacherData.endTime,
//         });
//         await newSession.save();

//         console.log(`Payment ${payment.payload.payment.entity.id} for user ${user.name} processed, session created.`);
//         res.json({ status: "success" });
//       } else {
//         console.log(`Webhook received for event: ${payment.event}. Not processing.`);
//         res.json({ status: "success", message: "Event type not processed" });
//       }
//     } catch (error) {
//       console.error("Webhook processing error:", error);
//       res.status(500).json({ status: "failure", error: "Internal server error during webhook processing" });
//     }
//   } else {
//     console.error("Signature verification failed: Incoming digest does not match calculated digest.");
//     res.status(400).json({ status: "failure", error: "Invalid signature" });
//   }
// };





// backend/controllers/paymentController.js





// backend/controllers/paymentController.js

const User = require("../models/User");
const Session = require("../models/Session");
const TeacherProfile = require("../models/Teacher"); // <--- NEW: Import TeacherProfile model
const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: "rzp_test_59BvySck8scTA8", // Replace with your actual key_id if different
  key_secret: "KZEGvAwmK7Mpp2xJ0L0xJefc", // Replace with your actual key_secret if different
});

exports.createPaymentOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", teacherData } = req.body;
    console.log("Received payload for payment order:", { amount, currency, teacherData });

    if (!amount || !teacherData || !teacherData.dateTime || !teacherData.startTime || !teacherData.endTime || !teacherData.teacherId) {
      return res.status(400).json({ error: "Amount, teacherData (with dateTime, startTime, endTime, teacherId) are required" });
    }

    const userIdShort = req.user.id.toString().slice(-10);
    const timestampShort = Date.now().toString().slice(-7);
    const receiptId = `rcpt_${userIdShort}_${timestampShort}`;

    console.log("Generated Receipt ID:", receiptId);

    const options = {
      amount: amount * 100, // Amount in paisa
      currency,
      receipt: receiptId,
      notes: {
        userId: req.user.id.toString(), // Student's User ID
        teacherData: JSON.stringify(teacherData), // Store teacher's details including ID, date, time
      },
    };

    const order = await razorpay.orders.create(options);
    res.json({ orderId: order.id, amount, currency, teacherData });
  } catch (error) {
    console.error("Error creating payment order:", {
      message: error.message,
      code: error.code,
      status: error.statusCode,
      details: error.response?.data || "No response data",
    });
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message || "Failed to create payment order",
      details: error.response?.data || "No specific details from payment gateway",
    });
  }
};

exports.handleRazorpayWebhook = async (req, res) => {
  const secret = "957602e3b363da9db40cced06b8d569e3ec6d18218d07327e9eafe816982cf3d"; // YOUR RAZORPAY WEBHOOK SECRET

  console.log("--- RAZORPAY WEBHOOK RECEIVED ---");
  console.log("Headers:", req.headers);
  console.log("req.body (Buffer):", req.body);
  console.log("--- END WEBHOOK DEBUGGING ---");

  const dataToHash = req.body; 

  if (!dataToHash || !(dataToHash instanceof Buffer)) {
    console.error("Webhook Error: Raw body not found or not a Buffer for signature verification.");
    return res.status(400).json({ status: "failure", error: "No raw body data for signature verification" });
  }

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(dataToHash); 
  const digest = shasum.digest("hex");

  let payment;
  try {
    payment = JSON.parse(dataToHash.toString('utf8'));
  } catch (parseError) {
    console.error("Webhook Error: Failed to parse raw body as JSON:", parseError);
    return res.status(400).json({ status: "failure", error: "Malformed JSON body in webhook" });
  }

  if (digest === req.headers["x-razorpay-signature"]) {
    try {
      if (payment.event === 'payment.captured') {
        const paymentEntity = payment.payload.payment.entity;
        const studentUserId = paymentEntity.notes.userId;

        const studentUser = await User.findById(studentUserId);

        if (!studentUser) {
          console.error(`Webhook Error: Student User not found for ID: ${studentUserId}. Session not created/availability not updated.`);
          return res.status(404).json({ status: "failure", error: "Student User not found" });
        }

        if (studentUser.lastPaymentId === paymentEntity.id) {
          console.log(`Webhook: Payment ${paymentEntity.id} already processed for student ${studentUser.name}.`);
          return res.json({ status: "success", message: "Payment already processed" });
        }

        studentUser.paymentAcknowledged = true;
        studentUser.lastPaymentId = paymentEntity.id;
        await studentUser.save();
        console.log(`Student ${studentUser.name}'s payment status updated.`);

        const teacherDataString = paymentEntity.notes.teacherData;
        let teacherData;
        try {
          teacherData = JSON.parse(teacherDataString);
        } catch (parseError) {
          console.error("Webhook Error: Failed to parse teacherData from notes:", parseError.message);
          return res.status(400).json({ status: "failure", error: "Malformed teacherData in payment notes" });
        }

        // --- Create New Session Record ---
        const newSession = new Session({
          teacherName: teacherData.name,
          teacherInitials: teacherData.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2),
          skill: teacherData.skill || "Unknown",
          dateTime: new Date(teacherData.dateTime),
          studentId: studentUser._id,
          paymentId: paymentEntity.id,
          startTime: teacherData.startTime,
          endTime: teacherData.endTime,
        });
        await newSession.save();
        console.log(`Session created: Teacher: ${teacherData.name}, Student: ${studentUser.name}, Time: ${teacherData.startTime}-${teacherData.endTime} on ${teacherData.dateTime}`);

        // --- IMPORTANT: Remove booked slot from teacher's availability ---
        try {
            const teacherIdFromNotes = teacherData.teacherId; 
            let teacherUser = await User.findById(teacherIdFromNotes); // Try finding by ID directly

            // Fallback: If User not found, try finding via TeacherProfile
            if (!teacherUser) {
                console.warn(`Webhook: Teacher User not found directly with ID ${teacherIdFromNotes}. Attempting to find via TeacherProfile.`);
                const teacherProfile = await TeacherProfile.findById(teacherIdFromNotes); 
                if (teacherProfile && teacherProfile.userId) {
                    teacherUser = await User.findById(teacherProfile.userId); // Found via TeacherProfile's userId
                    if (teacherUser) {
                        console.log(`Webhook: Teacher User found indirectly via TeacherProfile (Original ID: ${teacherIdFromNotes}, Actual User ID: ${teacherUser._id}).`);
                    } else {
                        console.error(`Webhook Error: Teacher User still not found even after trying TeacherProfile (Profile ID: ${teacherIdFromNotes}, User ID ref: ${teacherProfile.userId}).`);
                    }
                } else {
                    console.error(`Webhook Error: TeacherProfile not found for ID ${teacherIdFromNotes}, or it has no userId reference.`);
                }
            }

            if (!teacherUser) {
                console.error(`Webhook Error: Critical - Teacher User not found at all for availability update (ID: ${teacherIdFromNotes}). Session was booked, but availability could not be updated!`);
                // Continue to send success to Razorpay, but this indicates a severe data inconsistency.
                return res.json({ status: "success", message: "Session created, but teacher availability could not be updated." });
            }

            // Now, proceed with updating the availability on the found teacherUser
            const bookedDateString = teacherData.dateTime; 
            const bookedStartTime = teacherData.startTime;
            const bookedEndTime = teacherData.endTime;

            const availabilityEntry = teacherUser.availability.find(item => {
                const itemDateString = item.date.toISOString().split('T')[0]; 
                return itemDateString === bookedDateString;
            });

            if (availabilityEntry) {
                const initialSlotCount = availabilityEntry.slots.length;
                availabilityEntry.slots = availabilityEntry.slots.filter(slot =>
                    !(slot.startTime === bookedStartTime && slot.endTime === bookedEndTime)
                );

                if (availabilityEntry.slots.length === initialSlotCount) {
                    console.warn(`Webhook Warning: Slot ${bookedStartTime}-${bookedEndTime} not found for removal from teacher ${teacherUser._id}'s availability on ${bookedDateString}. Possibly already booked or data mismatch.`);
                } else {
                    console.log(`Webhook: Slot ${bookedStartTime}-${bookedEndTime} removed from teacher ${teacherUser._id}'s availability on ${bookedDateString}.`);
                }
                
                await teacherUser.save(); 
            } else {
                console.warn(`Webhook Warning: No availability entry found for teacher ${teacherUser._id} on date ${bookedDateString}. Slot not removed.`);
            }

        } catch (availabilityUpdateError) {
            console.error("Webhook Error: Failed to update teacher availability:", availabilityUpdateError);
        }

        res.json({ status: "success" }); 
      } else {
        console.log(`Webhook received for event: ${payment.event}. Not processing this event type.`);
        res.json({ status: "success", message: "Event type not processed" });
      }
    } catch (error) {
      console.error("Webhook processing error:", error);
      res.status(500).json({ status: "failure", error: "Internal server error during webhook processing" });
    }
  } else {
    console.error("Signature verification failed: Incoming digest does not match calculated digest.");
    res.status(400).json({ status: "failure", error: "Invalid signature" });
  }
};


