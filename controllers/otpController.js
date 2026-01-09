const Otp = require("../models/Otp");

// SEND OTP
exports.sendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile || mobile.length !== 10) {
      return res.status(400).json({ success: false, message: "Invalid mobile" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.findOneAndDelete({ mobile }); // remove old OTP

    await Otp.create({
      mobile,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min
    });

    // 👉 Integrate SMS gateway here
    console.log("OTP:", otp);

    res.json({ success: true, message: "OTP sent" });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
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
