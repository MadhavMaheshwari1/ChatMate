const express = require('express');
const router = express.Router();
const { protect } = require('../Middlwares/authMiddleWare');
const { accessChat, fetchChats,createGroupChat,renameGroup,addToGroup,removeFromGroup} = require('../Controllers/chatController');

router.route('/').post(protect, accessChat);
router.route('/').get(protect,fetchChats);
router.route('/group').post(protect,createGroupChat);
router.route('/rename').put(protect,renameGroup);
router.route('/addToGroup').put(protect,addToGroup);
router.route('/removeFromGroup').put(protect,removeFromGroup);

module.exports = router;