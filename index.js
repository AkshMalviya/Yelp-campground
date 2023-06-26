const express = require("express")
const path = require("path")
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require("ejs-mate")

const AppError = require("./utils/AppError")
const Campground = require("./models/campground")
const { campSchema, reviewSchema } = require("./joiSchema")
const catchAsync = require("./utils/catchAsync")
const Review = require("./models/review")


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("connected successfully")
    })
    .catch((err) => {
        console.log("something error")
        console.log(err)
    })
const app = express()

app.engine('ejs', ejsMate) 
app.set("view engine", 'ejs')
app.set("views", path.join(__dirname, 'views'))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
// app.use((req,res,next)=>{
//     console.log(req.path)
//     next()      // these are kind of middleware which can be used to run security for specfic or all request
// })

app.get("/", (req, res) => {
    res.render('home')
})

app.get("/campgrounds", catchAsync(async (req, res) => {
    const allCamps = await Campground.find({})
    res.render('campground/index', { allCamps })
}))

app.get("/campgrounds/add", (req, res) => {
    res.render('campground/newCamp')
})

app.get("/campgrounds/:id/edit", catchAsync(async(req, res ,next) => {
    const { id } = req.params
    const Camp = await Campground.findById(id)
    if ( !Camp ) {
        next( new AppError("Camp not found", 404 ))
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
app.post("/campground", validateCamp , catchAsync(async (req, res , next) => {
    // if (!req.body) throw new AppError("Body Cannot be empty",400)
    const addCamp = new Campground(req.body.campground)
    await addCamp.save()
    res.redirect(`/campgrounds/${addCamp._id}`)
}))

app.put("/campgrounds/:id", validateCamp , catchAsync(async(req,res,next)=>{
    const { id } = req.params
    const update = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    res.redirect(`/campgrounds/${id}`)
}))

app.get("/campgrounds/:id", catchAsync(async (req, res , next) => { //adding next
    const { id } = req.params
    const Camp = await Campground.findById(id).populate('review')
    if ( !Camp ) {
        // throw new AppError("Camp not found", 404 ) 
        // we cannot do like this because it is async function instead we need to add next and then pass our error to it as:
        next(new AppError("Camp not found", 404 ))
    }
    res.render('campground/show', { Camp })
}))

app.delete("/campgrounds/:id/", catchAsync(async(req,res)=>{
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect("/campgrounds")
}))

const validatingReview = (req, res, next)=>{
    const { error } = reviewSchema.validate(req.body)
    if ( error ){
        const msg = error.details.map( ele => ele.message).join(",")
        throw new AppError( msg , 400)
    }else{
        next()
    }
}
app.post("/campgroundS/:id/reviews" ,validatingReview , catchAsync(async(req,res, next)=>{
    const { id } = req.params
    const camp = await Campground.findById(id)
    const review =  new Review(req.body.review)
    camp.review.push(review)
    await review.save()
    await camp.save()
    res.redirect(`/campgrounds/${camp._id}`)
}))

app.delete("/campgrounds/:id/review/:reviewId", catchAsync(async(req,res)=>{
    const { id , reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: {review : reviewId}})
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/campgrounds/${id}`)
}))

app.all("*", (req,res,next)=>{
    next(new AppError("Page not found" , 400))
})

app.use((err ,req,res,next)=>{
    const { status= 500 } = err
    if (!err.message) { err.message = "Something went wrong!!!"}
    res.status(status).render("error", { err })
}) // this is custom error handler which can handle error from all routes if thrown at time of running
// but this cannot handle async request and they need to be defined at end
app.listen(3000, () => {
    console.log("listening on port 3000")
})