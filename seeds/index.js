const mongoose = require('mongoose')
const campground = require('../models/campground')
const cities = require('./cities')
const {places , descriptors} = require('./seedHelpers')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
    useNewUrlParser : true,
    useUnifiedTopology : true
    })      
const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error"))
db.once("open" , ()=>{
        console.log("connected successfully")
    })

const sample = array => array[Math.floor(Math.random() * array.length)]    

const seedDB = async() =>{
    await campground.deleteMany({})
    for (let i = 0; i < 50; i++) {
        const random = Math.floor(Math.random()*1000)
        const camp = new campground({
            location : `${cities[random].city}, ${cities[random].state}`,
            title : `${sample(descriptors)} ${sample(places)}`
        })
        camp.save()
    }
}
seedDB()
    .then(()=>{
        console.log("done")
    })