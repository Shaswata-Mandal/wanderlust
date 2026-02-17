//---------------------------------------------------------------------------------------------
if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

//Basic configurations---------------

//requiring imp packages
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const flash=require("connect-flash");
//for creating templates
const ejsMate=require("ejs-mate");
const port=3000;

const dbUrl = process.env.ATLASDB_URL;

//session configurations---------------
//express session
const session=require("express-session");
const MongoStore = require('connect-mongo');

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24*3600,
});

store.on("error", (err)=>{
    console.log("Error in mongo session store", err);
});

const sessionOptions={
    store,
    secret: process.env.SECRET, 
    resave: false, 
    saveUninitialized: true, 
    //exploring cookie option for user convinience
    cookie: {
        //this cookie will expire after 7days which is written below in ms
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};



//passport configurations---------------
//local mongoose passport
const passport=require("passport");
const LocalStrategy=require("passport-local");

//importing the user model
const User=require("./models/user");


//---------------------------------------
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//importing async wrap
const wrapAsync=require("./utils/wrapAsync");
const ExpressError=require("./utils/ExpressError");


//Setting basic paths---------------

//for using ejs
app.set("view engine", "ejs");
app.set("ejs", path.join(__dirname, "views"));

//for using static files
app.use(express.static(path.join(__dirname, "/public/css")));
app.use(express.static(path.join(__dirname, "/public/js")));
app.use(express.static(path.join(__dirname, "/public/assets")));

//using method-override
app.use(methodOverride("_method"));

//using ejs mate for creting common templates for the website
app.engine("ejs", ejsMate);

//for parsing the request body of post method
app.use(express.json());
app.use(express.urlencoded({extended: true}));


//normal route
app.get("/", (req, res)=>{
    res.redirect("/listings");
});


//---------------------------------------------------------------------------------------------
//Creating the connection with database asynchronously---------------

//connecting with wanderlust database hosted on mongodb atlas


async function main() {
    await mongoose.connect(dbUrl);
    console.log("Connection with DB successful!");

    app.listen(port, ()=>{
        console.log(`Server is listening at port ${port}`);
    });
}

main().catch((err)=>{
    console.log("DB Connection Failed:", err);
});


//Middleware for using the flash messages defined in the routes
app.use((req, res, next)=>{
    res.locals.successMsg= req.flash("success");
    res.locals.errorMsg= req.flash("error");
    res.locals.currUser= req.user || null;
    next();
})



//-------------------------------------------------------------------------------------------------------------------------------------
//Creating different routes based on the functionalities----------------------------------------------------------


//1) requiring all the listing routes from the route folder
const listingRoutes=require("./routes/listing");

app.use("/listings", listingRoutes);



//-------------------------------------------------------------------------------------------------------------------------------------
//Creating different routes for handling reviews----------------------------------------------------------

//2) requiring all the listing routes from the route folder
const reviewRoutes=require("./routes/review");

app.use("/listings/:id/reviews", reviewRoutes);


//-------------------------------------------------------------------------------------------------------------------------------------
//Creating different routes for handling users----------------------------------------------------------

//3) requiring all the user routes from the route folder
const userRoutes=require("./routes/userRoutes");

app.use("/", userRoutes);



//-------------------------------------------------------------------------------------------------------------------------------------
//4) Creating different middlewares for error handling----------------------------------------------------------

app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next)=>{
    //deconstrsucting any error thrown to this middleware
    let {statusCode=500, message="something went wrong"}=err;
    res.status(statusCode).render("listings/error.ejs", {message, statusCode});
});