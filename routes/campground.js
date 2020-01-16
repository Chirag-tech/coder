var express = require("express");
var router = express.Router();
var campground = require("../models/campground");
var middleWare= require("../middleWare");
router.get("/",function(req,res){
    campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/index",{data:allCampgrounds});
        }
    })
})
//create route
router.post("/",middleWare.isLoggedIn,function(req,res){
    var image = req.body.image;
    var name=req.body.name;
    price:req.body.price;
    var desc =req.body.description;
    var author={
        id:req.user._id,
        username:req.user.username
    }
    var newCampground = {name:name,price:price,image:image,description:desc,author:author};
    //create a new campground and save to DB
    campground.create(newCampground,function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds");
        }
    })
})
//form route to post and create a new campground
router.get("/new",middleWare.isLoggedIn,function(req,res){
    res.render("campgrounds/new");
});
//show route
router.get("/:id",function(req,res){
    campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/show",{campground:foundCampground});
        }
    })
})
//edit route
router.get("/:id/edit",middleWare.checkCampgroundOwnerShip,function(req,res){
    campground.findById(req.params.id,function(err,foundCampground){
            res.render("campgrounds/edit",{campground:foundCampground});
    });
});
//update route
router.put("/:id",middleWare.checkCampgroundOwnerShip,function(req,res){
    campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updated){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})
//delete route
router.delete("/:id",middleWare.checkCampgroundOwnerShip,function(req,res){
    campground.findByIdAndRemove(req.params.id,function(err,removed){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds");
        }
    });
});

module.exports=router;