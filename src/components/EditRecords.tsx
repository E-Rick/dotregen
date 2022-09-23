import {
  HStack,
  InputGroup,
  Input,
  InputRightAddon,
  Text,
  Button,
  Stack,
  Link as ChakraLink,
  Flex,
} from '@chakra-ui/react'
import React from 'react'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { contractConfig } from '../pages/index'
import { useDomainContext } from '../context/DomainContext'
import { ExternalLinkIcon } from '@chakra-ui/icons'

const EditRecords = () => {
  const { domain, record, setRecord, clearForm } = useDomainContext()

  const { config: contractSetRecordConfig } = usePrepareContractWrite({
    ...contractConfig,
    functionName: 'setRecord',
    args: [domain, record],
  })

  const {
    data: recordData,
    write: updateRecord,
    isLoading: isUpdateLoading,
    error: updateError,
  } = useContractWrite(contractSetRecordConfig)

  const {
    isSuccess: txSuccess,
    error: txError,
    isLoading: txLoading,
  } = useWaitForTransaction({
    hash: recordData?.hash,
    onSuccess(data) {
      console.log('Success', data)
    },
  })

  const isUpdated = txSuccess
  const isLoading = isUpdateLoading || txLoading
  const waitingForApproval = isUpdateLoading && 'Waiting for approval'
  const updatingRecord = txLoading && 'Updating record...'

  return (
    <Stack padding='4' spacing='8' py='8' justifyContent='center' mx='auto' maxW='80%'>
      <InputGroup>
        <Input disabled focusBorderColor='green.200' value={domain} />
        <InputRightAddon children='.regen' />
      </InputGroup>

      <Input
        placeholder="what's your superpower?"
        value={record}
        focusBorderColor='orange.200'
        onChange={(e) => setRecord(e.target.value)}
      />

      <HStack w='100%' justifyContent='center'>
        <Button
          colorScheme='green'
          disabled={isLoading}
          isLoading={isLoading}
          spinnerPlacement='start'
          onClick={() => updateRecord()}
          loadingText={updatingRecord || waitingForApproval}>
          Update record
        </Button>

        <Button variant='ghost' colorScheme='red' onClick={() => clearForm()}>
          Cancel
        </Button>
      </HStack>

      <Flex justifyContent='center'>
        {isUpdated && (
          <ChakraLink isExternal href={`https://mumbai.polygonscan.com/tx/${recordData?.hash}`}>
            <Flex alignItems='center' gap='1'>
              Success: View on polygonscan <ExternalLinkIcon />
            </Flex>
          </ChakraLink>
        )}

        {(txError || updateError) && (
          <Text color='red.200' overflow='hidden'>
            Error: {txError?.message} {updateError?.message}
          </Text>
        )}
      </Flex>
    </Stack>
  )
}

export default EditRecords
