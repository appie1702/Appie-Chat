import React from 'react'
import { ChatState } from '../Context/chatprovider';
import { Box } from '@chakra-ui/react';
import SingleChat from './SingleChat';
import "./someStyles.css"
const Chatbox = ({fetchagain, setfetchagain}) => {

  const {selectedChat} = ChatState();

  return (
    <Box
      className='overlay2'
      display={{base: selectedChat ? "flex":"none", md:"flex"}}
      alignItems="center"
      flexDir="column"
      p={3}
      w={{base:"100%", md:"68%"}}
      borderRadius="lg"
      color="black"
    >
      <SingleChat fetchagain={fetchagain} setfetchagain={setfetchagain}/>
    </Box>
  )
}

export default Chatbox;