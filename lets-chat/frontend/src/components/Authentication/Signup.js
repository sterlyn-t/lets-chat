import React, { useState } from 'react';
import { VStack } from '@chakra-ui/layout';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import { Button } from '@chakra-ui/button';
import { useToast } from '@chakra-ui/react';
import chakraUiThemeCjs from '@chakra-ui/theme';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Signup = () => {

    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [pic, setPic] = useState();
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const history = useHistory();

    const handleClick = () => {setShow(!show)}

    const postDetails = (pics) => {
        setLoading(true);
        if (pics === undefined) {
            toast({
                title: "Please select an image.",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return
        }

        if (pics.type === "image/jpeg" || pics.type === "image/png"){
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "lets-chat");
            data.append("cloud_name", "stxd10");
            fetch("https://api.cloudinary.com/v1_1/stxd10/image/upload", {
                method: 'post',
                body: data
            }).then((res) => res.json())
              .then(data => {
                  setPic(data.url.toString());
                  console.log(data.url.toString());
                  setLoading(false);
              })
              .catch((err) => {
                  console.log(err);
                  setLoading(false);
              });
        } else {
            toast({
                title: "Please select an image.",
                status: "warning",
                duration: 5000,
                isClosable: true,
                postion: "bottom"
            });
            setLoading(false);
            return;
        }
    }

    const submitHandler = async () => {
        setLoading(true);

        if (!name || !email || !password || !confirmPassword) {
            toast({
                title: "Please fill all required fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                postion: "bottom"
            });
            setLoading(false);
            return;
        }

        if (password != confirmPassword) {
            toast({
                title: "Passwords do not match",
                status: "warning",
                duration: 5000,
                isClosable: true,
                postion: "bottom"
            });
            setLoading(false);
            return; 
        }

        try { 
            const config = {
                headers: {
                    "Content-type" : "application/json",
                },
            };

            const { data } = await axios.post('/api/user',
            { name, email, password, pic },
            config
            );
            toast({
                title: "Sign up successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                postion: "bottom"
            });
            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);
            history.push('/chats')
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "warning",
                duration: 5000,
                isClosable: true,
                postion: "bottom"
            });
            setLoading(false);
            return;
        }
    }

    return (
        <VStack spacing='5px' color='black'>
            <FormControl id='first-name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input placeholder='Enter Your Name'
                       onChange={(e) => setName(e.target.value)}
                />
            </FormControl>
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder='Enter Your Email'
                       onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Enter Password</FormLabel>
                <InputGroup>
                <Input 
                type={show? "text" : "password"}
                placeholder='Enter Your Password'
                onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                    <Button h='1.75rem' size='sm' onClick={handleClick}>
                         {show ? "Hide" : "Show"} 
                    </Button>
                </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id='confirm-password' isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                <Input 
                type={show? "text" : "password"}
                placeholder='Enter Your Password'
                onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                    <Button h='1.75rem' size='sm' onClick={handleClick}>
                         {show ? "Hide" : "Show"} 
                    </Button>
                </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id='pic'>
                <FormLabel>Upload your Picture</FormLabel>
                <Input type="file"
                       p={1.5}
                       accept="image/*"
                       onChange={(e) => postDetails(e.target.files[0])}
                />
            </FormControl>
            <Button
                colorScheme="blue"
                width="100%"
                style={{ marginTop: 15}}
                onClick={submitHandler}
                isLoading={loading}
            >
                Sign Up
            </Button>
        </VStack>
    )
}

export default Signup
