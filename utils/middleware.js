const Campground = require("../models/campground")
const { campSchema , reviewSchema } =require("../utils/joiSchema")
const AppError = require("../utils/AppError")


module.exports.isLoggedin = (req,res,next)=>{
    if (!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash("error", "You must be Logged in!")
        return res.redirect("/login")
    }
    next()
}
module.exports.storeReturnTo = (req, res, next)=>{
    if(req.session.returnTo){
        res.locals.returnTo = req.session.returnTo
    }
    next()
}

module.exports.isAuthor = async(req,res,next)=>{
    const { id } = req.params
    const camp = await Campground.findById(id)
    if(!camp.author.equals(req.user._id)){
        req.flash("error", "You Don't have permission to do")
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}
module.exports.validateCamp = ( req, res, next )=>{
    const { error } = campSchema.validate(req.body)
    if ( error ){
        const msg = error.details.map( ele => ele.message).join(",")
        throw new AppError( msg , 400)
    }else{
        next()
    }
}

module.exports.validatingReview = (req, res, next)=>{
    const { error } = reviewSchema.validate(req.body)
    if ( error ){
        const msg = error.details.map( ele => ele.message).join(",")
        throw new AppError( msg , 400)
    }else{
        next()
    }
}