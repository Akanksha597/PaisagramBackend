// controllers/otpController.js
const Otp = require("../models/Otp");
const axios = require("axios");

// ==================== SEND OTP ====================
exports.sendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;

    // ✅ Validate mobile
    if (!mobile || !/^\d{10}$/.test(mobile)) {
      return res.status(400).json({ success: false, message: "Invalid mobile number" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Delete old OTP if exists
    await Otp.findOneAndDelete({ mobile });

    // Create new OTP in DB
    await Otp.create({
      mobile,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes expiry
    });

    // ✅ Send SMS via Fast2SMS (optional: comment out for testing)
 // ✅ Send SMS via Fast2SMS (NON-BLOCKING)
if (process.env.FAST2SMS_API_KEY) {
  try {
    await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        route: "otp",
        sender_id: "FSTSMS",
        message: `Your OTP is ${otp}`,
        language: "english",
        numbers: mobile,
      },
      {
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (smsError) {
    console.error(
      "Fast2SMS failed:",
      smsError.response?.data || smsError.message
    );
    // ❗ DO NOT throw error
  }
} else {
  console.warn("FAST2SMS_API_KEY not set, OTP not sent via SMS");
}


    console.log(`OTP for ${mobile} is ${otp}`); // For debugging
    res.json({ success: true, message: "OTP sent" });
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
      return res.status(400).json({ success: false, message: "Mobile and OTP are required" });
    }

    const record = await Otp.findOne({ mobile, otp });

    if (!record) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (record.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: record._id }); // Delete expired OTP
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    // OTP is valid
    await Otp.deleteOne({ _id: record._id }); // Remove used OTP
    res.json({ success: true, message: "OTP verified" });
  } catch (error) {
    console.error("Verify OTP Error:", error.message);
    res.status(500).json({ success: false, message: "OTP verification failed" });
  }
};
