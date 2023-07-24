const express = require("express")
const catchAsync = require("../utils/catchAsync")
const { isLoggedin , isAuthor , validateCamp} = require("../utils/middleware")
const { index, renderNewForm, fetchById, renderEditForm, createCamp, editCamp, deleteCamp } = require("../controllers/campgrounds")
const multer  = require('multer')
const { storage } = require("../utils/cloudinary")
const upload = multer({ storage })

const router = express.Router();

router.route("/")
    .get(catchAsync(index))
    .post(isLoggedin, upload.array("image"), validateCamp , catchAsync(createCamp))

router.get("/add", isLoggedin, renderNewForm)

router.route("/:id")
    .get(catchAsync(fetchById))
    .put(isLoggedin,isAuthor, upload.array("image"), validateCamp , catchAsync(editCamp))
    .delete(isLoggedin, isAuthor,   catchAsync(deleteCamp))

router.get("/:id/edit",isLoggedin,isAuthor,  catchAsync(renderEditForm))


module.exports = router