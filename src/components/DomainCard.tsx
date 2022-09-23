import React from 'react'
import { EditIcon } from '@chakra-ui/icons'
import { Link as ChakraLink, Box, IconButton, Text } from '@chakra-ui/react'
import { useAccount } from 'wagmi'
import { OPENSEA_ADDRESS, TLD } from '../utils/constants'
import { useDomainContext } from '../context/DomainContext'
import { type Domain } from '../utils/types'

const DomainCard = ({ domain }: { domain: Domain }) => {
  const { isConnected, address } = useAccount()
  const { editRecord } = useDomainContext()

  const isDomainOwner = domain.owner.toLowerCase() === address?.toLowerCase()
  const showEditButton = isConnected && isDomainOwner

  return (
    <Box className='mint-item' maxW='sm' borderRadius='lg' position='relative'>
      <ChakraLink isExternal href={`${OPENSEA_ADDRESS}/${domain.id}`}>
        <Text>
          {domain.name}
          {TLD}
        </Text>
      </ChakraLink>
      {showEditButton && (
        <IconButton
          position='absolute'
          variant='ghost'
          top='-2'
          right='-2'
          borderRadius='full'
          onClick={() => editRecord(domain.name, domain.record)}
          icon={<EditIcon />}
          aria-label={`edit ${domain.name} record`}
        />
      )}
      <Text> {domain.record} </Text>
    </Box>
  )
}

export default DomainCard
