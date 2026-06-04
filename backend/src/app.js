const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req,res) => {
    res.status(200).json({
        status: "OK",
        message: "Secure Event Api is Running",
    });
});

app.get("/health/db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT DATABASE() AS database_name");

    res.status(200).json({
      status: "OK",
      message: "Database connection is working",
      database: rows[0].database_name,
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: "Database connection failed",
      error: error.message,
    });
  }
});

module.exports = app;