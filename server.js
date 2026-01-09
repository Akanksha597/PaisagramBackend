const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

let isConnected = false;

const app = express();
app.use(cors());
app.use(express.json());

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
      console.log("MongoDB connected");
    } catch (err) {
      console.error("DB Connection Error:", err.message);
      return res.status(500).json({ error: "Database connection failed" });
    }
  }
  next();
});

app.use("/api/campaion", require("./routes/CampaionRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/otp", require("./routes/otpRoutes"));


module.exports = app;
