





// // backend/controllers/paymentController.js

// const User = require("../models/User");
// const Session = require("../models/Session");
// const TeacherProfile = require("../models/Teacher"); // Assuming Teacher model is named 'Teacher'
// const Razorpay = require("razorpay");
// const crypto = require("crypto");

// const razorpay = new Razorpay({
//   key_id: "rzp_test_59BvySck8scTA8", // Replace with your actual key_id
//   key_secret: "KZEGvAwmK7Mpp2xJ0L0xJefc", // Replace with your actual key_secret
// });

// exports.createPaymentOrder = async (req, res) => {
//   try {
//     const { amount, currency = "INR", teacherData } = req.body;
//     console.log("Received payload for payment order:", { amount, currency, teacherData });

//     if (!amount || !teacherData || !teacherData.dateTime || !teacherData.startTime || !teacherData.endTime || !teacherData.teacherId) {
//       return res.status(400).json({ error: "Amount, teacherData (with dateTime, startTime, endTime, teacherId) are required" });
//     }

//     const userIdShort = req.user.id.toString().slice(-10);
//     const timestampShort = Date.now().toString().slice(-7);
//     const receiptId = `rcpt_${userIdShort}_${timestampShort}`;

//     console.log("Generated Receipt ID:", receiptId);

//     const options = {
//       amount: amount * 100, // Amount in paisa
//       currency,
//       receipt: receiptId,
//       notes: {
//         userId: req.user.id.toString(), // Student's User ID
//         teacherData: JSON.stringify(teacherData), // Store teacher's details
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
//   const secret = "957602e3b363da9db40cced06b8d569e3ec6d18218d07327e9eafe816982cf3d"; // YOUR RAZORPAY WEBHOOK SECRET

//   console.log("--- RAZORPAY WEBHOOK RECEIVED ---");

//   console.log("Headers:", req.headers);
//   console.log("req.body (Buffer):", req.body); // Should be a Buffer if using express.raw()
//   console.log("--- END WEBHOOK DEBUGGING ---");

//   const dataToHash = req.body; // Assuming express.raw() or similar has populated req.body as a Buffer

//   if (!dataToHash || !(dataToHash instanceof Buffer)) {
//     console.error("Webhook Error: Raw body not found or not a Buffer for signature verification.");
//     return res.status(400).json({ status: "failure", error: "No raw body data for signature verification" });
//   }

//   const shasum = crypto.createHmac("sha256", secret);
//   shasum.update(dataToHash); 
//   const digest = shasum.digest("hex");

//   let payment;
//   try {
//     payment = JSON.parse(dataToHash.toString('utf8')); // Parse the buffer to JSON
//   } catch (parseError) {
//     console.error("Webhook Error: Failed to parse raw body as JSON:", parseError);
//     return res.status(400).json({ status: "failure", error: "Malformed JSON body in webhook" });
//   }

//   if (digest === req.headers["x-razorpay-signature"]) {
//     try {
//       if (payment.event === 'payment.captured') {
//         const paymentEntity = payment.payload.payment.entity;
//         const studentUserId = paymentEntity.notes.userId;

//         const studentUser = await User.findById(studentUserId);

//         if (!studentUser) {
//           console.error(`Webhook Error: Student User not found for ID: ${studentUserId}. Session not created/availability not updated.`);
//           return res.status(404).json({ status: "failure", error: "Student User not found" });
//         }

//         if (studentUser.lastPaymentId === paymentEntity.id) {
//           console.log(`Webhook: Payment ${paymentEntity.id} already processed for student ${studentUser.name}.`);
//           return res.json({ status: "success", message: "Payment already processed" });
//         }

//         studentUser.paymentAcknowledged = true;
//         studentUser.lastPaymentId = paymentEntity.id;
//         await studentUser.save();
//         console.log(`Student ${studentUser.name}'s payment status updated.`);

