const express = require("express");
const router =  express.Router({ mergeParams : true});
const wrapAsync = require("../utils/wrapAsync") ;
const ExpressError = require("../utils/ExpressError") ;
const {listingSchema , reviewSchema} = require("../schema");
const Review = require("../models/review");
const Listing = require("../models/listing");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware");
const { createReview, deleteReview } = require("../controllers/reviews");




router.post("/",isLoggedIn, validateReview, wrapAsync(createReview));

//Delete Review Route
router.delete("/:reviewId" ,isLoggedIn, isReviewAuthor,wrapAsync(deleteReview))

module.exports = router;