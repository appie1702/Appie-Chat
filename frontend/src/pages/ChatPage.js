import { ChatState } from "../Context/chatprovider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import Chatbox from "../components/Chatbox";
import { useState } from "react";

const ChatPage = () => {
    const { user } = ChatState();
    const [fetchagain, setfetchagain] = useState(false);

    return <div style={{width: "100%"}}>
        {user && <SideDrawer/>}
        <Box
            display="flex"
            justifyContent='space-between'
            width="100%"
            h="91.5vh"
            p="10px"
        >
            {user && <MyChats fetchagain={fetchagain} setfetchagain={setfetchagain}/>}
            {user && <Chatbox fetchagain={fetchagain} setfetchagain={setfetchagain}/>}
        </Box>
    </div>
};

export default ChatPage;