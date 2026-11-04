const express = require("express");
const mongoose = require("mongoose");

const app = express();

const PORT = 5000;

app.use(express.json());

mongoose
    .connect("mongodb://127.0.0.1:27017/mern_project")
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error);
    });

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});