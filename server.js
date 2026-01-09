const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { default: mongoose } = require("mongoose");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
let isconnected = false;
async function connectDB(){
  try{
    await mongoose.connect(process.env.MONGO_URI,{
      useNewUrlParser:true,
      useUnifiedTopology:true,
  });  isconnected = true;
    console.log("MongoDB connected");
  }  catch(err){
    console.error(err.message);
    process.exit(1);
  }
}

//add middleware to check db connection
app.use((req, res, next) => {
  if (!isConnected) {
       connectDB(); // assuming connectDB is async
  }
    next();
});
  
app.use("/api/campaion", require("./routes/CampaionRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () =>
//   console.log(`🚀 Server running on port ${PORT}`)
// );
module.exports = app;
