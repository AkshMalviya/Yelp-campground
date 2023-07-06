const express = require("express")
const catchAsync = require("../utils/catchAsync")
const Campground = require("../models/campground")
const AppError = require("../utils/AppError")
const { campSchema } = require("../joiSchema")

const router = express.Router();

router.get("/", catchAsync(async (req, res) => {
    const allCamps = await Campground.find({})
    res.render('campground/index', { allCamps })
}))

router.get("/add", (req, res) => {
    res.render('campground/newCamp')
})

router.get("/:id/edit", catchAsync(async(req, res ,next) => {
    const { id } = req.params
    const Camp = await Campground.findById(id)
    if ( !Camp ) {
        req.flash("error", "Cannot find that Camp")
        return res.redirect("/campgrounds")
    }
    res.render('campground/editCamp' , { Camp })
}))

const validateCamp = ( req, res, next )=>{
    const { error } = campSchema.validate(req.body)
    if ( error ){
        const msg = error.details.map( ele => ele.message).join(",")
        throw new AppError( msg , 400)
    }else{
        next()
    }
}
router.post("/", validateCamp , catchAsync(async (req, res , next) => {
    // if (!req.body) throw new AppError("Body Cannot be empty",400)
    const addCamp = new Campground(req.body.campground)
    await addCamp.save()
    req.flash("success", "Successfully made a new campground!")
    res.redirect(`/campgrounds/${addCamp._id}`)
}))

router.put("/:id", validateCamp , catchAsync(async(req,res,next)=>{
    const { id } = req.params
    const update = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    req.flash("success", "Successfully updated campground")
    res.redirect(`/campgrounds/${id}`)
}))

router.get("/:id", catchAsync(async (req, res , next) => { //adding next
    const { id } = req.params
    const Camp = await Campground.findById(id).populate('review')
    if ( !Camp ) {
        // throw new AppError("Camp not found", 404 ) 
        // we cannot do like this because it is async function instead we need to add next and then pass our error to it as:
        req.flash("error", "Cannot find that Camp")
        return res.redirect("/campgrounds")
    }
    res.render('campground/show', { Camp })
}))

router.delete("/:id/", catchAsync(async(req,res)=>{
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash("success", "Successfully deleted a Camp")
    res.redirect("/campgrounds")
}))


module.exports = router