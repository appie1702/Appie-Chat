import React from 'react'
import { ChatState } from '../Context/chatprovider';
import { Box } from '@chakra-ui/react';
import SingleChat from './SingleChat';

const Chatbox = ({fetchagain, setfetchagain}) => {

  const {selectedChat} = ChatState();

  return (
    <Box
      display={{base: selectedChat ? "flex":"none", md:"flex"}}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{base:"100%", md:"68%"}}
      borderRadius="lg"
      borderWidth="1px"
      color="black"
    >
      <SingleChat fetchagain={fetchagain} setfetchagain={setfetchagain}/>
    </Box>
  )
}

export default Chatbox;