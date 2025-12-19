const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const controller = require("../controllers/eventController");

const app = express();

router.post("/", upload.single("image"), controller.createEvent);
router.get("/", controller.getEvents);
router.get("/:id", controller.getEventById);
router.put("/:id", upload.single("image"), controller.updateEvent);
router.delete("/:id", controller.deleteEvent);

module.exports = router;
