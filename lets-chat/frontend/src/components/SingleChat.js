import React, { useState, useEffect } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box, Text } from '@chakra-ui/layout';
import { IconButton } from '@chakra-ui/button';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderObject } from '../config/ChatLogics';
import ProfileModal from './Authentication/miscellaneous/ProfileModal';
import UpdateGroupChatModal from './Authentication/miscellaneous/UpdateGroupChatModal';
import { Spinner, Input, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { FormControl } from '@chakra-ui/form-control';
import './styles.css';
import ScrollableChat from './ScrollableChat';


const SingleChat = ({ fetchAgain, setFetchAgain }) => {

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState();
    const { user, selectedChat, setSelectedChat } = ChatState();

    const toast = useToast();

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
            };
            setLoading(true);
            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
            console.log(messages);
            setMessages(data);
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to load the messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
        }
    }

    useEffect(() => {
        fetchMessages();
    }, [selectedChat]);

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
         // socket.emit("stop typing", selectedChat._id);
          try {
            const config = {
              headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
            };
            setNewMessage("");
            const { data } = await axios.post(
              "/api/message",
              {
                content: newMessage,
                chatId: selectedChat,
              },
              config
            );
           // socket.emit("new message", data);
            setMessages([...messages, data]);
          } catch (error) {
              console.log("frontend error")
            toast({
              title: "Error Occured!",
              description: "Failed to send the Message",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
          }
        }
      };
    const typingHandler = (e) => {
        setNewMessage(e.target.value);
    }

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
                     setFetchAgain={setFetchAgain}
                     fetchMessages={fetchMessages} />
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
               {loading ? (
                   <Spinner 
                    size="xl"
                    w={20}
                    h={20}
                    alignSelf="center"
                    margin="auto"
                   />
               ) : (
                    <div className="messages">
                        <ScrollableChat messages={messages}/> 
                    </div>
               )}

               <FormControl onKeyDown={sendMessage}  isRequired mt={3}>
                <Input 
                    variant="filled"
                    bg="#E0E0E0"
                    placeholder="Enter a message"
                    onChange={typingHandler}
                    value={newMessage}
                />
               </FormControl>
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
