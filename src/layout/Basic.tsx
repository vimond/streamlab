import React from 'react';
import { Menu, MenuButton, MenuList, MenuItem, Button, FormControl, Input, Flex } from '@chakra-ui/core';

const techOptions = ['Auto-detect technology', 'HLS', 'MPEG-DASH', 'Smooth stream', 'Progressive video'];

const Basic: React.FC = () => (
  <form>
    <Flex direction="row" m={4}>
      <FormControl isRequired flex="1 1 auto">
        <Input placeholder="Stream URL" type="url" />
      </FormControl>
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
    </Flex>
    <Flex justify="center" py={4}>
      <Button variantColor="green" mx={1}>
        Play
      </Button>
      <Button mx={1}>Clear</Button>
    </Flex>
  </form>
);

export default Basic;
