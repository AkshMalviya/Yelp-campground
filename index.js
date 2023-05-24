const express = require("express")
const path = require("path")
const mongoose = require('mongoose')

const Campground = require("./models/campground")

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
    useNewUrlParser : true,
    useUnifiedTopology : true
    })      
    .then(()=>{
        console.log("connected successfully")
    })
    .catch((err)=>{
        console.log("something error")
        console.log(err)
    })
const app = express()

app.set("view engine", 'ejs')
app.set("views" , path.join(__dirname , 'views'))
app.get("/" , (req, res)=>{
    res.render('home')
})

app.get("/campgrounds", async(req,res)=>{
    const allCamps  =  await Campground.find({})
    res.render('campground/index', {allCamps})
})
app.get("/campgrounds/:id", async(req,res)=>{
    const { id } = req.params
    const Camp  =  await Campground.findById(id)
    res.render('campground/show', {Camp})
})
app.get("campgrounds/new", (req,res)=>{
    res.render('campground/newCamp')
})
app.post("campgroundNew", async(req,res)=>{
    const addCamp = new Campground(req.body)
    await addCamp.save()
    res.redirect(`campground/${req.body._id}`)
})
app.listen(3000, ()=>{
    console.log("listening on port 3000")
})