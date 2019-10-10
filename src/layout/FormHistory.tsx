import React from 'react';
import { Text, Box, List, PseudoBox } from '@chakra-ui/core';
import Header, { Level } from '../components/Header';

const Item: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PseudoBox as="li" p={2} cursor="pointer" _hover={{ backgroundColor: 'gray.100' }}>
    {children}
  </PseudoBox>
);

const FormHistory: React.FC = () => (
  <Box mx={4}>
    <Box>
      <Header level={Level.H3}>Presets</Header>
      <List overflowY="scroll" backgroundColor="white" maxHeight={48}>
        <Item>Live sports channel</Item>
        <Item>Big Buck Bunny 1080P</Item>
        <Item>Low latency HLS.js mode</Item>
        <Item>Base64 FairPlay payloads</Item>
        <Item>Stream with WebVTT subtitles</Item>
        <Item>Troubleshooting for client</Item>
        <Item>Full debug output from Shaka Player</Item>
        <Item>Shift live stream edge</Item>
        <Item>My first stream</Item>
      </List>
      <Header level={Level.H3}>History entries</Header>
      <Text mb={1}>Select for inspection and creating presets:</Text>
      <List overflowY="scroll" backgroundColor="white" maxHeight={64}>
        <Item>Current form content</Item>
        <Item>2019-10-09 22:43 Stream details • Proxy • API</Item>
        <Item>2019-10-09 22:40 Stream details • Proxy • Stream processor</Item>
        <Item>2019-10-09 22:33 Stream details • Proxy • API</Item>
        <Item>2019-10-09 22:30 Proxy • API</Item>
        <Item>2019-10-09 21:15 Stream details • Proxy • Player options</Item>
        <Item>2019-10-09 21:10 Stream details • Proxy • Player options</Item>
        <Item>2019-10-09 20:05 Proxy • API</Item>
        <Item>2019-10-09 20:04 Proxy • API</Item>
        <Item>2019-10-09 20:03 Proxy • API</Item>
      </List>
    </Box>
  </Box>
);

export default FormHistory;
