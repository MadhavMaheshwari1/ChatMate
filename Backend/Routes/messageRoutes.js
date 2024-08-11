const express = require("express");
const {
    allMessages,
    sendMessage,
} = require("../Controllers/messageControllers");
const { protect } = require("../Middlwares/authMiddleWare");

const router = express.Router();

router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);

module.exports = router;