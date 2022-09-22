import {
  Box,
  Button,
  Divider,
  HStack,
  Input,
  InputGroup,
  InputRightAddon,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import contractAbi from "../utils/contract-abi.json";
import type { NextPage } from 'next';
import { Hero } from '../components/Hero'
import { Container } from '../components/Container'
import { CTA } from '../components/CTA'
import contractInterface from '../utils/contract-abi.json';
import { ethers } from 'ethers';
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { CONTRACT_ADDRESS } from '../utils/constants';
import DomainList from '../components/DomainList';
import Header from '../components/Header';
import TransitionPane from '../animations/TransitionPane';
import ConfettiCanvas from '../animations/ConfettiCanvas';
import Head from 'next/head';

export const contractConfig = {
  addressOrName: CONTRACT_ADDRESS,
  contractInterface: contractInterface.abi,
};

const Index: NextPage = () => {
  const { isConnected } = useAccount()
  const [mounted, setMounted] = useState(false);
  const [domain, setDomain] = useState('')
  const [superpower, setSuperpower] = useState('')
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false);
  const [mints, setMints] = useState([]);
  const [fire, setFire] = useState(false)

  useEffect(() => setMounted(true), []);

  const { config: contractWriteConfig } = usePrepareContractWrite({
    ...contractConfig,
    functionName: 'mint',
  });
  const { config: contractSetSuperpowerConfig } = usePrepareContractWrite({
    ...contractConfig,
    functionName: 'setSuperpower',
    args: [domain, superpower]
  });

  const {
    data: mintData,
    write: mint,
    isLoading: isMintLoading,
    isSuccess: isMintStarted,
    error: mintError,
  } = useContractWrite(contractWriteConfig);

  const {
    data: recordData,
    write: updateRecord,
    isLoading: isUpdateLoading,
    isSuccess: isUpdateStarted,
    error: updateError,
  } = useContractWrite(contractSetSuperpowerConfig);


  const { data: names } = useContractRead({
    ...contractConfig,
    functionName: 'getAllNames',
    watch: true,
  });
  console.log("names: ", names)
  const {
    data: txData,
    isSuccess: txSuccess,
    error: txError,
  } = useWaitForTransaction({
    hash: mintData?.hash,
  });

  const isMinted = txSuccess;

  /**
 * Mints the domain name to contract
 * @returns
 */
  const mintDomain = async () => {
    // Don't run if the domain is empty
    if (!domain) {
      return;
    }
    // Alert the user if the domain is too short
    if (domain.length < 3) {
      alert("Domain must be at least 3 characters long");
      return;
    }
    // Calculate price based on length of domain (change this to match your contract)
    // 3 chars = 0.5 MATIC, 4 chars = 0.3 MATIC, 5 or more = 0.1 MATIC
    const price = domain.length === 3 ? "0.5" : domain.length === 4 ? "0.3" : "0.1";
    console.log("Minting domain", domain, "with price", price);
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);

        console.log("Going to pop wallet now to pay gas...");
        let tx = await contract.register(domain, { value: ethers.utils.parseEther(price) });
        // Wait for the transaction to be mined
        const receipt = await tx.wait();

        // Check if the transaction was successfully completed
        if (receipt.status === 1) {
          console.log("Domain minted! https://mumbai.polygonscan.com/tx/" + tx.hash);

          // Set the record for the domain
          tx = await contract.setRecord(domain, superpower);
          await tx.wait();

          console.log("Record set! https://mumbai.polygonscan.com/tx/" + tx.hash);

          setFire(true)
          // Call fetchMints after 2 seconds
          setTimeout(() => {
            fetchMints();
          }, 2000);

          setSuperpower("");
          setDomain("");
        } else {
          alert("Transaction failed! Please try again");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };


  const fetchMints = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        // You know all this
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);
        console.log(contract.functions)
        console.log('getting all names')
        // Get all the domain names from our contract
        const names = await contract.getAllNames();

        // For each name, get the record and the address
        const mintRecords = await Promise.all(
          names.map(async (name) => {
            const mintRecord = await contract.records(name);
            const owner = await contract.domains(name);
            return {
              id: names.indexOf(name),
              name: name,
              record: mintRecord,
              owner: owner,
            };
          })
        );

        console.log("MINTS FETCHED ", mintRecords);
        setMints(mintRecords);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMints()
  }, [names])


  const updateDomain = async () => {
    if (!superpower || !domain) {
      return;
    }
    setLoading(true);
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);

        console.log("Updating domain", domain, "with Superpower", superpower);
        let tx = await contract.setSuperpower(domain, superpower);
        await tx.wait();
        console.log("Superpower set https://mumbai.polygonscan.com/tx/" + tx.hash);

        fetchMints();
        setSuperpower("");
        setDomain("");
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };


  // This will take us into edit mode and show us the edit buttons!
  const editRecord = (name) => {
    console.log("Editing record for", name);
    setEditing(true);
    setDomain(name);
  };
  const cancelEdit = () => {
    console.log("Cancel edit record for", name);
    setEditing(false);
    setDomain('');
  }

  return (
    <TransitionPane>
      <Container height="100vh">
        <Head>
          <title>Regen Name Service</title>
        </Head>
        <Header />
        <Hero />
        <Box w='100%' justifyContent='center' py='8'>
          <Stack padding='4' spacing='8' py='8' mx='auto' maxW='60%'>
            <InputGroup>
              <Input
                id='domain'
                value={domain}
                placeholder="nouns"
                onChange={(e) => setDomain(e.target.value)}
              />
              <InputRightAddon children=".regen" />
            </InputGroup>
            <Input
              placeholder="what's your superpower?"
              value={superpower}
              onChange={(e) => setSuperpower(e.target.value)}
            />

            {mintError && (
              <p style={{ marginTop: 24, color: '#FF6257' }}>
                Error: {mintError.message}
              </p>
            )}
            {txError && (
              <p style={{ marginTop: 24, color: '#FF6257' }}>
                Error: {txError.message}
              </p>
            )}
            <ConfettiCanvas fireConfetti={fire} />
            {mounted && isConnected && !isMinted && !editing && (
              <Button
                disabled={isMintLoading || isMintStarted || !domain}
                className="mint-button"
                colorScheme='green'
                data-mint-loading={isMintLoading}
                data-mint-started={isMintStarted}
                onClick={() => mintDomain()}
              >
                {isMintLoading && 'Waiting for approval'}
                {isMintStarted && 'Minting...'}
                {!isMintLoading && !isMintStarted && <Text>{domain.length <= 2 ? "Enter a domain" : domain.length === 3 ? "Mint for 0.5" : domain.length === 4 ? "Mint for 0.3" : "Mint for 0.1"}</Text>}
              </Button>
            )}
            {editing &&
              <HStack w='100%' justifyContent='center'>
                <Button onClick={() => updateDomain()} variant='solid' colorScheme='green'>
                  {isUpdateLoading && 'Waiting for approval'}
                  {isUpdateStarted && 'Updating record...'}
                  {!isUpdateLoading && !isUpdateStarted && 'Update record'}
                </Button>
                <Button variant='ghost' colorScheme='red' onClick={() => cancelEdit()}>Cancel</Button>
              </HStack>
            }
          </Stack>
          <Divider />
          {mints && <DomainList domains={mints} editRecord={editRecord} />}
        </Box>
        <CTA />
      </Container>
    </TransitionPane>
  )
}

export default Index
