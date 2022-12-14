import {React,useEffect,useState} from 'react'
import { Text,Box, Button, Stack, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { ChatState } from '../Context/chatprovider';
import { AddIcon } from '@chakra-ui/icons';
import { getSender } from '../Config/chatlogics';
import Chatloading from './miscellaneous/Chatloading';
import GroupChatModal from './miscellaneous/GroupChatModal';
import "./someStyles.css"
const MyChats = ({fetchagain, setfetchagain}) => {
  const toast = useToast();
  const [loggedUser, setLoggedUser] = useState(null);
  const{ user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const fetchChats = async () => {
    try{
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const {data} = await axios.get("api/chat", config);
      setChats(data);
    }catch(error){
      toast({
        title: "Error occured:(",
        description:"Failed to load Chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
  };

  useEffect(()=>{
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  },[fetchagain,user]);


  return (
    <Box
      color="white"
      display={{base: selectedChat ? "none":"flex", md: "flex"}}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="blackAlpha.300"
      backdropFilter="revert" 
      backdropBlur="6px"
      w={{base: "100%", md: "31%"}}
      borderRadius="lg"
    >
      <Box 
        color="white"
        pb={3}
        px={3}
        fontSize={{base:"28px", md:"30px"}}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        {console.log(chats)}
        <GroupChatModal fetchagain={fetchagain} setfetchagain={setfetchagain}>
          <Button
            colorScheme="teal"
            display="flex"
            fontSize={{base: "17px", md: "10px", lg:"17px"}}
            rightIcon={<AddIcon/>}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        className='bg4_add'
        display="flex"
        flexDir="column"
        p={3}
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats.length !== 0 ? (
          <Stack overflowY="scroll">
            {chats.map((chat)=> (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC":"#E8E8E8"}
                color={selectedChat === chat ? "white":"black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {loggedUser && !chat.isGrpChat? (
                    getSender(loggedUser.data, chat.users)
                  ) : (chat.chatName)}
                  
                </Text>
                {chat.latestMessage && 
                <Text fontSize="xs">
                  <b>{ chat.isGrpChat && chat.latestMessage.sender.name + ":"} </b>
                  {chat.latestMessage.content.length > 50
                  ? chat.latestMessage.content.substring(0,51) + "..."
                  : chat.latestMessage.content}
                </Text>
                }
              </Box>
            ))}
          </Stack>
        ) : (
          <Box display="flex" alignItems="center" justifyContent="center" w="100%" h="100%" borderRadius="lg">
              <Text fontSize="2xl" pb={4} fontFamily="Work sans" color="white">
                  <b>Search Your Friends or Guests</b>
              </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MyChats;