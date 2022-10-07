import { Flex, Stack, Text } from '@chakra-ui/react'
import { memo } from 'react'
import DomainCard from './DomainCard'

const DomainList = ({ domains }) => {
  return (
    <>
      <Stack my='20' justifyContent='center' alignItems='center'>
        <Text fontSize='2xl' fontWeight='semibold'>
          Recently minted domains
        </Text>
        <Flex flexWrap='wrap' justifyContent='center' mx='auto'>
          {domains && domains.map((domain) => <DomainCard domain={domain} key={domain.id} />)}
        </Flex>
      </Stack>
    </>
  )
}

// memoize domainlist to prevent re-renders
export default memo(DomainList)
