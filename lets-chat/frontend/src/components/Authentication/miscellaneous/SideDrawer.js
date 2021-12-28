import React, { useState } from 'react';
import { Box } from '@chakra-ui/layout';
import { Tooltip, Button, Text, Menu, MenuButton, MenuList, MenuItem, MenuDivider, Drawer, DrawerOverlay, DrawerHeader, DrawerContent, DrawerBody, Input, useToast } from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Avatar } from '@chakra-ui/avatar';
import { ChatState } from '../../../Context/ChatProvider';
import { useHistory } from 'react-router';
import ProfileModal from './ProfileModal';
import ChatLoading from '../ChatLoading';
import { useDisclosure } from '@chakra-ui/hooks';
import axios from 'axios';
import UserListItem from '../../UserAvatar/UserListItem';
import { Spinner } from '@chakra-ui/spinner';


const SideDrawer = () => {

    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();
    const { user, setSelectedChat, chats, setChats } = ChatState();
    const history = useHistory();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const logOutHandler = () => {
        localStorage.removeItem("userInfo");
        history.push("/");
    };

    // const handleSearch = async () => {
    //     if (!search) {
    //         toast({
    //             title: "Please enter a user name to search",
    //             status: "warning",
    //             duration: 5000,
    //             isClosable: true,
    //             position: "top-left"
    //         });
    //         return;
    //     }

    //     try {
    //        setLoading(true);
           
    //        const config = {
    //            headers: {
    //                Authorization: `Bearer ${user.token}`,
    //            },
    //        };

    //        const { data } = await axios.get(`/api/user?search=${search}`, config)
    //        setLoading(false);
    //        setSearchResult(data);
    //     } catch (error) {
    //         toast({
    //             title: "Error occured!",
    //             description: "Failed to load the search results",
    //             status: "error",
    //             duration: 5000,
    //             isClosable: true,
    //             position: "bottom-left"
    //         });
    //     }
    // };

    const handleSearch = async () => {
        if (!search) {
          toast({
            title: "Please Enter something in search",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top-left",
          });
          return;
        }
    
        try {
          setLoading(true);
    
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
    
          const { data } = await axios.get(`/api/user?search=${search}`, config);
    
          setLoading(false);
          setSearchResult(data);
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: "Failed to Load the Search Results fuck",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
        }
      };
    
    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const {data} = await axios.post(`/api/chat`, { userId }, config);

            if (!chats.find((c) => c._id === data._id)){
                setChats([data, ...chats]);
            }

            setSelectedChat(data);
            setLoadingChat(false);
            onClose();

        } catch (error) {
            toast({
                title: "Error fetching the chat",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            });
        }
    };

    return (
        <>
        <Box
        d="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
        >
            <Tooltip label="Search users to chat" hasArrow placement='bottom-end'>
                <Button variant="ghost" onClick={onOpen}>
                    <i class="fas fa-search"></i>
                    <Text
                    d={{base:"none", md: "flex"}}
                    px={4}
                    >Search User</Text>
                </Button>
            </Tooltip>
            <Text
            fontSize="2xl"
            >
                Let's Chat
            </Text>
            <div>
                <Menu>
                    <MenuButton p={1}>
                        <BellIcon fontSize="2xl" m={1}/>
                    </MenuButton>
                    {/* <MenuList></MenuList> */}
                </Menu>
                <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                    <Avatar 
                     size='sm' 
                     cursor='pointer' 
                     name={user.name}
                     src={user.pic}
                    />
                </MenuButton>
                <MenuList>
                    <ProfileModal user={user}>
                    <MenuItem>My Profile</MenuItem>
                    </ProfileModal>
                    <MenuDivider/>
                    <MenuItem onClick={logOutHandler}>Log Out</MenuItem>
                </MenuList>
                </Menu>
            </div>
        </Box>
        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay/>
            <DrawerContent>
                <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                <DrawerBody>
                <Box d="flex" pb={2}>
                    <Input 
                      placeholder="Search by name or email"
                      mr={2}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    /> 
                    <Button onClick={handleSearch}>Go</Button> 
                </Box>
                {loading ? (
                    <ChatLoading />
                ): (
                    searchResult?.map((user) => (
                        <UserListItem 
                         key={user._id}
                         user={user}
                         handleFunction={() => accessChat(user._id)}
                        />
                    ))
                )}
                {loadingChat && <Spinner ml="auto" d="flex" />}
            </DrawerBody>
            </DrawerContent>
        </Drawer>
        </>
    );
};

export default SideDrawer;
