const mongoose = require('mongoose')
const review = require('./review')
const opts = { toJSON: { virtuals : true}}
const Schema = mongoose.Schema

const ImageSchema = new Schema({
    url: String,
    filename : String
})
ImageSchema.virtual("thumbnail").get(function (){
    return this.url.replace("/upload" , '/upload/w_200')
})
const CampgroundSchema = new Schema({
    title:String,
    images : [ImageSchema],
    geometry: {
        type: {
        type: String,
        enum: ['Point'],
        required: true
        },
        coordinates:{
            type:[Number],
            require:true
        }
    },
    price: Number,
    description: String,
    location:String,
    author : { 
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    review : [{
            type: Schema.Types.ObjectId,
            ref:"Review"
        }]
}, opts)

CampgroundSchema.virtual("properties.popUpMarkup").get(function(){
    return `<strong><a href='/campgrounds/${this._id}'>${this.title}</a></strong>`
})

CampgroundSchema.post("findOneAndDelete" , async(doc)=>{
    if (doc){
        const del = await review.deleteMany({ _id : {$in : doc.review} })
        console.log(del)
    }
})

module.exports = mongoose.model('Campground' , CampgroundSchema)