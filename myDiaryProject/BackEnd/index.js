const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const mysql=require("mysql2");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const connection=mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"CHINNI@123",
  database:"myDairyProject"
})

connection.connect((err)=>{
  if(err){
    console.error('Error connecting to databse:',err);
    return;
  }
  console.log("connected to mysql databse:");
})
app.get("/",(req,res)=>{
  console.log(req);
  res.status(200).json({message:"Success"})
})

  
app.post("/registerUser", async (req,res)=>{
  const {email,password} = req.body;

  try{
    const hashPassword = await bcrypt.hash(password,10);

    connection.query(
      "INSERT INTO users (EmailID,HashedPassword) VALUES (?,?)",
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

  } catch(err){
    console.error(err);
    res.status(500).json({
      message:"Error while hashing password"
    });
  }
});



app.post("/userLogin", async (req,res)=>{
  let hashedPassword='';
  let userID='';
  const {email,password}=req.body;
  connection.query(`select ID, HashedPassword from users where EmailID='${email}'`,async (err,results)=>{
    if(err){
      res.status(500);
      return;
    }
    console.log(results)
    hashedPassword=results[0].HashedPassword;
    userID=results[0].ID;
    console.log(hashedPassword)
    let response=await bcrypt.compare(password,hashedPassword);
    console.log("line 74:",response)
    if(response){
      res.status(200).json({userID:userID});
      return;
    }
    else{
      res.status(500);
      return;
    }
  })
 // let response=await bcrypt.compare(password,hashedPassword);
 // console.log('Is same?',response);
  //res.send(200).send('Matched');
})



app.post("/newPost",(req,res)=>{
  const {postTitle, postDescription, userID} = req.body;

  connection.query(
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



app.get('/getMyPosts/:userID',(req,res)=>{
  const userID = req.params.userID;

  connection.query(
    "SELECT * FROM posts WHERE userID=?",
    [userID],
    (err,result)=>{
      if(err){
        return res.status(500).json({message:"Database error"});
      }

      res.status(200).json(result);
    }
  );
});
app.listen(3000,()=>{
  console.log("server started on port 3000!")
})