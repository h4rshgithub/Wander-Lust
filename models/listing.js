const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema ({
    title : {
        type : String,
        required:true,
    },
    description : String,
    image : {
        type : String,
        default : "https://images.unsplash.com/photo-1695068545577-60fc2d9768f2?auto=format&fit=crop&q=80&w=1462&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set : ( v ) => v===""? "https://images.unsplash.com/photo-1695068545577-60fc2d9768f2?auto=format&fit=crop&q=80&w=1462&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
    }, 
    price : Number,
    location : String,
    country : String
});

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;
