import { Avatar, Tooltip } from '@chakra-ui/react';
import React from 'react'
import ScrollableFeed from "react-scrollable-feed";
import { isLastMessage, SameSenderMargin, isSameUser, showAvatar } from '../Config/chatlogics';
import { ChatState } from '../Context/chatprovider';

const ScrollabelChat = ({messages}) => {
  const {user} = ChatState();


  return (
    <ScrollableFeed>
    {messages && messages.map((m,i)=>(
      <div style={{display:"flex"}} key={m._id}>
        {
          (showAvatar(messages,m,i,user._id)
          || isLastMessage(messages,i,user._id)
          ) && (
            <Tooltip
              label={m.sender.name}
              placement="bottom-start"
              hasArrow
            >
              <Avatar
                mt="7px"
                mr={1}
                size="sm"
                cursor="pointer"
                name={m.sender.name}
                src={m.sender.pic}              
              />
            </Tooltip>
          )
        }

        <span
          style={{
            backgroundColor:`${

              (!m.sender || m.sender._id === user._id) ? "#BEE3F8" : "rgba(174, 239, 187, 0.8)"
            }`,
            borderRadius:"20px",
            padding:"5px 15px",
            maxWidth:"75%",
            marginLeft: SameSenderMargin(messages,m,i,user._id),
            marginTop: isSameUser(messages,m,i,user._id) ? 3:10,
          }}
        >
          {m.content}
        </span>
      </div>
    ))}
    </ScrollableFeed>
  )
  
}

export default ScrollabelChat;