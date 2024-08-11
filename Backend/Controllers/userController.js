const expressAsyncHandler = require('express-async-handler');
const User = require('../Models/UserModel');
const generateToken = require('../Config/generateToken');

// Register user
const registerUser = expressAsyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const newUser = await User.create({ name, email, password, pic });

        // Generate token
        const token = generateToken(newUser);

        // Respond with token and user data
        if (newUser.pic === null) {
            newUser.pic = 'https://www.elevenforum.com/attachments/images-jpeg-2-jpg.45643/';
        }

        res.status(201).json({
            token,
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                pic: newUser.pic
            }
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Authenticate user
const authUser = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Validate password
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user);
        // Respond with token and user data
        res.status(200).json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                pic: user.pic
            }
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

const getAllUsers = expressAsyncHandler(async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
        ],
    } : {};
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    const filteredUsers = users.map(user => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic // Include pic if needed
    }));

    res.json(filteredUsers);
    console.log(filteredUsers);
});

module.exports = { registerUser, authUser, getAllUsers };
