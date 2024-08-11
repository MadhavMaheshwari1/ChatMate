import express from 'express';
import { allMessages, sendMessage } from '../Controllers/messageControllers.js';
import { protect } from '../Middlewares/authMiddleWare.js';

const router = express.Router();

router.get('/:chatId', protect, allMessages);
router.post('/', protect, sendMessage);

export default router;
