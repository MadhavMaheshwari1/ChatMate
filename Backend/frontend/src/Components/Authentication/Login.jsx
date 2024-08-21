import React, { useState } from 'react';
import { VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passShow, setPassShow] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const submitHandler = async () => {
        if (!password || !email) {
            toast({
                title: "Please Fill all the fields!",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
            return;
        }
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                }
            };
            const { data } = await axios.post("/api/users/login", { email, password }, config);
            toast({
                title: "Login Successfull!!",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            navigate('/Chats');
        } catch (error) {
            toast({
                title: "Error Occurred!!",
                description: error.response.data.message,
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
        }
    };

    const handlePassword = () => {
        setPassShow(!passShow);
    }

    return (
        <VStack spacing={"5px"} color="black" pl={'5px'}>
            <FormControl id="email" isRequired mb={"5px"}>
                <FormLabel>Email</FormLabel>
                <Input placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)}></Input>
            </FormControl>
            <FormControl id="password" isRequired mb={"5px"}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input type={passShow ? "text" : "password"} value={password} placeholder='Enter your password' onChange={(e) => setPassword(e.target.value)}></Input>
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handlePassword}>{passShow ? "Hide" : "Show"}</Button>
                    </InputRightElement>
                </InputGroup>

            </FormControl>

            <Button colorScheme='blue' width="100%" mt="15" onClick={submitHandler}>Log In</Button>
            <Button variant="solid" bg={"red.500"} width="100%" mt="2" onClick={() => { setEmail("guest@example.com"); setPassword("123456"); }}>Get Guest User credentials</Button>
        </VStack >
    )
}

export default Login;