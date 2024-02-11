if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require('express');
const mongoose = require('mongoose');
const app = express();



const dbUrl =process.env.ATLASDB_URL;

const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require('./routes/listing.js');
const reviewRouter = require("./routes/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");


//Calling main function 
main().then(() => {
    console.log("connected to DB ");
}).catch(err => {
    console.log(err);
});

//Creating a database 
async function main () {
    await mongoose.connect(dbUrl);
}
//ejs templating

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto: {
        secret : process.env.SECRET,
    },
    touchAfter : 24 *3600,
    
});
store.on("error",() => {
    console.log("ERROR in mongo session store",err);
});

const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7*24*60 *60*1000,
        maxAge :  7*24*60 *60*1000,
        httpOnly : true,
    }, 
    
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    
    next();
});

//demo useer
// app.get("/demouser", async (req , res ) => {
//     let fakeUser = new User({
//         email :"student@gmail.com",
//         username :"Harsh"
//     });
//     let registerdUser=  await User.register(fakeUser, "helloworld");
//     res.send(registerdUser);
// });


//Restructuirng listings 
app.use("/listings",listingRouter);
//Restructuring reviews
app.use("/listings/:id/reviews" ,reviewRouter);
app.use("/",userRouter);

app.all("*", (req ,res , next) => {
    next(new ExpressError(404, "Page not found!"));
});

app.use((err, req,res,next) => {
    let {statusCode = 500 , message ="Something went wrong"}= err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
});

app.listen(  8080 , () => {
    console.log("server is listening to port 8080");
});