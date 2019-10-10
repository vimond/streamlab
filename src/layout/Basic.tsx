import React from 'react';
import { Box, Menu, MenuButton, MenuList, MenuItem, Button, FormControl, Input, Flex } from '@chakra-ui/core';

const techOptions = ['Auto-detect technology', 'HLS', 'MPEG-DASH', 'Smooth stream', 'Progressive video'];

const Basic: React.FC = () => (
  <Box as="form" my={8}>
    <FormControl isRequired m={4}>
      <Input placeholder="Stream URL" type="url" />
    </FormControl>
    <Flex justify="center" mx={4}>
      <Menu>
        {/*
            // @ts-ignore */}
        <MenuButton as={Button} rightIcon="chevron-down" flex="0 0 none" ml={2}>
          {techOptions[0]}
        </MenuButton>
        <MenuList>
          {techOptions.map((option, i) => (
            <MenuItem key={i}>{option}</MenuItem>
          ))}
        </MenuList>
      </Menu>
      <Button variantColor="green" mx={4}>
        Play
      </Button>
    </Flex>
  </Box>
);

export default Basic;
