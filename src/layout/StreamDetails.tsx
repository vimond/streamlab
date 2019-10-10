import React from 'react';
import {
  Box,
  Button,
  Collapse,
  Flex,
  FormControl,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Switch
} from '@chakra-ui/core';
import Header, { Level } from '../components/Header';

const StreamDetailRow: React.FC<{
  label: string;
  onChange?: () => void;
  selectedTechOption: string;
  techOptions: string[];
  isTechOptionsEnabled?: boolean;
  isHeadersEnabled?: boolean;
}> = ({ label, onChange, selectedTechOption, techOptions, isTechOptionsEnabled, isHeadersEnabled }) => {
  const [showHeaders, setShow] = React.useState(false);
  const handleToggle = () => setShow(!showHeaders);
  return (
    <>
      <FormControl isRequired>
        <Input onChange={onChange} placeholder={label} type="url" />
      </FormControl>
      <Menu>
        {/*
          // @ts-ignore */}
        <MenuButton as={Button} rightIcon="chevron-down" isDisabled={!isTechOptionsEnabled}>
          {selectedTechOption}
        </MenuButton>
        <MenuList>
          {techOptions.map((option, i) => (
            <MenuItem key={i}>{option}</MenuItem>
          ))}
        </MenuList>
      </Menu>
      <FormControl justifySelf="center">
        <Switch onChange={onChange} id="stream-proxy-activate">
          Activate proxy for {label}
        </Switch>
      </FormControl>
      <Button onClick={handleToggle} isDisabled={!isHeadersEnabled}>
        Add
      </Button>
      <Box gridColumn="1/span 4">
        <Collapse isOpen={showHeaders}>
          <Flex direction="row" mt={2} mb={4}>
            <Input flex="1 2 auto" placeholder="Header name" mr={2} />
            <Input flex="2 1 auto" placeholder="Header value" mr={2} />
            {/*
              // @ts-ignore */}
            <IconButton flex="0" aria-label="Remove" icon="delete" />
          </Flex>
        </Collapse>
      </Box>
    </>
  );
};

const StreamDetails: React.FC = () => (
  <form>
    <Box display="grid" gridTemplateColumns="1fr auto auto auto" gridAutoRows="auto" gridGap={2} alignItems="center">
      <Header level={Level.H6} justifySelf="left">
        URLs
      </Header>
      <Header level={Level.H6}>Technology</Header>
      <Header level={Level.H6}>Proxy</Header>
      <Header level={Level.H6}>Headers</Header>
      <StreamDetailRow
        label="Stream URL"
        techOptions={['Auto', 'HLS', 'MPEG-DASH', 'Smooth stream', 'Progressive video']}
        selectedTechOption="Auto"
        isTechOptionsEnabled
        isHeadersEnabled
      />
      <StreamDetailRow
        label="DRM license URL"
        techOptions={['Auto', 'Widevine', 'PlayReady', 'FairPlay']}
        selectedTechOption="Widevine"
        isTechOptionsEnabled={false}
        isHeadersEnabled
      />
      <StreamDetailRow
        label="DRM certificate URL"
        techOptions={['Auto', 'Widevine', 'FairPlay']}
        selectedTechOption="Widevine"
        isTechOptionsEnabled={false}
        isHeadersEnabled={false}
      />
      <StreamDetailRow
        label="Subtitles URL"
        techOptions={['Auto', 'WebVTT', 'TTML', 'SRT']}
        selectedTechOption="Auto"
        isTechOptionsEnabled
        isHeadersEnabled
      />
    </Box>
  </form>
);

export default StreamDetails;
