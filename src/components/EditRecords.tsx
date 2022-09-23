import { HStack, InputGroup, Input, InputRightAddon, Button, Stack, Link as ChakraLink } from '@chakra-ui/react'
import React from 'react'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { contractConfig } from '../pages/index';
import { useState } from 'react';

const EditRecords = ({ domain, superpower, clearForm }) => {
  const [superPower, setSuperpower] = useState(superpower)
  const { config: contractSetSuperpowerConfig } = usePrepareContractWrite({
    ...contractConfig,
    functionName: 'setRecord',
    args: [domain, superpower]
  });

  const {
    data: recordData,
    write: updateRecord,
    isLoading: isUpdateLoading,
    isSuccess: isUpdateStarted,
    error: updateError,
  } = useContractWrite(contractSetSuperpowerConfig);

  const {
    data: uTxData,
    isSuccess: uTxSuccess,
    error: uTxError,
  } = useWaitForTransaction({
    hash: recordData?.hash,
  });


  const updateDomain = async () => {
    if (!superpower || !domain) {
      return;
    }
    // setLoading(true);
    updateRecord()
    clearForm()
    // try {
    //   const { ethereum } = window;
    //   if (ethereum) {
    //     const provider = new ethers.providers.Web3Provider(ethereum);
    //     const signer = provider.getSigner();
    //     const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);

    //     let tx = await contract.setRecord(domain, superpower);
    //     await tx.wait();
    //     console.log("Superpower set https://mumbai.polygonscan.com/tx/" + tx.hash);

    //     fetchMints();
    //     setSuperpower("");
    //     setDomain("");
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
    // setLoading(false);
  };


  const isUpdated = uTxSuccess

  return (
    <Stack padding='4' spacing='8' py='8' justifyContent='center' mx='auto' maxW='80%'>
      <InputGroup>
        <Input
          disabled
          colorScheme='green'
          focusBorderColor='green.200'
          id='domain'
          value={domain}
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
      <HStack w='100%' justifyContent='center'>
        <Button
          disabled={isUpdateLoading}
          colorScheme='green'
          loadingText={isUpdateLoading && 'Waiting for approval' || isUpdateStarted && 'Updating record...'}
          isLoading={isUpdateLoading}
          onClick={() => updateRecord()}
          spinnerPlacement='start'>
          Update record
        </Button>
        <Button variant='ghost' colorScheme='red' onClick={() => clearForm()}>Cancel</Button>
      </HStack>
      {uTxSuccess && <ChakraLink isExternal href={`https://mumbai.polygonscan.com/tx/${recordData?.hash}`}>View on polygonscan</ChakraLink>}
      {uTxError && (
        <Text style={{ color: '#FF6257' }} overflow='hidden'>
          Error: {uTxError.message}
        </Text>
      )}
      {updateError && (
        <Text style={{ color: '#FF6257' }} overflow='hidden'>
          Error: {updateError.message}
        </Text>
      )}
    </Stack>
  )
}

export default EditRecords
