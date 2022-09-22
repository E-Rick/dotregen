import { HStack, useColorMode } from '@chakra-ui/react';
import React from 'react'
import DarkModeSwitch from './DarkModeSwitch';
import Image from 'next/image'
import { ConnectKitButton } from 'connectkit';

const Header = () => {
  const { colorMode } = useColorMode()
  return (
    <HStack justifyContent='space-between' width='100%' p="4" alignContent='center'>
      <Image src='/polygonlogo.png' width={45} height={45}></Image>
      <HStack justify='space-between' alignItems='center' gap='2'>
        <DarkModeSwitch />
        <ConnectKitButton mode={colorMode as 'light' | 'dark'} />
      </HStack>
    </HStack>
  );
}

export default Header
