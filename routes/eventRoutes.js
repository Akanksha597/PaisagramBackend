const express = require("express");
const router = express.Router();
const {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  getEvent
} = require("../controllers/eventController");

router.post("/create", createEvent);
router.get("/", getEvents);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);
router.get("/:id", getEvent);

module.exports = router;