//         const teacherDataString = paymentEntity.notes.teacherData;
//         let teacherData;
//         try {
//           teacherData = JSON.parse(teacherDataString);
//         } catch (parseError) {
//           console.error("Webhook Error: Failed to parse teacherData from notes:", parseError.message);
//           return res.status(400).json({ status: "failure", error: "Malformed teacherData in payment notes" });
//         }

//         // --- Create New Session Record ---
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
//           studentId: studentUser._id,
//           paymentId: paymentEntity.id,
//           startTime: teacherData.startTime,
//           endTime: teacherData.endTime,
//         });
//         await newSession.save();
//         console.log(`Session created: Teacher: ${teacherData.name}, Student: ${studentUser.name}, Time: ${teacherData.startTime}-${teacherData.endTime} on ${teacherData.dateTime}`);

//         // --- IMPORTANT: Mark booked slot as unavailable in teacher's availability ---
//         try {
//             const teacherIdFromNotes = teacherData.teacherId; 
//             let teacherUser = await User.findById(teacherIdFromNotes); 

//             // Fallback: If User not found directly by ID (e.g., if TeacherProfile._id was sent)
//             if (!teacherUser) {
//                 console.warn(`Webhook: Teacher User not found directly with ID ${teacherIdFromNotes}. Attempting to find via TeacherProfile.`);
//                 const teacherProfile = await TeacherProfile.findById(teacherIdFromNotes); 
//                 if (teacherProfile && teacherProfile.userId) {
//                     teacherUser = await User.findById(teacherProfile.userId); 
//                     if (teacherUser) {
//                         console.log(`Webhook: Teacher User found indirectly via TeacherProfile (Original ID: ${teacherIdFromNotes}, Actual User ID: ${teacherUser._id}).`);
//                     } else {
//                         console.error(`Webhook Error: Teacher User still not found even after trying TeacherProfile (Profile ID: ${teacherIdFromNotes}, User ID ref: ${teacherProfile.userId}).`);
//                     }
//                 } else {
//                     console.error(`Webhook Error: TeacherProfile not found for ID ${teacherIdFromNotes}, or it has no userId reference.`);
//                 }
//             }

//             if (!teacherUser) {
//                 console.error(`Webhook Error: Critical - Teacher User not found at all for availability update (ID: ${teacherIdFromNotes}). Session was booked, but availability could not be updated!`);
//                 return res.json({ status: "success", message: "Session created, but teacher availability could not be updated." });
//             }

//             const bookedDateString = teacherData.dateTime; 
//             const bookedStartTime = teacherData.startTime;
//             const bookedEndTime = teacherData.endTime;

//             const availabilityEntry = teacherUser.availability.find(item => {
//                 const itemDateString = item.date.toISOString().split('T')[0]; 
//                 return itemDateString === bookedDateString;
//             });

//             if (availabilityEntry) {
//                 // Find the specific slot and mark it as unavailable
//                 const slotToUpdate = availabilityEntry.slots.find(slot =>
//                     slot.startTime === bookedStartTime && 
//                     slot.endTime === bookedEndTime &&
//                     slot.available === true // Ensure it's currently available
//                 );

//                 if (slotToUpdate) {
//                     slotToUpdate.available = false; // Mark it as booked/unavailable
//                     console.log(`Webhook: Slot ${bookedStartTime}-${bookedEndTime} on ${bookedDateString} for teacher ${teacherUser._id} marked as BOOKED.`);
//                 } else {
//                     console.warn(`Webhook Warning: Slot ${bookedStartTime}-${bookedEndTime} not found or already booked for teacher ${teacherUser._id}'s availability on ${bookedDateString}.`);
//                 }
                
//                 await teacherUser.save(); // Save the updated teacher User document
//             } else {
//                 console.warn(`Webhook Warning: No availability entry found for teacher ${teacherUser._id} on date ${bookedDateString}. Slot not marked as booked.`);
//             }

//         } catch (availabilityUpdateError) {
//             console.error("Webhook Error: Failed to update teacher availability:", availabilityUpdateError);
//         }

