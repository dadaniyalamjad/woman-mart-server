const express = require("express");
const router = new express.Router();
const categoryController = require("../controller/categoryController")

/* Category Api's */
router.post("/api/new-category", categoryController.categoryCreate)
router.get("/api/category", categoryController.getCategory)
router.patch("/api/update-category/:id", categoryController.updateCategory);
router.patch("/api/delete-category/:id", categoryController.categoryDelete);
/* Category Api's */
module.exports = router