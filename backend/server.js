 // server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import database and routes
const pool = require("./db");
const clubsRouter = require("./routes/clubs");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Use clubs route
app.use("/api/clubs", clubsRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
