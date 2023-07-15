const express = require("express")

const catchAsync = require("../utils/catchAsync")
const { isLoggedin , validatingReview , isReviewAuthor } = require("../utils/middleware")
const { createReview , deleteReview } = require("../controllers/reviews")

const router = express.Router({mergeParams : true})

router.post("/" , isLoggedin, validatingReview , catchAsync(createReview))
router.delete("/:reviewId", isLoggedin , isReviewAuthor , catchAsync(deleteReview))

module.exports = router