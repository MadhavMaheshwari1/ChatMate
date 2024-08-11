import express from 'express';
import { registerUser, authUser, getAllUsers } from '../Controllers/userController.js';
import { protect } from '../Middlwares/authMiddleWare.js';

const router = express.Router();

router.post('/', registerUser);
router.get('/', protect, getAllUsers);
router.post('/login', authUser);

export default router;
