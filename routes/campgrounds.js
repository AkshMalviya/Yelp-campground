const express = require("express")
const catchAsync = require("../utils/catchAsync")
const { isLoggedin , isAuthor , validateCamp} = require("../utils/middleware")
const { index, renderNewForm, fetchById, renderEditForm, createCamp, editCamp, deleteCamp } = require("../controllers/campgrounds")

const router = express.Router();

router.get("/", catchAsync(index))
router.get("/add", isLoggedin, renderNewForm)
router.get("/:id", catchAsync(fetchById))
router.get("/:id/edit",isLoggedin,isAuthor,  catchAsync(renderEditForm))
router.post("/", isLoggedin,  validateCamp , catchAsync(createCamp))
router.put("/:id",isLoggedin,isAuthor, validateCamp , catchAsync(editCamp))
router.delete("/:id/", isLoggedin, isAuthor,   catchAsync(deleteCamp))

module.exports = router