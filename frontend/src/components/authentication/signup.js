import { useToast, Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from "axios";
import {useHistory} from 'react-router-dom';
import { ChatState } from '../../Context/chatprovider';
const Signup = () => {
    const [email,setemail] = useState(null);
    const [name,setname] = useState(null);
    const [password,setpassword] = useState(null);
    const [confirmpassword,setconfirmpassword] = useState(null);
    const [pic,setpic] = useState(null);
    const [show,setshow] = useState(false);
    const [loading,setloading] = useState(false);
    const history = useHistory();
    const toast = useToast(); //for modal type alert
    const handleClick = () => setshow(!show);
    const {setuser} = ChatState();


    const postDetails = (pics) => {
        setloading(true);
        if (pics === undefined){
            toast({
            title: 'Please Select an Image!',
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });
        setloading(false);
        return;
        }
        console.log(pics)
        if(pics.type==="image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "mern-chat");
            data.append("cloud_name", "appie1702");
            fetch("https://api.cloudinary.com/v1_1/appie1702/image/upload",{
                method: "post",
                body: data,
            }).then((res) => res.json())
                .then((res) => {
                setpic(res.url.toString());
                console.log(res.url.toString());
                setloading(false);
            });
        } else {
            toast({
            title: 'Please Select Image!',
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });
        setloading(false);
        return;
        }
    };

    const submitHandler= async () => {
        setloading(true);
        if (!name || !email || !password || !confirmpassword) {
            toast({
                title: 'Please fill all the Fields!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        setloading(false);
        return;
        }

        if (password !== confirmpassword) {
            toast({
                title: 'The passwords do not match!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        setloading(false);
        return;
        }
        
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            
            const {userdata} = await axios.post(
                "/api/user", 
                {name,email,password,pic},
                config
                );

            toast({
                title: 'Registration is successful!',
                status: 'success',
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
                title: 'Error Occured!, Try after sometime:(',
                status: 'warning',
                description: error.response.data.message,
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setloading(false);
        }

    };

    return (
        <VStack spacing='5px' color="white">

            <FormControl id='name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input 
                    placeholder='Enter Your Name'
                    onChange={(e)=> setname(e.target.value)}
                />
            </FormControl>

            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    type="email"
                    placeholder='Enter Your Email'
                    onChange={(e)=> setemail(e.target.value)}
                />
            </FormControl>

            <FormControl id='password' isRequired>
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

            <FormControl id='confirm-password' isRequired>
                <FormLabel>Comfirm Password</FormLabel>
                <InputGroup>
                <Input
                    type={show ? "text":"password"}
                    placeholder=''
                    onChange={(e)=> setconfirmpassword(e.target.value)}
                />
                <InputRightElement width={"4.5rem"}>
                    <Button color="black" h="1.75rem" size={"sm"} onClick={handleClick}>
                        {show ? "Hide":"Show"}
                    </Button>
                </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl id='pics' isRequired>
                <FormLabel>Upload Your Picture</FormLabel>
                <Input 
                    type="file"
                    p={1.5}
                    accept="image/*"
                    onChange={(e)=> postDetails(e.target.files[0])}
                />
            </FormControl>
            <Button
                colorScheme="blue"
                width="100%"
                style={{marginTop: 15}}
                onClick={submitHandler}
                isLoading={loading}
            >
                Sign Up
            </Button>

            <Button
                variant="solid"
                colorScheme="pink"
                width="100%"
                style={{marginTop: 15}}
                onClick={() => {
                    setemail("guest@example.com");
                    setpassword("123456");
                }}
            >
                Just want to be a guest
            </Button>
        </VStack>
  )
}

export default Signup