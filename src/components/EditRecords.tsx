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
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { useDomainContext } from '../context/DomainContext'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { contractConfig } from '../utils/constants'
import useDomains from '../hooks/useDomains'

const EditRecords = () => {
  const { domain, record, setRecord, clearForm } = useDomainContext()
  const { refetchDomains } = useDomains()
  const {
    config: contractSetRecordConfig,
    isError,
    error,
  } = usePrepareContractWrite({
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
      // Call fetchMints after 2 seconds
      setTimeout(() => {
        refetchDomains()
      }, 3000)
    },
  })

  // const errorMessage = pluck('message', txError, error, updateError)
  // const isError = any(txError, error, updateError)
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

        {(txError || updateError || isError) && (
          <Text color='red.200' overflow='hidden'>
            Error: {txError?.message} {updateError?.message} {error?.message}
          </Text>
        )}
      </Flex>
    </Stack>
  )
}

export default EditRecords
