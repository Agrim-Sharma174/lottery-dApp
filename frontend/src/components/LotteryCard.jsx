"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardBody, CardFooter, Heading, Stack, Text } from "@chakra-ui/react";
import { Contract, ethers } from "ethers";
import { LOTTERY_ABI, LOTTERY_ADDRESS } from "@/constants";

const lotteryAddress = LOTTERY_ADDRESS;
const lotteryABI = LOTTERY_ABI;

const LotteryCard = () => {
  const router = useRouter();
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
      const signer = provider.getSigner();
      setSigner(signer);
      const contract = new Contract(lotteryAddress, lotteryABI, signer);
      setContract(contract);
    }
  }, []);

  const handleEnterLottery = async () => {
    if (contract) {
      try {
        const tx = await contract.enterLottery({
          value: ethers.utils.parseEther("0.000002"),
        });
        await tx.wait();
        router.push("/lotteryTable");
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div>
      <Card maxW="sm" bg="white" color="black" borderRadius="xl">
        <CardBody>
          <Stack mt="6" spacing="3" className="flex justify-center items-center">
            <Heading size="md">Lottery No. 1</Heading>
            <Text>fee: 0.000002 ETH</Text>
          </Stack>
        </CardBody>
        <CardFooter>
          <Button
            size="md"
            height="48px"
            width="200px"
            colorScheme="yellow"
            variant="solid"
            onClick={handleEnterLottery}
          >
            Enter Lottery
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LotteryCard;
