import expressAsyncHandler from 'express-async-handler';
import Chat from '../Models/ChatModel.js';

// Access a chat or create a new one
export const accessChat = expressAsyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log('UserId param not sent with the request!!');
    return res.status(400).json({ message: 'UserId param not sent with the request!!' });
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } }
    ]
  })
    .populate('users', '-password')
    .populate({
      path: 'latestMessage',
      populate: {
        path: 'sender',
        select: 'name pic email'
      }
    });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    const chatData = {
      chatName: 'sender', // Ensure this value is correctly provided
      isGroupChat: false,
      users: [req.user._id, userId]
    };

    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate('users', '-password');
      res.status(200).json(fullChat);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
});

// Fetch all chats for a user
export const fetchChats = expressAsyncHandler(async (req, res) => {
  try {
    const results = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate({
        path: 'users',
        select: '-password'
      })
      .populate({
        path: 'groupAdmin',
        select: '-password'
      })
      .populate({
        path: 'latestMessage',
        populate: {
          path: 'sender',
          select: 'name pic email'
        }
      })
      .sort({ updatedAt: -1 });
    res.status(200).json(results);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create a new group chat
export const createGroupChat = expressAsyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).json({ message: 'Please fill all the fields' });
  }

  const users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res.status(400).json({ message: 'More than 2 users are required to form a group chat' });
  }

  users.push(req.user._id);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users,
      isGroupChat: true,
      groupAdmin: req.user._id,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Rename a group chat
export const renameGroup = expressAsyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!updatedChat) {
      res.status(404).json({ message: 'Chat not found' });
    } else {
      res.json(updatedChat);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add a user to a group chat
export const addToGroup = expressAsyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    const added = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!added) {
      res.status(404).json({ message: 'Chat not found' });
    } else {
      res.json(added);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Remove a user from a group chat
export const removeFromGroup = expressAsyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!removed) {
      res.status(404).json({ message: 'Chat not found' });
    } else {
      res.json(removed);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
