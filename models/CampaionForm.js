const mongoose = require("mongoose");

const campaionFormSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      default: "General",
      trim: true,
    },
    eventDescription: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      default: "",
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{10}$/, "Mobile number must be 10 digits"],
    },
    occupation: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CampaionForm", campaionFormSchema);
