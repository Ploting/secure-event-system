const express = require("express");
const {profileMiddleware} = require("../middlewares/auth.middlewares");
const {adminMiddleware} = require("../middlewares/admin.middlewares");
const { getAllUsers } = require("../controllers/admin.controller")
const router = express.Router();

router.get( "/users" , profileMiddleware, adminMiddleware, getAllUsers );

module.exports = router;