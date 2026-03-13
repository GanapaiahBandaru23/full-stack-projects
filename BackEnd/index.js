const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect((err)=>{
  if(err){
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to MySQL database");
});


// Test API
app.get("/",(req,res)=>{
  res.status(200).json({message:"Success"});
});


// Register User
app.post("/registerUser", async (req,res)=>{
  const {email,password} = req.body;

  try{
    const hashPassword = await bcrypt.hash(password,10);

    db.query(
      "INSERT INTO users_new (EmailID,HashedPassword) VALUES (?,?)",
      [email, hashPassword],
      (err,results)=>{
        if(err){
          console.log(err);
          return res.status(500).json({message:"Database error"});
        }

        res.status(200).json({
          message:"Registration successful"
        });
      }
    );

  }catch(err){
    console.error(err);
    res.status(500).json({
      message:"Error while hashing password"
    });
  }
});


// Login User
app.post("/userLogin",(req,res)=>{
  const {email,password} = req.body;

  db.query(
    "SELECT ID, HashedPassword FROM users_new WHERE EmailID=?",
    [email],
    async (err,results)=>{
      if(err){
        return res.status(500).json({message:"Database error"});
      }

      if(results.length === 0){
        return res.status(400).json({message:"User not found"});
      }

      const hashedPassword = results[0].HashedPassword;
      const userID = results[0].ID;

      const response = await bcrypt.compare(password,hashedPassword);

      if(response){
        res.status(200).json({userID:userID});
      }else{
        res.status(400).json({message:"Invalid password"});
      }
    }
  );
});


// Add New Post
app.post("/newPost",(req,res)=>{
  const {postTitle, postDescription, userID} = req.body;

  db.query(
    "INSERT INTO posts (UserID,postTitle,postDescription) VALUES (?,?,?)",
    [userID, postTitle, postDescription],
    (err,result)=>{
      if(err){
        return res.status(500).send("Database error");
      }

      res.status(200).send("Post added successfully");
    }
  );
});


// Get My Posts
app.get('/getMyPosts/:userID',(req,res)=>{
  const userID = req.params.userID;

  db.query(
    "SELECT * FROM posts WHERE UserID=?",
    [userID],
    (err,result)=>{
      if(err){
        return res.status(500).json({message:"Database error"});
      }

      res.status(200).json(result);
    }
  );
});


// Server start
const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`);
});