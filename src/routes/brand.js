const express = require("express")
const router = new express.Router()
const brandController = require("../controller/brandController")

router.post("/api/new-brand", brandController.brandCreate)
router.get("/api/brand", brandController.getBrand)
router.patch("/api/update-brand/:id", brandController.updateBrand);
router.patch("/api/delete-brand/:id", brandController.deleteBrand);

module.exports = router