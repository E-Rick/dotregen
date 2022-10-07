import { Box, Divider } from '@chakra-ui/react'
import { ethers } from 'ethers'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useCallback, useEffect, useState } from 'react'
import { useAccount, useSigner } from 'wagmi'
import { CTA } from '../components/CTA'
import DomainList from '../components/DomainList'
import EditRecords from '../components/EditRecords'
import Header from '../components/Header'
import { Hero } from '../components/Hero'
import RegisterForm from '../components/RegisterForm'
import { useDomainContext } from '../context/DomainContext'
import { CONTRACT_ADDRESS } from '../utils/constants'
import contractAbi from '../utils/contract-abi.json'

const Index: NextPage = () => {
  const { isUpdatingRecords, isSuccessfulUpdate } = useDomainContext()
  const [domains, setDomains] = useState([])
  const { isConnected, isReconnecting, address } = useAccount()
  const { data: signer } = useSigner()

  /**
   * Fetch all domain names from contract, the owner's addresses for each domain,
   * and the record for each domain retrieved.
   * Put them into an array and set array as mints
   */
  // wrap refetchDomains in a usecallback to prevent re-renders
  const fetchDomains = useCallback(async () => {
    try {
      if (signer) {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer)

        // Get all the domain names from our contract
        const names = await contract.getAllNames()

        // For each name, get the record and the address
        const domainRecords = await Promise.all(
          names.map(async (name: string) => {
            const mintRecord = await contract.records(name)
            const owner = await contract.domains(name)

            //Construct the domain
            const domain = {
              id: names.indexOf(name),
              name: name,
              record: mintRecord,
              owner: owner,
            }
            return domain
          })
        )

        console.log('Mints fetched', domainRecords)
        setDomains(domainRecords)
      }
    } catch (error) {
      console.error('error message: ', error)
    }
  }, [signer])

  // This will run any time currentAccount or network are changed
  useEffect(() => {
    fetchDomains()
  }, [isReconnecting, isConnected, address, signer, isSuccessfulUpdate])
  return (
    <Box height='100vh'>
      <Head>
        <title>Regen Name Service</title>
        <meta name='description' content='Domain name service for Regenerates' key='desc' />
      </Head>
      <Header />
      <Hero />
      <Box w='100%' py='8'>
        {isUpdatingRecords ? <EditRecords /> : <RegisterForm />}
        <Divider />
        <DomainList domains={domains} />
      </Box>
      <CTA />
    </Box>
  )
}

export default Index
