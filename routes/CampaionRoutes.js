const express = require("express");
const router = express.Router();
const {
  submitForm,
  getForms,
  getFormByEvent,
  deleteForm,
} = require("../controllers/CampaionController");

router.post("/submit", submitForm);
router.get("/", getForms);
router.get("/event/:eventName", getFormByEvent);
router.delete("/:id", deleteForm);

module.exports = router;
