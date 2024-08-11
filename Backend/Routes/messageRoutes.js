const express = require("express");
const {protect} = require('./Middlwares/AuthMiddleware.js');
const {
    allMessages,
    sendMessage,
} = require("../Controllers/messageControllers");

const router = express.Router();

router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);

module.exports = router;