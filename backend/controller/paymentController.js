
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

const User = require("../models/User"); // Need User model to update teacher availability and student payment status
const Session = require("../models/Session"); // Need Session model to create new session records
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

    // Basic validation for required data
    if (!amount || !teacherData || !teacherData.dateTime || !teacherData.startTime || !teacherData.endTime || !teacherData.teacherId) {
      return res.status(400).json({ error: "Amount, teacherData (with dateTime, startTime, endTime, teacherId) are required" });
    }

    // Generate a unique receipt ID
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
  // IMPORTANT: Replace with your actual Razorpay webhook secret from your Razorpay dashboard
  const secret = "957602e3b363da9db40cced06b8d569e3ec6d18218d07327e9eafe816982cf3d";

  // Debugging logs for webhook payload
  console.log("--- RAZORPAY WEBHOOK RECEIVED ---");
  console.log("Headers:", req.headers);
  // req.body is already a Buffer due to `express.raw()` middleware
  console.log("req.body (Buffer):", req.body);
  console.log("--- END WEBHOOK DEBUGGING ---");

  const dataToHash = req.body; 

  if (!dataToHash || !(dataToHash instanceof Buffer)) {
    console.error("Webhook Error: Raw body not found or not a Buffer for signature verification.");
    return res.status(400).json({ status: "failure", error: "No raw body data for signature verification" });
  }

  // Calculate the HMAC SHA256 signature
  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(dataToHash); 
  const digest = shasum.digest("hex");

  // Parse the raw buffer body into JSON for processing
  let payment;
  try {
    payment = JSON.parse(dataToHash.toString('utf8'));
  } catch (parseError) {
    console.error("Webhook Error: Failed to parse raw body as JSON:", parseError);
    return res.status(400).json({ status: "failure", error: "Malformed JSON body in webhook" });
  }

  // Verify the signature
  if (digest === req.headers["x-razorpay-signature"]) {
    try {
      // Process only 'payment.captured' events
      if (payment.event === 'payment.captured') {
        const paymentEntity = payment.payload.payment.entity;
        const studentUserId = paymentEntity.notes.userId;

        const studentUser = await User.findById(studentUserId);

        if (!studentUser) {
          console.error(`Webhook Error: Student User not found for ID: ${studentUserId}. Session not created/availability not updated.`);
          return res.status(404).json({ status: "failure", error: "Student User not found" });
        }

        // Implement idempotency: prevent reprocessing the same payment
        if (studentUser.lastPaymentId === paymentEntity.id) {
          console.log(`Webhook: Payment ${paymentEntity.id} already processed for student ${studentUser.name}.`);
          return res.json({ status: "success", message: "Payment already processed" });
        }

        // Update student's payment status
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
            const teacherUserId = teacherData.teacherId; 
            const bookedDateString = teacherData.dateTime; // "YYYY-MM-DD" format
            const bookedStartTime = teacherData.startTime;
            const bookedEndTime = teacherData.endTime;

            const teacherUser = await User.findById(teacherUserId);

            if (!teacherUser) {
                console.error(`Webhook Error: Teacher User not found for availability update (ID: ${teacherUserId}). This is critical as a session was booked!`);
                // Log this, but still send a success to Razorpay to avoid retries.
                return res.json({ status: "success", message: "Session created, but teacher not found for availability update." });
            }

            // Find the specific date entry in the teacher's availability array
            const availabilityEntry = teacherUser.availability.find(item => {
                // Convert DB Date object to "YYYY-MM-DD" string for accurate comparison
                const itemDateString = item.date.toISOString().split('T')[0]; 
                return itemDateString === bookedDateString;
            });

            if (availabilityEntry) {
                const initialSlotCount = availabilityEntry.slots.length;
                // Filter out (remove) the specific booked slot from the slots array
                availabilityEntry.slots = availabilityEntry.slots.filter(slot =>
                    !(slot.startTime === bookedStartTime && slot.endTime === bookedEndTime)
                );

                if (availabilityEntry.slots.length === initialSlotCount) {
                    console.warn(`Webhook Warning: Slot ${bookedStartTime}-${bookedEndTime} not found for removal from teacher ${teacherUserId}'s availability on ${bookedDateString}. Possibly already booked or data mismatch.`);
                } else {
                    console.log(`Webhook: Slot ${bookedStartTime}-${bookedEndTime} removed from teacher ${teacherUserId}'s availability on ${bookedDateString}.`);
                }
                
                await teacherUser.save(); // Save the updated teacher User document
            } else {
                console.warn(`Webhook Warning: No availability entry found for teacher ${teacherUserId} on date ${bookedDateString}. Slot not removed.`);
            }

        } catch (availabilityUpdateError) {
            console.error("Webhook Error: Failed to update teacher availability:", availabilityUpdateError);
            // This is an internal server error; log it, but the Razorpay webhook still gets a success.
            // Implement a robust error logging system or alert for such failures.
        }

        res.json({ status: "success" }); // Final success response to Razorpay
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
