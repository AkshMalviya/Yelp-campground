const Campground = require("../models/campground")
const Review = require("../models/review")

module.exports.createReview = async(req,res, next)=>{
    const { id } = req.params
    const camp = await Campground.findById(id)
    const review =  new Review(req.body.review)
    review.author = req.user._id
    camp.review.push(review)
    await review.save()
    await camp.save()
    req.flash("success", "Created a new Review")
    res.redirect(`/campgrounds/${camp._id}`)
}

module.exports.deleteReview = async(req,res)=>{
    const { id , reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: {review : reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash("success", "Successfully deleted a review")
    res.redirect(`/campgrounds/${id}`)
}