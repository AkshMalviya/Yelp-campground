const express = require("express")
const passport = require("passport")

const catchAsync = require("../utils/catchAsync")
const { storeReturnTo } = require("../utils/middleware") 
const { renderRegisterForm, createUser , renderLoginForm , loginUser , logout } = require("../controllers/user")
const router = express.Router()


router.route('/register')
    .get(renderRegisterForm)
    .post(catchAsync(createUser))
router.route("/login")
    .get(renderLoginForm )
    .post(storeReturnTo, passport.authenticate("local", { failureFlash:true , failureRedirect:"/login" }), loginUser)
router.get("/logout", logout )

module.exports = router;