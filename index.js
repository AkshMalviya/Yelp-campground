// if (process.env.NODE_ENV !== "production"){
//     require("dotenv").config()
// }
require("dotenv").config()
const express = require("express")
const path = require("path")
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require("ejs-mate")
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const helmet = require("helmet")
const mongoSanitize = require("express-mongo-sanitize")
const mongoDbStore = require("connect-mongo")(session)

const AppError = require("./utils/AppError")
const userRoute = require("./routes/user")
const reviewRoutes = require("./routes/reviews")
const campgroundRoutes = require("./routes/campgrounds")
const User = require("./models/user")

const mongoUrl = 'mongodb://127.0.0.1:27017/yelp-camp'
// mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
//     .then(() => {
//         console.log("connected successfully")
//     })
//     .catch((err) => {
//         console.log("something error")
//         console.log(err)
//     })
mongoose.connect( mongoUrl ,{ useNewUrlParser: true, useUnifiedTopology: true })
    .then((e) => {
    console.log("Connected Successfully")
})
const app = express()

app.engine('ejs', ejsMate) 
app.set("view engine", 'ejs')
app.set("views", path.join(__dirname, 'views'))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname , "public")))
app.use(mongoSanitize())

const mongoStore = new mongoDbStore({
    url:mongoUrl,
    secret:"ThisIsAVerySecret!",
    touchAfter: 24*60*60
})
mongoStore.on('error', (e)=>{
    console.log("error in mongostore", e)
})
const sessionConfig = {
    store: mongoStore,
    name: "sessionMongo",
    secret: "ThisIsAVerySecret!",
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        // secure : true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge : 1000*60*60*24*7
    }
}
app.use(session(sessionConfig))
app.use(flash())
app.use( helmet({ contentSecurityPolicy:false, }) )
// passport configuration for authentication
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate())) // in this we are telling passport to use model User and function authenticate which we don't create which is prebuilt by passport-local-mongoose
passport.serializeUser(User.serializeUser()) //this help in creating the session 
passport.deserializeUser(User.deserializeUser())  // this help destroying session

app.use((req,res,next)=>{
    res.locals.success = req.flash('success')
    res.locals.error = req.flash("error")
    res.locals.currentUser = req.user
    next()
})



app.get("/", (req, res) => {
    res.render('home')
})

app.use('/campgrounds', campgroundRoutes)
app.use("/campgrounds/:id/reviews" , reviewRoutes)
app.use(userRoute)
app.all("*", (req,res,next)=>{
    next(new AppError("Page not found" , 400))
})

app.use((err ,req,res,next)=>{
    const { status= 500 } = err
    if (!err.message) { err.message = "Something went wrong!!!"}
    res.status(status).render("error", { err })
}) // this is custom error handler which can handle error from all routes if thrown at time of running
// but this cannot handle async request and they need to be defined at end
app.listen(3000, () => {
    console.log("listening on port 3000")
})
