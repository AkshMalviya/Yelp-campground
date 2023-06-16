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
        const price = Math.floor(Math.random()*20)+10        
        const camp = new campground({
            location : `${cities[random].city}, ${cities[random].state}`,
            title : `${sample(descriptors)} ${sample(places)}` ,
            image : "https://source.unsplash.com/random/?InTheWoods",
            description :  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati dolorem odio porro recusandae reiciendis cumque in magnam ipsam autem quo cupiditate sunt non fugit enim, ullam maxime dolor distinctio magni.",
            price : price
        })
        camp.save()
    }
}
seedDB()
    .then(()=>{
        console.log("done")
    })