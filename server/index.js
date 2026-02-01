console.log("index.js loaded");

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // port: 3306, // 可不寫，mysql2 預設 3306；想教學清楚可打開
  waitForConnections: true,
  connectionLimit: 10
});

// 測試 API 有沒有跑起來
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

// 讀取 students 表
app.get("/api/students", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email FROM students ORDER BY id ASC"
    );
    res.json(rows);
  } catch (err) {
    console.error("DB query failed:", err);
    res.status(500).json({ error: "DB query failed" });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
