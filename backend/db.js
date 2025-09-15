// db.js
const mysql = require("mysql2");

// Local development defaults
const conn = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "astrologer"
});

conn.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1); // Exit if DB not connected
  }
  console.log("MySQL connected!");
});

module.exports = conn;