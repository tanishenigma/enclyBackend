const express = require("express");
const router = express.Router();
const clickController = require("../controllers/clickController");
const verifyToken = require("../middleware/authMiddleware");

router.get("/", verifyToken, clickController.getClicks);
router.get("/:urlId", verifyToken, clickController.getClicksForUrl);
router.post("/:shortUrl", clickController.storeClick); // Public endpoint for tracking

module.exports = router;
