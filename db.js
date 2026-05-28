const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection(process.env.MYSQL_URL || {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
});

connection.connect(function(err) {
  if (err) {
    console.log("Database connection failed:", err);
  } else {
    console.log("Database connected successfully!");
  }
});

module.exports = connection;