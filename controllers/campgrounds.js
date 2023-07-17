const Campground = require("../models/campground")

module.exports.index = async (req, res) => {
    const allCamps = await Campground.find({})
    res.render('campground/index', { allCamps })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campground/new')
}

module.exports.fetchById = async (req, res , next) => { //adding next
    const { id } = req.params
    const Camp = await Campground.findById(id).populate({
        path :'review',
        populate : {
            path : "author"
        }
    }).populate("author")
    if ( !Camp ) {
        // throw new AppError("Camp not found", 404 ) 
        // we cannot do like this because it is async function instead we need to add next and then pass our error to it as:
        req.flash("error", "Cannot find that Camp")
        return res.redirect("/campgrounds")
    }
    res.render('campground/show', { Camp })
}

module.exports.renderEditForm = async(req, res ,next) => {
    const { id } = req.params
    const Camp = await Campground.findById(id)
    if ( !Camp ) {
        req.flash("error", "Cannot find that Camp")
        return res.redirect("/campgrounds")
    }
    res.render('campground/edit' , { Camp })
}

module.exports.createCamp = async (req, res , next) => {
    // if (!req.body) throw new AppError("Body Cannot be empty",400)
    const addCamp = new Campground(req.body.campground)
    addCamp.images = req.files.map(ele => ({url:ele.path , filename: ele.filename}))
    addCamp.author = req.user._id
    await addCamp.save()
    console.log(addCamp)
    req.flash("success", "Successfully made a new campground!")
    res.redirect(`/campgrounds/${addCamp._id}`)
}

module.exports.editCamp = async(req,res,next)=>{
    const { id } = req.params
    const update = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    req.flash("success", "Successfully updated campground")
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCamp = async(req,res)=>{
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash("success", "Successfully deleted a Camp")
    res.redirect("/campgrounds")
}