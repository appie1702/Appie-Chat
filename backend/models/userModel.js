const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const expressAsyncHandler = require('express-async-handler');

const userSchema = mongoose.Schema({
    name: { type: String, required:true },
    email: {type: String, required:true, unique:true},
    password: {type: String, required:true},
    pic: { 
        type: String, 
        default:
            "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
        },
    },

    { timestamps:true, }
 
    );


//same as how you used to give methods in django models
userSchema.methods.matchPassword = async function(entered_pass){
    return await bcrypt.compare(entered_pass,this.password);
}

//some middleware type of function
//next is basically passing the req to next middleware
userSchema.pre('save', async function (next) {
    if (!this.isModified) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt)
})


const User = mongoose.model("User", userSchema);
module.exports = User;