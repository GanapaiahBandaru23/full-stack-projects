const express = require("express");
const mysql = require("mysql"); // MySQL package
const bodyParser = require("body-parser"); // To parse JSON requests
const bcrypt = require("bcrypt");

const cors = require("cors"); // Optional: allow requests from frontend

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 1️⃣ Create MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",     // XAMPP default
  password: "",     // XAMPP default
  database: "registration_db"  // Your DB name
});

// 2️⃣ Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("DB Connection Error:", err.message);
    process.exit(1);
  }
  console.log("✅ MySQL Connected Successfully");
});

app.get("/", (req, res) => {
  res.send("Server and MySQL connected!");
});

app.post("/register", async (req, res) => {
  const { name, email, password, age } = req.body;
  if (!name || !email || !password || !age) {
    return res.json({ message: "All fields are required!" });
  }
  try{

    // 1️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds

    // 2️⃣ Insert into DB
    const query = "INSERT INTO users (name,email,password,age) VALUES (?,?,?,?)";
    db.query(query, [name, email, hashedPassword, age], (err, result) => {
      if (err) return res.json({ message: "Database error!" });
      res.json({ message: "Registration Successful ✅" });
    });

  }
  catch (error) {
    res.json({ message: "Error hashing password!" });
  }

});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});


