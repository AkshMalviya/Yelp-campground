const express = require("express")
const passport = require("passport")

const catchAsync = require("../utils/catchAsync")
const { storeReturnTo } = require("../utils/middleware") 
const { renderRegisterForm, createUser , renderLoginForm , loginUser , logout } = require("../controllers/user")
const router = express.Router()

router.get("/register", renderRegisterForm)
router.post("/register", catchAsync(createUser))
router.get("/login", renderLoginForm )
router.post("/login", storeReturnTo, passport.authenticate("local", { failureFlash:true , failureRedirect:"/login" }), loginUser)
router.get("/logout", logout )

module.exports = router;