import { Stack, InputGroup, Input, InputRightAddon, Button, Text, Box, Flex } from '@chakra-ui/react'
import { ethers } from 'ethers'
import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { contractConfig, CONTRACT_ADDRESS } from '../utils/constants'
import FlipCard, { BackCard, FrontCard } from './FlipCard'
import Image from 'next/image'
import useHasMounted from '../hooks/useHasMounted'
import { useDomainContext } from '../context/DomainContext'
import contractInterface from '../utils/contract-abi.json'
import { useState } from 'react'

const RegisterForm = () => {
  const { domain, setDomain, record, setRecord, clearForm } = useDomainContext()
  const hasMounted = useHasMounted()
  const { isConnected } = useAccount()
  const [loading, setLoading] = useState<boolean>(false)
  const [minted, setMinted] = useState<boolean>(false)

  // console.log('domain length', domain.length)
  const getPrice = domain.length === 3 ? '0.5' : domain.length === 4 ? '0.3' : '0.1'
  const calculatePrice = ethers.utils.parseEther(getPrice)

  // Register config
  const {
    config: contractWriteConfig,
    error,
    isError,
  } = usePrepareContractWrite({
    ...contractConfig,
    functionName: 'register',
    enabled: false,
    args: [domain, { value: calculatePrice }],
  })

  // SetRecord config
  const { config: contractSetRecordConfig } = usePrepareContractWrite({
    ...contractConfig,
    functionName: 'setRecord',
    enabled: false,
    args: [domain, record],
  })

  const {
    data: mintData,
    write: register,
    writeAsync: registerAsync,
    isLoading: isRegisterLoading,
    isSuccess: isRegisterStarted,
    error: registerError,
  } = useContractWrite(contractWriteConfig)

  const {
    data: recordData,
    write: updateRecord,
    writeAsync,
    isLoading: isUpdateLoading,
    error: updateError,
  } = useContractWrite(contractSetRecordConfig)

  const {
    data: txData,
    isSuccess: txSuccess,
    error: txError,
    isLoading: registerLoading,
  } = useWaitForTransaction({
    hash: mintData?.hash,
    onSuccess: (data) => {
      console.log('Domain minted! https://mumbai.polygonscan.com/tx/' + data.transactionHash)
      updateRecord()
    },
    onSettled(data, error) {
      console.log('Settled', { data, error })
    },
  })

  const {
    isSuccess: isRecordUpdated,
    error: updateTxError,
    isLoading: txLoading,
  } = useWaitForTransaction({
    hash: recordData?.hash,
    onSuccess(data) {
      // Record update successful
      console.log('Success', data)
    },
    onSettled(data, error) {
      console.log('Settled', { data, error })
    },
  })

  // const mintDomain = async () => {
  //   const tx = await registerAsync()
  //   console.log('tx: ', tx)
  //   const update = await writeAsync()
  //   console.log('update: ', update)
  // }

  const isLoading = isRegisterLoading || txLoading || registerLoading || isUpdateLoading || loading
  const isMinted = txSuccess || minted
  const txMessage = 'https://mumbai.polygonscan.com/tx/' + txData
  const waitingForApproval = (isUpdateLoading || isRegisterLoading) && 'Waiting for approval'
  const updatingRecord = txLoading && 'Updating record...'
  const registeringDomain = registerLoading && 'Registering domain...'

  const mintDomain = async () => {
    // Don't run if the domain is empty
    if (!domain) {
      return
    }
    // Alert the user if the domain is too short
    if (domain.length < 3) {
      alert('Domain must be at least 3 characters long')
      return
    }
    setLoading(true)
    // Calculate price based on length of domain (change this to match your contract)
    // 3 chars = 0.5 MATIC, 4 chars = 0.3 MATIC, 5 or more = 0.1 MATIC
    const price = domain.length === 3 ? '0.5' : domain.length === 4 ? '0.3' : '0.1'
    console.log('Minting domain', domain, 'with price', price)
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractInterface.abi, signer)

        console.log('Going to pop wallet now to pay gas...')
        let tx = await contract.register(domain, { value: ethers.utils.parseEther(price) })
        // Wait for the transaction to be mined
        const receipt = await tx.wait()

        // Check if the transaction was successfully completed
        if (receipt.status === 1) {
          console.log('Domain minted! https://mumbai.polygonscan.com/tx/' + tx.hash)

          // Set the record for the domain
          tx = await contract.setRecord(domain, record)
          await tx.wait()

          console.log('Record set! https://mumbai.polygonscan.com/tx/' + tx.hash)
          setMinted(true)
          // Call fetchMints after 2 seconds
          // setTimeout(() => {
          //   fetchMints()
          // }, 2000)
          clearForm()
          setLoading(false)
        } else {
          alert('Transaction failed! Please try again')
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Stack padding='4' spacing='8' py='8' justifyContent='center' mx='auto' maxW='80%'>
      <InputGroup>
        <Input
          focusBorderColor='green.200'
          id='domain'
          value={domain}
          placeholder='nouns'
          onChange={(e) => setDomain(e.target.value)}
        />
        <InputRightAddon children='.regen' />
      </InputGroup>
      <Input
        placeholder="what's your superpower?"
        value={record}
        focusBorderColor='orange.200'
        onChange={(e) => setRecord(e.target.value)}
      />
      {hasMounted && isConnected && (
        <Button
          disabled={isLoading || !domain}
          colorScheme='green'
          loadingText={waitingForApproval || updatingRecord || registeringDomain}
          isLoading={isLoading}
          onClick={() => mintDomain()}
          spinnerPlacement='start'
        >
          <Text>{domain.length <= 2 ? 'Enter a domain' : `${getPrice} MATIC`}</Text>
        </Button>
      )}
      {isError && <div>Errors: {error.message}</div>}
      {registerError && <p style={{ marginTop: 24, color: '#FF6257' }}>Error: {registerError.message}</p>}
      {txError && <p style={{ marginTop: 24, color: '#FF6257' }}>Error: {txError.message}</p>}

      <Flex justifyContent='center'>
        <FlipCard>
          <FrontCard isCardFlipped={isMinted}>
            <svg xmlns='http://www.w3.org/2000/svg' width='270' height='270' fill='npnpm ne'>
              <path fill='url(#B)' d='M0 0h270v270H0z' />
              <defs>
                <filter id='A' colorInterpolationFilters='sRGB' filterUnits='userSpaceOnUse' height='270' width='270'>
                  <feDropShadow dx='0' dy='1' stdDeviation='2' floodOpacity='.225' width='200%' height='200%' />
                </filter>
              </defs>
              <path
                d='M72.863 42.949c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-10.081 6.032-6.85 3.934-10.081 6.032c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-8.013-4.721a4.52 4.52 0 0 1-1.589-1.616c-.384-.665-.594-1.418-.608-2.187v-9.31c-.013-.775.185-1.538.572-2.208a4.25 4.25 0 0 1 1.625-1.595l7.884-4.59c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v6.032l6.85-4.065v-6.032c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595L41.456 24.59c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-14.864 8.655a4.25 4.25 0 0 0-1.625 1.595c-.387.67-.585 1.434-.572 2.208v17.441c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l10.081-5.901 6.85-4.065 10.081-5.901c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v9.311c.013.775-.185 1.538-.572 2.208a4.25 4.25 0 0 1-1.625 1.595l-7.884 4.721c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-7.884-4.59a4.52 4.52 0 0 1-1.589-1.616c-.385-.665-.594-1.418-.608-2.187v-6.032l-6.85 4.065v6.032c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l14.864-8.655c.657-.394 1.204-.95 1.589-1.616s.594-1.418.609-2.187V55.538c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595l-14.993-8.786z'
                fill='#fef6ec'
              />
              <defs>
                <linearGradient id='B' x1='0' y1='0' x2='270' y2='270' gradientUnits='userSpaceOnUse'>
                  <stop stopColor='#cb9e59' />
                  <stop offset='1' stopColor='#427e83' stopOpacity='.99' />
                </linearGradient>
              </defs>
              <text
                x='32.5'
                y='231'
                fontSize='27'
                fill='#fef6ec'
                filter='url(#A)'
                fontFamily='Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif'
                fontWeight='bold'
              >
                {`${domain}.regen`}
              </text>
            </svg>
          </FrontCard>
          <BackCard isCardFlipped={isMinted}>
            <Box padding='20px'>
              <Image src='/svg.svg' width='80' height='80' alt='Regen domain NFT' style={{ borderRadius: 8 }} />
              <h2 style={{ marginTop: 8, marginBottom: 6 }}>NFT Minted!</h2>
              <p style={{ marginBottom: 16 }}>Your NFT will show up in your wallet in the next few minutes.</p>
              <p style={{ marginBottom: 4 }}>
                View on <a href={`https://rinkeby.etherscan.io/tx/${mintData?.hash}`}>Polygonscan</a>
              </p>
              <p>
                View on <a href={`https://testnets.opensea.io/assets/mumbai/${txData?.to}`}>Opensea</a>
              </p>
            </Box>
          </BackCard>
        </FlipCard>
      </Flex>
    </Stack>
  )
}

export default RegisterForm
