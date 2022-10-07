import { ethers } from "ethers";
import { useState, useEffect, useCallback } from 'react';
import { CONTRACT_ADDRESS } from '../utils/constants';
import contractAbi from "../utils/contract-abi.json";
import { Domain } from "../utils/types";
import { useAccount, useSigner } from 'wagmi';
/**
   * Fetch all domain names from contract, the owner's addresses for each domain,
   * and the record for each domain retrieved.
   * Put them into an array and set array as mints
   */
export default function useDomains() {
  const [domains, setDomains] = useState<Domain[]>([])
  const { data: signer } = useSigner()
  const { isConnected, isReconnecting, address } = useAccount()
  // wrap refetchDomains in a usecallback to prevent re-renders
  const fetchDomains = useCallback(async () => {
    try {
      if (signer) {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);

        // Get all the domain names from our contract
        const names = await contract.getAllNames();

        // For each name, get the record and the address
        const domainRecords = await Promise.all(
          names.map(async (name: string) => {
            const mintRecord = await contract.records(name);
            const owner = await contract.domains(name);

            //Construct the domain
            const domain = {
              id: names.indexOf(name),
              name: name,
              record: mintRecord,
              owner: owner,
            };
            return domain
          })
        );

        console.log('Mints fetched', domainRecords)
        setDomains(domainRecords)
      }

    } catch (error) {
      console.error('error message: ', error);
    }
  }, [signer])


  /**
 * Fetch all domain names from contract, the owner's addresses for each domain,
 * and the record for each domain retrieved.
 * Put them into an array and set array as mints
 */
  // const fetchDomains = async () => {
  //   try {
  //     const { ethereum } = window;
  //     if (ethereum && signer) {
  //       // You know all this
  //       const provider = new ethers.providers.Web3Provider(ethereum);
  //       const signer = provider.getSigner();
  //       const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);

  //       // Get all the domain names from our contract
  //       const names = await contract.getAllNames();

  //       // For each name, get the record and the address
  //       const mintRecords = await Promise.all(
  //         names.map(async (name) => {
  //           const mintRecord = await contract.records(name);
  //           const owner = await contract.domains(name);
  //           return {
  //             id: names.indexOf(name),
  //             name: name,
  //             record: mintRecord,
  //             owner: owner,
  //           };
  //         })
  //       );

  //       console.log("MINTS FETCHED ", mintRecords);
  //       setDomains(mintRecords);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  useEffect(() => {
    fetchDomains()
  }, [signer])

  return {
    domains,
    totalDomains: domains.length,
    fetchDomains
  }
}