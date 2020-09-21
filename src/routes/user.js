const express = require("express")
const router = new express.Router()
const userController = require("../controller/userController")
const auth = require('../middleware/auth')

router.post("/api/new-user", userController.userCreate)
router.post("/api/login", userController.userLogin);
router.post("/api/logout", auth, userController.userLogout);
router.post("/api/all-devices/logout", auth, userController.userLogoutAllDevices);

router.patch("/api/update-user/:id", auth, userController.userUpdate);
router.patch("/api/delete-user/:id", auth, userController.userDelete);

router.get("/api/me/:id", auth, userController.userProfile);
router.get("/api/users", auth, userController.getAllUser);

router.post("/api/email", auth, userController.messageCreate);

module.exports = router