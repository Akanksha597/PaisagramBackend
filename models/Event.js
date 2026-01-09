const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    eventCategory: {
      type: String,
      enum: ["group", "individual"],
      required: true,
    },
    eventName: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: String, // example: "2 hours", "3 days"
   
    },

    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    shortdescription:{
    type: String,
    required: true,
       
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
  
);
const EVENT_CATEGORIES = eventSchema.path("eventCategory").enumValues;

module.exports = {
  Event: mongoose.model("Event", eventSchema),
  EVENT_CATEGORIES,
};

module.exports = mongoose.model("Event", eventSchema);
