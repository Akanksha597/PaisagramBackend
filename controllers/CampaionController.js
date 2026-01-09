const CampaionForm = require("../models/CampaionForm");

// SUBMIT FORM
exports.submitForm = async (req, res) => {
  try {
    let {
      eventName,
      eventDescription,
      name,
      email,
      mobile,
      occupation,
    } = req.body;

    if (!eventName || !name || !mobile) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    if (mobile.length !== 10) {
      return res.status(400).json({
        success: false,
        message: "Mobile number must be 10 digits",
      });
    }

    const formData = await CampaionForm.create({
      eventName: eventName.trim(),
      eventDescription,
      name: name.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      occupation: occupation.trim(),
    });

    res.status(201).json({
      success: true,
      message: "Form submitted successfully",
      data: formData,
    });
  } catch (error) {
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
