"use client";

import React, { useState, useEffect } from "react";
import { Box, Flex, Text, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@chakra-ui/react";
import { Contract, ethers } from "ethers";
import { LOTTERY_ABI, LOTTERY_ADDRESS } from "@/constants";

const lotteryAddress = LOTTERY_ADDRESS;
const lotteryABI = LOTTERY_ABI;

const LotteryTable = () => {
  const [participants, setParticipants] = useState([]);
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new Contract(lotteryAddress, lotteryABI, provider);
      
      contract.on("LotteryEntered", (participant) => {
        setParticipants((prevParticipants) => [...prevParticipants, participant]);
      });

      contract.on("LotteryDrawn", (winners, prizes) => {
        setWinners(winners.map((winner, index) => ({ address: winner, prize: ethers.utils.formatEther(prizes[index]) })));
        setLoading(false);
        onOpen();
      });
    }
  }, []);

  useEffect(() => {
    if (participants.length === 4) {
      setLoading(true);
      setTimeout(() => {
        // Draw the lottery after 10 seconds
        // In reality, the smart contract will handle this
      }, 10000);
    }
  }, [participants]);

  return (
    <Flex direction="column" align="center" justify="center" minH="100vh" bg="green.200" p={4}>
      <Box
        width="80%"
        height="80vh"
        bg="green.300"
        borderRadius="lg"
        position="relative"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        {participants.map((participant, index) => (
          <Text key={index} position="absolute" top={index === 0 ? "5px" : index === 1 ? "50%" : index === 2 ? "95%" : "50%"} left={index === 0 ? "50%" : index === 1 ? "5px" : index === 2 ? "50%" : "95%"} transform={index === 1 || index === 3 ? "translateY(-50%) rotate(90deg)" : "translateX(-50%)"} fontSize="lg">
            Participant {index + 1}
          </Text>
        ))}
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Lottery Results</ModalHeader>
          <ModalBody>
            {winners.map((winner, index) => (
              <Text key={index}>
                {winner.address} won {winner.prize} ETH
              </Text>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default LotteryTable;
