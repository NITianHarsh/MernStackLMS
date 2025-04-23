require("dotenv").config();
const express = require("express");
const app = express();

const cors = require("cors");
const PORT = process.env.PORT || 5000;
const connectDB = require("./db/db.js");

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

//dB connection
connectDB();

// routes
const authRoutes = require("./routes/auth");

app.use("/auth", authRoutes);

//error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
