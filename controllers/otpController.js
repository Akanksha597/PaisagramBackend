const Otp = require("../models/Otp");

// SEND OTP
const axios = require("axios");

exports.sendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000);

    await Otp.findOneAndDelete({ mobile });

    await Otp.create({
      mobile,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // ✅ SEND SMS
    await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        route: "otp",
        variables_values: otp,
        numbers: mobile,
      },
      {
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ success: true, message: "OTP sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "OTP failed" });
  }
};


// VERIFY OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    const record = await Otp.findOne({ mobile, otp });

    if (!record || record.expiresAt < new Date()) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    await Otp.deleteOne({ _id: record._id });

    res.json({ success: true, message: "OTP verified" });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
