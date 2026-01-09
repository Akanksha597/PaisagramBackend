// routes/otpRoutes.js
const express = require("express");
const router = express.Router();
const { sendOtp, verifyOtp } = require("../controllers/otpController");

// POST /api/otp/send
router.post("/send", sendOtp);

// POST /api/otp/verify
router.post("/verify", verifyOtp);

module.exports = router;
