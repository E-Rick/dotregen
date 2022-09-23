import { Box, Divider } from '@chakra-ui/react'
import type { NextPage } from 'next'
import { Hero } from '../components/Hero'
import { CTA } from '../components/CTA'
import DomainList from '../components/DomainList'
import Header from '../components/Header'
import Head from 'next/head'
import EditRecords from '../components/EditRecords'
import RegisterForm from '../components/RegisterForm'
import { useDomainContext } from '../context/DomainContext'

const Index: NextPage = () => {
  const { isUpdatingRecords } = useDomainContext()
  return (
    <Box height='100vh'>
      <Head>
        <title>Regen Name Service</title>
      </Head>
      <Header />
      <Hero />
      <Box w='100%' py='8'>
        {isUpdatingRecords ? <EditRecords /> : <RegisterForm />}
        <Divider />
        <DomainList />
      </Box>
      <CTA />
    </Box>
  )
}

export default Index
