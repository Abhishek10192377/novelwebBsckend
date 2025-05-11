const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

// Import Routes
const Registerroutes = require("./App/Routes/Registerroutes");
const Categoryroutes = require("./App/Routes/CategoryRoute");
const Bookrouter = require("./App/Routes/bookRouter");
const Novelrouter = require("./App/Routes/NovelRoutes");
const UserregisterRouter = require("./App/Routes/User/userregister");
const protectedrouter = require("./App/Routes/authRoutes");

// Middlewares
const corsOption={
  origin:[
    "https://novelwebdashboad.onrender.com",
    "https://novelwebfrontend.onrender.com"
  ],
  credentials:true,
}
app.use(cors(corsOption));  // You can customize this if needed
app.use(express.json());

// Use Routes
app.use("/api", Registerroutes);
app.use("/api", Categoryroutes);
app.use("/api", Bookrouter);
app.use("/api", Novelrouter);
app.use("/api", UserregisterRouter);
app.use("/api",protectedrouter)
// Root Route
app.get("/", (req, res) => {
  res.send("server is running");
});

// DB Connection + Server Start
mongoose.connect(process.env.DB_URL || "mongodb://localhost:27017/NovelWeb")  // You can fallback to localhost if DB_URL isn't available
  .then(() => {
    console.log("Database is connected successfully");

    const PORT = process.env.PORT || 3000;  // Fallback to 3000 if no PORT in .env
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Database connection failed: " + error);
  });

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});
