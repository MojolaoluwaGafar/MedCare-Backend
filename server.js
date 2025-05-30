const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes.js");
const verifyToken = require("./middleware/verifyToken");

dotenv.config();
const app = express();
app.use((req, res, next) => {
  console.log(`➡️ Incoming request: ${req.method} ${req.url}`);
  next();
});

//middleware
app.use(express.json());
app.use(cors());


// const allowedOrigins = [
//   "http://localhost:5173"
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );

//routes
app.use("/api/auth", authRoutes);


//database connection
// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.error("MongoDB Error:", err));

// //server port
// const PORT = process.env.PORT || 6000;
// app.listen(PORT, () => console.log(`server running on port ${PORT}`));

app.get("/test", (req, res) => {
  console.log("✅ Test route hit");
  res.status(200).json({ message: "Server is working" });
});


const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    console.log("🟢 About to start server...");
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Startup error:", err.message);
  }
};
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.stack || err);
});
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.stack || err);
});
startServer();
