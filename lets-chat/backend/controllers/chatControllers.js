const expressAsyncHandler = require("express-async-handler");
const { chats } = require("../data/data");
const Chat = require('../Models/chatModel');
const User = require("../Models/userModel");

const accessChat = expressAsyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        console.log("UserId param not sent with the request");
        return res.sendStatus(400);
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            {users: {$elemMatch: {$eq:req.user._id}}},
            {users: {$elemMatch: {$eq: userId}}}
        ]
    }).populate("users", "-password")
      .populate("latestMessage");

      isChat = await User.populate(isChat, {
          path: 'latestMessage.sender',
          select: 'name pic email',
      });

      if (isChat.length > 0) {
          res.send(isChat[0]);
      } else {
          // Create new chat
          var chatData = {
              chatName: "sender",
              isGroupChat: false,
              users: [req.user._id, userId],
          };

          try {
              const createdChat = await Chat.create(chatData);
              const fullChat = await Chat.findOne({_id: createdChat._id}).populate("users", "-password");
              res.status(200).json(fullChat);
          } catch (error) {
              res.status(400);
              throw new Error(error.message);
          }
      }
});

const fetchChats = expressAsyncHandler(async(req, res) => {
    try {
        Chat.find({users: {$elemMatch: {$eq: req.user._id}}})
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then( async(results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name pic email"
                });
                res.status(200).send(results);
            });
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }

});

const createGroupChat = expressAsyncHandler(async(req, res) => {

    if (!req.body.users || !req.body.name) {
        return res.status(400).send({message: "Please fill all fields"});
    }

    var users = JSON.parse(req.body.users);

    // Group chat must have more than 2 users
    if (users.length < 2){
        return res.status(400).send("More than 2 users are required to form a group chat");
    }

    users.push(req.user);
    // Fetching groupchat from db and sending to user
    try {
        // Group admin is the user who sends request
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });

        const fullGroupChat = await Chat.findOne({
            _id: groupChat._id
        })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
        
        res.status(200).json(fullGroupChat);

    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }

});

const renameGroup = expressAsyncHandler(async(req, res) => {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName,
        },
        {
            new: true,
        }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    if (!updatedChat) {
        res.status(404);
        throw new Error("Chat not found");
    }
    else {
        res.json(updatedChat);
    }
});

const addToGroup = expressAsyncHandler(async(req, res) => {
    const { chatId, userId } = req.body;

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: {users: userId },
        },
        {
            new: true
        }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    if (!added) {
        res.status(404);
        throw new Error("Chat not found");
    } else {
        res.json(added);
    }
});

const removeFromGroup = expressAsyncHandler(async(req, res) => {

    const { chatId, userId } = req.body;

    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: {users: userId },
        },
        {
            new: true
        }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    if (!removed) {
        res.status(404);
        throw new Error("Chat not found");
    } else {
        res.json(removed);
    }
    
});


module.exports = { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup };