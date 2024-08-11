const express = require("express");
const {
    allMessages,
    sendMessage,
} = require("/Backend/Controllers/messageControllers");
const { protect } = require("/Backend/Middlwares/AuthMiddleware");

const router = express.Router();

router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);

module.exports = router;