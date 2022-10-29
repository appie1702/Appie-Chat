const asyncHandler = require("express-async-handler");
const Noti = require("../models/notiModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

const addNoti = asyncHandler(async(req,res)=>{
    const {messID,userID} = req.body;
    if(!messID || !userID){
        console.log("Either message ID or User ID is not provided");
        return res.sendStatus(400);
    };
    console.log("1.",messID, userID);
    try{
        const noti = await Noti.find({user:userID});
        if(noti.length !== 0){
            const notif = await Noti.findByIdAndUpdate(
                noti[0]._id,
                {
                    $push: {messages: messID},
                },
                {new:true}
            ).populate({path:"messages",
                        populate: {
                        path: 'sender',
                        model: 'User'
                        },
                        options:{ sort: { 'updatedAt': -1 } }})
                        .sort({updatedAt: -1});
            console.log("2. in if", notif);
            res.json(notif);
        } else{
            var created_notif = await Noti.create({
                user: userID,
                messages:[messID]
            });
            const notif_new = await Noti.find({_id: created_notif._id})
                            .populate({path:"messages",
                                        populate: {
                                        path: 'sender',
                                        model: 'User'
                                        },
                                        options:{ sort: { 'updatedAt': -1 } }
                                    })
                                    .sort({updatedAt: -1});;
            console.log("3. in else", notif_new)
            res.json(notif_new);
        };
    } catch(error) {
        res.status(400);
        throw new Error(error.message);
    }
});


const fetchAllNoti = asyncHandler(async(req,res)=>{
    try{
    const notifications = await Noti.find({user:req.user._id})
    .populate({path:"messages",
                populate: {
                    path: 'sender',
                    model: 'User'
                    },
                    options:{ sort: { 'updatedAt': -1 } }})
                    .sort({updatedAt: -1});
    res.json(notifications);

}catch(error){
    res.status(400);
    throw new Error(error.message);
}
});


const markReadAll = asyncHandler(async(req,res)=>{
    const {userID} = req.body;
    if(!userID){
        console.log("User ID is not provided as params");
        return res.sendStatus(400);
    }

    try{
        const notifi = await Noti.findOne({user:userID});
        if(!notifi){
            return res.send({mess:"NO notifications for the user"});
        };
        await Noti.findByIdAndDelete(notifi._id).then((notifica)=>{
            if(!notifica){
                console.log("Some error occured");
                return res.sendStatus(404);
            }
            res.send({mess:"deleted noti"})
        })
        .catch((error)=>{
            res.status(400);
            throw new Error(error.message);
        })


        res.status(200).json({"message":"The document is deleted successfully"});
    }catch(error){
        res.status(400);
        throw new Error(error.message);
    };
});


const markReadOne = asyncHandler(async(req,res)=>{
    const {userID, messID} = req.body;
    if(!userID || !messID){
        console.log("userID or messID not provided");
        return res.sendStatus(400);
    }

    try{
        const noti = await Noti.find({user:userID});
        if(noti.length == 0){
            console.log("no notifications of this user");
            return res.sendStatus(400);
        };
        const full_noti = await Noti.findByIdAndUpdate(
            noti[0]._id,{
                $pull:{messages: messID},
            },
            {new:true}
        ).populate({path:"messages",
                        populate: {
                        path: 'sender',
                        model: 'User'
                        },
                        options:{ sort: { 'updatedAt': -1 } }
                    }).sort({updatedAt: -1});
        res.status(200).json(full_noti);

    }catch(error){
        res.status(404);
        throw new Error(error.message);
    }
});

module.exports = {addNoti,fetchAllNoti, markReadAll, markReadOne};

