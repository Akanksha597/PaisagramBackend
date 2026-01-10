const Otp = require("../models/Otp");
const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// ==================== SEND OTP ====================
exports.sendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;

    // ✅ Validate mobile number (India example)
    if (!mobile || !/^\d{10}$/.test(mobile)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid mobile number" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    // Delete old OTP
    await Otp.findOneAndDelete({ mobile });

    // Save OTP (5 min expiry)
    await Otp.create({
      mobile,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // 📲 Send SMS using Twilio
    await client.messages.create({
      body: `Your OTP is ${otp}. It is valid for 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${mobile}`, // India country code
    });

    console.log(`OTP sent to ${mobile}: ${otp}`);

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP Error:", error.message);
    res.status(500).json({ success: false, message: "OTP sending failed" });
  }
};

// ==================== VERIFY OTP ====================
exports.verifyOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Mobile and OTP required" });
    }

    const record = await Otp.findOne({ mobile, otp });

    if (!record) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP" });
    }

    if (record.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: record._id });
      return res
        .status(400)
        .json({ success: false, message: "OTP expired" });
    }

    // OTP verified → delete
    await Otp.deleteOne({ _id: record._id });

    res.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("Verify OTP Error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "OTP verification failed" });
  }
};
