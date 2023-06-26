const mongoose = require('mongoose')
const review = require('./review')
const Schema = mongoose.Schema
const CampgroundSchema = new Schema({
    title:String,
    image : String,
    price: Number,
    description: String,
    location:String,
    review : [{
            type: Schema.Types.ObjectId,
            ref:"Review"
        }]
})

CampgroundSchema.post("findOneAndDelete" , async(doc)=>{
    if (doc){
        const del = await review.deleteMany({ _id : {$in : doc.review} })
        console.log(del)
    }
})

module.exports = mongoose.model('Campground' , CampgroundSchema)