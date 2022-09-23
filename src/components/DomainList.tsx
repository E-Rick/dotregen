import { Flex, Stack, Text } from '@chakra-ui/react'
import { memo } from 'react'
import useDomains from '../hooks/useDomains'
import DomainCard from './DomainCard'

const DomainList = () => {
  const { domains } = useDomains()

  return (
    <>
      <Stack my='20' justifyContent='center' alignItems='center'>
        <Text fontSize='2xl' fontWeight='semibold'>
          Recently minted domains
        </Text>
        <Flex flexWrap='wrap' justifyContent='center' mx='auto'>
          {domains.map((domain) => (
            <DomainCard domain={domain} key={domain.id} />
          ))}
        </Flex>
      </Stack>
    </>
  )
}

// memoize domainlist to prevent re-renders
export default memo(DomainList)
