const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt"); // ✅ Add this line

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Connect to MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "registerdb"
});

db.connect((err) => {
  if (err) throw err;
  console.log("✅ MySQL Connected");
});

app.get("/", (req, res) => {
  res.send("Server running and connected to MySQL!");
});

// ✅ Register endpoint (with password hashing)
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send("All fields are required!");
  }

  try {
    // 🔒 Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) {
        console.log("❌ DB Error:", err);
        return res.status(500).send("Database error");
      }
      console.log("✅ Data Inserted:", result.insertId);
      res.send("Registration Successful!");
    });
  } catch (err) {
    console.error("❌ Hash Error:", err);
    res.status(500).send("Server error");
  }
});

app.listen(8080, () => {
  console.log("✅ Server running at http://localhost:8080");
});
