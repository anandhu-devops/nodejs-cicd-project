const express = require("express");
const app = express();

const PORT = 3000;

// Home Route
app.get("/", (req, res) => {
    res.send("CI/CD Pipeline Working Successfully!");
});

// Health Check Route
app.get("/health", (req, res) => {
    res.send("Application is Healthy");
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});