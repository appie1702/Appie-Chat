import React, { useEffect } from 'react'
import { ChatState } from '../Context/chatprovider'
import { InputGroup, Box,FormControl,IconButton,Input,Spinner,Text, useToast, InputRightElement, Button, Tooltip } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender,getSenderFull } from '../Config/chatlogics';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGrpChatModal
 from './miscellaneous/UpdateGrpChatModal';
import { useState } from 'react';
import axios from 'axios';
import "./someStyles.css";
import ScrollabelChat from './ScrollabelChat';
import io from 'socket.io-client'
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import EmojiPicker from 'emoji-picker-react';


const ENDPOINT = "https://appie-chat.herokuapp.com/";

var socket,not_to_be_noti;

const SingleChat = ({fetchagain, setfetchagain}) => {
    const [messages,setMessages] = useState([]);
    const [loading,setloading] = useState(false);
    const [newMessage, setnewMessage] = useState("");
    const toast = useToast();
    const {user,selectedChat, setSelectedChat, notification, setnotification} = ChatState();
    const [socketconnected,setsocketConnected] = useState(false);
    const [show_emojis, set_show_emojis] = useState(false);
    
    //used when listening to socket("typing") or socket("stoptyping")
    //and displaying that loading icon.
    const [isTyping,setisTyping] = useState(false);
    
    //used when actually typing a message and emiting to 
    //socket("typing") or socket("stoptyping").
    //const [typing,settyping] = useState(false);


    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };



    const fetchMessages = async ()=> {
        if(!selectedChat) return;

        try{
            setloading(true);
            const config = {
                    headers:{
                        Authorization: `Bearer ${user.token}`
                    },
                };

                const {data} = await axios.get(`/api/message/${selectedChat._id}`,config);
                
                setMessages(data);
                setloading(false);
                socket.emit('join room', selectedChat._id)
        }catch(error){
            toast({
            title: "Error occured:(",
            description:"Failed to load Messages",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
            });
        };
    };

    //when fetching req from server, do apply async/await.
    const sendMessage = async (event)=>{
        if(event.key === "Enter" && newMessage){
            socket.emit("stoptyping", selectedChat._id);
            try {
                const config = {
                    headers:{
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    },
                };

                //wiping out the newMessage before making request to change ui instantly
                setnewMessage("");
                const {data} = await axios.post("/api/message",
                {
                    content: newMessage,
                    chatID: selectedChat._id,
                },
                config
                );
                socket.emit('new message', data);
                setMessages([...messages,data]);
            }catch(error) {
                toast({
                    title: "Error occured:(",
                    description:"Failed to send message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom-left",
                });
            }
        }
    };


    //if we want useEffect everytime our state updates, 
    // we must not use that empty array "[]" in the 
    //end of useEffect, otherwise it will only refreshes at first loading.

    //note: this useEffect should be above the last useEffect
    //where you are using socket, cause first we have to 
    //create a socket which is happening in this useEffect:)
    useEffect(()=>{
        socket = io(ENDPOINT);    
        socket.emit("setup", user);    
        socket.on("connected", ()=> setsocketConnected(true));
        socket.on("typing", ()=>setisTyping(true));
        socket.on("stoptyping", ()=> setisTyping(false));
    },[]);

    useEffect(()=>{
        fetchMessages();
        setnewMessage("");
        set_show_emojis(false);
        not_to_be_noti = selectedChat;
    },[selectedChat]);


