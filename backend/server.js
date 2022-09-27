const express = require("express")
const { chats } = require("./data/data");
const dotenv = require('dotenv');
const { connect } = require("mongoose");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const app = express();
const { notfound, errorHandler } = require("./middleware/errorMiddleware") 
const messageRoutes = require("./routes/messageRoutes");
const path = require('path');
dotenv.config();
connectDB();

app.use(express.json()); //to accept json data from frontend



app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes);
app.use("/api/message", messageRoutes);



//-----------------------------Deployment---------------------//

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    console.log("--------------");
    res.send("API is running..");
  });
}


//--------------------------------deployment=====================//
const PORT = process.env.PORT || 5000

const server = app.listen(PORT, console.log(`Server Started on Port ${PORT}`.yellow.bold));

const io = require("socket.io")(server,{
    pingTimeout: 60000,
    cors:{
        origin: "http://localhost:3000",
    }
});



app.use(notfound);
app.use(errorHandler);

//note socket and socket room are different things 
//socket room is created by join function
//and socket is just endpoint to send and receieve
//data.


//setting up the connection with the client
io.on("connection", (socket) => {
    console.log("connected to socket.io");

    //creating a room with that particular user
    socket.on('setup',(userData)=>{
        console.log(userData._id);
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join room", (roomID) => {
        socket.join(roomID);
        console.log("User joined room:"+roomID);
    });


    socket.on('typing', (roomID) => socket.in(roomID).emit("typing"));
    socket.on('stoptyping', (roomID) => socket.in(roomID).emit("stoptyping"));


    socket.on("new message", (newMessageReceieved)=> {
        var chat = newMessageReceieved.chat;

        if(!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user)=>{
            if(user._id == newMessageReceieved.sender._id) return;
            //"in" function is user to send something to created socket room.
            socket.in(user._id).emit("message recieved", newMessageReceieved);
        });

    });

    socket.off("setup", ()=>{
        console.log("USER DISCONNECTED")
        socket.leave(userData._id);

    });
});

