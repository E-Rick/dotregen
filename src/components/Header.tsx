import { HStack } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react'
import DarkModeSwitch from './DarkModeSwitch';
import Image from 'next/image'

const Header = () => {
  return (
    <HStack justifyContent='space-between' width='100%' p="4" alignContent='center'>
      <Image src='/reGen.png' width={45} height={45}></Image>
      <HStack justify='space-between' alignItems='center' gap='2'>
        <DarkModeSwitch />
        <ConnectButton showBalance accountStatus='avatar' />
      </HStack>
    </HStack>
  );
}

export default Header
