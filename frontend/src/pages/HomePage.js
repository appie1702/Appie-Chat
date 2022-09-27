import {
  Box,
  Center,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import Login from '../components/authentication/login';
import Signup from '../components/authentication/signup';
import { useHistory } from 'react-router-dom';

const HomePage = () => {

  const history = useHistory();

  //if user is already logged in , it will automatically pushed back to chats page.
  useEffect(()=> {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) history.push("/chats");

  },[history]);


  return (
   <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        textAlign={"center"}
        p={3}
        bg="blackAlpha.100"
        backdropFilter="auto" 
        backdropBlur="6px"
        w="100%"
        m="20px 0 10px 0"
        borderRadius="lg"
        borderWidth="0px"
      >
        <Text fontSize="4xl" fontFamily="Work sans" color='white'>
          Appie Chat
        </Text>
      </Box>
      <Box bg="blackAlpha.100" backdropFilter="auto" backdropBlur="6px" w="100%" p={4} borderRadius="lg"> 
        <Tabs variant='soft-rounded'>
          <TabList mb="1em">
            <Tab width="50%" color={"white"}>Login</Tab>
            <Tab width="50%" color={"white"}>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login/>
            </TabPanel>
            <TabPanel>
              <Signup/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
)}
export default HomePage