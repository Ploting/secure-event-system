const express = require("express");
const router = express.Router();
const {register, getUser, login, getProfile} = require("../controllers/auth.controllers")
const { profileMiddleware } = require("../middlewares/auth.middlewares");

router.post("/register", register);
router.get("/users", getUser);
router.post("/login", login);
router.get("/profile", profileMiddleware, getProfile)

module.exports = router;