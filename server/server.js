require("dotenv").config();
const express = require("express");
const app=express();

const cors = require("cors");
const PORT=process.env.PORT || 5000;
const MONGO_URI=process.env.MONGO_URI;

cors({
    origin:process.env.CLIENT_URL,
    methods:["GET","POST","PUT","DELETE"],
    allowedHeaders:["Content-Type","Authorization"],
})

app.use(express.json());

//dB connection
const mongoose = require("mongoose");
mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

//error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});