"use client";

// import LotteryCard from "@/components/LotteryCard";
// import Navbar from "@/components/Navbar";
// import { useEffect, useRef, useState } from "react";
// import Web3Modal from "web3modal";
// import { providers, Contract } from "ethers";

// export default function Home() {
//   const [walletConnected, setWalletConnected] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const web3ModalRef = useRef();

//   const getProviderOrSigner = async (needSigner = false) => {
//     try {
//       console.log("Attempting to connect provider...");
//       const provider = await web3ModalRef.current.connect().catch(e => {
//         console.error("Error in web3Modal.connect():", e);
//         throw e;
//       });
//       console.log("Provider connected:", provider);
      
//       const web3Provider = new providers.Web3Provider(provider);
//       console.log("Web3Provider created");
  
//       const { chainId } = await web3Provider.getNetwork().catch(e => {
//         console.error("Error getting network:", e);
//         throw e;
//       });
//       console.log("Connected to chain ID:", chainId);
      
//       if (needSigner) {
//         const signer = web3Provider.getSigner();
//         console.log("Signer obtained");
//         return signer;
//       }
//       return web3Provider;
//     } catch (error) {
//       console.error("Error in getProviderOrSigner:", error);
//       throw error;
//     }
//   };
  

//   const connectWallet = async () => {
//     try {
//       console.log("Connecting wallet...");
//       const provider = await getProviderOrSigner();
//       console.log("Provider obtained:", provider);
//       setWalletConnected(true);
//       console.log("Wallet connected, checking election state");
//       await checkElectionState();
//       console.log("Fetching candidates");
//       await fetchCandidates();
//       console.log("Checking user role");
//       await checkUserRole();
//     } catch (err) {
//       console.error("Connection error:", err);
//       if (err.code === 4001 || err.message.includes("User rejected")) {
//         alert("Please accept the wallet connection request to proceed.");
//       } else {
//         alert(`Error connecting wallet: ${err.message}`);
//       }
//     }
//   };

//   useEffect(() => {
//     if (!walletConnected) {
//       console.log("Initializing Web3Modal");
//       web3ModalRef.current = new Web3Modal({
//         network: "mainnet",
//         cacheProvider: false,
//         providerOptions: {
//           injected: {
//             display: {
//               name: "Injected",
//               description: "Connect with the provider in your Browser"
//             },
//             package: null
//           },
//         },
//       });
//       console.log("Web3Modal initialized");
//     }
//   }, [walletConnected]);

//   return (
//     <main className="flex min-h-screen flex-col items-center  p-5">
//       <Navbar />
//       <div className="flex flex-grow w-full justify-center items-center">
//         <LotteryCard />
//       </div>
//     </main>
//   );
// }


// "use client";

import { useEffect, useRef, useState } from "react";
import { providers, Contract } from "ethers";
import Web3Modal from "web3modal";
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@chakra-ui/react";
import LotteryCard from "@/components/LotteryCard";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const web3ModalRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();

    if (chainId !== 11155111) {
      window.alert("Please connect to sepolia Testnet");
      throw new Error("Please connect to sepolia Testnet");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      const userAddress = await signer.getAddress();
        setAddress(userAddress);
      return signer;
    }

    return web3Provider;
  };

  const connectWallet = async () => {
    try {
      const provider = await getProviderOrSigner(true);
      setWalletConnected(true);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      console.log("Initializing Web3Modal");
      web3ModalRef.current = new Web3Modal({
        network: "mainnet",
        cacheProvider: false,
        providerOptions: {
          injected: {
            display: {
              name: "Injected",
              description: "Connect with the provider in your Browser"
            },
            package: null
          },
        },
      });
      console.log("Web3Modal initialized");
      onOpen(); // Open the modal if wallet is not connected
    }
  }, [walletConnected]);

  return (
    <main className="flex min-h-screen flex-col items-center p-5">
      <Navbar address={address} />
      <div className="flex flex-grow w-full justify-center items-center">
        <LotteryCard />
      </div>
      <Modal isOpen={isOpen} onClose={onClose} isCentered closeOnOverlayClick={false} closeOnEsc={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Connect Your Wallet</ModalHeader>
          <ModalBody>
            <p>Please connect your wallet to proceed.</p>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={connectWallet} isLoading={loading}>
              Connect Wallet
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </main>
  );
}
