const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");
const {isOwner} = require("../middleware.js");
const {validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");

//Index Route

router.get("/", wrapAsync(listingController.index));

//New Route

router.get("/new",isLoggedIn,listingController.renderNewForm);


//Show Route 

router.get("/:id",  wrapAsync(listingController.showListing));

//Create Route
router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));

//Edit Route
router.get("/:id/edit", isLoggedIn,  isOwner, wrapAsync(listingController.editListing));

//Update Route
router.put("/:id",isLoggedIn, isOwner, validateListing ,wrapAsync(listingController.updateListing));

//Delete Route

router.delete("/:id",isLoggedIn, isOwner,  wrapAsync(listingController.deleteListing));

module.exports = router;
