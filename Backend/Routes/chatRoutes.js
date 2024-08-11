import express from 'express';
// import { protect } from '../Middlewares/authMiddleWare.js';
import {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup
} from '../Controllers/chatController.js';

const router = express.Router();

// router.post('/', protect, accessChat);
// router.get('/', protect, fetchChats);
// router.post('/group', protect, createGroupChat);
// router.put('/rename', protect, renameGroup);
// router.put('/addToGroup', protect, addToGroup);
// router.put('/removeFromGroup', protect, removeFromGroup);
router.post('/', accessChat);
router.get('/', fetchChats);
router.post('/group', createGroupChat);
router.put('/rename', renameGroup);
router.put('/addToGroup', addToGroup);
router.put('/removeFromGroup', removeFromGroup);

export default router;
