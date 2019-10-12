import React from 'react';
import { Box, Button, Flex, FormControl, Input, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/core';
import Header, { Level } from "../components/Header";

const techOptions = ['Auto-detect technology', 'HLS', 'MPEG-DASH', 'Smooth stream', 'Progressive video'];

const Basic: React.FC = () => (
  <Box as="form" my={8}>
    <Header level={Level.H3} fontSize="md" textAlign="center">Test progressive, HLS, or MPEG-DASH streams</Header>
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
