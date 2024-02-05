const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");
const {isOwner} = require("../middleware.js");
const {validateListing} = require("../middleware.js");



//Index Route

router.get("/", async (req,res) => {
    const allListings =  await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
});

//New Route

router.get("/new",isLoggedIn, (req ,res) => {
        res.render("listings/new.ejs");
    
});


//Show Route 

router.get("/:id", async  (req,res) => {
    let {id} = req.params;
     const listing = await Listing.findById(id).populate("reviews").populate("owner");
     if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
     }
     console.log(listing);
    res.render("listings/show.ejs",{listing});

});

//Create Route
router.post("/", isLoggedIn, validateListing,
     wrapAsync(async (req,res,next) => {
    
        // let{title,description,image,price,country,location} = req.body;
    const newListing = new Listing (req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New listing created!");
    res.redirect("/listings");
        
    }
));

//Edit Route
router.get("/:id/edit", isLoggedIn,  isOwner, wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
        return;
     }
    res.render("listings/edit.ejs",{listing});
}));

//Update Route
router.put("/:id",isLoggedIn, isOwner, validateListing ,wrapAsync(async (req,res) => {
    let {id} = req.params;
     await Listing.findByIdAndUpdate(id, {...req.body.listing});
     req.flash("success","Listing updated!");
     res.redirect(`/listings/${id}`);
}));

//Delete Route

router.delete("/:id",isLoggedIn, isOwner,  wrapAsync(async (req,res ) => {
    let {id} = req.params;
    let deletedListing =  await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing deleted!");
    res.redirect("/listings");
}));

module.exports = router;
