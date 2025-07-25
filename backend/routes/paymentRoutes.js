const express = require("express");
const router = express.Router();
const {createPaymentOrder,handleRazorpayWebhook} = require("../controller/paymentController");
const {protect} = require("../middleware/auth");

router.post("/create-payment-order", protect, createPaymentOrder);
router.post("/razorpay-webhook", handleRazorpayWebhook);

module.exports = router;