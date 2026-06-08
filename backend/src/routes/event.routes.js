const express = require("express");
const { getEventList, getEventId, createEvent, updateEvent, deleteEvent } = require("../controllers/event.controller");
const { profileMiddleware } = require("../middlewares/auth.middlewares");
const router = express.Router();

router.get("/" ,profileMiddleware, getEventList);
router.get("/{:id}", profileMiddleware, getEventId);
router.post("/", profileMiddleware, createEvent);
router.put("/{:id}", profileMiddleware, updateEvent);
router.delete("/{:id}", profileMiddleware, deleteEvent);

module.exports = router;