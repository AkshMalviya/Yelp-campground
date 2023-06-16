const express = require("express")
const path = require("path")
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require("ejs-mate")

const AppError = require("./AppError")
const Campground = require("./models/campground")


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

app.get("/campgrounds", async (req, res) => {
    const allCamps = await Campground.find({})
    res.render('campground/index', { allCamps })
})

app.get("/campgrounds/add", (req, res) => {
    res.render('campground/newCamp')
})

app.get("/campgrounds/:id/edit", async(req, res) => {
    const { id } = req.params
    const Camp = await Campground.findById(id)
    res.render('campground/editCamp' , { Camp })
})

app.post("/campground", async (req, res) => {
    const addCamp = new Campground(req.body.campground)
    await addCamp.save()
    res.redirect(`/campgrounds/${addCamp._id}`)
})

app.put("/campgrounds/:id", async(req,res)=>{
    const { id } = req.params
    const update = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    res.redirect(`/campgrounds/${id}`)
})

app.get("/campgrounds/:id", async (req, res , next) => { //adding next 
    const { id } = req.params
    const Camp = await Campground.findById(id)
    res.send(Camp)
    if ( !Camp ) {
        // throw new AppError("Camp not found", 404 ) 
        // we cannot do like this because it is async function instead we need to add next and then pass our error to it as:
        return next(new AppError("Camp not found", 404 ))
    }
    res.render('campground/show', { Camp })
    console.log(Camp)
})

app.delete("/campgrounds/:id/", async(req,res)=>{
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect("/campgrounds")
})

app.get("/secret" , (req,res)=>{
    throw new AppError("Your are not admin",401)
})

app.use((err ,req,res,next)=>{
    const { status= 500 , message = "Something Went Wrong"} = err
    console.log("Errorrrrr!!!!!!!111")
    res.status(status).send(message)
}) // this is custom error handler which can handle error from all routes if thrown at time of running
// but this cannot handle async request and they need to be defined at end
app.listen(3000, () => {
    console.log("listening on port 3000")
})