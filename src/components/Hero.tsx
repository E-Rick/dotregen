import { Flex, Heading, VStack } from '@chakra-ui/react';

export const Hero = ({ title }: { title: string }) => (
  <VStack
    justifyContent="center"
    alignItems="center"
    bgGradient="linear(to-l, heroGradientStart, heroGradientEnd)"
    bgClip="text"
    padding={4}
  >
    <Heading fontSize={{ base: '3rem', md: '4rem', lg: '5rem' }}>{title}</Heading>
    <Heading fontSize='18px'>This domain is your universal username, secured on the blockchain</Heading>
  </VStack>
)

Hero.defaultProps = {
  title: 'Regen domain service',
}
