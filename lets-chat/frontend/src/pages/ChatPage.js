// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { ChatState } from '../Context/ChatProvider';
// import { Box } from '@chakra-ui/layout';
// import SideDrawer from '../components/Authentication/miscellaneous/SideDrawer';
// import MyChats from '../components/Authentication/MyChats';
// import ChatBox from '../components/Authentication/ChatBox';

// const ChatPage = () => {

//     const {user} = ChatState();
//     return (
//         <div stlye={{ width: "100%"}}>   
//          {user && <SideDrawer />} 
//         <Box
//         justifyContent='space-between'
//         d='flex'
//         w='100%'
//         h='91.5vh'
//         p='10px'
//         >
//              {user && <MyChats />} 
//              {user && <ChatBox />} 
//         </Box>
//         </div>
//     )
// }

// export default ChatPage
import { Box } from "@chakra-ui/layout";
import { useState } from "react";
import ChatBox from "../components/Authentication/ChatBox";
import MyChats from "../components/Authentication/MyChats";
import SideDrawer from "../components/Authentication/miscellaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chatpage;