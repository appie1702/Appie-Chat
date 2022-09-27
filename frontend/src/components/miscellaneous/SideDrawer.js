import React, { useEffect, useState } from 'react'
import { useToast,Text, Box, Button, Tooltip, Menu, MenuButton, Avatar, MenuItem, MenuDivider, MenuList, Drawer, useDisclosure, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Input, Toast, Spinner } from "@chakra-ui/react"
import {BellIcon, ChevronDownIcon} from "@chakra-ui/icons"
import { ChatState } from '../../Context/chatprovider';
import ProfileModal from './ProfileModal';
import { useHistory } from 'react-router-dom';
//import { set } from 'mongoose';
import axios from 'axios';
import Chatloading from './Chatloading';
import UserListItem from '../../User Avatar/UserListItem';
import NotificationBadge, { Effect } from 'react-notification-badge';

const SideDrawer = () => {
  const [search,setsearch] = useState("");
  const [searchResult, setsearchResult] = useState([]);
  const [loading,setloading] = useState(false);
  const [loadingChat,setloadingChat] = useState(false);

  const{ user, setuser, selectedChat, setSelectedChat, chats, setChats, notification, setnotification } = ChatState();
  const history = useHistory();
  const {isOpen,onOpen,onClose} = useDisclosure();
  const toast = useToast();



  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    setuser(null);
    setSelectedChat(null);
    setChats([]);
    toast({
        title: "Successfully Logged Out!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    history.push('/');
  }


  const accessChat = async (userId) => {
    setloadingChat(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
    };
    
    const {data} = await axios.post("/api/chat", {userID: userId}, config);

    //if created or accessed chat is not in our chats already, then we have
    //to append it in chats.
    if (!chats.find((c)=> c._id===data._id)) setChats([data, ...chats]);

    setSelectedChat(data);
    setloadingChat(false);
    onClose();

  }catch(error) {
    toast({
        title: "Error fetching the chat(",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    };
  }



  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Search field is empty:(",
          status: "warning",
          duration: 2000,
          isClosable: true,
          position: "top-left",
      });
      return;
    }

    try{
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const {data} = await axios.get(`/api/user?search=${search}`, config);
      setloading(false);
      setsearchResult(data);

    }catch(error){
      toast({
        title: "Error occured:(",
        description:"Failed to load the search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
  }

  return (
    <>
    <Box 
      display="flex"
      justifyContent='space-between'
      width="100%"
      bg = "white"
      p="5px 10px 5px 10px"
      borderWidth="2px"
      borderRadius="7px"
    >
      <Tooltip 
      color="white"
      label="Search Users to chat" 
      hasArrow
      placement='bottom-end'>
        <Button color="black" variant="ghost" onClick={onOpen}>
          <i class="fas fa-search" aria-hidden="true"></i>
          <Text display={{base:"none", md:"flex"}} px="4">
            Search User
          </Text>
        </Button>
      </Tooltip>

      <Text as='b' color="black" fontSize="2xl" fontFamily="Work sans">
        Appie Chat
      </Text>

      <div>
        <Menu>
          <MenuButton p={1}>
            <NotificationBadge
              count={notification.length}
              effect={Effect.SCALE}
            />
            <BellIcon color="black" fontSize="2xl" m={1}/>
          </MenuButton>
          <MenuList alignContent="center" justifyContent="center" color="black">
            {console.log(notification+"------------------")}
            {!notification.length && <MenuItem>No New Message</MenuItem>}
            {notification.map((notif) => (
              <MenuItem key={notif._id} onClick={()=>{
                setSelectedChat(notif.chat);
                setnotification(notification.filter((n)=>n !== notif))
              }}>
                {notif.chat.isGrpChat ? 
                `${notif.sender.name} sent a message in ${notif.chat.chatName}`
                : `New Message from ${notif.sender.name}`}
              </MenuItem>
            ))}
          </MenuList>

        </Menu>

        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon color='black' />}>
            <Avatar size="sm" cursor='pointer' name={user.name} src={user.pic}></Avatar>
          </MenuButton>
          <MenuList color="black">
            <ProfileModal user={user}>
              <MenuItem>My Profile</MenuItem>
            </ProfileModal>
              <MenuDivider />
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
          </MenuList>
        </Menu>

      </div>
    </Box>

    <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay/>
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Chat with Your Friends!</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input 
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setsearch(e.target.value)}
              />
              <Button onClick={handleSearch}>
                Search
              </Button>
            </Box>
            {loading ? <Chatloading/>: 
            (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={()=> accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex"/> }
          </DrawerBody>

        </DrawerContent>
    </Drawer>


    </>
  );
};

export default SideDrawer;