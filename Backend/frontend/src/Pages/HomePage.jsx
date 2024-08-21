import React from 'react';
import { Container, Box, Text } from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import Login from '../Components/Authentication/Login';
import SignUp from '../Components/Authentication/SignUp';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo) {
      navigate("/Chats");
    }
  }, []);

  return (
    <Container maxW="3xl" h="100%" p={4}>
      <Box color='white' p={10} bg={"blue.100"} borderRadius="xl" margin="0px 0px 15px 0px">
        <Text color='black' fontSize={"4xl"} fontWeight="bold" textAlign={"center"}>Chat Mate</Text>
      </Box>
      <Box d="flex" justifyContent='center' color='black' p={5} bg={"white"} borderRadius="xl">
        <Tabs variant='soft-rounded' colorScheme='blue' isLazy>
          <TabList>
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
