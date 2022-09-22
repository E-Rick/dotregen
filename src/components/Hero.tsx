import { Flex, Heading, VStack } from '@chakra-ui/react';

export const Hero = ({ title }: { title: string }) => (
  <VStack
    justifyContent="center"
    alignItems="center"
    bgGradient="linear(to-l, heroGradientStart, heroGradientEnd)"
    bgClip="text"
  >
    <Heading fontSize="7vw">{title}</Heading>
    <Heading fontSize='3vw'>The name is your universal username, secure on the blockchain</Heading>
  </VStack>
)

Hero.defaultProps = {
  title: 'Regen domain service',
}
