const express = require("express");
const router = express.Router();
const urlController = require("../controllers/urlController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/", verifyToken, urlController.createShortUrl);
router.get("/", verifyToken, urlController.getUserUrls);
router.delete("/:id", verifyToken, urlController.deleteUrl);
router.get("/:id", verifyToken, urlController.getLongUrl);

module.exports = router;
