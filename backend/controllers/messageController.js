const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");



const sendMessage = asyncHandler(async(req,res)=>{

    const {content,chatID} = req.body;

    if (!content || !chatID){
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    var newMessage = {
        sender:req.user._id,
        content:content,
        chat:chatID,
    };


    try{
        //execpopulate is necesssary when populate is not used directly with create,find,etc query.
        var message = await Message.create(newMessage);
        message = await message.populate("sender", "name pic").execPopulate();
        message = await message.populate("chat").execPopulate();
        message = await User.populate(message,{
            path:"chat.users",
            select: "name pic email",
        });

        await Chat.findByIdAndUpdate(req.body.chatID, {
            latestMessage: message,
        });

        res.json(message);

    }catch(error) {
        res.status(400);
        throw new Error(error.message);
    }

});


const allMessages = asyncHandler(async (req,res)=> {
try{
    const messages = await Message.find({chat:req.params.chatID})
    .populate("sender", "name pic email")
    .populate("chat");

    res.json(messages);

}catch(error){
    res.status(400);
        throw new Error(error.message);
}
});

module.exports = {sendMessage, allMessages};