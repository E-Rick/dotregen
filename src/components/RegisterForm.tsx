import { Stack, InputGroup, Input, InputRightAddon, Button, Text, Box, Flex } from '@chakra-ui/react';
import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { contractConfig } from '../pages'
import { CONTRACT_ADDRESS, OPENSEA_ADDRESS } from '../utils/constants'
import contractAbi from "../utils/contract-abi.json";
import FlipCard, { BackCard, FrontCard } from './FlipCard';
import Image from 'next/image';
const RegisterForm = () => {
  const { isConnected } = useAccount()
  const [domain, setDomain] = useState('')
  const [superpower, setSuperpower] = useState('')
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false)
  useEffect(() => setMounted(true), []);

  const getPrice = domain.length === 3 ? "0.5" : domain.length === 4 ? "0.3" : "0.1";
  const calculatePrice = ethers.utils.parseEther(getPrice)


  const { config: contractWriteConfig } = usePrepareContractWrite({
    ...contractConfig,
    functionName: 'register',
    args: [domain, { value: calculatePrice }]
  });

  const {
    data: mintData,
    write: register,
    isLoading: isRegisterLoading,
    isSuccess: isRegisterStarted,
    error: registerError,
  } = useContractWrite(contractWriteConfig);

  const {
    data: txData,
    isSuccess: txSuccess,
    error: txError,
  } = useWaitForTransaction({
    hash: mintData?.hash,
  });

  // const { data: names } = useContractRead({
  //   ...contractConfig,
  //   functionName: 'getAllNames',
  // });


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
        register()
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

          // Call fetchMints after 2 seconds
          setTimeout(() => {
            // fetchMints();
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

  const isLoading = isRegisterLoading || isRegisterStarted
  const isMinted = txSuccess
  const isSuccess = isMinted
  const txMessage = 'https://mumbai.polygonscan.com/tx/' + txData
  const openSea = `${OPENSEA_ADDRESS}/`
  const isError = txError || registerError

  return (
    <Stack padding='4' spacing='8' py='8' justifyContent='center' mx='auto' maxW='80%'>
      <InputGroup>
        <Input
          colorScheme='green'
          focusBorderColor='green.200'
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
        colorScheme='orange'
        focusBorderColor='orange.200'
        onChange={(e) => setSuperpower(e.target.value)}
      />
      {mounted && isConnected && (
        <Button
          disabled={isLoading || !domain}
          className="mint-button"
          colorScheme='green'
          loadingText={isRegisterLoading && 'Waiting for approval' || isRegisterStarted && 'Minting'}
          isLoading={isLoading}
          onClick={() => register()}
          spinnerPlacement='start'
        >
          <Text>{domain.length <= 2 ? "Enter a domain" : domain.length === 3 ? "Mint for 0.5" : domain.length === 4 ? "Mint for 0.3" : "Mint for 0.1"}</Text>
        </Button>
      )}

      {registerError && (
        <p style={{ marginTop: 24, color: '#FF6257' }}>
          Error: {registerError.message}
        </p>
      )}
      {txError && (
        <p style={{ marginTop: 24, color: '#FF6257' }}>
          Error: {txError.message}
        </p>
      )}

      <Flex justifyContent='center'>
        <FlipCard>
          <FrontCard isCardFlipped={show}>
            <svg xmlns="http://www.w3.org/2000/svg" width="270" height="270" fill="none"><path fill="url(#B)" d="M0 0h270v270H0z" /><defs><filter id="A" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse" height="270" width="270"><feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity=".225" width="200%" height="200%" /></filter></defs><path d="M72.863 42.949c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-10.081 6.032-6.85 3.934-10.081 6.032c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-8.013-4.721a4.52 4.52 0 0 1-1.589-1.616c-.384-.665-.594-1.418-.608-2.187v-9.31c-.013-.775.185-1.538.572-2.208a4.25 4.25 0 0 1 1.625-1.595l7.884-4.59c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v6.032l6.85-4.065v-6.032c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595L41.456 24.59c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-14.864 8.655a4.25 4.25 0 0 0-1.625 1.595c-.387.67-.585 1.434-.572 2.208v17.441c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l10.081-5.901 6.85-4.065 10.081-5.901c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v9.311c.013.775-.185 1.538-.572 2.208a4.25 4.25 0 0 1-1.625 1.595l-7.884 4.721c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-7.884-4.59a4.52 4.52 0 0 1-1.589-1.616c-.385-.665-.594-1.418-.608-2.187v-6.032l-6.85 4.065v6.032c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l14.864-8.655c.657-.394 1.204-.95 1.589-1.616s.594-1.418.609-2.187V55.538c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595l-14.993-8.786z" fill="#fef6ec" /><defs><linearGradient id="B" x1="0" y1="0" x2="270" y2="270" gradientUnits="userSpaceOnUse"><stop stop-color="#cb9e59" /><stop offset="1" stop-color="#427e83" stop-opacity=".99" /></linearGradient></defs><text x="32.5" y="231" font-size="27" fill="#fef6ec" filter="url(#A)" font-family="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif" font-weight="bold">
              {`${domain}.regen`}</text></svg>
          </FrontCard>
          <BackCard isCardFlipped={isMinted}>
            <Box padding='20px'>
              <Image
                src="/svg.svg"
                width="80"
                height="80"
                alt="Regen domain NFT"
                style={{ borderRadius: 8 }}
              />
              <h2 style={{ marginTop: 8, marginBottom: 6 }}>NFT Minted!</h2>
              <p style={{ marginBottom: 16 }}>
                Your NFT will show up in your wallet in the next few minutes.
              </p>
              <p style={{ marginBottom: 4 }}>
                View on{' '}
                <a href={`https://rinkeby.etherscan.io/tx/${mintData?.hash}`}>
                  Polygonscan
                </a>
              </p>
              <p>
                View on{' '}
                <a
                  href={`https://testnets.opensea.io/assets/mumbai/${txData?.to}`}
                >
                  Opensea
                </a>
              </p>
            </Box>
          </BackCard>
        </FlipCard>
      </Flex>
    </Stack >
  )

}

export default RegisterForm


