//jshint esversion:6
require("dotenv").config(); //requiring the dotenv module in order to use external file to save our file
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");


const app = express();


mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose); //using the plugin for our mongoose model


const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  secret: "Our little secret..!",
  resave: false,
  saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());


app.get("/", function(req,res){
    res.render("home");
});

app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/");
});


app.get("/login", function(req,res){
    res.render("login");
});

app.get("/register", function(req,res){
    res.render("register");
});

app.get("/secrets", function(req,res){
  if (req.isAuthenticated()){
    res.render("secrets");
  } else {
    res.redirect("/login");
  }
});


app.post("/register", (req,res) => {

    User.register({username: req.body.username}, req.body.password, function(err, user){
      if (err) { console.log(err); res.redirect("/register")} else {
        passport.authenticate("local")(req,res, function(){
          res.redirect("/secrets")
        })
      }
    })



});


app.post("/login", (req,res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err){
    if (err) {
      console.log(err);
      res.redirect("/login");
    } else {
      passport.authenticate("local")(req,res, function(){
        res.redirect("/secrets");
      });
    }
  })

});

app.listen(5500, ()=> {
    console.log("Server has started on port 5500");
})
