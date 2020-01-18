var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
//REST-INDEX route
router.get("/",function(req,res){
    res.render("home");
});

//AUTH ROUTES
router.get("/register",function(req,res){
    res.render("register");
});
//handle register  logic
router.post("/register",function(req,res){
    var newUser = new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            req.flash("A user with the given username already exists !!");
           return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success","Welcome to YelpCamp " +user.username);
            res.redirect("/campgrounds");
        });
    });
});
//login route
router.get("/login",function(req,res){
    
    res.render("login");
});
router.post("/login",passport.authenticate("local",
     {
         successRedirect:"/campgrounds",
         failureRedirect:"/login"
     }),function(req,res){
});
//logout route
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Successfully,logged you out !!");
    res.redirect("/campgrounds");
});
module.exports =router;