//         res.json({ status: "success" }); 
//       } else {
//         console.log(`Webhook received for event: ${payment.event}. Not processing this event type.`);
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




// const User = require("../models/User");
// const Session = require("../models/Session");
// const TeacherProfile = require("../models/Teacher");
// const Razorpay = require("razorpay");
// const crypto = require("crypto");

// const razorpay = new Razorpay({
//   key_id: "rzp_test_59BvySck8scTA8",
//   key_secret:  "KZEGvAwmK7Mpp2xJ0L0xJefc",
// });

// exports.createPaymentOrder = async (req, res) => {
//   try {
//     const { amount, currency = "INR", teacherData } = req.body;
//     console.log("Received payload for payment order:", { amount, currency, teacherData });

//     if (!amount || !teacherData || !teacherData.dateTime || !teacherData.startTime || !teacherData.endTime || !teacherData.teacherId || !teacherData.name ) {
//       return res.status(400).json({ error: "Amount, and complete teacherData (name, skill, dateTime, startTime, endTime, teacherId) are required" });
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
//   const secret =  "957602e3b363da9db40cced06b8d569e3ec6d18218d07327e9eafe816982cf3d";

//   console.log("--- RAZORPAY WEBHOOK RECEIVED ---");
//   console.log("Headers:", req.headers);
//   console.log("req.body (Buffer Length):", req.body ? req.body.length : '0');
//   console.log("--- END WEBHOOK DEBUGGING ---");

//   const dataToHash = req.body;

//   if (!dataToHash || !(dataToHash instanceof Buffer)) {
//     console.error("Webhook Error: Raw body not found or not a Buffer for signature verification. Ensure `express.raw({type: 'application/json'})` is used as middleware for this route.");
//     return res.status(400).json({ status: "failure", error: "No raw body data for signature verification" });
//   }

//   const shasum = crypto.createHmac("sha256", secret);
//   shasum.update(dataToHash);
//   const digest = shasum.digest("hex");

//   let paymentEventPayload;
//   try {
//     paymentEventPayload = JSON.parse(dataToHash.toString('utf8'));
//   } catch (parseError) {
//     console.error("Webhook Error: Failed to parse raw body as JSON:", parseError);
//     return res.status(400).json({ status: "failure", error: "Malformed JSON body in webhook" });
//   }

//   if (digest === req.headers["x-razorpay-signature"]) {
//     try {
//       if (paymentEventPayload.event === 'payment.captured' || paymentEventPayload.event === 'order.paid') {
//         const paymentEntity = paymentEventPayload.payload.payment.entity;
//         const orderEntity = paymentEventPayload.payload.order.entity;

//         const studentUserId = orderEntity.notes.userId;
//         const teacherDataString = orderEntity.notes.teacherData;

//         const studentUser = await User.findById(studentUserId);

//         if (!studentUser) {
//           console.error(`Webhook Error: Student User not found for ID: ${studentUserId}. Session not created/availability not updated.`);
//           return res.status(404).json({ status: "failure", error: "Student User not found" });
//         }

//         if (studentUser.lastPaymentId === paymentEntity.id) {
//           console.log(`Webhook: Payment ${paymentEntity.id} already processed for student ${studentUser.name}.`);
//           return res.json({ status: "success", message: "Payment already processed" });
//         }

//         studentUser.paymentAcknowledged = true;
//         studentUser.lastPaymentId = paymentEntity.id;
//         await studentUser.save();
//         console.log(`Student ${studentUser.name}'s payment status updated.`);

