//jshint esversion:6
require("dotenv").config(); //requiring the dotenv module in order to use external file to save our file
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const mongodb = require("mongodb");
// const encrypt = require("mongoose-encryption");
// const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10; //setting saltrounds for bcrypt to make passwords more secure

const app = express();

// console.log(process.env.SECRET); //using the secret from the .env file that we hid in order to not be visible in the app.js file in case it gets hacked
mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});



// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req,res){
    res.render("home");
});

app.get("/logout", function(req,res){
    res.redirect("/");
});


app.get("/login", function(req,res){
    res.render("login");
});

app.get("/register", function(req,res){
    res.render("register");
});


app.post("/register", (req,res) => {

    bcrypt.hash(req.body.password, saltRounds ,function(err, has){


          const newUser = new User({
              email: req.body.username ,
              password: hash
          })

          newUser.save((err)=>{
              if (err) {
                  console.log(err);
              } else {
                  console.log("New user successfully registered with the email: " + req.body.username + " and the password of " + req.body.password + " . ");
                  res.redirect("/");

              }
          })

    });



});


app.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;


    User.findOne({email: username }, (err, foundUser)=>{
        if (err) {
            console.log(err);
        }
        else {
            if (foundUser) {
              bcrypt.compare(password, foundUser.password, function(err, result){
                  if (result === true) {
                    console.log("Logging you in...");
                    res.render("secrets");
                  }

              });



            }
        }
    })
})

app.listen(3000, ()=> {
    console.log("Server has started on port 3000");
})
