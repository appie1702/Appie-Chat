import React, { useState } from 'react'
import { FormControl, FormErrorIcon, IconButton, Input, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { ChatState } from '../../Context/chatprovider';
import UserBadgeItem from '../../User Avatar/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../../User Avatar/UserListItem';


const UpdateGrpChatModal = ({fetchagain,setfetchagain,fetchMessages}) => {
    const {isOpen,onOpen,onClose} = useDisclosure();
    const [grpChatName,setGrpChatName] = useState();
    const [search,setsearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading,setloading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);

    const { selectedChat, setSelectedChat, user} = ChatState();
    const toast = useToast();

    
    const handleRename = async ()=>{
        if(!grpChatName) return;

        try{
            setRenameLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
            };

            const {data} = await axios.put(
                "/api/chat/rename",
                {
                    chatID:selectedChat._id,
                    chatName: grpChatName,
                },
                config
            );
            setSelectedChat(data);
            setfetchagain(!fetchagain);
            setRenameLoading(false);

        }catch(error){
            toast({
            title: "Failed to rename Group's name",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
        });
        setRenameLoading(false);
        };
        setGrpChatName("");
    };
    

    const handleSearch = async (query) => {
        setsearch(query);
        if(!query){
            return;
        }

        try{
            setloading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
            };

            const {data} = await axios.get(`/api/user?search=${search}`, config);
            console.log(data);
            setloading(false);
            setSearchResult(data);

        }catch(error){
            toast({
            title: "Error occured:(",
            description:"Failed to Search Results",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
        });
        setloading(false);
        };
    };

    const handleAddUser = async (user1)=>{
        if(selectedChat.users.find((u)=>u._id===user1._id)) {
            toast({
            title: "User Already in Group",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
        });
        return;
        };

        if(selectedChat.grpAdmin._id !== user._id) {
            toast({
            title: "Only admins can add people in this Group!",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
        });
        return;
        };

        try{
            setloading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            };
            const {data} = await axios.put("api/chat/groupadd", {
                chatID:selectedChat._id,
                userID: user1._id,
            }, config);

            setSelectedChat(data);
            setfetchagain(!fetchagain);
            setloading(false);


        }catch(error){
            toast({
            title: "Error Occured!",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
        });
        setloading(false);
        };
        setGrpChatName("");
    };
    const handleRemove = async (user1)=>{
        //if i am not the grp admin and i am removing some other person, error will be given
        //otherwise req will be made
        console.log(user1);
        if(selectedChat.grpAdmin._id !== user._id && user1._id !== user._id){
            toast({
            title: "Only admins can add people in this Group!",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
        });
        return;
        };

        try{
            setloading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            };
            const {data} = await axios.put("api/chat/groupremove", {
                userID: user1._id,
                chatID: selectedChat._id,
            }, config);

            user1._id === user._id ? setSelectedChat():setSelectedChat(data);
            setfetchagain(!fetchagain);
            fetchMessages();
            setloading(false);
            
        }catch(error){
            toast({
            title: "Error Occured!",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
        });
        setloading(false);
        };
        
        setGrpChatName("");
    };


  return (
    <>
      <IconButton display={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen}>Open Modal</IconButton>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                {selectedChat.users.map((u)=>(
                    <UserBadgeItem
                        key={u._id}
                        user={u}
                        admin={selectedChat.grpAdmin}
                        handleFuntion={()=>handleRemove(u)}                  
                    />
                ))}
            </Box>
            <FormControl display="flex">
                <Input placeholder="Chat Name" mb={3} onChange={(e) => setGrpChatName(e.target.value)}/>
                <Button 
                    variant="solid"
                    colorScheme="teal"
                    ml={1}
                    isLoading={renameLoading}
                    onClick={handleRename}
                >
                    Update
                </Button>
            </FormControl>

            <FormControl>
                <Input placeholder="Add Users to Group" mb={1} onChange={(e) => handleSearch(e.target.value)}/>
            </FormControl>
            
            {loading ? (<Spinner ml="auto" display="flex"/>):(
                    searchResult?.slice(0,4).map((u) => <UserListItem key={u._id} user={u} handleFunction={()=>handleAddUser(u)}/>)
            )}

          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={()=>handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGrpChatModal;