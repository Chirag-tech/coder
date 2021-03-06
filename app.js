//REQUIRE CONFIG
var express =         require("express"),
    app =             express(),
    bodyParser =      require("body-parser"),
    mongoose =        require("mongoose"),
    passport =        require("passport"),
    flash =           require("connect-flash"),
    localStrategy =   require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    MethodOverride        = require("method-override"),
    campground =            require("./models/campground"),
    seed =                  require("./seed"),
    campgroundRoutes =      require("./routes/campground"),
    commentRoutes =         require("./routes/comments"),
    authenticateRoutes =    require("./routes/index"),
    comment =               require("./models/comment"),
    User =                  require("./models/user");
    require("dotenv").config();
 
mongoose.connect("mongodb+srv://dbUser:dbUser@cluster0-jz1fy.mongodb.net/test?retryWrites=true&w=majority",{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("connected to DB");
}).catch(err =>{
    console.log("ERROR:"+err.message);
});
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.use(MethodOverride("_method"));
app.use(flash());
// seed(); //seed the database
//PASSPORT CONFIG
app.use(require("express-session")({
    secret:"hello there",
    resave: false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
    res.locals.currentUser= req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});
//IMPORTING ROUTES FROM FILES
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/",authenticateRoutes);
//initializing server
var PORT = process.env.PORT||1310;
app.listen(PORT,function(){
    console.log("Server started....");
});