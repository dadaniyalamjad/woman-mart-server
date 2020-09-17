const express = require("express");
const router = new express.Router();
const categoryController = require("../controller/categoryController")

router.post("/api/new-category", categoryController.categoryCreate)
router.get("/api/category", categoryController.getCategory)
router.patch("/api/update-category/:id", categoryController.updateCategory);
router.patch("/api/update-delete/:id", categoryController.categoryDelete);

module.exports = router