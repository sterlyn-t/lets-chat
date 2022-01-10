import React from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box, Text } from '@chakra-ui/layout';
import { IconButton } from '@chakra-ui/button';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderObject } from '../config/ChatLogics';
import ProfileModal from './Authentication/miscellaneous/ProfileModal';
import UpdateGroupChatModal from './Authentication/miscellaneous/UpdateGroupChatModal';


const SingleChat = ({ fetchAgain, setFetchAgain }) => {

    const { user, selectedChat, setSelectedChat } = ChatState();

    return (
        <>
        {selectedChat ? (
           <>
           <Text 
           fontSize={{ base: "28px", md: "30px"}}
           pb={3}
           px={2}
           w="100%"
           d="flex"
           justifyContent={{ base: "space-between" }}
           alignItems="center"
           >
               <IconButton 
               d={{ base: "flex", md: "none"}}
               icon={<ArrowBackIcon/>}
               onClick={() => setSelectedChat("")}
               />
               {!selectedChat.isGroupChat ? (
                   <>
                       {getSender(user, selectedChat.users)}
                       <ProfileModal user={getSenderObject(user, selectedChat.users)}/>
                    </>
               ):(
                   <>
                   {selectedChat.chatName.toUpperCase()}
                    {<UpdateGroupChatModal 
                     fetchAgain={fetchAgain}
                     setFetchAgain={setFetchAgain} />
                    } 
                   </>
               )}
           </Text>
           <Box
            d="flex"
            p={3}
            flexDir="column"
            justifyContent="flex-end"
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
           >
               {/* Messages Here */}
           </Box>
           </> 
        ) : (
            <Box d="flex" alignItems="center" justifyContent="center" h="100%">
                <Text fontSize="3xl" pb={3}>
                    Click on a user to start chatting
                </Text>
            </Box>
        )}
        </>
    )
}

export default SingleChat
