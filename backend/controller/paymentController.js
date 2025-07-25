// const User = require("../models/User");
// const Session = require("../models/Session");
// const Razorpay = require("razorpay");

// // const razorpay = new Razorpay({
// //   key_id: process.env.RAZORPAY_KEY_I,
// //   key_secret: process.env.RAZORPAY_KEY_SECRET,
// // });

// const razorpay = new Razorpay({
//   key_id: "rzp_test_59BvySck8scTA8",
//   key_secret: "KZEGvAwmK7Mpp2xJ0L0xJefc",
// });


// exports.createPaymentOrder = async (req, res) => {
//   try {
//     const { amount, currency = "INR", teacherData } = req.body;
//     console.log("Received payload:", { amount, currency, teacherData }); // Log incoming data
//     if (!amount || !teacherData || !teacherData.dateTime || !teacherData.startTime || !teacherData.endTime) {
//       return res.status(400).json({ error: "Amount, dateTime, startTime, and endTime are required" });
//     }

//     const options = {
//       amount: amount * 100,
//       currency,
//       receipt: `receipt_${req.user.id}_${Date.now()}`,
//       notes: {
//         userId: req.user.id,
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
//     res.status(500).json({ error: "Failed to create payment order", details: error.message });
//   }
// };

// exports.handleRazorpayWebhook = async (req, res) => {
//   const secret = process.env.RAZORPAY_KEY_SECRET;
//   const shasum = require("crypto").createHmac("sha256", secret);
//   shasum.update(req.rawBody);

//   const digest = shasum.digest("hex");

//   if (digest === req.headers["x-razorpay-signature"]) {
//     try {
//       const payment = req.body;
//       const user = await User.findById(payment.notes.userId);
//       if (!user) throw new Error("User not found");

//       user.paymentAcknowledged = true;
//       user.lastPaymentId = payment.id;
//       await user.save();

//       const teacherData = JSON.parse(payment.notes.teacherData);
//       const newSession = new Session({
//         teacherName: teacherData.name,
//         teacherInitials: teacherData.name
//           .split(" ")
//           .map((n) => n[0])
//           .join("")
//           .toUpperCase()
//           .slice(0, 2),
//         skill: teacherData.skill || "Unknown",
//         dateTime: new Date(teacherData.dateTime),
//         studentId: user._id,
//         paymentId: payment.id,
//         startTime: teacherData.startTime,
//         endTime: teacherData.endTime,
//       });
//       await newSession.save();

//       console.log(`Payment ${payment.id} for user ${user.name} processed, session created`);
//       res.json({ status: "success" });
//     } catch (error) {
//       console.error("Webhook processing error:", error);
//       res.status(500).json({ status: "failure", error: error.message });
//     }
//   } else {
//     console.error("Signature verification failed");
//     res.status(400).json({ status: "failure", error: "Invalid signature" });
//   }
// };





const User = require("../models/User");
const Session = require("../models/Session");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: "rzp_test_59BvySck8scTA8",
  key_secret: "KZEGvAwmK7Mpp2xJ0L0xJefc",
});

exports.createPaymentOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", teacherData } = req.body;
    console.log("Received payload:", { amount, currency, teacherData });
    if (!amount || !teacherData || !teacherData.dateTime || !teacherData.startTime || !teacherData.endTime) {
      return res.status(400).json({ error: "Amount, dateTime, startTime, and endTime are required" });
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

// exports.handleRazorpayWebhook = async (req, res) => {
//   const secret = process.env.RAZORPAY_KEY_SECRET;
//   const shasum = require("crypto").createHmac("sha256", secret);
//   shasum.update(req.rawBody);

//   const digest = shasum.digest("hex");

//   if (digest === req.headers["x-razorpay-signature"]) {
//     try {
//       const payment = req.body;
//       const user = await User.findById(payment.notes.userId);
//       if (!user) throw new Error("User not found");

//       user.paymentAcknowledged = true;
//       user.lastPaymentId = payment.id;
//       await user.save();

//       const teacherData = JSON.parse(payment.notes.teacherData);
//       const newSession = new Session({
//         teacherName: teacherData.name,
//         teacherInitials: teacherData.name
//           .split(" ")
//           .map((n) => n[0])
//           .join("")
//           .toUpperCase()
//           .slice(0, 2),
//         skill: teacherData.skill || "Unknown",
//         dateTime: new Date(teacherData.dateTime),
//         studentId: user._id,
//         paymentId: payment.id,
//         startTime: teacherData.startTime,
//         endTime: teacherData.endTime,
//       });
//       await newSession.save();

//       console.log(`Payment ${payment.id} for user ${user.name} processed, session created`);
//       res.json({ status: "success" });
//     } catch (error) {
//       console.error("Webhook processing error:", error);
//       res.status(500).json({ status: "failure", error: error.message });
//     }
//   } else {
//     console.error("Signature verification failed");
//     res.status(400).json({ status: "failure", error: "Invalid signature" });
//   }
// };



exports.handleRazorpayWebhook = async (req, res) => {
  const secret = "957602e3b363da9db40cced06b8d569e3ec6d18218d07327e9eafe816982cf3d";

  // --- DEBUGGING LOGS (KEEP THESE IN FOR NOW) ---
  console.log("--- WEBHOOK RECEIVED ---");
  console.log("Headers:", req.headers);
  console.log("req.body (parsed by express.raw):", req.body);
  console.log("req.rawBody (from express.raw middleware):", req.rawBody ? req.rawBody.toString() : "undefined/null");
  console.log("--- END DEBUGGING LOGS ---");

  const dataToHash = typeof req.rawBody === 'object' && req.rawBody !== null && req.rawBody instanceof Buffer
                     ? req.rawBody
                     : JSON.stringify(req.body);

  if (!dataToHash) {
    console.error("Webhook Error: No body data found for signature verification.");
    return res.status(400).json({ status: "failure", error: "No body data" });
  }

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(dataToHash);

  const digest = shasum.digest("hex");

  if (digest === req.headers["x-razorpay-signature"]) {
    try {
      const payment = req.body;

      if (payment.event === 'payment.captured') {
        const userId = payment.payload.payment.entity.notes.userId;
        const user = await User.findById(userId);

        if (!user) {
          console.error(`Webhook Error: User not found for userId: ${userId}`);
          return res.status(404).json({ status: "failure", error: "User not found" });
        }

        if (user.lastPaymentId === payment.payload.payment.entity.id) {
          console.log(`Webhook: Payment ${payment.payload.payment.entity.id} already processed for user ${user.name}`);
          return res.json({ status: "success", message: "Payment already processed" });
        }

        user.paymentAcknowledged = true;
        user.lastPaymentId = payment.payload.payment.entity.id;
        await user.save();

        const teacherDataString = payment.payload.payment.entity.notes.teacherData;
        let teacherData;
        try {
          teacherData = JSON.parse(teacherDataString);
        } catch (parseError) {
          console.error("Webhook Error: Failed to parse teacherData from notes:", parseError.message);
          return res.status(400).json({ status: "failure", error: "Malformed teacherData in notes" });
        }

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
          studentId: user._id,
          paymentId: payment.payload.payment.entity.id,
          startTime: teacherData.startTime,
          endTime: teacherData.endTime,
        });
        await newSession.save();

        console.log(`Payment ${payment.payload.payment.entity.id} for user ${user.name} processed, session created.`);
        res.json({ status: "success" });
      } else {
        console.log(`Webhook received for event: ${payment.event}. Not processing.`);
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
