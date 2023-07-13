module.exports.isLoggedin = (req,res,next)=>{
    if (!req.isAuthenticated()){
        req.flash("error", "You must be Logged in!")
        return res.redirect("/login")
    }
    next()
}