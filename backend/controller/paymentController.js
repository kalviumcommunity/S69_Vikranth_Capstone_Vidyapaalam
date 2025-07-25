const User = require("../models/User");
const Session = require("../models/Session");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createPaymentOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", teacherData } = req.body;
    console.log("Received payload:", { amount, currency, teacherData }); // Log incoming data
    if (!amount || !teacherData || !teacherData.dateTime || !teacherData.startTime || !teacherData.endTime) {
      return res.status(400).json({ error: "Amount, dateTime, startTime, and endTime are required" });
    }

    const options = {
      amount: amount * 100,
      currency,
      receipt: `receipt_${req.user.id}_${Date.now()}`,
      notes: {
        userId: req.user.id,
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
    res.status(500).json({ error: "Failed to create payment order", details: error.message });
  }
};

exports.handleRazorpayWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  const shasum = require("crypto").createHmac("sha256", secret);
  shasum.update(req.rawBody);

  const digest = shasum.digest("hex");

  if (digest === req.headers["x-razorpay-signature"]) {
    try {
      const payment = req.body;
      const user = await User.findById(payment.notes.userId);
      if (!user) throw new Error("User not found");

      user.paymentAcknowledged = true;
      user.lastPaymentId = payment.id;
      await user.save();

      const teacherData = JSON.parse(payment.notes.teacherData);
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
        paymentId: payment.id,
        startTime: teacherData.startTime,
        endTime: teacherData.endTime,
      });
      await newSession.save();

      console.log(`Payment ${payment.id} for user ${user.name} processed, session created`);
      res.json({ status: "success" });
    } catch (error) {
      console.error("Webhook processing error:", error);
      res.status(500).json({ status: "failure", error: error.message });
    }
  } else {
    console.error("Signature verification failed");
    res.status(400).json({ status: "failure", error: "Invalid signature" });
  }
};
