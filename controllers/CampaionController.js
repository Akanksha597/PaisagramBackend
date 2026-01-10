const CampaionForm = require("../models/CampaionForm");

// SUBMIT FORM
exports.submitForm = async (req, res) => {
  try {
    const {
      eventName,
      eventCategory,
      name,
      email,
      mobile,
      occupation,
      isMobileVerified,
    } = req.body;

    if (!eventName || !name || !mobile) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    if (mobile.length !== 10) {
      return res.status(400).json({
        success: false,
        message: "Mobile must be 10 digits",
      });
    }

    // ✅ BLOCK if individual & not verified
    if (eventCategory === "individual" && !isMobileVerified) {
      return res.status(403).json({
        success: false,
        message: "Mobile verification required",
      });
    }

    const formData = await CampaionForm.create({
      eventName,
      eventCategory,
      name,
      email,
      mobile,
      occupation,
      isMobileVerified: eventCategory === "individual",
    });

    res.status(201).json({
      success: true,
      message: "Form submitted successfully",
      data: formData,
    });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// GET ALL FORMS
exports.getForms = async (req, res) => {
  try {
    const forms = await CampaionForm.find().sort({ createdAt: -1 });
    res.json({ success: true, count: forms.length, data: forms });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ GET FORMS BY EVENT NAME (FIXED)
exports.getFormByEvent = async (req, res) => {
  try {
    const eventName = decodeURIComponent(req.params.eventName).trim();

    const forms = await CampaionForm.find({
      eventName: {
        $regex: eventName,
        $options: "i",
      },
    });

    res.status(200).json({
      success: true,
      count: forms.length,
      data: forms,
    });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE USER
exports.deleteForm = async (req, res) => {
  try {
    await CampaionForm.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted successfully" });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
