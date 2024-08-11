const express = require('express');
const router = express.Router();
const { registerUser } = require("../Controllers/userController");
const { authUser ,getAllUsers} = require("../Controllers/userController");
const {protect} = require("../Middlwares/authMiddleWare");

router.route('/').post(registerUser).get(protect,getAllUsers);
router.post('/login', authUser);

module.exports = router;
