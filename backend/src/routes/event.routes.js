const express = require("express");
const { getEventList, getEventId, createEvent, updateEvent, deleteEvent } = require("../controllers/event.controller");
const { profileMiddleware } = require("../middlewares/auth.middlewares");
const router = express.Router();

// router.get("/" , getEventList);

router.post("/", profileMiddleware, createEvent)

module.exports = router;