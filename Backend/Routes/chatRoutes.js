import express from 'express';
import { protect } from '../Middlwares/authMiddleWare.js';
import {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup
} from '../Controllers/chatController.js';

const router = express.Router();

router.post('/', protect, accessChat);
router.get('/', protect, fetchChats);
router.post('/group', protect, createGroupChat);
router.put('/rename', protect, renameGroup);
router.put('/addToGroup', protect, addToGroup);
router.put('/removeFromGroup', protect, removeFromGroup);

export default router;
