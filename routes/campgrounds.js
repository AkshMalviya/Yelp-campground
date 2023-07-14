const express = require("express")
const catchAsync = require("../utils/catchAsync")
const Campground = require("../models/campground")
const { isLoggedin , isAuthor , validateCamp} = require("../utils/middleware")

const router = express.Router();

router.get("/", catchAsync(async (req, res) => {
    const allCamps = await Campground.find({})
    res.render('campground/index', { allCamps })
}))

router.get("/add", isLoggedin, (req, res) => {
    res.render('campground/new')
})

router.get("/:id", catchAsync(async (req, res , next) => { //adding next
    const { id } = req.params
    const Camp = await Campground.findById(id).populate('review').populate("author")
    if ( !Camp ) {
        // throw new AppError("Camp not found", 404 ) 
        // we cannot do like this because it is async function instead we need to add next and then pass our error to it as:
        req.flash("error", "Cannot find that Camp")
        return res.redirect("/campgrounds")
    }
    res.render('campground/show', { Camp })
}))

router.get("/:id/edit",isLoggedin,isAuthor,  catchAsync(async(req, res ,next) => {
    const { id } = req.params
    const Camp = await Campground.findById(id)
    if ( !Camp ) {
        req.flash("error", "Cannot find that Camp")
        return res.redirect("/campgrounds")
    }
    res.render('campground/edit' , { Camp })
}))

router.post("/", isLoggedin,  validateCamp , catchAsync(async (req, res , next) => {
    // if (!req.body) throw new AppError("Body Cannot be empty",400)
    const addCamp = new Campground(req.body.campground)
    addCamp.author = req.user._id
    await addCamp.save()
    req.flash("success", "Successfully made a new campground!")
    res.redirect(`/campgrounds/${addCamp._id}`)
}))

router.put("/:id",isLoggedin,isAuthor, validateCamp , catchAsync(async(req,res,next)=>{
    const { id } = req.params
    const update = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    req.flash("success", "Successfully updated campground")
    res.redirect(`/campgrounds/${id}`)
}))

router.delete("/:id/", isLoggedin, isAuthor,   catchAsync(async(req,res)=>{
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash("success", "Successfully deleted a Camp")
    res.redirect("/campgrounds")
}))


module.exports = router