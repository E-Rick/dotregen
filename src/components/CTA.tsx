import { Link as ChakraLink, Tooltip, Container, IconButton } from '@chakra-ui/react';
import Image from 'next/image'
export const CTA = () => (
  <Container
    display='flex'
    flexDirection="row"
    position="fixed"
    bottom={0}
    left={0}
    width="full"
    py={3}
    zIndex={100}
  >
    <Tooltip
      label='Twitter'
    >
      <IconButton
        as={ChakraLink}
        isExternal
        icon={<Image src='/twitter.svg' width={32} height={32}></Image>}
        href="https://twitter.com/0xerick"
        variant="ghost"
        colorScheme="gray"
        rounded='full'
        mx={2}
        aria-label={'See twitter'}>
        Twitter
      </IconButton>
    </Tooltip>
    <Tooltip label='View repo'>
      <IconButton
        as={ChakraLink}
        isExternal
        icon={<Image src='/github.svg' width={32} height={32}></Image>}
        href="https://github.com/E-Rick/dotregen"
        variant="ghost"
        colorScheme="gray"
        rounded='full'
        mx={2}
        aria-label={'Github repo'}    >
        View Repo
      </IconButton>
    </Tooltip>
  </Container>
)
