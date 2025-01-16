const express = require("express");
const router =  express.Router({ mergeParams : true});
const wrapAsync = require("C:/Users/tejas/OneDrive/文件/MAJORPROJECT/utils/wrapAsync.js") ;
const ExpressError = require("C:/Users/tejas/OneDrive/文件/MAJORPROJECT/utils/ExpressError") ;
const {listingSchema , reviewSchema} = require("C:/Users/tejas/OneDrive/文件/MAJORPROJECT/schema.js");
const Review = require("C:/Users/tejas/OneDrive/文件/MAJORPROJECT/models/review.js");
const Listing = require("C:/Users/tejas/OneDrive/文件/MAJORPROJECT/models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware");
const { createReview, deleteReview } = require("../controllers/reviews");




router.post("/",isLoggedIn, validateReview, wrapAsync(createReview));

//Delete Review Route
router.delete("/:reviewId" ,isLoggedIn, isReviewAuthor,wrapAsync(deleteReview))

module.exports = router;