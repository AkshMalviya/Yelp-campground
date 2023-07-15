const express = require("express")
const Campground = require("../models/campground")
const catchAsync = require("../utils/catchAsync")
const Review = require("../models/review")

const router = express.Router({mergeParams : true})
const { isLoggedin , validatingReview , isReviewAuthor } = require("../utils/middleware")

router.post("/" , isLoggedin, validatingReview , catchAsync(async(req,res, next)=>{
    const { id } = req.params
    const camp = await Campground.findById(id)
    const review =  new Review(req.body.review)
    review.author = req.user._id
    camp.review.push(review)
    await review.save()
    await camp.save()
    req.flash("success", "Created a new Review")
    res.redirect(`/campgrounds/${camp._id}`)
}))

router.delete("/:reviewId", isLoggedin , isReviewAuthor , catchAsync(async(req,res)=>{
    const { id , reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: {review : reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash("success", "Successfully deleted a review")
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router