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
app.get("/makeCamp" , async(req, res)=>{
    const camp = new Campground({title:"My home" , price:"56" , description:"less cheap"})
    await camp.save()
    res.send(camp)
})
app.listen(3000, ()=>{
    console.log("listening on port 3000")
})