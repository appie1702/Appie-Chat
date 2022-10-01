import React from 'react'
import { IconButton, useDisclosure } from '@chakra-ui/react'
import {
    Text,
    Image,
    Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { ViewIcon } from "@chakra-ui/icons";

const ProfileModal = ({user, children}) => {
const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
        {children ? (
            <span onClick={onOpen}>{children}</span>
        ) : (
            <IconButton  colorScheme="teal" display={{ base:"flex"}} icon={<ViewIcon />} onClick={onOpen}/>
        )}

        <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent h="410px">
                <ModalHeader
                    fontSize="35px"
                    fontFamily="Work sans"
                    display="flex"
                    justifyContent="center"
                >
                    {user.name}
                </ModalHeader>
            <ModalCloseButton />
            <ModalBody
                display="flex"
                flexDir="column"
                alignItems="center"
                justifyContent="space-between"
            >
                <Image
                    borderRadius="1vh"
                    boxSize="162px"
                    src={user.pic}
                    alt={user.name}
                />

                <Text
                    fontSize={{ base : "28px", md: "25px"}}
                    fontFamily="Work sans"
                    fontWeight="bold"
                >
                    Email: {user.email}
                </Text>
            </ModalBody>

            <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
                </Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    )
}

export default ProfileModal;