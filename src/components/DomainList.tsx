import { Text, Flex, Stack } from '@chakra-ui/react'
import React from 'react'
import DomainCard from './DomainCard'

const DomainList = ({ domains, editRecord }) => {
  if (!domains) return null
  return (
    <Stack my='20' justifyContent='center' alignItems='center'>
      <Text fontSize='2xl' fontWeight='semibold'>Recently minted domains</Text >
      <Flex flexWrap='wrap' justifyContent='center' mx='auto'>
        {domains.map((domain) => (
          <DomainCard domain={domain} key={domain.id} editRecord={editRecord} />
        ))}
      </Flex>
    </Stack >
  )
}

export default DomainList