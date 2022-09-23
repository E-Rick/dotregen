import { ethers } from "ethers";
import { useState, useEffect } from 'react';
import { CONTRACT_ADDRESS } from "../utils/constants";
import contractAbi from "../utils/contract-abi.json";
import { Domain } from "../utils/types";

async function fetchDomains() {
  try {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);
      console.log('getting all names')
      // Get all the domain names from our contract
      const names = await contract.getAllNames();
      // For each name, get the record and the address
      const domainRecords: Domain[] = await Promise.all(
        names.map(async (name: string) => {
          const mintRecord = await contract.records(name);
          const owner = await contract.domains(name);
          return {
            id: names.indexOf(name),
            name: name,
            record: mintRecord,
            owner: owner,
          }
        })
      );
      console.log("MINTS FETCHED ", domainRecords);
      return domainRecords;
    }
  } catch (error) {
    console.log(error);
  }
}

/**
   * Fetch all domain names from contract, the owner's addresses for each domain,
   * and the record for each domain retrieved.
   * Put them into an array and set array as mints
   */
export default function useDomains() {
  const [domains, setDomains] = useState<Domain[]>([])

  useEffect(() => {
    fetchDomains().then(resp => setDomains(resp))
  }, [])

  return {
    domains,
    totalDomains: domains.length
  }
}