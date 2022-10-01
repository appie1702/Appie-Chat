import React, { useState } from 'react';
import { Spinner,FormControl, Input, useDisclosure, useToast } from '@chakra-ui/react';
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
} from '@chakra-ui/react';
import { ChatState } from '../../Context/chatprovider';
import axios from 'axios';
import UserListItem from '../../User Avatar/UserListItem';
import UserBadgeItem from '../../User Avatar/UserBadgeItem';


const GroupChatModal = ({children, fetchagain, setfetchagain}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [grpChatName, setGrpChatName] = useState(null);
    const[selectedUsers,setSelectedUsers] = useState([]);
    const [search,setsearch] = useState("");
    const [searchResult,setSearchResult] = useState([]);
    const [loading,setloading] = useState(false);

    const toast = useToast();
    console.log(setfetchagain);
    const {user, chats, setChats} = ChatState();

    const handleDelete = (deleteuser) => {
        setSelectedUsers(selectedUsers.filter((sel)=> sel._id !== deleteuser._id));
    };

    const handleGrp = (userToAdd) => {
        if(selectedUsers.includes(userToAdd)) {
            toast({
            title: "User already added to the Group",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
            });
            return;
        }
        setSelectedUsers([...selectedUsers,userToAdd]);
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


    const handleSubmit = async() => {
        if(!grpChatName || !selectedUsers) {
            toast({
            title: "Please fill all the fields",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
        });
        return;
        }

        try{
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            console.log(JSON.stringify(selectedUsers.map((u)=>u._id)));

            const {data} = await axios.post(`/api/chat/group`, {
                grpName:grpChatName,
                users: JSON.stringify(selectedUsers.map((u)=>u._id)),
            },config);

            setChats([data, ...chats]);
            setfetchagain(!fetchagain);
            onClose();
            toast({
                title: "New Group created!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }catch(error){
            toast({
            title: "Failed to create the Group",
            status: "error",
            description: error.message.value,
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
        });
        };

    };


    return (
        <>
        <span onClick={onOpen}>{children}</span>

        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader
                    fontSize="35px"
                    fontFamily="Work sans"
                    display="flex"
                    justifyContent="center"
                >
                    Create Group Chat
                </ModalHeader>
            <ModalCloseButton />
            <ModalBody display="flex" flexDir="column" alignItems="center">
                <FormControl>
                    <Input placeholder="Chat Name" mb={3} onChange={(e) => setGrpChatName(e.target.value)}/>
                </FormControl>
                <FormControl>
                    <Input placeholder="Add Users eg: John, Bob, Jane" mb={3} onChange={(e) => handleSearch(e.target.value)}/>
                </FormControl>
                <Box
                    w="100%"
                    display="flex"
                    flexWrap="wrap"
                >
                {selectedUsers.map((u) => (
                    <UserBadgeItem
                        key={u._id}
                        user={u}
                        handleFuntion={()=>handleDelete(u)}
                    />
                ))}
                </Box>

                {loading ? (<Spinner ml="auto" display="flex"/>):(
                    searchResult?.slice(0,4).map((user) => <UserListItem key={user._id} user={user} handleFunction={()=>handleGrp(user)}/>)
                )}

            </ModalBody>
            <ModalFooter>
                <Button colorScheme='teal' onClick={handleSubmit}>
                Create Group
                </Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
    </>
    );
};

export default GroupChatModal;