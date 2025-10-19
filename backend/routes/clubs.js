 // routes/clubs.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

 
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM clubs"); 
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching clubs:", err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
