const express = require("express")
const passport = require("passport")

const catchAsync = require("../utils/catchAsync")
const User = require("../models/user")
const { storeReturnTo } = require("../utils/middleware") 
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
    req.login(userwithPwd , err=>{
        if (err) return next(err)
        req.flash("success", "Welcome to YelpCamp")
        res.redirect('/campgrounds')
    })
    }
    catch(e){
        req.flash("error" , e.message)
        res.redirect('/register')
    }
}))

router.get("/login", (req,res)=>{
    res.render("Auth/login")
})
router.post("/login", storeReturnTo, passport.authenticate("local", { failureFlash:true , failureRedirect:"/login" }) ,(req,res)=>{
    const returnTo = res.locals.returnTo || "/campgrounds"
    console.log(res.locals , req.session)
    req.flash("success", "Welcome back!")
    res.redirect(returnTo)
})

router.get("/logout" , (req,res)=>{
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
})
module.exports = router;