//this useEffect should not contain "[]" as we want it to
//run everytime any state changes.
    useEffect(()=>{
        socket.on("message recieved",(newMessageReceieved) => {
            if(!not_to_be_noti || not_to_be_noti._id !== newMessageReceieved.chat._id){
                if(!notification.includes(newMessageReceieved)) {
                    setnotification([newMessageReceieved,...notification]);
                    //remember fetchagain is for fetching chats again not for messages.
                    //as when message is sent, chat is updated so the order of chats array 
                    //will be changed.
                    setfetchagain(!fetchagain);
                }
            } else {
                setMessages([...messages,newMessageReceieved]);
            }
        })
    });



    const typingHandler = async (e)=>{
        setnewMessage(e.target.value);
    };

    
    const handleEmojiClick = async(e)=>{
        console.log(e);
        setnewMessage(newMessage+e.emoji);
    };

    if (selectedChat){
        if (newMessage===""){
            socket.emit("stoptyping", selectedChat._id);
        }else{
            socket.emit("typing", selectedChat._id)
        };
    }

    return (
        <>
            {
                selectedChat ? (
                        <>
                            <Text
                                fontSize={{base:"28px", md:"30px"}}
                                pb={3}
                                px={2}
                                w="100%"
                                fontFamily="Work sans"
                                display="flex"
                                justifyContent={{base: "space-between"}}
                                alignItems="center"
                            >
                                <IconButton
                                    display={{base:"flex", md:"none"}}
                                    icon={<ArrowBackIcon/>}
                                    onClick={()=> setSelectedChat("")}
                                />
                                {!selectedChat.isGrpChat ? (
                                    <>
                                        {getSender(user,selectedChat.users)}
                                        <ProfileModal user={getSenderFull(user,selectedChat.users)}/>
                                    </>
                                ) : (
                                    <>
                                        {selectedChat.chatName.toUpperCase()}
                                        <UpdateGrpChatModal
                                            fetchagain={fetchagain}
                                            setfetchagain={setfetchagain}
                                            fetchMessages={fetchMessages}
                                        />
                                    </>
                                )}
                            </Text>
                            <Box
                                className='bg2_add'
                                display="flex"
                                flexDir="column"
                                justifyContent="flex-end"
                                p={3}
                                w="100%"
                                h="100%"
                                borderRadius="lg"
                                overflow="hidden"
                            >
                                

                                {loading ? (
                                    <Spinner
                                        thickness='5px'
                                        emptyColor='gray.300'
                                        color="teal.300"
                                        size="lg"
                                        w={20}
                                        h={20}
                                        alignSelf="center"
                                        margin="auto"

                                    />
                                ) : (
                                    <div className='messages' onClick={()=>set_show_emojis(false)}>
                                        <ScrollabelChat messages={messages}/>
                                    </div>
                                )}

                                {show_emojis && 
                                    <div class="dropdown-content">
                                        <EmojiPicker height={400} width={300} onEmojiClick={(e)=>handleEmojiClick(e)} suggestedEmojisMode="recent"/>
                                    </div>
                                }
                                <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                                    
                                    {isTyping?

                                        (<div><Lottie
                                            options={defaultOptions}
                                            width={70}
                                            style={{marginBottom:15, marginLeft:0}}
                                        /></div>) : 
                                        (<></>)
                                    }
                                    <InputGroup>
                                    <Input
                                        variant="outline"
                                        bg="#E0E0E0"
                                        placeholder='Enter a message'
                                        value={newMessage}
                                        onChange = {typingHandler}
                                    />
                                        <InputRightElement width={"1rem"} p={3} mr={4}>
                                            <Tooltip 
                                                color="white"
                                                label="Emojis"
                                                hasArrow
                                                placement='bottom-end'>
                                                    <i class='far fa-grin-beam' style={{fontSize:"24px"}} onClick={()=>set_show_emojis(!show_emojis)}></i>
                                            </Tooltip>
                                        </InputRightElement>
                                    </InputGroup>
                                    
                                </FormControl>

                            </Box>
                        </>
                ) : (
                    <Box className='bg3_add' display="flex" alignItems="center" justifyContent="center" w="100%" h="100%">
                        <Text fontSize="5xl" pb={3} fontFamily="Work sans" color="white">
                            <b>Click on the user to start chatting</b>
                        </Text>
                    </Box>
                )
            }

        </>
    );
}

export default SingleChat;