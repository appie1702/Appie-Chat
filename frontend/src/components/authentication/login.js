import { useToast, Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from "axios";
import {useHistory} from 'react-router-dom';
import { ChatState } from '../../Context/chatprovider';

const Login = () => {

    const [email,setemail] = useState(null);
    const [password,setpassword] = useState(null);
    const [show,setshow] = useState(false);
    const [loading, setloading] = useState(false);
    const history = useHistory();
    const handleClick = () => setshow(!show);
    const toast = useToast();
    const{setuser} = ChatState();

    const submitHandler = async () => {
        setloading(true);
        if (!email || !password) {
            toast({
                title: "Please Fill all the Feilds",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        setloading(false);
        return;
        }

        console.log(email)
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            
            const userdata = await axios.post(
                "/api/user/login",
                {email, password},
                config
            );

            toast({
                title: "Login Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });

            localStorage.setItem("userInfo", JSON.stringify(userdata));
            setuser(userdata.data);
            setloading(false);
            history.push("/chats");

        } catch(error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setloading(false);
        }
    };
    
    return (
    <VStack spacing='5px' color="white">
        <FormControl id='login-email' isRequired>
            <FormLabel>Email</FormLabel>
            <Input 
                type="email"
                placeholder='Enter Your Email'
                onChange={(e)=> setemail(e.target.value)}
            />
        </FormControl>

        <FormControl id='login-password' isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
                <Input
                    type={show ? "text":"password"}
                    placeholder=''
                    onChange={(e)=> setpassword(e.target.value)}
                />
                <InputRightElement width={"4.5rem"}>
                    <Button color="black" h="1.75rem" size={"sm"} onClick={handleClick}>
                        {show ? "Hide":"Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>

        <Button
            colorScheme="teal"
            width="100%"
            style={{marginTop: 15}}
            onClick={submitHandler}
            isLoading = {loading}
        >
        Login
        </Button>
        </VStack>
  )
}

export default Login