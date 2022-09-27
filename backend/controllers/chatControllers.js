const asyncHandler = require("express-async-handler");
const { populate, remove } = require("../models/chatModel");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const { use } = require("../routes/chatRoutes");

const accessChat = asyncHandler(async (req,res) => {
    const {userID} = req.body;
    if (!userID) {
        console.log("UserID param not sent with the request.")
        return res.sendStatus(400);
    }

    var isChat = await Chat.find({
        isGrpChat: false,
        $and: [
            {users: { $elemMatch: { $eq: req.user._id } } },
            {users: { $elemMatch: { $eq: userID } } },
        ],
    //populate converts refrence or foreign key "id" to actual details of referenced object of "id".
    }).populate("users", "-password")
        .populate("latestMessage");


    //populating sender field of latestMessage, so population is nested basically or applying reversing population.
    isChat = await User.populate(isChat, {
        path:'latestMessage.sender',
        select: 'name pic email',
    });

    if(isChat.length>0) {
        res.send(isChat[0]);
    } else {
        var chatData = {
            chatName: "sender",
            isGrpChat: false,
            users: [req.user._id, userID],
        };

        try {
            const createdChat = await Chat.create(chatData);

            const FullChat = await Chat.findOne({_id: createdChat._id}).populate("users", "-password");
            
            res.status(200).send(FullChat)
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }

});


const fetchChats = asyncHandler(async (req,res) => {
    try{
        chats = Chat.find({users: {$elemMatch: { $eq: req.user._id}}})
        .populate("users", "-password")
        .populate("grpAdmin","-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1})
        .then(async (result) => {
            result = await User.populate(result, {
            path:'latestMessage.sender',
        select: 'name pic email',
        });

        res.status(200).send(result)
        });

    }catch(error){
        res.status(401);
        throw new Error(error.message);
    }
});


const createGroupChat = asyncHandler(async (req,res) => {
    if (!req.body.users || !req.body.grpName) {
        return res.status(400).send({message: "Please fill all the fields"});
    };
    
    //we cannot send an array to backend, we send stringified array and then
    //in backend we have to parse it first before using it.
    var users = JSON.parse(req.body.users);
    console.log(users);
    if (users<2) {
        return res.status(400).send({message: "More than 2 users are required to form a group chat"});
    };
    
    users.push(req.user);

    try{
        const grpChat = await Chat.create({
            chatName: req.body.grpName,
            users: users,
            isGrpChat: true,
            grpAdmin: req.user,
        });

        const fullGroupChat = await Chat.findOne({_id: grpChat._id})
        .populate("users", "-password")
        .populate("grpAdmin", "-password");

        res.status(200).send(fullGroupChat);

    }catch(error) {
        res.status(400);
        throw new Error(error.message);
    }

});


const renameGrp = asyncHandler(async (req,res) => {
    const {chatID,chatName} = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(
        chatID,
        {
            chatName,
        },
        {
            new:true,
        }
    ).populate("users", "-password")
    .populate("grpAdmin", "-password");
    
    if(!updatedChat) {
        res.status(404);
        throw new Error("Chat Not found");
    } else{
        res.json(updatedChat);
    }
});


const addToGrp = asyncHandler(async(req,res) => {
    const { chatID, userID} = req.body;

    const added = await Chat.findByIdAndUpdate(
        chatID,
        {
            $push: {users: userID},
        },
        { new:true}
    ).populate("users", "-password")
    .populate("grpAdmin", "-password");


    if(!added){
        res.status(404);
        throw new Error("Chat Not found");
    } else{
        res.json(added);
    }
});

const removeFromGrp = asyncHandler(async(req,res) => {
    const { chatID, userID} = req.body;

    const removed = await Chat.findByIdAndUpdate(
        chatID,
        {
            $pull: {users: userID},
        },
        { new:true}
    ).populate("users", "-password")
    .populate("grpAdmin", "-password");


    if(!removed){
        res.status(404);
        throw new Error("Chat Not found");
    } else{
        res.json(removed);
    }
});


module.exports = {accessChat,fetchChats,createGroupChat,renameGrp,addToGrp, removeFromGrp};