//         let teacherData;
//         try {
//           teacherData = JSON.parse(teacherDataString);
//           if (!teacherData || !teacherData.teacherId || !teacherData.name || !teacherData.skill || !teacherData.dateTime || !teacherData.startTime || !teacherData.endTime) {
//              console.error("Webhook Error: Parsed teacherData is incomplete or missing required fields.", teacherData);
//              return res.status(400).json({ status: "failure", error: "Incomplete or malformed teacherData in payment notes" });
//           }
//         } catch (parseError) {
//           console.error("Webhook Error: Failed to parse teacherData from notes:", parseError.message);
//           return res.status(400).json({ status: "failure", error: "Malformed teacherData JSON in payment notes" });
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
//           studentId: studentUser._id,
//           paymentId: paymentEntity.id,
//           startTime: teacherData.startTime,
//           endTime: teacherData.endTime,
//           teacherId: teacherData.teacherId,
//         });
//         await newSession.save();
//         console.log(`Session created: Teacher: ${teacherData.name}, Student: ${studentUser.name}, Time: ${teacherData.startTime}-${teacherData.endTime} on ${teacherData.dateTime}, Session ID: ${newSession._id}`);

//         try {
//             const teacherIdForAvailability = teacherData.teacherId;
//             let teacherUser = await User.findById(teacherIdForAvailability);

//             if (!teacherUser) {
//                 console.error(`Webhook Error: Teacher User not found by ID ${teacherIdForAvailability} for availability update. Session was booked, but availability could not be updated!`);
//                 return res.json({ status: "success", message: "Session created, but teacher availability could not be updated (teacher user not found)." });
//             }

//             if (!teacherUser.availability) {
//                 teacherUser.availability = [];
//             }

//             const bookedDateString = new Date(teacherData.dateTime).toISOString().split('T')[0];
//             const bookedStartTime = teacherData.startTime;
//             const bookedEndTime = teacherData.endTime;

//             const availabilityEntry = teacherUser.availability.find(item => {
//                 const itemDateString = item.date instanceof Date ? item.date.toISOString().split('T')[0] : item.date;
//                 return itemDateString === bookedDateString;
//             });

//             if (availabilityEntry) {
//                 const slotToUpdate = availabilityEntry.slots.find(slot =>
//                     slot.startTime === bookedStartTime &&
//                     slot.endTime === bookedEndTime &&
//                     slot.available === true
//                 );

//                 if (slotToUpdate) {
//                     slotToUpdate.available = false;
//                     console.log(`Webhook: Slot ${bookedStartTime}-${bookedEndTime} on ${bookedDateString} for teacher ${teacherUser._id} marked as BOOKED.`);
//                 } else {
//                     console.warn(`Webhook Warning: Slot ${bookedStartTime}-${bookedEndTime} not found or already booked for teacher ${teacherUser._id}'s availability on ${bookedDateString}.`);
//                 }

//                 await teacherUser.save();
//             } else {
//                 console.warn(`Webhook Warning: No availability entry found for teacher ${teacherUser._id} on date ${bookedDateString}. Slot not marked as booked.`);
//             }

//         } catch (availabilityUpdateError) {
//             console.error("Webhook Error: Failed to update teacher availability:", availabilityUpdateError);
//         }

//         res.json({ status: "success" });
//       } else {
//         console.log(`Webhook received for event: ${paymentEventPayload.event}. Not processing this event type.`);
//         res.json({ status: "success", message: "Event type not processed" });
//       }
//     } catch (error) {
//       console.error("Webhook processing error (outer catch):", error);
//       res.status(500).json({ status: "failure", error: "Internal server error during webhook processing" });
//     }
//   } else {
//     console.error("Signature verification failed: Incoming digest does not match calculated digest.");
//     res.status(400).json({ status: "failure", error: "Invalid signature" });
//   }
// };



const User = require("../models/User");
const Session = require("../models/Session");
const TeacherProfile = require("../models/Teacher"); 
const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: "rzp_test_59BvySck8scTA8",
  key_secret: "KZEGvAwmK7Mpp2xJ0L0xJefc",
});

exports.createPaymentOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", teacherData } = req.body;
    console.log("Received payload for payment order:", { amount, currency, teacherData });

    if (!amount || !teacherData || !teacherData.dateTime || !teacherData.startTime || !teacherData.endTime || !teacherData.teacherId || !teacherData.name) {
      return res.status(400).json({ error: "Amount, and complete teacherData (name, dateTime, startTime, endTime, teacherId) are required" });
    }

    const userIdShort = req.user.id.toString().slice(-10);
    const timestampShort = Date.now().toString().slice(-7);
    const receiptId = `rcpt_${userIdShort}_${timestampShort}`;

    console.log("Generated Receipt ID:", receiptId);

    const options = {
      amount: amount * 100,
      currency,
      receipt: receiptId,
      notes: {
        userId: req.user.id.toString(),
        teacherData: JSON.stringify(teacherData),
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
  const secret = "957602e3b363da9db40cced06b8d569e3ec6d18218d07327e9eafe816982cf3d";

  console.log("--- RAZORPAY WEBHOOK RECEIVED ---");
  console.log("Headers:", req.headers);
  console.log("req.body (Buffer Length):", req.body ? req.body.length : '0');
  console.log("--- END WEBHOOK DEBUGGING ---");

  const dataToHash = req.body;

  if (!dataToHash || !(dataToHash instanceof Buffer)) {
    console.error("Webhook Error: Raw body not found or not a Buffer for signature verification. Ensure `express.raw({type: 'application/json'})` is used as middleware for this route.");
    return res.status(400).json({ status: "failure", error: "No raw body data for signature verification" });
  }

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(dataToHash);
  const digest = shasum.digest("hex");

  let paymentEventPayload;
  try {
    paymentEventPayload = JSON.parse(dataToHash.toString('utf8'));
    console.log("Parsed Webhook Payload (for debugging):", JSON.stringify(paymentEventPayload, null, 2));
  } catch (parseError) {
    console.error("Webhook Error: Failed to parse raw body as JSON:", parseError);
    return res.status(400).json({ status: "failure", error: "Malformed JSON body in webhook" });
  }

  if (digest === req.headers["x-razorpay-signature"]) {
    try {
      if (paymentEventPayload.event === 'payment.captured' || paymentEventPayload.event === 'order.paid') {
        const paymentEntity = paymentEventPayload.payload.payment.entity;

        let orderEntity;
        if (paymentEventPayload.payload.order && paymentEventPayload.payload.order.entity) {
            orderEntity = paymentEventPayload.payload.order.entity;
        } else if (paymentEntity.order_id) {
            console.log(`Webhook: Order entity not found in payload directly. Fetching order ${paymentEntity.order_id} to get notes.`);
            try {
                const fetchedOrder = await razorpay.orders.fetch(paymentEntity.order_id);
                orderEntity = fetchedOrder;
            } catch (fetchError) {
                console.error("Webhook Error: Failed to fetch order details for notes:", fetchError);
                return res.status(500).json({ status: "failure", error: "Failed to fetch order details for notes" });
            }
        }

        if (!orderEntity || !orderEntity.notes || !orderEntity.notes.userId || !orderEntity.notes.teacherData) {
            console.error("Webhook Error: Missing order entity or essential notes data for session creation.", orderEntity);
            return res.status(400).json({ status: "failure", error: "Missing essential order data in webhook payload." });
        }

        const studentUserId = orderEntity.notes.userId;
        const teacherDataString = orderEntity.notes.teacherData;

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

        let teacherData;
        try {
          teacherData = JSON.parse(teacherDataString);
          if (!teacherData || !teacherData.teacherId || !teacherData.name || !teacherData.dateTime || !teacherData.startTime || !teacherData.endTime) {
             console.error("Webhook Error: Parsed teacherData is incomplete or missing required fields.", teacherData);
             return res.status(400).json({ status: "failure", error: "Incomplete or malformed teacherData in payment notes" });
          }
        } catch (parseError) {
          console.error("Webhook Error: Failed to parse teacherData from notes:", parseError.message);
          return res.status(400).json({ status: "failure", error: "Malformed teacherData JSON in payment notes" });
        }

        const newSession = new Session({
          teacherName: teacherData.name,
          teacherInitials: teacherData.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2),
          dateTime: new Date(teacherData.dateTime),
          studentId: studentUser._id,
          paymentId: paymentEntity.id,
          startTime: teacherData.startTime,
          endTime: teacherData.endTime,
          teacherId: teacherData.teacherId,
        });
        await newSession.save();
        console.log(`Session created: Teacher: ${teacherData.name}, Student: ${studentUser.name}, Time: ${teacherData.startTime}-${teacherData.endTime} on ${teacherData.dateTime}, Session ID: ${newSession._id}`);

        try {
            const teacherIdFromNotes = teacherData.teacherId;
            let teacherUser = await User.findById(teacherIdFromNotes); 

            if (!teacherUser) {
                console.warn(`Webhook: Teacher User not found directly with ID ${teacherIdFromNotes}. Attempting to find via TeacherProfile.`);
                const teacherProfile = await TeacherProfile.findById(teacherIdFromNotes);
                if (teacherProfile && teacherProfile.userId) {
                    teacherUser = await User.findById(teacherProfile.userId);
                    if (teacherUser) {
                        console.log(`Webhook: Teacher User found indirectly via TeacherProfile (Original ID: ${teacherIdFromNotes}, Actual User ID: ${teacherUser._id}).`);
                    } else {
                        console.error(`Webhook Error: Teacher User still not found even after trying TeacherProfile (Profile ID: ${teacherIdFromNotes}, User ID ref: ${teacherProfile.userId}).`);
                    }
                } else {
                    console.error(`Webhook Error: TeacherProfile not found for ID ${teacherIdFromNotes}, or it has no userId reference. Cannot determine true teacher user ID.`);
                }
            }

            if (!teacherUser) {
                console.error(`Webhook Error: Critical - Teacher User not found at all for availability update (ID: ${teacherIdFromNotes}). Session was booked, but availability could not be updated!`);
                return res.json({ status: "success", message: "Session created, but teacher availability could not be updated." });
            }

            if (!teacherUser.availability) {
                teacherUser.availability = [];
            }

            const bookedDateString = new Date(teacherData.dateTime).toISOString().split('T')[0];
            const bookedStartTime = teacherData.startTime;
            const bookedEndTime = teacherData.endTime;

            const availabilityEntry = teacherUser.availability.find(item => {
                const itemDateString = item.date instanceof Date ? item.date.toISOString().split('T')[0] : item.date;
                return itemDateString === bookedDateString;
            });

            if (availabilityEntry) {
                const slotToUpdate = availabilityEntry.slots.find(slot =>
                    slot.startTime === bookedStartTime &&
                    slot.endTime === bookedEndTime &&
                    slot.available === true
                );

                if (slotToUpdate) {
                    slotToUpdate.available = false;
                    console.log(`Webhook: Slot ${bookedStartTime}-${bookedEndTime} on ${bookedDateString} for teacher ${teacherUser._id} marked as BOOKED.`);
                } else {
                    console.warn(`Webhook Warning: Slot ${bookedStartTime}-${bookedEndTime} not found or already booked for teacher ${teacherUser._id}'s availability on ${bookedDateString}.`);
                }

                await teacherUser.save();
            } else {
                console.warn(`Webhook Warning: No availability entry found for teacher ${teacherUser._id} on date ${bookedDateString}. Slot not marked as booked.`);
            }

        } catch (availabilityUpdateError) {
            console.error("Webhook Error: Failed to update teacher availability:", availabilityUpdateError);
            
        }

        res.json({ status: "success" });
      } else {
        console.log(`Webhook received for event: ${paymentEventPayload.event}. Not processing this event type.`);
        res.json({ status: "success", message: "Event type not processed" });
      }
    } catch (error) {
      console.error("Webhook processing error (outer catch):", error);
      res.status(500).json({ status: "failure", error: "Internal server error during webhook processing" });
    }
  } else {
    console.error("Signature verification failed: Incoming digest does not match calculated digest.");
    res.status(400).json({ status: "failure", error: "Invalid signature" });
  }
};
