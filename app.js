const express = require('express');
const mongoose = require('mongoose');
const app = express();
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const listings = require('./routes/listing.js');
const reviews = require("./routes/review.js");

//Calling main function 
main().then(() => {
    console.log("connected to DB ");
}).catch(err => {
    console.log(err);
});

//Creating a database 
async function main () {
    await mongoose.connect(MONGO_URL);
}
//ejs templating

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
//Creating a API
app.get("/", (req,res) => {
    res.send("Hi , I am root");

});
//Restructuirng listings 
app.use("/listings",listings);
//Restructuring reviews
app.use("/listings/:id/reviews" ,reviews);

app.all("*", (req ,res , next) => {
    next(new ExpressError(404, "Page not found!"));
});

app.use((err, req,res,next) => {
    let {statusCode = 500 , message ="Something went wrong"}= err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
});

app.listen( 8080 , () => {
    console.log("server is listening to port 8080");
});