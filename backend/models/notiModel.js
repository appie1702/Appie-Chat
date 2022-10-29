const mongoose = require("mongoose");

const notiModel = mongoose.Schema({
    messages:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    }],
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
},
{
    timestamps: true,
},

);

const Noti = mongoose.model("Noti", notiModel);
module.exports = Noti;