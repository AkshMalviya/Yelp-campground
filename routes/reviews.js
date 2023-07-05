const express = require("express")
const { reviewSchema } = require("../joiSchema")
const Campground = require("../models/campground")
const catchAsync = require("../utils/catchAsync")
const Review = require("../models/review")
const AppError = require("../utils/AppError")
const router = express.Router({mergeParams : true})

const validatingReview = (req, res, next)=>{
    const { error } = reviewSchema.validate(req.body)
    if ( error ){
        const msg = error.details.map( ele => ele.message).join(",")
        throw new AppError( msg , 400)
    }else{
        next()
    }
}
router.post("/" ,validatingReview , catchAsync(async(req,res, next)=>{
    const { id } = req.params
    const camp = await Campground.findById(id)
    const review =  new Review(req.body.review)
    camp.review.push(review)
    await review.save()
    await camp.save()
    res.redirect(`/campgrounds/${camp._id}`)
}))

router.delete("/:reviewId", catchAsync(async(req,res)=>{
    const { id , reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: {review : reviewId}})
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router