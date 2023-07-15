const User = require("../models/user")

module.exports.renderRegisterForm = (req,res)=>{
    res.render("Auth/register")
}

module.exports.createUser = async(req,res)=>{
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
}

module.exports.renderLoginForm =  (req,res)=>{
    res.render("Auth/login")
}

module.exports.loginUser = (req,res)=>{
    const returnTo = res.locals.returnTo || "/campgrounds"
    req.flash("success", "Welcome back!")
    res.redirect(returnTo)
}

module.exports.logout = (req,res)=>{
    req.logout(function (err) {
        if (err) {
            return new next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}