const express = require("express");
const {register, getUser, login} = require("../controllers/auth.controllers")
const router = express.Router();

router.post("/register", register);
router.get("/users", getUser);
router.post("/login", login);

module.exports = router;