const mongoose = require("mongoose");

const campaionFormSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: true,
      trim: true,
    },
    eventDescription: String,
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    occupation: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CampaionForm", campaionFormSchema);
