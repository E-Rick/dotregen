import {
  Box,
  Divider,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import contractAbi from "../utils/contract-abi.json";
import type { NextPage } from 'next';
import { Hero } from '../components/Hero'
import { CTA } from '../components/CTA'
import contractInterface from '../utils/contract-abi.json';
import { ethers } from 'ethers';
import {
  useAccount,
} from 'wagmi';
import { CONTRACT_ADDRESS } from '../utils/constants';
import DomainList from '../components/DomainList';
import Header from '../components/Header';
import Head from 'next/head';
import EditRecords from '../components/EditRecords';
import RegisterForm from '../components/RegisterForm';

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

  const getPrice = domain.length === 3 ? "0.5" : domain.length === 4 ? "0.3" : "0.1";

  useEffect(() => setMounted(true), []);

  const fetchMints = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        // You know all this
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);

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
  }, [])

  const clearForm = () => {
    setSuperpower('')
    setDomain('')
    setEditing(false)
  }

  // This will take us into edit mode and show us the edit buttons!
  const editRecord = (name, record) => {
    console.log("Editing record for", name);
    setEditing(true);
    setDomain(name);
    setSuperpower(record)
  };

  return (
    <Box height="100vh">
      <Head>
        <title>Regen Name Service</title>
      </Head>
      <Header />
      <Hero />
      <Box w='100%' py='8'>
        {
          editing ?
            <EditRecords domain={domain} superpower={superpower} clearForm={clearForm} />
            :
            <RegisterForm />
        }
        <Divider />
        {mints && <DomainList domains={mints} editRecord={editRecord} />}
      </Box>
      <CTA />
    </Box >
  )
}

export default Index
