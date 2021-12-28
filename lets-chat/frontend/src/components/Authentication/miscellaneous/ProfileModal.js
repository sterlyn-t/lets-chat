import React from 'react';
import { useDisclosure } from '@chakra-ui/hooks';
import { IconButton } from '@chakra-ui/button';
import { ViewIcon } from '@chakra-ui/icons';
import { Button } from '@chakra-ui/button';
import { Modal, 
         ModalOverlay, 
         ModalContent, 
         ModalBody, 
         ModalCloseButton, 
         ModalFooter, 
         ModalHeader,
         Image,
         Text 
         } from '@chakra-ui/react';


const ProfileModal = ({ user, children }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
        {
            children ? (<span onClick={onOpen}>{children}</span>) : 
            (
                <IconButton 
                 d={{ base: "flex"}}
                 icon={<ViewIcon />}
                 onClick={onOpen}

                />
            )}
        <Modal size="lg" isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader
            fontSize="40px"
            //fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            {user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            d="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image 
            borderRadius="full"
            boxSize="150px"
            src={user.pic}
            alt={user.name}
            />
            <Text fontSize={{ base: "28px", md: "30px"}}>
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

export default ProfileModal
