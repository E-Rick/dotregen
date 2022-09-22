import { Link as ChakraLink, Button } from '@chakra-ui/react'

import { Container } from './Container'

export const CTA = () => (
  <Container
    flexDirection="row"
    position="fixed"
    bottom={0}
    width="full"
    maxWidth="3xl"
    py={3}
  >
    <Button
      as={ChakraLink}
      isExternal
      href="https://twitter.com/0xerick"
      variant="outline"
      colorScheme="gray"
      rounded="button"
      flexGrow={1}
      mx={2}
      width="full"
    >
      Twitter
    </Button>
    <Button
      as={ChakraLink}
      isExternal
      href="https://github.com/E-Rick/dotregen"
      variant="solid"
      colorScheme="gray"
      rounded="button"
      flexGrow={3}
      mx={2}
      width="full"
    >
      View Repo
    </Button>
  </Container>
)
