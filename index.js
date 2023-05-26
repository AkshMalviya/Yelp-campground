const express = require("express")
const path = require("path")
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require("ejs-mate")

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
//     next()
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
    const addCamp = new Campground(req.body)
    await addCamp.save()
    res.redirect(`/campgrounds/${addCamp._id}`)
})

app.put("/campgrounds/:id", async(req,res)=>{
    const { id } = req.params
    const update = await Campground.findByIdAndUpdate(id, {...req.body})
    res.redirect(`/campgrounds/${id}`)
})

app.get("/campgrounds/:id", async (req, res) => {
    const { id } = req.params
    const Camp = await Campground.findById(id)
    res.render('campground/show', { Camp })
})

app.delete("/campgrounds/:id/", async(req,res)=>{
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect("/campgrounds")
})
app.listen(3000, () => {
    console.log("listening on port 3000")
})