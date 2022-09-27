import React from 'react'
import { Box } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'


const UserBadgeItem = ({user,handleFuntion, admin}) => {
  return (
    <Box
        px={2}
        py={1}
        borderRadius="lg"
        m={1}
        mb={2}
        variant="solid"
        fontSize={12}
        backgroundColor="purple"
        color="white"
        cursor="pointer"
        onClick={handleFuntion}
    >
        {user.name}
        {admin === user._id && <span> (Admin)</span>}
        <CloseIcon pl={1}/>
    </Box>
  )
}

export default UserBadgeItem