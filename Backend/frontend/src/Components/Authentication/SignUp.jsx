import React, { useState } from 'react';
import { VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [pic, setPic] = useState('');
    const [Loading, setLoading] = useState(false);
    const [passShow, setPassShow] = useState(false);
    const [confirmPassshow, setconfirmPassshow] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const postDetails = (pics) => {
        setLoading(true);
        if (pics === undefined) {
            toast({
                title: "Please Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "Chat Mate");
            data.append("cloud_name", "da3em1kya");
            fetch("https://api.cloudinary.com/v1_1/da3em1kya/image/upload", {
                method: "post",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
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
                title: "Please Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }
    };

    const handlePassword = () => {
        setPassShow(!passShow);
    };

    const handleConfirmPassword = () => {
        setconfirmPassshow(!confirmPassshow);
    };

    const submitHandler = async () => {
        if (!password || !email || !name || !confirmPassword) {
            toast({
                title: "Please Fill all the fields!",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
            return;
        }
        if (password !== confirmPassword) {
            toast({
                title: "Passwords do not match",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
            return;
        }
        setLoading(true);
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                }
            };
            const { data } = await axios.post("/api/users", { name, email, password, pic }, config);
            toast({
                title: "Registration Successfull!!",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
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
            setLoading(false);
        }
    };

    return (
        <VStack spacing="5px" color="black" pl="5px">
            <FormControl id="firstName" isRequired mb="5px">
                <FormLabel>Name</FormLabel>
                <Input placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl id="email" isRequired mb="5px">
                <FormLabel>Email</FormLabel>
                <Input placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl id="password" isRequired mb="5px">
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={passShow ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handlePassword}>
                            {passShow ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="confirmPassword" isRequired mb="5px">
                <FormLabel>Confirm password</FormLabel>
                <InputGroup>
                    <Input
                        type={confirmPassshow ? 'text' : 'password'}
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleConfirmPassword}>
                            {confirmPassshow ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="picture" isRequired mb="5px">
                <FormLabel>Upload your picture</FormLabel>
                <InputGroup>
                    <Input type="file" accept="image/*" onChange={(e) => postDetails(e.target.files[0])} />
                </InputGroup>
            </FormControl>
            <Button isLoading={Loading} colorScheme="blue" width="100%" mt="15" onClick={submitHandler}>
                Sign Up
            </Button>
        </VStack>
    );
};

export default SignUp;
