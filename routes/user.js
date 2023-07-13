const express = require("express")
const passport = require("passport")

const catchAsync = require("../utils/catchAsync")
const User = require("../models/user")
const router = express.Router()

router.get("/register",(req,res)=>{
    res.render("Auth/register")
})

router.post("/register", catchAsync(async(req,res)=>{
    try{
    const { email, username , password } = req.body
    const user = new User ({ email:email , username:username })
    const userwithPwd = await User.register(user , password)
    await user.save()
    console.log(userwithPwd)
    req.flash("success", "Welcome to YelpCamp")
    res.redirect('/campgrounds')
    }
    catch(e){
        req.flash("error" , e.message)
        res.redirect('/register')
    }
}))

router.get("/login", (req,res)=>{
    res.render("Auth/login")
})
router.post("/login", passport.authenticate("local", { failureFlash:true , failureRedirect:"/login" }) ,(req,res)=>{
    req.flash("success", "Welcome back!")
    res.redirect("/campgrounds")
})
module.exports = router;